import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function reparse() {
  console.log("Starting re-parse of all tenders...");
  const tenders = await prisma.tender.findMany({});

  let count = 0;
  for (const tender of tenders) {
    if (!tender.rawData || typeof tender.rawData !== 'object') continue;
    
    const raw = tender.rawData;
    const procurement = raw.procurement || {};
    const dates = raw.dates || {};
    const decision = raw.decision || {};
    const base = raw.base || {};

    // Improved Budget Extraction
    let budget = (procurement.budget || 
                procurement.totalPriceSelectionValue || 
                raw.decision?.vendors?.[0]?.price?.price ||
                tender.budget);
    
    // Improved Deadline Extraction
    const deadlineStr = (
      dates.offerDeadline || 
      dates.offersDeadline ||
      procurement.executionDeadline || 
      decision.awardDecisionDate || 
      base.publicationDate
    );
    const deadline = deadlineStr ? new Date(deadlineStr) : tender.deadline;

    const pubDateStr = base.publicationDate || tender.publicationDate;
    const publicationDate = pubDateStr ? new Date(pubDateStr) : null;

    // Improved Description Extraction
    let description = raw.description || tender.description;
    
    // Flatten if object
    if (description && typeof description === 'object') {
      description = description.en || description.de || description.fr || description.it || Object.values(description)[0];
    }

    if (!description && procurement.orderDescription) {
      const descObj = procurement.orderDescription;
      description = descObj.en || descObj.de || descObj.fr || descObj.it || Object.values(descObj)[0];
    }
    if (!description && procurement.projectOrderDescription) {
      const descObj = procurement.projectOrderDescription;
      description = descObj.en || descObj.de || descObj.fr || descObj.it || Object.values(descObj)[0];
    }

    // Final check for HTML/Object strings
    if (typeof description !== 'string' && description != null) {
      description = String(description);
    }

    await prisma.tender.update({
      where: { id: tender.id },
      data: {
        budget: budget ? parseFloat(budget) : null,
        deadline,
        publicationDate,
        description,
        detailsFetchedAt: tender.detailsFetchedAt || new Date()
      }
    });
    count++;
    if (count % 10 === 0) console.log(`Processed ${count} tenders...`);
  }
  console.log(`Successfully fixed ${count} tenders!`);
}

reparse()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
