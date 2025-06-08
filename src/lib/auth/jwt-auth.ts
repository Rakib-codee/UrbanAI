// JWT Authentication Configuration
import jwt, { SignOptions } from 'jsonwebtoken';

// Define user type for better type safety
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role?: string;
}

// JWT Secret Key (must match the one in simple-auth.ts)
export const JWT_SECRET = process.env.JWT_SECRET || 'urbanai-development-jwt-secret-key-do-not-use-in-production';

// JWT configuration options
export const jwtOptions: SignOptions = {
  // Token expiration time
  expiresIn: '30d', // 30 days
  
  // JWT algorithm
  algorithm: 'HS256',
  
  // Custom token issuance claims
  issuer: 'urbanai-platform',
  audience: 'urbanai-users'
};

// Create JWT token
export function createToken(user: User): string {
  try {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name || '',
      role: user.role || 'user',
      image: user.image || null,
    };
    
    return jwt.sign(payload, JWT_SECRET, jwtOptions);
  } catch (error) {
    console.error('Error creating token:', error);
    throw new Error('Token creation failed');
  }
}

// Simple function to decode JWT token without verification
// This is safe for client-side as we're not using it for authentication
// just for displaying user information
function decodeJWT(token: string): Record<string, unknown> {
  try {
    // Split the token into parts
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }
    
    // Decode the payload (middle part)
    const payload = parts[1];
    const decoded = JSON.parse(atob(payload));
    
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return {};
  }
}

// Verify JWT token
export function verifyToken(token: string): User | null {
  try {
    if (!token) return null;
    
    // Use different approaches for server and client side
    if (typeof window === 'undefined') {
      // Server-side: Use full verification
      const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
      
      return {
        id: decoded.id as string,
        name: decoded.name as string,
        email: decoded.email as string,
        role: decoded.role as string,
        image: decoded.image as string || undefined
      };
    } else {
      // Client-side: Use simple decoding
      const decoded = decodeJWT(token);
      if (!decoded) return null;
      
      // Check if token has expired
      const expiry = decoded.exp as number;
      if (expiry && expiry * 1000 < Date.now()) {
        return null;
      }
      
      return {
        id: decoded.id as string,
        name: decoded.name as string,
        email: decoded.email as string,
        role: decoded.role as string,
        image: decoded.image as string || undefined
      };
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
} 