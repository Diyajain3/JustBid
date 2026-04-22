import prisma from './backend/src/config/db.js';
import { matchCompanyToAllTenders } from './backend/src/services/match.service.js';

async function testMatch() {
  const company = await prisma.company.findFirst();
  if (!company) {
    console.log("No company found to match.");
    return;
  }
  console.log(`Matching for company: ${company.name} (ID: ${company.id})`);
  await matchCompanyToAllTenders(company.id);
  const matches = await prisma.match.findMany({ where: { companyId: company.id } });
  console.log(`Matching complete. Found ${matches.length} matches.`);
  process.exit(0);
}

testMatch().catch(err => {
  console.error(err);
  process.exit(1);
});
