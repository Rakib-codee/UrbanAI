import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '../../../lib/simple-auth';

// Handle different auth routes
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { nextauth } = req.query;
  const action = Array.isArray(nextauth) ? nextauth[0] : null;
  
  // Handle sign-in
  if (action === 'signin' || action === 'callback') {
    if (req.method === 'POST') {
      try {
        const { email, password } = req.body;
        
        if (!email || !password) {
          return res.status(400).json({ error: 'Email and password are required' });
        }
        
        const user = await auth.signIn({ email, password });
        
        if (!user) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Create session token
        const token = auth.createToken(user);
        
        return res.status(200).json({ 
          user,
          token
        });
      } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  }
  
  // Handle sign-out
  if (action === 'signout') {
    return res.status(200).json({ success: true });
  }
  
  // Handle session
  if (action === 'session') {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
      const user = auth.verifyToken(token);
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }
      
      return res.status(200).json({ 
        user,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });
    } catch (error) {
      console.error('Session error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // Default: route not found
  return res.status(404).json({ error: 'Not found' });
} 