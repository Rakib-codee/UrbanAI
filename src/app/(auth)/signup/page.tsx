'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle, Eye, EyeOff } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    givenName: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasNumber: false,
    hasUppercase: false,
    hasLowercase: false,
    hasSpecialChar: false,
  });
  const [isMounted, setIsMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Fix hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Password validation
  useEffect(() => {
    const { password } = formData;
    const requirements = {
      minLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setPasswordRequirements(requirements);
    
    // Auto-hide requirements when all are met
    if (Object.values(requirements).every(Boolean)) {
      setShowPasswordRequirements(false);
    }
  }, [formData.password, formData]);

  const allRequirementsMet = Object.values(passwordRequirements).every(Boolean);
  const passwordsMatch = formData.password === formData.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!allRequirementsMet) {
      setError('Please meet all password requirements');
      setLoading(false);
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${formData.givenName} ${formData.surname}`.trim(),
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Something went wrong');
      }

      router.push('/login?message=Account created successfully');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Early return if not mounted
  if (!isMounted) {
    return <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b]"></div>;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
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

          <h1 className="text-4xl font-bold text-gray-900 mb-2">Sign Up</h1>
          <p className="text-gray-800 text-lg mb-8">Create your account to get started</p>

          {/* Signup form */}
          {error && (
            <div className="bg-red-100 border-2 border-red-400 text-red-800 font-medium px-4 py-3 rounded-lg mb-6 shadow-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="givenName" className="block text-base font-semibold text-gray-800 mb-2">
                First Name
              </label>
              <input
                id="givenName"
                type="text"
                value={formData.givenName}
                onChange={(e) => setFormData({ ...formData, givenName: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                placeholder="Enter your first name"
                required
              />
            </div>

            <div>
              <label htmlFor="surname" className="block text-base font-semibold text-gray-800 mb-2">
                Last Name
              </label>
              <input
                id="surname"
                type="text"
                value={formData.surname}
                onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                placeholder="Enter your last name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-base font-semibold text-gray-800 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onFocus={() => setShowPasswordRequirements(true)}
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
              
              <AnimatePresence>
                {showPasswordRequirements && !allRequirementsMet && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-3 p-4 bg-gray-100 border-2 border-gray-300 rounded-lg shadow-sm"
                  >
                    <div className="space-y-2">
                      {Object.entries(passwordRequirements).map(([key, met]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <div className={met ? "text-green-600" : "text-gray-400"}>
                            <CheckCircle className={`h-5 w-5 ${met ? "text-green-600" : "text-gray-400"}`} />
                          </div>
                          <span className={`text-base ${met ? "text-green-800 font-medium" : "text-gray-800"}`}>
                            {key === "minLength" && "At least 8 characters"}
                            {key === "hasUppercase" && "One uppercase letter"}
                            {key === "hasLowercase" && "One lowercase letter"}
                            {key === "hasNumber" && "One number"}
                            {key === "hasSpecialChar" && "One special character"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-base font-semibold text-gray-800 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  placeholder="Confirm your password"
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
              {formData.confirmPassword && !passwordsMatch && (
                <p className="mt-2 text-base font-medium text-red-600">Passwords do not match</p>
              )}
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading || !allRequirementsMet || !passwordsMatch}
                className={`w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold rounded-lg shadow-md transition-all duration-300 flex items-center justify-center ${
                  loading || !allRequirementsMet || !passwordsMatch
                    ? 'opacity-70 cursor-not-allowed'
                    : ''
                }`}
              >
                {loading ? (
                  <div className="w-6 h-6 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2" />
                ) : (
                  "Sign Up"
                )}
              </button>
            </div>
          </form>

          {/* Social login */}
          <div className="mt-8">
            <div className="flex items-center my-6">
              <div className="flex-grow h-px bg-gray-300"></div>
              <span className="px-4 text-base text-gray-600 font-medium">OR</span>
              <div className="flex-grow h-px bg-gray-300"></div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md hover:bg-blue-700 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </button>
              <button className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white shadow-md hover:bg-red-600 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 11v2.4h3.97c-.16 1.029-1.2 3.02-3.97 3.02-2.39 0-4.34-1.979-4.34-4.42 0-2.44 1.95-4.42 4.34-4.42 1.36 0 2.27.58 2.79 1.08l1.9-1.83c-1.22-1.14-2.8-1.83-4.69-1.83-3.87 0-7 3.13-7 7s3.13 7 7 7c4.04 0 6.721-2.84 6.721-6.84 0-.46-.051-.81-.111-1.16h-6.61zm0 0 17 2h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2z" fillRule="evenodd" clipRule="evenodd" />
                </svg>
              </button>
              <button className="w-12 h-12 rounded-full bg-blue-800 flex items-center justify-center text-white shadow-md hover:bg-blue-900 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                </svg>
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-lg font-medium">
            <span className="text-gray-800">Already have an account?</span>{" "}
            <Link href="/login" className="text-indigo-600 hover:text-indigo-800 font-bold">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Features */}
      <div className="hidden lg:block lg:w-2/5 bg-gradient-to-br from-blue-500 to-indigo-600">
        <div className="h-full flex items-center justify-center p-12">
          <div className="max-w-md">
            <div className="flex flex-col space-y-8">
              {/* Card 1 */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="ml-4 text-xl font-semibold text-white">Your data, your rules</h3>
                </div>
                <p className="text-white/80">Take control of your urban planning data with advanced visualization tools.</p>
              </div>

              {/* Card 2 */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="ml-4 text-xl font-semibold text-white">AI-Powered Insights</h3>
                </div>
                <p className="text-white/80">Leverage machine learning to uncover patterns and optimize urban development.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 