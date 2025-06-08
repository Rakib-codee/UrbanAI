import prisma from '../../../src/lib/db/prisma';
import { hash } from 'bcrypt';

/**
 * Test data generation script
 */
async function main() {
  console.log('Starting database seeding...');

  // Create default user
  const passwordHash = await hash('password123', 10);
  
  const defaultUser = await prisma.user.upsert({
    where: { email: 'admin@urbanai.city' },
    update: {},
    create: {
      name: 'Abdul Karim',
      email: 'admin@urbanai.city',
      password: passwordHash,
      role: 'ADMIN',
    },
  });
  
  console.log(`User created: ${defaultUser.name}`);
  
  // Create projects
  const project = await prisma.project.create({
    data: {
      userId: defaultUser.id,
      name: 'Dhaka City Development Project',
      description: 'A comprehensive urban development project for Dhaka city focusing on sustainable infrastructure, transportation, and green spaces.',
    },
  });

  console.log(`Project created: ${project.name}`);

  // Traffic data generation
  const trafficLocations = [
    'Mohammadpur',
    'Gulshan',
    'Banani',
    'Dhanmondi',
    'Motijheel',
  ];

  for (const location of trafficLocations) {
    await prisma.trafficData.create({
      data: {
        projectId: project.id,
        location,
        density: Math.floor(Math.random() * 100),
      },
    });

    console.log(`Traffic data added: ${location}`);
  }

  // Resource data generation
  const resourceTypes = ['Water', 'Electricity', 'Gas', 'Internet'];

  for (const type of resourceTypes) {
    await prisma.resourceData.create({
      data: {
        projectId: project.id,
        type,
        usage: parseFloat((Math.random() * 100).toFixed(2)),
      },
    });

    console.log(`Resource data added: ${type}`);
  }

  // Green space data generation
  const greenSpaceTypes = ['Park', 'Garden', 'Playground', 'Lek', 'Banai'];

  for (let i = 0; i < greenSpaceTypes.length; i++) {
    const greenSpaceData = await prisma.greenSpaceData.create({
      data: {
        projectId: project.id,
        location: `${trafficLocations[i % trafficLocations.length]} km`,
        area: parseFloat((Math.random() * 10 + 1).toFixed(2)),
        type: greenSpaceTypes[i],
      },
    });

    console.log(`Green space data added: ${greenSpaceData.type}`);
  }

  console.log('Database seeding completed!');
}

// Script execution
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Seeding error:', e);
    await prisma.$disconnect();
    process.exit(1);
  }); 