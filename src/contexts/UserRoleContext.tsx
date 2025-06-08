import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useSession } from 'next-auth/react';

// Define user roles
export type UserRole = 'admin' | 'cityPlanner' | 'analyst' | 'viewer';

// Define permissions for each feature
export type Permission = 'view' | 'edit' | 'create' | 'delete' | 'approve';

// Define features that require permissions
export type Feature = 
  | 'dashboard' 
  | 'traffic' 
  | 'resources' 
  | 'greenSpaces' 
  | 'simulation' 
  | 'aiAssistant'
  | 'analytics'
  | 'settings'
  | 'users';

// Permission map defines what each role can do with each feature
const PERMISSIONS_MAP: Record<UserRole, Record<Feature, Permission[]>> = {
  admin: {
    dashboard: ['view', 'edit', 'create', 'delete'],
    traffic: ['view', 'edit', 'create', 'delete', 'approve'],
    resources: ['view', 'edit', 'create', 'delete', 'approve'],
    greenSpaces: ['view', 'edit', 'create', 'delete', 'approve'],
    simulation: ['view', 'edit', 'create', 'delete', 'approve'],
    aiAssistant: ['view', 'edit', 'create', 'delete'],
    analytics: ['view', 'edit', 'create', 'delete'],
    settings: ['view', 'edit'],
    users: ['view', 'edit', 'create', 'delete'],
  },
  cityPlanner: {
    dashboard: ['view', 'edit'],
    traffic: ['view', 'edit', 'create', 'approve'],
    resources: ['view', 'edit', 'create', 'approve'],
    greenSpaces: ['view', 'edit', 'create', 'approve'],
    simulation: ['view', 'edit', 'create'],
    aiAssistant: ['view', 'edit', 'create'],
    analytics: ['view', 'edit', 'create'],
    settings: ['view'],
    users: ['view'],
  },
  analyst: {
    dashboard: ['view'],
    traffic: ['view', 'edit', 'create'],
    resources: ['view', 'edit', 'create'],
    greenSpaces: ['view', 'edit', 'create'],
    simulation: ['view', 'edit', 'create'],
    aiAssistant: ['view', 'create'],
    analytics: ['view', 'edit', 'create'],
    settings: ['view'],
    users: ['view'],
  },
  viewer: {
    dashboard: ['view'],
    traffic: ['view'],
    resources: ['view'],
    greenSpaces: ['view'],
    simulation: ['view'],
    aiAssistant: ['view'],
    analytics: ['view'],
    settings: ['view'],
    users: ['view'],
  },
};

interface UserRoleContextType {
  userRole: UserRole;
  hasPermission: (feature: Feature, permission: Permission) => boolean;
  isLoading: boolean;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export const useUserRole = () => {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
};

export const UserRoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Mock session data for development
  const mockSession = {
    data: {
      user: {
        name: "Test User",
        email: "admin@example.com"
      }
    },
    status: "authenticated"
  };
  
  // const { data: session, status } = useSession();
  const { data: session, status } = mockSession;
  
  const [userRole, setUserRole] = useState<UserRole>('viewer');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true);
      return;
    }

    setIsLoading(false);

    // Set user role based on session data
    // In a real application, this would come from your database/API
    if (session?.user) {
      // Example: Get role from user email or custom claim
      const email = session.user.email || '';
      
      if (email.includes('admin')) {
        setUserRole('admin');
      } else if (email.includes('planner')) {
        setUserRole('cityPlanner');
      } else if (email.includes('analyst')) {
        setUserRole('analyst');
      } else {
        setUserRole('viewer');
      }
      
      // You could also fetch this from an API
      /*
      const fetchUserRole = async () => {
        try {
          const response = await fetch('/api/getUserRole');
          const data = await response.json();
          setUserRole(data.role);
        } catch (error) {
          console.error('Error fetching user role:', error);
          setUserRole('viewer'); // Default fallback
        }
      };
      fetchUserRole();
      */
    } else {
      setUserRole('viewer');
    }
  }, [session, status]);

  // Check if user has permission for a specific feature and action
  const hasPermission = (feature: Feature, permission: Permission): boolean => {
    if (!PERMISSIONS_MAP[userRole][feature]) {
      return false;
    }
    
    return PERMISSIONS_MAP[userRole][feature].includes(permission);
  };

  return (
    <UserRoleContext.Provider
      value={{
        userRole,
        hasPermission,
        isLoading,
      }}
    >
      {children}
    </UserRoleContext.Provider>
  );
};

export default UserRoleProvider; 