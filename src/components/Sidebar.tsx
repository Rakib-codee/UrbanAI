"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home,
  BarChart2,
  Map,
  Activity,
  Cloud,
  Droplets,
  Leaf,
  LogOut
} from 'lucide-react';
import { auth } from '@/lib/simple-auth';

interface SidebarItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
}

const SidebarItem = ({ href, icon: Icon, label, active }: SidebarItemProps) => {
  return (
    <Link 
      href={href}
      className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
        active 
          ? 'bg-green-600 text-white' 
          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span>{label}</span>
    </Link>
  );
};

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  
  const handleLogout = () => {
    auth.signOut();
    router.push('/login');
  };
  
  const links = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/dashboard/traffic', icon: Map, label: 'Traffic' },
    { href: '/dashboard/resources', icon: Activity, label: 'Resources' },
    { href: '/dashboard/weather', icon: Cloud, label: 'Weather' },
    { href: '/dashboard/greenspaces', icon: Leaf, label: 'Green Spaces' },
    { href: '/dashboard/simulation', icon: BarChart2, label: 'Simulation' },
    { href: '/dashboard/ai-assistant', icon: Droplets, label: 'AI Assistant' },
  ];
  
  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-screen">
      <div className="p-4 flex items-center justify-center border-b border-gray-800">
        <Leaf className="w-8 h-8 text-green-500 mr-2" />
        <h1 className="text-xl font-bold">UrbanAI</h1>
      </div>
      
      <div className="py-4 flex-1 overflow-y-auto">
        <nav className="px-4 space-y-2">
          {links.map((link) => (
            <SidebarItem
              key={link.href}
              href={link.href}
              icon={link.icon}
              label={link.label}
              active={pathname === link.href}
            />
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center px-3 py-2 rounded-lg transition-colors text-gray-300 hover:bg-gray-800 hover:text-white w-full"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}; 