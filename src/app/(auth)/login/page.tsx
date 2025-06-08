"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Building, ChartBar, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

function LoginForm() {
  const searchParams = useSearchParams();
  const encodedCallbackUrl = searchParams ? searchParams.get('callbackUrl') : null;
  const callbackUrl = encodedCallbackUrl ? decodeURIComponent(encodedCallbackUrl) : '/dashboard';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Fix hydration issues
  useEffect(() => {
    setIsMounted(true);
    // Debug: Check if callbackUrl is properly parsed
    console.log("Login page mounted with callbackUrl:", callbackUrl);
    console.log("Original encoded callbackUrl:", encodedCallbackUrl);
  }, [callbackUrl, encodedCallbackUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted!', { email, password });
    setIsLoading(true);
    setError('');

    try {
      console.log('Attempting login for:', email);
      
      // Call the API route directly
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Login failed:', data.error);
        setError(data.error || 'Invalid email or password. Please try again.');
        setIsLoading(false);
        return;
      }
      
      // Store user in auth system
      const user = data.user;
      const token = data.token;
      
      if (!user) {
        console.error('No user data received from API');
        setError('Server error: No user data received. Please try again.');
        setIsLoading(false);
        return;
      }
      
      if (!token) {
        console.error('No token received from API');
        setError('Authentication error: No token received. Please try again.');
        setIsLoading(false);
        return;
      }
      
      // Store the token in localStorage
      localStorage.setItem('auth-token', token);
      
      // Set token in cookie for middleware
      document.cookie = `auth-token=${token}; path=/; max-age=2592000; SameSite=Strict`;
      
      // Save user's name to localStorage for dashboard
      if (user.name) {
        localStorage.setItem('userName', user.name);
      }
      
      console.log('Login successful, redirecting to:', callbackUrl);
      console.log('Current URL is:', window.location.href);
      
      // Set a flag to ensure the dashboard starts at the top
      sessionStorage.setItem('dashboardScrollTop', 'true');
      
      // Directly navigate to dashboard, but with page reload
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Login exception:', error);
      setError('System error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  // Early return if not mounted
  if (!isMounted) {
    return <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b]"></div>;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login form */}
      <div className="w-full lg:w-3/5 flex flex-col items-center justify-center px-6 sm:px-12 lg:px-24 py-12 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center mb-12">
            <div className="w-12 h-12 rounded-lg border border-indigo-200 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="ml-3 text-2xl font-semibold text-gray-800">UrbanAI</span>
          </div>

          <h1 className="text-4xl font-bold text-black mb-3">Login to Your Account</h1>
          <p className="text-gray-800 text-lg font-medium mb-8">Login using social networks</p>

          {/* Social login buttons */}
          <div className="flex justify-center space-x-4 mb-8">
            <button className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md hover:bg-blue-700 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </button>
            <button className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white shadow-md hover:bg-red-600 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 11v2.4h3.97c-.16 1.029-1.2 3.02-3.97 3.02-2.39 0-4.34-1.979-4.34-4.42 0-2.44 1.95-4.42 4.34-4.42 1.36 0 2.27.58 2.79 1.08l1.9-1.83c-1.22-1.14-2.8-1.83-4.69-1.83-3.87 0-7 3.13-7 7s3.13 7 7 7c4.04 0 6.721-2.84 6.721-6.84 0-.46-.051-.81-.111-1.16h-6.61zm0 0 17 2h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2z" fillRule="evenodd" clipRule="evenodd" />
              </svg>
            </button>
            <button className="w-12 h-12 rounded-full bg-blue-800 flex items-center justify-center text-white shadow-md hover:bg-blue-900 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
              </svg>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-4 text-base font-medium text-gray-600">OR</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          {/* Login form */}
          {error && (
            <div className="bg-red-100 border-2 border-red-400 text-red-800 font-medium px-4 py-3 rounded-lg mb-6 shadow-sm">
              {error}
            </div>
          )}

          <form onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
          }} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-base font-semibold text-gray-800 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-base font-semibold text-gray-800 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 hover:text-gray-900"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={false}
              className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold rounded-lg shadow-md transition-all duration-300 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-lg font-medium">
            <span className="text-gray-800">Don&apos;t have an account?</span>{" "}
            <Link href="/signup" className="text-indigo-600 hover:text-indigo-800 font-bold">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Signup CTA with animations */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-blue-500 to-indigo-600 flex-col items-center justify-center px-12 relative overflow-hidden">
        {/* Animated background shapes */}
        <div className="absolute inset-0 opacity-20">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }} 
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-white/10"
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.1, 0.2]
            }} 
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-white/10"
          />
          <motion.div 
            animate={{ 
              y: [-10, 10, -10],
              opacity: [0.1, 0.3, 0.1]
            }} 
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="absolute top-3/4 left-1/2 w-40 h-40 rounded-full bg-white/10"
          />
        </div>

        {/* Floating city elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute bottom-10 left-10 w-20 h-32 bg-white/5 backdrop-blur-sm rounded-lg"
          />
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute bottom-16 left-24 w-16 h-40 bg-white/5 backdrop-blur-sm rounded-lg"
          />
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="absolute bottom-12 left-36 w-24 h-28 bg-white/5 backdrop-blur-sm rounded-lg"
          />
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="absolute bottom-20 left-56 w-14 h-36 bg-white/5 backdrop-blur-sm rounded-lg"
          />
          
          {/* Floating data points */}
          <motion.div
            animate={{ 
              y: [-5, 5, -5],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="absolute top-20 right-20 w-3 h-3 bg-yellow-300 rounded-full"
          />
          <motion.div
            animate={{ 
              y: [-8, 8, -8],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
            className="absolute top-32 right-40 w-2 h-2 bg-green-300 rounded-full"
          />
          <motion.div
            animate={{ 
              y: [-6, 6, -6],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ 
              duration: 3.5, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute top-60 right-24 w-4 h-4 bg-blue-300 rounded-full"
          />
        </div>

        <div className="relative z-10 max-w-md text-center flex flex-col min-h-[500px] justify-between py-6">
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl font-bold text-white mb-6"
            >
              New Here?
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/90 text-xl mb-8"
            >
              Join UrbanAI and revolutionize your urban planning process with cutting-edge AI technology
            </motion.p>
            
            <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white/10 backdrop-blur-sm p-4 rounded-xl flex items-start"
                whileHover={{ scale: 1.03 }}
              >
                <div className="mr-3 mt-1 bg-white/20 p-2 rounded-lg">
                  <Building className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-semibold text-lg mb-1">Smart City Planning</h3>
                  <p className="text-white/80">AI-powered urban analysis and development solutions</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-white/10 backdrop-blur-sm p-4 rounded-xl flex items-start"
                whileHover={{ scale: 1.03 }}
              >
                <div className="mr-3 mt-1 bg-white/20 p-2 rounded-lg">
                  <ChartBar className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-semibold text-lg mb-1">Data-Driven Decisions</h3>
                  <p className="text-white/80">Optimize resource allocation with predictive analytics</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="bg-white/10 backdrop-blur-sm p-4 rounded-xl flex items-start"
                whileHover={{ scale: 1.03 }}
              >
                <div className="mr-3 mt-1 bg-white/20 p-2 rounded-lg">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-semibold text-lg mb-1">Location Intelligence</h3>
                  <p className="text-white/80">Geospatial analytics for optimal urban development</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>}>
      <LoginForm />
    </Suspense>
  );
}