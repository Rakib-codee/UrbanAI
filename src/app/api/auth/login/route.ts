import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';
import jwt from 'jsonwebtoken';

// JWT Secret Key - ensure it's a string
const JWT_SECRET = (process.env.JWT_SECRET || 'urbanai-development-jwt-secret-key-do-not-use-in-production') as string;

// Initialize Prisma client
const prisma = new PrismaClient();

// Define user interface for type safety
interface UserData {
  id: string;
  email: string;
  name?: string;
  role?: string;
  [key: string]: unknown; // For any additional fields with safer 'unknown' type
}

// Simple hash function for passwords
function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

// Function to verify password
function verifyPassword(storedPassword: string, inputPassword: string): boolean {
  // SHA-256 hash check
  if (storedPassword.length === 64 && !storedPassword.startsWith('$')) {
    const hashedInput = hashPassword(inputPassword);
    return storedPassword === hashedInput;
  }
  return false;
}

// Create JWT token
function createToken(user: UserData): string {
  try {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name || '',
      role: user.role || 'user'
    };
    
    return jwt.sign(payload, JWT_SECRET);
  } catch (error) {
    console.error('Error creating token:', error);
    throw new Error('Token creation failed');
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    console.log('Login attempt for:', email);
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      console.log('User not found:', email);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Verify password
    const isValid = verifyPassword(user.password, password);
    if (!isValid) {
      console.log('Invalid password for user:', email);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    console.log('Login successful for user:', email);
    
    // Return user without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: userPassword, ...userWithoutPassword } = user;
    
    // Create JWT token
    const token = createToken(userWithoutPassword as UserData);
    
    return NextResponse.json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 