'use client';

import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { auth, User } from '@/lib/simple-auth';

// Create authentication context
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true
});

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

export function SessionProvider({ 
  children
}: { 
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on mount
    const checkAuth = () => {
      try {
        // First check localStorage for token
        let token = null;
        if (typeof window !== 'undefined') {
          token = localStorage.getItem('auth-token');
          
          // If token exists in localStorage but not in cookies, set it in cookies
          if (token) {
            document.cookie = `auth-token=${token}; path=/; max-age=2592000; SameSite=Strict`;
          }
        }
        
        const currentUser = auth.getUser();
        console.log('Current user from auth:', currentUser);
        setUser(currentUser);
      } catch (error) {
        console.error('Auth error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}