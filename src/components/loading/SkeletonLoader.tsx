import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  count?: number;
  height?: number;
  className?: string;
}

export default function SkeletonLoader({ count = 1, height = 20, className = '' }: SkeletonLoaderProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0.5 }}
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`bg-gray-200 rounded-md ${className}`}
          style={{ height }}
        />
      ))}
    </>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="space-y-4">
        <SkeletonLoader height={24} className="w-1/3" />
        <SkeletonLoader height={32} className="w-full" />
        <div className="flex space-x-4">
          <SkeletonLoader height={16} className="w-1/4" />
          <SkeletonLoader height={16} className="w-1/4" />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <SkeletonLoader height={24} className="w-1/4" />
      </div>
      <div className="p-4 space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex space-x-4">
            <SkeletonLoader height={16} className="w-1/4" />
            <SkeletonLoader height={16} className="w-1/3" />
            <SkeletonLoader height={16} className="w-1/5" />
          </div>
        ))}
      </div>
    </div>
  );
} 