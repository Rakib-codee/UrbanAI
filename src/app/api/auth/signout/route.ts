import { NextResponse } from 'next/server';

export async function GET() {
  // Clear all cookies related to authentication
  const cookieNames = ['next-auth.session-token', 'next-auth.csrf-token', 'next-auth.callback-url', '__Secure-next-auth.session-token'];
  
  // Set each cookie with an expired date to effectively delete them
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  
  cookieNames.forEach(name => {
    response.cookies.set({
      name,
      value: '',
      expires: new Date(0),
      path: '/',
    });
  });
  
  return response;
} 