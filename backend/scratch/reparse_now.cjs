const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const stripTags = (text) => {
  if (!text) return "";
  let clean = text.replace(/<[^>]*>?/gm, ' ');
  clean = clean.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  return clean.replace(/\s\s+/g, ' ').trim();
};

const findBudgetInText = (text) => {
  if (!text) return null;
  const regex = /(?:Budget|Value|Price|Total|CHF|USD|\$)\D*([\d\s'\.,]{4,})/i;
  const match = text.match(regex);
  if (match) {
    const raw = match[1].replace(/[\s'\.]/g, '').split(',')[0];
    if (/^\d+$/.test(raw) && raw.length > 3) return parseInt(raw);
  }
  return null;
};

const findLocationInText = (text) => {
  if (!text) return null;
  const cantons = ["ZH", "BE", "LU", "UR", "SZ", "OW", "NW", "GL", "ZG", "FR", "SO", "BS", "BL", "SH", "AR", "AI", "SG", "GR", "AG", "TG", "TI", "VD", "VS", "NE", "GE", "JU"];
  const regex = new RegExp(`\\b(${cantons.join('|')})\\b`);
  const match = text.match(regex);
  return match ? match[0] : null;
};

async function reparse() {
  console.log("Starting Neural Data Repair...");
  const tenders = await prisma.tender.findMany();
  let count = 0;
  
  for (const tender of tenders) {
    const raw = tender.rawData || {};
    const base = raw.base || {};
    const procurement = raw.procurement || {};
    
    // Improved Sanitization
    const description = stripTags(tender.description || base.orderDescription || "");
    
    // Improved Budget Extraction
    let budget = (tender.budget || findBudgetInText(description));
    
    // Improved Location Extraction
    let location = (tender.location || findLocationInText(description));

    await prisma.tender.update({
      where: { id: tender.id },
      data: {
        description,
        budget: budget ? parseFloat(budget) : null,
        location,
        detailsFetchedAt: tender.detailsFetchedAt || new Date()
      }
    });
    count++;
  }
  console.log(`Reparsing complete. Processed ${count} tenders.`);
  process.exit(0);
}

reparse().catch(err => {
  console.error(err);
  process.exit(1);
});
