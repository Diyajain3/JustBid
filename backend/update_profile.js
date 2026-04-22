import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function update() {
  console.log("Updating company profile to match local tender pool...");
  // Use the ID from the previous check
  await prisma.company.update({
    where: { id: '69e1357edf59d67ffbd2dccc' },
    data: {
      cpvCodes: ['71300000'],
      keywords: ['Construction', 'Engineering', 'Sanierung', 'Tiefbau'],
      location: 'Switzerland',
      minBudget: 0,
      maxBudget: 1000000000
    }
  });
  console.log("Profile updated. Now triggering re-match...");
}

update()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
