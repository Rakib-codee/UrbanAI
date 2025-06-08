import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';

const prisma = new PrismaClient();

// Simple hash function for passwords - same as in [...nextauth]/route.ts
const hashPassword = (password: string): string => {
  return createHash('sha256').update(password).digest('hex');
};

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    console.log('Received signup request:', { name, email });

    // Validate input
    if (!name || !email || !password) {
      console.log('Missing required fields');
      return NextResponse.json(
        { message: 'প্রয়োজনীয় ক্ষেত্রগুলি অনুপস্থিত' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log('User already exists:', email);
      return NextResponse.json(
        { message: 'This email already has an account' },
        { status: 400 }
      );
    }

    // Hash password using simple crypto (for development only)
    let hashedPassword;
    try {
      hashedPassword = hashPassword(password);
      console.log('Password hashed successfully, hash length:', hashedPassword.length);
    } catch (hashError) {
      console.error('Error hashing password:', hashError);
      return NextResponse.json(
        { message: 'Error processing your request' },
        { status: 500 }
      );
    }

    // Create user
    console.log('Attempting to create user...');
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });
    console.log('User created successfully:', user.id);

    return NextResponse.json(
      { message: 'User created successfully', userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Detailed signup error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Something went wrong' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 