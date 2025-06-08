'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import TrafficMap with SSR disabled to avoid window reference errors
const TrafficMap = dynamic(
  () => import('@/components/map/TrafficMap'),
  { ssr: false }
);

export default function TrafficMapPage() {
  const [activeTab, setActiveTab] = useState('map');

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link 
          href="/dashboard/traffic"
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-2 inline-flex items-center"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="ml-2">Back to Traffic Dashboard</span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <h1 className="text-3xl font-bold">Traffic Map</h1>
        
        <Tabs defaultValue="map" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="map">Interactive Map</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="map">
            <Card>
              <CardContent className="p-0">
                <div className="h-[700px]">
                  <TrafficMap height="700px" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-10">
                  <h3 className="text-xl font-medium mb-2">Traffic Analytics</h3>
                  <p className="text-gray-500">Advanced analytics will be available soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
} 