import { prisma } from '../src/lib/prisma';

async function main() {
  const count = await prisma.college.count();
  console.log(`Number of colleges in database: ${count}`);
  if (count > 0) {
    const first = await prisma.college.findFirst();
    console.log(`First college: ${first?.name}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
