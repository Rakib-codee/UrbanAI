import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hash } from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await hash(tempPassword, 10);

    // Update user password
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    // Here you would typically send an email with the temporary password
    // For now, we'll just return it (in production, never return passwords!)
    return NextResponse.json({ 
      message: 'Password reset successful',
      tempPassword // Remove this in production!
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 