import prisma from '../config/db.js';

export const computeMatchScore = (company, tender) => {
  let score = 0;
  const reasons = [];

  const companyCpvs = company.cpvCodes || [];
  const tenderCpvs = tender.cpvCodes || [];
  const companyKeywords = company.keywords || [];

  // 1. CPV Code Matching (Max 40 points)
  if (companyCpvs.length > 0 && tenderCpvs.length > 0) {
    // Robust Matching: Trim and Casing
    const normalizedCompanyCpvs = companyCpvs.map(c => c.trim().toLowerCase());
    const normalizedTenderCpvs = tenderCpvs.map(t => t.trim().toLowerCase());
    
    const matchedCpvs = normalizedCompanyCpvs.filter(cpv => normalizedTenderCpvs.includes(cpv));
    
    if (matchedCpvs.length > 0) {
      const cpvScore = Math.min(40, matchedCpvs.length * 20);
      score += cpvScore;
      reasons.push(`Matched ${matchedCpvs.length} CPV code(s): ${matchedCpvs.join(', ')}`);
    }
  }

  // 2. Keyword matching in title and description (Max 40 points)
  if (companyKeywords.length > 0) {
    const textToSearch = `${tender.title || ''} ${tender.description || ''}`.toLowerCase();
    const matchedKeywords = companyKeywords.filter(kw => textToSearch.includes(kw.toLowerCase()));
    
    if (matchedKeywords.length > 0) {
      const keywordScore = Math.min(40, matchedKeywords.length * 10);
      score += keywordScore;
      reasons.push(`Matched keywords: ${matchedKeywords.join(', ')}`);
    }
  }

  // 3. Location Matching (Max 20 points)
  if (company.location && tender.location) {
    if (tender.location.toLowerCase().includes(company.location.toLowerCase())) {
      score += 20;
      reasons.push(`Location matched: ${company.location}`);
    }
  }

  // 4. Budget Matching Algorithm (Max 20 points or Penalty!)
  if (tender.budget) {
    const isAboveMin = company.minBudget == null || tender.budget >= company.minBudget;
    const isBelowMax = company.maxBudget == null || tender.budget <= company.maxBudget;

    if (company.minBudget != null || company.maxBudget != null) {
      if (isAboveMin && isBelowMax) {
        score += 20;
        reasons.push(`Budget ($${tender.budget}) falls perfectly within your target range!`);
      } else {
        // Drop the score by half if it grossly exceeds their physical budgets!
        score = score * 0.5;
        reasons.push(`Warning: Tender budget ($${tender.budget}) is drastically outside your preferred capacity.`);
      }
    }
  }

  return { score, reasons };
};

/**
 * Match a specific company against all tenders in the database.
 * Used when a user updates their profile.
 */
export const matchCompanyToAllTenders = async (companyId) => {
  try {
    const company = await prisma.company.findUnique({ where: { id: companyId } });
    if (!company) return;

    const tenders = await prisma.tender.findMany();
    const BATCH_SIZE = 50;
    
    for (let i = 0; i < tenders.length; i += BATCH_SIZE) {
      const batch = tenders.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map(async (tender) => {
        try {
          const { score, reasons } = computeMatchScore(company, tender);
          if (score > 0) {
            await prisma.match.upsert({
              where: {
                companyId_tenderId: {
                  companyId: company.id,
                  tenderId: tender.id
                }
              },
              update: { score, reasons },
              create: { companyId: company.id, tenderId: tender.id, score, reasons }
            });
          } else {
            await prisma.match.deleteMany({
              where: { companyId: company.id, tenderId: tender.id }
            });
          }
        } catch (matchErr) {
          console.error(`Failed to match company ${companyId} with tender ${tender.id}:`, matchErr);
        }
      }));
    }
    console.log(`Updated matches for company ${company.name} across ${tenders.length} tenders.`);
  } catch (error) {
    console.error("Error in matchCompanyToAllTenders:", error);
  }
};

/**
 * Match all existing companies against a list of new/updated tenders.
 */
export const matchAllCompaniesToNewTenders = async (tenderIds) => {
  try {
    if (!tenderIds || tenderIds.length === 0) return;

    const companies = await prisma.company.findMany();
    const tenders = await prisma.tender.findMany({
      where: { id: { in: tenderIds } }
    });

    const BATCH_SIZE = 50;
    let totalMatches = 0;

    for (const company of companies) {
      for (let i = 0; i < tenders.length; i += BATCH_SIZE) {
        const batch = tenders.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map(async (tender) => {
          try {
            const { score, reasons } = computeMatchScore(company, tender);
            if (score > 0) {
              await prisma.match.upsert({
                where: {
                  companyId_tenderId: {
                    companyId: company.id,
                    tenderId: tender.id
                  }
                },
                update: { score, reasons },
                create: { companyId: company.id, tenderId: tender.id, score, reasons }
              });
              totalMatches++;
            }
          } catch (matchErr) {
            console.error(`Failed to match company ${company.id} with tender ${tender.id}:`, matchErr);
          }
        }));
      }
    }
    console.log(`Matching complete: Processed ${companies.length} companies across ${tenderIds.length} tenders. Created/Updated ${totalMatches} positive matches.`);
  } catch (error) {
    console.error("Error in matchAllCompaniesToNewTenders:", error);
  }
};
