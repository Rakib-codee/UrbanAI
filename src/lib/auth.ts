import jsonwebtoken from 'jsonwebtoken';

// Define custom user type with role
export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

export interface Session {
  user: User;
  expires: string;
}

// Use a hardcoded secret for development to ensure consistency
const FALLBACK_SECRET = "URBANAI_DEVELOPMENT_SECRET_KEY_DO_NOT_USE_IN_PRODUCTION";

// Get JWT secret
export const getJwtSecret = () => {
  return process.env.JWT_SECRET || FALLBACK_SECRET;
};

// Create token
export const createToken = (user: User): string => {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days
  };
  
  return jsonwebtoken.sign(payload, getJwtSecret());
};

// Verify token
export const verifyToken = (token: string): User | null => {
  try {
    const decoded = jsonwebtoken.verify(token, getJwtSecret()) as User & { exp: number };
    
    // Check if token is expired
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    return decoded;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
};

// Mock users database
const USERS = [
  {
    id: '1',
    name: 'Rakib Islam',
    email: 'rakibislam23@gmail.com',
    password: 'Rakib8838@',
    role: 'admin'
  },
  {
    id: '2',
    name: 'Demo User',
    email: 'user@demo.com',
    password: 'password',
    role: 'user'
  }
];

// Authentication functions
export const auth = {
  // Sign in function
  signIn: async (credentials: { email: string; password: string }): Promise<User | null> => {
    // Find user by email and password
    const user = USERS.find(u => 
      u.email === credentials.email && 
      u.password === credentials.password
    );
    
    if (!user) {
      return null;
    }
    
    // Return user without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    
    return userWithoutPassword;
  },
};

// Helper function for Edge API routes
export async function getMockSession() {
  return {
    user: {
      id: '1',
      name: 'Demo User',
      email: 'user@example.com',
      image: 'https://i.pravatar.cc/150?u=user@example.com'
    }
  };
}