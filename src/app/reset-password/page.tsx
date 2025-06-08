'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে।');
      } else {
        setStatus('error');
        setMessage(data.message || 'একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      }
    } catch (error) {
      setStatus('error');
      setMessage('একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-gray-800 rounded-xl p-8 shadow-lg"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">পাসওয়ার্ড রিসেট</h1>
          <p className="text-gray-400">আপনার ইমেইল এড্রেস দিন</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              ইমেইল এড্রেস
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500"
                placeholder="example@mail.com"
              />
            </div>
          </div>

          {status === 'error' && (
            <div className="text-red-500 text-sm">{message}</div>
          )}

          {status === 'success' && (
            <div className="text-green-500 text-sm">{message}</div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? 'প্রসেসিং...' : 'পাসওয়ার্ড রিসেট করুন'}
          </button>
        </form>
      </motion.div>
    </div>
  );
} 