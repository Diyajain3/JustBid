const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const tenders = await prisma.tender.findMany({ take: 5 });
  tenders.forEach(t => {
    console.log(`ID: ${t.id}`);
    console.log(`Title: ${t.title}`);
    console.log(`Desc Sample: ${t.description?.substring(0, 50)}`);
    console.log(`Raw Sample: ${JSON.stringify(t.description?.substring(0, 50))}`);
    console.log("---");
  });
  process.exit(0);
}

check();
