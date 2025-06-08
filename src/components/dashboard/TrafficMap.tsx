'use client';

import { useEffect, useRef } from 'react';

// Simple component to display a traffic map
// In a real application, this would integrate with a mapping API like Google Maps, Mapbox, etc.
export default function TrafficMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Draw a simple map with some traffic indicators
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions to match container
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        drawMap(ctx, canvas.width, canvas.height);
      }
    };
    
    // Initial resize
    resizeCanvas();
    
    // Resize on window resize
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  // Draw the map
  const drawMap = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Background
    ctx.fillStyle = '#f1f5f9'; // Light background for the map
    ctx.fillRect(0, 0, width, height);
    
    // Grid lines (city blocks)
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    
    // Draw horizontal grid lines
    for (let y = 0; y <= height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Draw vertical grid lines
    for (let x = 0; x <= width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Draw main roads
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 5;
    
    // Horizontal main roads
    for (let y = 0; y <= height; y += 120) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Vertical main roads
    for (let x = 0; x <= width; x += 120) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Draw traffic indicators (circles with different colors based on congestion)
    const trafficPoints = [
      { x: width * 0.2, y: height * 0.3, congestion: 'high' },
      { x: width * 0.5, y: height * 0.2, congestion: 'medium' },
      { x: width * 0.8, y: height * 0.4, congestion: 'low' },
      { x: width * 0.3, y: height * 0.6, congestion: 'medium' },
      { x: width * 0.7, y: height * 0.7, congestion: 'high' },
      { x: width * 0.5, y: height * 0.5, congestion: 'high' }, // City center
    ];
    
    trafficPoints.forEach(point => {
      let color;
      switch (point.congestion) {
        case 'high':
          color = '#ef4444'; // Red
          break;
        case 'medium':
          color = '#f59e0b'; // Amber
          break;
        case 'low':
          color = '#10b981'; // Green
          break;
        default:
          color = '#3b82f6'; // Blue
      }
      
      // Draw traffic circle
      ctx.beginPath();
      ctx.arc(point.x, point.y, 12, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      
      // Add glow effect
      ctx.beginPath();
      ctx.arc(point.x, point.y, 20, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(point.x, point.y, 12, point.x, point.y, 20);
      gradient.addColorStop(0, color + '80'); // Semi-transparent
      gradient.addColorStop(1, color + '00'); // Transparent
      ctx.fillStyle = gradient;
      ctx.fill();
    });
    
    // Draw roads with traffic indicators
    drawTrafficRoad(ctx, width * 0.2, height * 0.2, width * 0.8, height * 0.8, 'high');
    drawTrafficRoad(ctx, width * 0.1, height * 0.5, width * 0.9, height * 0.5, 'medium');
    drawTrafficRoad(ctx, width * 0.5, height * 0.1, width * 0.5, height * 0.9, 'low');
  };
  
  // Draw a road with traffic color
  const drawTrafficRoad = (
    ctx: CanvasRenderingContext2D, 
    x1: number, 
    y1: number, 
    x2: number, 
    y2: number, 
    congestion: string
  ) => {
    let color;
    switch (congestion) {
      case 'high':
        color = '#ef4444'; // Red
        break;
      case 'medium':
        color = '#f59e0b'; // Amber
        break;
      case 'low':
        color = '#10b981'; // Green
        break;
      default:
        color = '#3b82f6'; // Blue
    }
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.stroke();
  };
  
  return (
    <div className="w-full h-full relative bg-slate-100 dark:bg-slate-800">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full absolute top-0 left-0"
      />
      <div className="absolute bottom-4 right-4 bg-white dark:bg-slate-700 p-2 rounded-lg shadow-md text-xs flex items-center space-x-4">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
          <span className="text-slate-700 dark:text-slate-200">High</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-amber-500 mr-1"></div>
          <span className="text-slate-700 dark:text-slate-200">Medium</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
          <span className="text-slate-700 dark:text-slate-200">Low</span>
        </div>
      </div>
    </div>
  );
} 