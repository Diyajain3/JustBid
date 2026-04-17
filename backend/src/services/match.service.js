import prisma from '../config/db.js';

export const computeMatchScore = (company, tender) => {
  let score = 0;
  const reasons = [];

  const companyCpvs = company.cpvCodes || [];
  const tenderCpvs = tender.cpvCodes || [];
  const companyKeywords = company.keywords || [];

  // 1. CPV Code Matching (Max 40 points)
  if (companyCpvs.length > 0 && tenderCpvs.length > 0) {
    const matchedCpvs = companyCpvs.filter(cpv => tenderCpvs.includes(cpv));
    if (matchedCpvs.length > 0) {
      const cpvScore = Math.min(40, matchedCpvs.length * 20);
      score += cpvScore;
      reasons.push(`Matched ${matchedCpvs.length} CPV code(s): ${matchedCpvs.join(', ')}`);
    }
  }

  // 2. Keyword matching in title and description (Max 40 points)
  if (companyKeywords.length > 0) {
    const textToSearch = `${tender.title} ${tender.description}`.toLowerCase();
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

export const matchCompanyToAllTenders = async (companyId) => {
  const company = await prisma.company.findUnique({ where: { id: companyId } });
  if (!company) return;

  const tenders = await prisma.tender.findMany();

  for (const tender of tenders) {
    const { score, reasons } = computeMatchScore(company, tender);
    if (score > 0) {
      await prisma.match.upsert({
        where: {
          companyId_tenderId: {
            companyId: company.id,
            tenderId: tender.id
          }
        },
        update: { score, reasons }, // MongoDB Native arrays! 
        create: { companyId: company.id, tenderId: tender.id, score, reasons }
      });
    }
  }
};
