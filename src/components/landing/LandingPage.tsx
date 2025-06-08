'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslation } from '@/app/i18n/hooks';

// Navbar component
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useTranslation();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Features', href: '#features' },
    { name: 'Solutions', href: '#solutions' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'About Us', href: '#about-us' },
  ];
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'glass-card py-2' : 'py-4'
    }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2 hover-scale">
          <div className="w-10 h-10 rounded-full animated-gradient flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <span className="font-bold text-xl gradient-text">UrbanAI</span>
        </Link>
        
        <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <motion.a 
                key={item.name} 
                href={item.href}
                className="font-medium text-white/80 hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.name}
              </motion.a>
          ))}
        </div>
        
        <div className="flex items-center space-x-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
          <Link 
            href="/login" 
              className="font-medium text-white/80 hover:text-white transition-colors"
          >
            {t('auth.login')}
          </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
          <Link 
            href="/signup" 
              className="glass-card px-6 py-2 rounded-full font-medium text-white hover:bg-white/20 transition-colors"
          >
            {t('auth.register')}
          </Link>
          </motion.div>
        </div>
      </div>
    </nav>
  );
};

// Hero section
const Hero = () => {
  // Fix hydration issue
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Data for floating stats
  const stats = [
    { label: "Cities Planned", value: "150+", icon: "🏙️", color: "from-blue-500 to-cyan-300" },
    { label: "Traffic Optimized", value: "45%", icon: "🚦", color: "from-green-500 to-emerald-300" },
    { label: "CO2 Reduction", value: "32%", icon: "🌿", color: "from-green-500 to-teal-300" },
    { label: "Energy Saved", value: "28%", icon: "⚡", color: "from-yellow-500 to-amber-300" },
  ];
  
  // Dynamic data visualization - line coordinates
  const generateDataLines = () => {
    if (!isClient) return [];
    
    const lines = [];
    for (let i = 0; i < 15; i++) {
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      const controlX = startX + Math.random() * 30 - 15;
      const controlY = startY + Math.random() * 30 - 15;
      const endX = startX + Math.random() * 40 - 20;
      const endY = startY + Math.random() * 40 - 20;
      
      lines.push({
        id: i,
        path: `M${startX},${startY} Q${controlX},${controlY} ${endX},${endY}`,
        color: Math.random() > 0.5 ? 'rgba(100, 220, 255, 0.2)' : 'rgba(180, 180, 255, 0.2)',
        delay: i * 0.3
      });
    }
    return lines;
  };
  
  const dataLines = isClient ? generateDataLines() : [];
  
  return (
    <div className="overflow-hidden min-h-screen w-full flex items-center justify-center relative animated-gradient"
        style={{ marginTop: "0", paddingTop: "4rem", borderTop: "none" }}>
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>
      
      {/* Smart city silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-48 z-0 opacity-25 city-silhouette">
        {/* This will be styled with CSS */}
      </div>
      
      {/* Data Visualization Lines */}
      <svg className="absolute inset-0 w-full h-full z-0 opacity-40">
        {dataLines.map((line) => (
          <motion.path
            key={line.id}
            d={line.path}
            stroke={line.color}
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3, delay: line.delay }}
            className="data-line"
          />
        ))}
      </svg>
      
      {/* Floating data nodes */}
      {isClient && (
        <div className="absolute inset-0 z-0">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full data-point"
              style={{
                width: `${4 + Math.random() * 8}px`,
                height: `${4 + Math.random() * 8}px`,
                background: `rgba(${100 + Math.random() * 155}, ${150 + Math.random() * 105}, 255, ${0.3 + Math.random() * 0.4})`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                boxShadow: '0 0 10px rgba(100, 200, 255, 0.5)',
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 3 + Math.random() * 3,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>
      )}
      
      {/* Circuit board pattern */}
      <div className="absolute inset-0 z-0 opacity-10">
        {isClient && Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/30"
            style={{
              height: `${2 + Math.random() * 8}px`,
              width: `${20 + Math.random() * 100}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}
        
        {isClient && Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/30"
            style={{
              height: `${4 + Math.random() * 6}px`,
              width: `${4 + Math.random() * 6}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Floating stats cards */}
      {isClient && (
        <div className="absolute inset-0 z-0">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="absolute glass-card p-3 rounded-lg shadow-lg"
              style={{
                top: `${15 + Math.random() * 70}%`,
                left: `${5 + Math.random() * 40}%`,
                opacity: 0,
                scale: 0.8,
                rotate: Math.random() * 10 - 5,
              }}
              animate={{
                opacity: [0, 0.8, 0.8, 0],
                scale: [0.8, 1, 1, 0.8],
                y: [20, 0, 0, -20],
              }}
              transition={{
                duration: 15,
                delay: i * 5,
                repeat: Infinity,
                repeatDelay: 10,
              }}
            >
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center text-xl`}>
                  {stat.icon}
                </div>
                <div className="ml-3">
                  <div className="text-white font-bold text-lg">{stat.value}</div>
                  <div className="text-white/70 text-xs">{stat.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {/* Animated background particles */}
      <div className="absolute inset-0 z-0">
        {isClient && Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            initial={{
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%',
              opacity: Math.random() * 0.5 + 0.3,
            }}
            animate={{
              x: [
                Math.random() * 100 + '%',
                Math.random() * 100 + '%',
                Math.random() * 100 + '%',
              ],
              y: [
                Math.random() * 100 + '%',
                Math.random() * 100 + '%',
                Math.random() * 100 + '%',
              ],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4 z-10 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 text-center md:text-left mb-12 md:mb-0">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
          >
            Reimagine Urban Planning with{' '}
            <span className="gradient-text">AI</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-xl text-white/80 max-w-xl mx-auto md:mx-0"
          >
            Transform your city planning with cutting-edge AI simulations. Create sustainable, efficient, and future-proof urban environments.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 flex flex-row justify-center md:justify-start space-x-4"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
          >
            <Link 
              href="/signup" 
                className="animated-gradient text-white px-8 py-4 rounded-full font-medium text-lg inline-block text-center"
            >
              Get Started
            </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
            <Link 
              href="#features" 
                className="glass-card px-8 py-4 rounded-full font-medium text-lg text-white hover:bg-white/20 transition-colors inline-block text-center"
            >
              Learn More
            </Link>
            </motion.div>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="md:w-1/2 relative"
        >
          <div className="w-full h-[500px] md:h-[600px] relative animate-float">
            <div className="glass-card w-full h-full p-8 flex items-center justify-center overflow-hidden">
              {/* Interactive City Visualization */}
              <div className="relative w-full h-full">
                {/* City Skyline */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end">
                  {/* Buildings */}
                  {isClient && Array.from({ length: 10 }).map((_, i) => {
                    const height = 100 + Math.random() * 200;
                    const width = 40 + Math.random() * 30;
                    const delay = i * 0.1;
                    const position = 10 + (i * (width + 10));
                    
                    return (
                      <motion.div
                        key={i}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height, opacity: 0.8 }}
                        transition={{ duration: 1, delay, ease: "easeOut" }}
                        className="relative bg-gradient-to-t from-blue-700/40 to-purple-700/20 backdrop-blur-sm rounded-t-lg mx-1"
                        style={{ width, left: `${position}px` }}
                      >
                        {/* Windows */}
                        {Array.from({ length: Math.floor(height / 30) }).map((_, j) => (
                          <div key={j} className="absolute w-full flex justify-center" style={{ bottom: 30 * j + 10 }}>
                            <div className="flex space-x-2">
                              {Array.from({ length: 2 }).map((_, k) => (
                                <div
                                  key={k}
                                  className="w-3 h-3 bg-yellow-400/70 rounded-sm"
                                  style={{
                                    animationDelay: `${Math.random() * 5}s`,
                                    animation: Math.random() > 0.7 ? 'pulse 4s infinite' : 'none'
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    );
                  })}
                </div>
                
                {/* Animated Traffic */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-blue-900/20 backdrop-blur-sm">
                  {isClient && Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute bottom-2 h-3 w-6 rounded-sm bg-red-500/70"
                      initial={{ left: "-20px" }}
                      animate={{ left: "calc(100% + 20px)" }}
                      transition={{
                        duration: 8,
                        delay: i * 2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  ))}
                  
                  {isClient && Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute bottom-2 h-3 w-6 rounded-sm bg-blue-500/70"
                      initial={{ right: "-20px" }}
                      animate={{ right: "calc(100% + 20px)" }}
                      transition={{
                        duration: 10,
                        delay: i * 1.5,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  ))}
                </div>
                
                {/* Floating Data Points */}
                {isClient && Array.from({ length: 8 }).map((_, i) => {
                  const size = 30 + Math.random() * 40;
                  const x = Math.random() * 80;
                  const y = Math.random() * 70;
                  
                  return (
                    <motion.div
                      key={i}
                      className="absolute glass-card flex items-center justify-center rounded-full"
                      style={{ width: size, height: size, left: `${x}%`, top: `${y}%` }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 0.9 }}
                      transition={{ duration: 0.8, delay: 1 + (i * 0.2) }}
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="w-2/3 h-2/3 rounded-full bg-gradient-to-br from-blue-500/50 to-purple-500/50"
                      />
                    </motion.div>
                  );
                })}
                
                {/* Animated Connections Between Data Points */}
                <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                  {isClient && Array.from({ length: 10 }).map((_, i) => {
                    const startX = Math.random() * 100;
                    const startY = Math.random() * 100;
                    const endX = Math.random() * 100;
                    const endY = Math.random() * 100;
                    
                    return (
                      <motion.line
                        key={i}
                        x1={`${startX}%`}
                        y1={`${startY}%`}
                        x2={`${endX}%`}
                        y2={`${endY}%`}
                        stroke="rgba(147, 197, 253, 0.3)"
                        strokeWidth="1"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.5 }}
                        transition={{ duration: 2, delay: 1.5 + (i * 0.1) }}
                      />
                    );
                  })}
                </svg>
                
                {/* AI Analysis Overlay */}
                <div className="absolute top-5 right-5 glass-card p-3 rounded-lg" style={{ maxWidth: '180px' }}>
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 rounded-full bg-green-400 mr-2 animate-pulse"></div>
                    <div className="text-white/90 text-xs font-semibold">AI Analysis Active</div>
              </div>
                  <div className="h-2 bg-white/10 rounded-full mb-2">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '75%' }}
                      transition={{ duration: 2, delay: 2 }}
                    />
                  </div>
                  <div className="text-white/70 text-xs mt-1">Traffic Optimization: 75%</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Features section
const Features = () => {
  const features = [
    {
      title: "AI-Powered Simulations",
      description: "Leverage advanced machine learning algorithms to simulate urban development scenarios with unprecedented accuracy.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "3D Visualization",
      description: "Experience your urban plans in immersive 3D environments that bring your vision to life before breaking ground.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      )
    },
    {
      title: "Smart Analytics",
      description: "Get deep insights into urban patterns and trends with our advanced analytics and machine learning capabilities.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: "Traffic Management",
      description: "Optimize traffic flow and reduce congestion with AI-driven traffic management solutions for smarter urban mobility.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "Sustainability Planning",
      description: "Create eco-friendly urban spaces with integrated tools for environmental impact assessment and green infrastructure planning.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    {
      title: "Collaborative Workspace",
      description: "Enable seamless teamwork with real-time collaboration tools that connect urban planners, architects, and stakeholders.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: "Data-Driven Decision Making",
      description: "Make informed urban planning decisions with comprehensive data visualization and analysis tools.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: "Public Engagement Tools",
      description: "Involve citizens in the planning process with interactive surveys, feedback tools, and community engagement features.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    {
      title: "Integrated Resource Management",
      description: "Efficiently manage urban resources including water, energy, and waste with smart monitoring and optimization systems.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      )
    }
  ];
  
  return (
    <section id="features" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Powerful Features for Modern Urban Planning
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Our cutting-edge tools empower urban planners and city developers to create sustainable, efficient cities of the future.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-8 hover-scale rounded-xl shadow-xl border border-white/10"
            >
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 text-center">{feature.title}</h3>
              <p className="text-white/80 text-center text-lg leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Testimonials section
const Testimonials = () => {
  const testimonials = [
    {
      content: "UrbanAI has revolutionized how we approach urban planning. The AI-powered simulations have helped us make better decisions faster than ever before.",
      author: "Sarah Chen",
      role: "Urban Planning Director",
      company: "Smart City Solutions",
      image: "/testimonials/sarah.jpg"
    },
    {
      content: "The 3D visualization capabilities are incredible. We can now show stakeholders exactly how our projects will impact the community before breaking ground.",
      author: "Michael Rodriguez",
      role: "Chief Architect",
      company: "Urban Innovations",
      image: "/testimonials/michael.jpg"
    },
    {
      content: "The collaborative features have made it so much easier to work with our team and stakeholders. UrbanAI is now an essential part of our planning process.",
      author: "Emily Thompson",
      role: "City Planner",
      company: "Metropolitan Council",
      image: "/testimonials/emily.jpg"
    }
  ];
  
  return (
    <section className="py-24 bg-gray-800 relative">
      {/* Decorative elements */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-gray-900 to-transparent"></div>
      <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-gray-900 to-transparent"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-blue-500/10 blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-purple-500/10 blur-xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            See what urban planning professionals are saying about UrbanAI
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-8 rounded-xl shadow-xl backdrop-blur-md border border-white/10 hover-scale"
            >
              {/* Quote icon */}
              <div className="mb-6 text-blue-400">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.4 24H8V33.6H17.6V24L12.8 12H8L14.4 24ZM30.4 24H24V33.6H33.6V24L28.8 12H24L30.4 24Z" fill="currentColor" fillOpacity="0.5"/>
                </svg>
              </div>
              
              <blockquote className="text-white/90 text-lg font-light italic leading-relaxed mb-8">
                &ldquo;{testimonial.content}&rdquo;
              </blockquote>
              
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-white font-semibold text-lg">{testimonial.author}</h3>
                  <p className="text-white/70 text-sm">{testimonial.role}</p>
                  <p className="text-white/50 text-sm">{testimonial.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Trust indicators */}
        <div className="mt-24">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-semibold text-white mb-2">Trusted by Organizations Worldwide</h3>
            <p className="text-white/60">Join hundreds of urban planning organizations using UrbanAI</p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            {/* Company logos would go here - using placeholder text for now */}
            <div className="text-white/50 font-semibold text-xl">CITY CORP</div>
            <div className="text-white/50 font-semibold text-xl">URBAN TECH</div>
            <div className="text-white/50 font-semibold text-xl">METRO SYSTEMS</div>
            <div className="text-white/50 font-semibold text-xl">SMART CITIES INC</div>
            <div className="text-white/50 font-semibold text-xl">PLANNING+</div>
          </div>
        </div>
      </div>
    </section>
  );
};

// CTA section
const CTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 animated-gradient opacity-90"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl"></div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10 flex items-center justify-center">
        <div className="max-w-4xl mx-auto w-full">
          <div className="glass-card p-12 rounded-2xl shadow-2xl backdrop-blur-lg border border-white/10 text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-white mb-6 text-center"
            >
              Ready to Transform Your Urban Planning?
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-xl text-white/80 mb-12 text-center leading-relaxed"
            >
              Join thousands of urban planners and city developers who are already using UrbanAI to create smarter, more sustainable cities.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row justify-center items-center space-y-6 sm:space-y-0 sm:space-x-6"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
            >
              <Link 
                href="/signup" 
                  className="animated-gradient px-10 py-4 rounded-full font-semibold text-lg text-white shadow-lg border border-white/20 inline-flex items-center justify-center w-full sm:w-auto"
              >
                  <span className="mr-2">Start Free Trial</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
              </Link>
            </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Link
                  href="/contact"
                  className="glass-card px-10 py-4 rounded-full font-semibold text-lg text-white hover:bg-white/10 transition-colors inline-flex items-center justify-center shadow-lg w-full sm:w-auto"
                >
                  Contact Sales
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Extra trust indicator */}
            <div className="mt-12 text-center">
              <p className="text-white/60 text-sm flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure, reliable, and trusted by leading urban planning organizations
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Footer section
const Footer = () => {
  const footerLinks = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Solutions', href: '#solutions' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Case Studies', href: '#case-studies' },
    ],
    company: [
      { name: 'About Us', href: '#about' },
      { name: 'Careers', href: '#careers' },
      { name: 'Blog', href: '#blog' },
      { name: 'Press', href: '#press' },
    ],
    resources: [
      { name: 'Documentation', href: '#docs' },
      { name: 'Help Center', href: '#help' },
      { name: 'API Reference', href: '#api' },
      { name: 'Community', href: '#community' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#privacy' },
      { name: 'Terms of Service', href: '#terms' },
      { name: 'Cookie Policy', href: '#cookies' },
    ],
  };

  const socialLinks = [
    {
      name: 'Twitter',
      href: '#',
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ),
    },
    {
      name: 'GitHub',
      href: '#',
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      href: '#',
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      href: '#',
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: '#',
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="relative bg-gray-900 overflow-hidden">
      {/* Background gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 opacity-80"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-purple-500/5 blur-3xl"></div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Main footer sections */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row justify-between items-start mb-12">
            {/* Logo and description */}
            <div className="md:w-1/3 mb-12 md:mb-0">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 rounded-full animated-gradient flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
                <span className="gradient-text font-bold text-3xl">UrbanAI</span>
            </div>
              <p className="text-gray-400 mb-6 text-lg max-w-md">
                UrbanAI empowers urban planners and city developers with cutting-edge AI solutions for creating sustainable, efficient cities of the future.
            </p>
            <div className="flex space-x-4">
                {socialLinks.map((item) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    className="glass-card p-3 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <span className="sr-only">{item.name}</span>
                    {item.icon}
                  </motion.a>
              ))}
            </div>
          </div>
          
            {/* Link columns */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:w-2/3">
              {Object.entries(footerLinks).map(([category, links]) => (
                <div key={category}>
                  <h3 className="text-white font-semibold text-lg mb-6 relative">
                    <span className="relative z-10">{category}</span>
                    <span className="absolute -bottom-2 left-0 w-10 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></span>
                  </h3>
                  <ul className="space-y-3">
                    {links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-gray-400 hover:text-white transition-colors block py-1 hover:translate-x-1 duration-200"
                        >
                          {link.name}
                        </Link>
                </li>
              ))}
            </ul>
          </div>
              ))}
            </div>
          </div>
          
          {/* Newsletter subscription */}
          <div className="glass-card p-8 rounded-xl backdrop-blur-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-6 md:mb-0 md:w-1/2">
                <h3 className="text-white font-bold text-xl mb-2">Subscribe to Our Newsletter</h3>
                <p className="text-gray-400">Stay updated with the latest in urban planning and AI innovations.</p>
              </div>
              <div className="md:w-1/2">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="bg-white/10 px-4 py-3 rounded-lg text-white placeholder-gray-400 flex-grow outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom footer area */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} UrbanAI. All rights reserved.
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <Link href="#privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link href="#terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
            <Link href="#cookies" className="hover:text-gray-300 transition-colors">Cookie Policy</Link>
            <Link href="#sitemap" className="hover:text-gray-300 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Showcase section
const Showcase = () => {
  return (
    <section className="py-20 bg-gray-800 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Experience the Future of Urban Planning
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Our platform combines cutting-edge AI technology with intuitive design to revolutionize how cities are planned and developed.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="glass-card p-8 hover-scale rounded-xl shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                Real-time 3D Visualization
              </h3>
              <p className="text-white/80 text-lg leading-relaxed">
                Experience your urban planning projects in immersive 3D environments. Make informed decisions with real-time visualization of changes and impacts.
              </p>
                  </div>
            
            <div className="glass-card p-8 hover-scale rounded-xl shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                AI-Powered Analytics
              </h3>
              <p className="text-white/80 text-lg leading-relaxed">
                Leverage machine learning algorithms to analyze traffic patterns, population density, and environmental impact for optimal urban development.
              </p>
            </div>
        
            <div className="glass-card p-8 hover-scale rounded-xl shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Collaborative Platform
              </h3>
              <p className="text-white/80 text-lg leading-relaxed">
                Enable seamless collaboration between stakeholders with real-time updates, comments, and version control for your urban planning projects.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="w-full aspect-square relative animate-float">
              <div className="glass-card w-full h-full p-8 rounded-2xl shadow-2xl backdrop-blur-lg overflow-hidden border border-white/20">
                <div className="relative w-full h-full">
                  {/* City visualization background elements */}
                  <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-blue-500/20 filter blur-xl"></div>
                    <div className="absolute bottom-1/3 right-1/3 w-40 h-40 rounded-full bg-purple-500/20 filter blur-xl"></div>
                    <div className="absolute top-1/2 right-1/4 w-24 h-24 rounded-full bg-green-500/20 filter blur-xl"></div>
                  </div>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full rounded-xl flex items-center justify-center relative">
                      {/* 3D City Model */}
                      <div className="relative z-10 transform-gpu">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-48 w-48 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      
                      {/* Data points */}
                      <div className="absolute top-1/4 left-1/4 w-3 h-3 rounded-full bg-blue-400 animate-pulse"></div>
                      <div className="absolute top-1/3 right-1/3 w-3 h-3 rounded-full bg-purple-400 animate-pulse"></div>
                      <div className="absolute bottom-1/4 left-1/3 w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                      <div className="absolute bottom-1/3 right-1/4 w-3 h-3 rounded-full bg-yellow-400 animate-pulse"></div>
                      
                      {/* Connection lines */}
                      <svg className="absolute inset-0 w-full h-full z-0">
                        <line x1="25%" y1="25%" x2="33%" y2="33%" stroke="rgba(96, 165, 250, 0.5)" strokeWidth="1" />
                        <line x1="33%" y1="66%" x2="25%" y2="75%" stroke="rgba(96, 165, 250, 0.5)" strokeWidth="1" />
                        <line x1="66%" y1="33%" x2="75%" y2="25%" stroke="rgba(96, 165, 250, 0.5)" strokeWidth="1" />
                        <line x1="75%" y1="75%" x2="66%" y2="66%" stroke="rgba(96, 165, 250, 0.5)" strokeWidth="1" />
                      </svg>
                      
                      {/* Data overlay */}
                      <div className="absolute top-4 right-4 glass-card p-3 rounded-lg" style={{ maxWidth: '160px' }}>
                        <div className="text-white/90 text-xs font-semibold mb-1">Urban Analytics</div>
                        <div className="h-1.5 bg-white/10 rounded-full mb-1">
                          <div className="h-full bg-blue-400 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                        <div className="text-white/70 text-xs">Population: 2.4M</div>
                      </div>
                      
                      <div className="absolute bottom-4 left-4 glass-card p-3 rounded-lg" style={{ maxWidth: '160px' }}>
                        <div className="text-white/90 text-xs font-semibold mb-1">Sustainability</div>
                        <div className="h-1.5 bg-white/10 rounded-full mb-1">
                          <div className="h-full bg-green-400 rounded-full" style={{ width: '82%' }}></div>
                        </div>
                        <div className="text-white/70 text-xs">CO₂ Reduction: 82%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Main Landing Page component
export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden" style={{ background: "transparent", margin: 0, padding: 0 }}>
      <div className="relative">
      <Navbar />
        <main className="flex flex-col w-full" style={{ margin: 0, padding: 0 }}>
          <div className="section-container"><Hero /></div>
          <div className="section-container"><Features /></div>
          <div className="section-container"><Showcase /></div>
          <div className="section-container"><Testimonials /></div>
          <div className="section-container"><CTA /></div>
          <div><Footer /></div>
        </main>
      </div>
    </div>
  );
} 