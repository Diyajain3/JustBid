import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const tenders = await prisma.tender.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  });
  console.log(JSON.stringify(tenders, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
