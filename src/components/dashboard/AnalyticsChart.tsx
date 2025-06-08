'use client';

export default function AnalyticsChart() {
  // This is a placeholder component
  // In a real app, you would integrate with a chart library like Chart.js or Recharts
  
  return (
    <div className="h-64 relative">
      {/* Fake chart background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 opacity-50"></div>
      
      {/* Fake grid lines */}
      <div className="absolute inset-0 grid grid-cols-6 grid-rows-4">
        {Array(24).fill(0).map((_, i) => (
          <div key={i} className="border-t border-l border-gray-700/30"></div>
        ))}
      </div>
      
      {/* Fake chart line */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path 
          d="M0,50 L10,45 L20,60 L30,40 L40,55 L50,35 L60,50 L70,30 L80,45 L90,25 L100,40" 
          fill="none" 
          stroke="#6366f1" 
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        <path 
          d="M0,70 L10,65 L20,75 L30,60 L40,70 L50,55 L60,65 L70,50 L80,65 L90,50 L100,60" 
          fill="none" 
          stroke="#8b5cf6" 
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        
        {/* Add gradient fill under line */}
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
        <path 
          d="M0,50 L10,45 L20,60 L30,40 L40,55 L50,35 L60,50 L70,30 L80,45 L90,25 L100,40 L100,100 L0,100 Z" 
          fill="url(#gradient1)" 
        />
        
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </linearGradient>
        <path 
          d="M0,70 L10,65 L20,75 L30,60 L40,70 L50,55 L60,65 L70,50 L80,65 L90,50 L100,60 L100,100 L0,100 Z" 
          fill="url(#gradient2)" 
        />
      </svg>
      
      {/* Chart labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-xs text-gray-500">
        <span>Jan</span>
        <span>Feb</span>
        <span>Mar</span>
        <span>Apr</span>
        <span>May</span>
        <span>Jun</span>
      </div>
      
      {/* Chart legend */}
      <div className="absolute top-0 right-0 flex items-center space-x-4 p-2">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-indigo-500 rounded-full mr-1"></div>
          <span className="text-xs text-gray-400">Projects</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-purple-500 rounded-full mr-1"></div>
          <span className="text-xs text-gray-400">Analytics</span>
        </div>
      </div>
    </div>
  );
} 