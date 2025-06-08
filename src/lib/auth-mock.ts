// Mock authentication data for development and testing purposes.
// IMPORTANT: Replace with real authentication in production!

export const MOCK_USER = {
  id: 'user-id-123',
  name: 'Test User',
  email: 'test@example.com',
  image: null,
  role: 'user',
};

export const isMockEnabled = () => {
  // Enable mock auth based on environment variable or always in development
  return process.env.NEXT_PUBLIC_ENABLE_MOCK_AUTH === 'true' || process.env.NODE_ENV === 'development';
};

export const getMockSession = () => {
  if (!isMockEnabled()) return null;
  
  return {
    user: MOCK_USER,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
  };
}; 