'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  trend: 'up' | 'down';
}

export default function DashboardCard({ title, value, change, icon, trend }: DashboardCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: "easeOut"
      }}
      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-lg bg-indigo-50">{icon}</div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
            <motion.div
              key={value}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-2xl font-semibold"
            >
              {value}
            </motion.div>
          </div>
        </div>
        <motion.div
          className={`flex items-center ${
            trend === 'up' ? 'text-green-500' : 'text-red-500'
          }`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {trend === 'up' ? '↑' : '↓'} {change}
        </motion.div>
      </div>
    </motion.div>
  );
} 