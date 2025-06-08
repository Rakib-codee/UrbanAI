const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Create a test user with a SHA-256 hashed password
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', // 'password123' hashed with SHA-256
        role: 'USER',
      },
    });
    console.log('User created:', user);
  } catch (error) {
    // If user already exists, try to update it
    if (error.code === 'P2002') {
      console.log('User already exists, updating password...');
      const user = await prisma.user.update({
        where: { email: 'test@example.com' },
        data: {
          password: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f',
        },
      });
      console.log('User updated:', user);
    } else {
      console.error('Error:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main(); 