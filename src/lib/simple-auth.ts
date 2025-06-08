import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';
import { createToken, verifyToken, User as JWTUser } from './auth/jwt-auth';

// Initialize Prisma client
const prisma = new PrismaClient();

// Types
export type User = JWTUser;

export interface Session {
  user: User;
  expires: string;
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

// Client-side auth utilities
export const auth = {
  // Sign in function
  signIn: async (credentials: { email: string; password: string }): Promise<User | null> => {
    try {
      // Find user by email in database
      const user = await prisma.user.findUnique({
        where: { email: credentials.email }
      });
      
      if (!user) {
        console.log('User not found:', credentials.email);
        return null;
      }
      
      // Verify password
      const isValid = verifyPassword(user.password, credentials.password);
      if (!isValid) {
        console.log('Invalid password for user:', credentials.email);
        return null;
      }
      
      console.log('Login successful for user:', credentials.email);
      
      // Return user without password
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;
      
      // Create and store token
      const token = createToken(userWithoutPassword);
      auth.setToken(token);
      
      return userWithoutPassword;
    } catch (error) {
      console.error('Error during sign in:', error);
      return null;
    } finally {
      await prisma.$disconnect();
    }
  },
  
  // Create token using JWT
  createToken,
  
  // Get token from localStorage or cookies
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      // First try localStorage
      const localToken = localStorage.getItem('auth-token');
      if (localToken) return localToken;
      
      // Then try cookies
      const cookieValue = document.cookie.split('; ')
        .find(row => row.startsWith('auth-token='))
        ?.split('=')[1];
      
      return cookieValue || null;
    }
    return null;
  },
  
  // Store token in both localStorage and cookies
  setToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth-token', token);
      document.cookie = `auth-token=${token}; path=/; max-age=2592000; SameSite=Strict`;
    }
  },
  
  // Remove token from both localStorage and cookies
  removeToken: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
    }
  },
  
  // Get current user from token
  getUser: (): User | null => {
    try {
      const token = auth.getToken();
      if (!token || token === 'invalid-token') return null;
      
      // Verify and decode the JWT token
      return verifyToken(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      auth.removeToken(); // Remove invalid token
      return null;
    }
  },
  
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!auth.getUser();
  },
  
  // Check if auth is still loading
  isLoading: (): boolean => {
    if (typeof window === 'undefined') return true;
    return false;
  },
  
  // Sign out
  signOut: (): void => {
    auth.removeToken();
  },
  
  // Verify a token from server-side
  verifyToken
}; 