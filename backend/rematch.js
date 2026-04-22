import { PrismaClient } from '@prisma/client';
import { matchCompanyToAllTenders } from './src/services/match.service.js';

const prisma = new PrismaClient();

async function runRematch() {
  console.log("Triggering global re-match for all companies...");
  const companies = await prisma.company.findMany();
  
  for (const company of companies) {
    console.log(`Matching for company: ${company.name} (${company.id})`);
    await matchCompanyToAllTenders(company.id);
  }
  console.log("Global re-match completed!");
}

runRematch()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
