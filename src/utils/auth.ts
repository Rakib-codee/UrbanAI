import jsonwebtoken from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest } from 'next/server';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Extended request type with user property
export interface AuthenticatedRequest extends NextApiRequest {
  user: JwtPayload;
}

// Generate JWT token function using standard jsonwebtoken library
export function generateToken(payload: JwtPayload): string {
  const jwtSecret = process.env.NEXTAUTH_SECRET as string;
  
  if (!jwtSecret) {
    console.error('NEXTAUTH_SECRET environment variable is not set!');
    throw new Error('Server configuration error');
  }
  
  // Increased token expiry time (7 days)
  const token = jsonwebtoken.sign(payload, jwtSecret, { 
    expiresIn: '7d',
    algorithm: 'HS256'
  });
  
  return token;
}

// Verify JWT token function using standard jsonwebtoken library
export function verifyToken(token: string): JwtPayload | null {
  try {
    const jwtSecret = process.env.NEXTAUTH_SECRET as string;
    
    if (!jwtSecret) {
      console.error('NEXTAUTH_SECRET environment variable is not set!');
      return null;
    }
    
    const decoded = jsonwebtoken.verify(token, jwtSecret, { algorithms: ['HS256'] }) as JwtPayload;
    return decoded;
  } catch (error: Error | unknown) {
    console.error('JWT verification error:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}

// API request middleware
export function withAuth(handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void> | void) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ success: false, message: 'Please log in' });
      }
      
      const decoded = verifyToken(token);
      
      if (!decoded) {
        // Remove existing cookie
        res.setHeader('Set-Cookie', 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict');
        return res.status(401).json({ success: false, message: 'Session expired, please log in again' });
      }
      
      // Add user info to request
      const authReq = req as AuthenticatedRequest;
      authReq.user = decoded;
      
      return handler(authReq, res);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
}

// Edge/Middleware function - for redirecting to login page
export function isAuthenticated(req: NextRequest): boolean {
  try {
    const token = req.cookies.get('token')?.value;
    
    if (!token) {
      return false;
    }
    
    const decoded = verifyToken(token);
    return !!decoded;
  } catch (error: unknown) {
    console.error('Authentication check error:', error);
    return false;
  }
}

// Set cookie function
export function setAuthCookie(res: NextApiResponse, token: string): void {
  // Increased cookie expiry time (7 days)
  const cookieOptions = { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'strict' as const,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
  };
  
  // Set response header
  res.setHeader(
    'Set-Cookie', 
    `token=${token}; Path=${cookieOptions.path}; Max-Age=${cookieOptions.maxAge}; ${cookieOptions.httpOnly ? 'HttpOnly;' : ''} ${cookieOptions.secure ? 'Secure;' : ''} SameSite=${cookieOptions.sameSite}`
  );
}

// Clear cookie function
export function clearAuthCookie(res: NextApiResponse): void {
  res.setHeader(
    'Set-Cookie', 
    'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict'
  );
} 