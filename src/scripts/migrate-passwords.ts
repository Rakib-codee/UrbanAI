import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';
import * as readline from 'readline';

// Define User interface matching our schema
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

const prisma = new PrismaClient();

// Hash password using SHA-256
const hashPassword = (password: string): string => {
  return createHash('sha256').update(password).digest('hex');
};

// Helper to get input from user
const getUserInput = async (question: string): Promise<string> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};

// Main migration function
const migratePasswords = async () => {
  try {
    console.log('🔍 Finding users with bcrypt passwords...');
    
    // Find users with bcrypt passwords
    const users = await prisma.user.findMany();
    
    const bcryptUsers = users.filter((user: User) => user.password.startsWith('$2b$'));
    
    console.log(`Found ${bcryptUsers.length} users with bcrypt passwords out of ${users.length} total users.`);
    
    if (bcryptUsers.length === 0) {
      console.log('No users to migrate.');
      return;
    }
    
    console.log('\nUsers that need password reset:');
    bcryptUsers.forEach((user: User, index: number) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`);
    });
    
    const confirmation = await getUserInput('\nDo you want to reset these passwords to a temporary password? (yes/no): ');
    
    if (confirmation.toLowerCase() !== 'yes') {
      console.log('Migration aborted.');
      return;
    }
    
    const tempPassword = await getUserInput('Enter temporary password for all users: ');
    
    if (!tempPassword) {
      console.log('Empty password not allowed. Migration aborted.');
      return;
    }
    
    // Hash the temp password
    const hashedPassword = hashPassword(tempPassword);
    
    // Update all bcrypt users
    console.log('\nUpdating passwords...');
    
    for (const user of bcryptUsers) {
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
      });
      console.log(`✅ Reset password for ${user.email}`);
    }
    
    console.log('\n🎉 Password migration completed successfully!');
    console.log(`Temporary password for all migrated users: ${tempPassword}`);
    console.log('Please advise users to change their passwords after logging in.');
    
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await prisma.$disconnect();
  }
};

// Run the migration
migratePasswords().catch(console.error); 