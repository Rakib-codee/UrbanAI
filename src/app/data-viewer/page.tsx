'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  createdAt: string;
  _count: {
    projects: number;
  };
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    name: string | null;
    email: string | null;
  };
  _count: {
    trafficData: number;
    resourceData: number;
    greenSpaceData: number;
  };
}

interface TrafficData {
  id: string;
  projectId: string;
  location: string;
  density: number;
  timestamp: string;
  project: {
    name: string;
  };
}

interface ResourceData {
  id: string;
  projectId: string;
  type: string;
  usage: number;
  timestamp: string;
  project: {
    name: string;
  };
}

interface GreenSpaceData {
  id: string;
  projectId: string;
  location: string;
  area: number;
  type: string;
  timestamp: string;
  project: {
    name: string;
  };
}

interface Data {
  users: User[];
  projects: Project[];
  trafficData: TrafficData[];
  resourceData: ResourceData[];
  greenSpaceData: GreenSpaceData[];
}

export default function DataViewerPage() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/data');
        if (!response.ok) {
          throw new Error('Error loading data');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-lg max-w-md">
          <h2 className="text-2xl font-bold text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <Button 
            className="mt-4" 
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Database Viewer</h1>
      
      {data ? (
        <Tabs defaultValue="users">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="users">Users ({data.users.length})</TabsTrigger>
            <TabsTrigger value="projects">Projects ({data.projects.length})</TabsTrigger>
            <TabsTrigger value="traffic">Traffic Data ({data.trafficData.length})</TabsTrigger>
            <TabsTrigger value="resources">Resource Data ({data.resourceData.length})</TabsTrigger>
            <TabsTrigger value="greenspace">Green Space Data ({data.greenSpaceData.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>List of all users in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2 text-left">Name</th>
                        <th className="border p-2 text-left">Email</th>
                        <th className="border p-2 text-left">Role</th>
                        <th className="border p-2 text-left">Created</th>
                        <th className="border p-2 text-left">Projects</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.users.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="border p-2">{user.name || 'Unknown'}</td>
                          <td className="border p-2">{user.email || 'Unknown'}</td>
                          <td className="border p-2">{user.role}</td>
                          <td className="border p-2">{new Date(user.createdAt).toLocaleString('en-US')}</td>
                          <td className="border p-2">{user._count.projects}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="projects" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>প্রজেক্ট</CardTitle>
                <CardDescription>সকল প্রজেক্টের তালিকা</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2 text-left">নাম</th>
                        <th className="border p-2 text-left">বিবরণ</th>
                        <th className="border p-2 text-left">মালিক</th>
                        <th className="border p-2 text-left">তৈরি হয়েছে</th>
                        <th className="border p-2 text-left">ট্রাফিক ডাটা</th>
                        <th className="border p-2 text-left">রিসোর্স ডাটা</th>
                        <th className="border p-2 text-left">গ্রীন স্পেস ডাটা</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.projects.map(project => (
                        <tr key={project.id} className="hover:bg-gray-50">
                          <td className="border p-2">{project.name}</td>
                          <td className="border p-2">{project.description || 'কোন বিবরণ নেই'}</td>
                          <td className="border p-2">{project.user.name || project.user.email || 'অজানা'}</td>
                          <td className="border p-2">{new Date(project.createdAt).toLocaleString('bn-BD')}</td>
                          <td className="border p-2">{project._count.trafficData}</td>
                          <td className="border p-2">{project._count.resourceData}</td>
                          <td className="border p-2">{project._count.greenSpaceData}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="traffic" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>ট্রাফিক ডাটা</CardTitle>
                <CardDescription>ট্রাফিক সিমুলেশন থেকে সংগৃহীত ডাটা</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2 text-left">প্রজেক্ট</th>
                        <th className="border p-2 text-left">অবস্থান</th>
                        <th className="border p-2 text-left">ঘনত্ব</th>
                        <th className="border p-2 text-left">সময়</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.trafficData.map(item => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="border p-2">{item.project.name}</td>
                          <td className="border p-2">{item.location}</td>
                          <td className="border p-2">{item.density}</td>
                          <td className="border p-2">{new Date(item.timestamp).toLocaleString('bn-BD')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="resources" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>রিসোর্স ডাটা</CardTitle>
                <CardDescription>সংস্থান ব্যবহারের তথ্য</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2 text-left">প্রজেক্ট</th>
                        <th className="border p-2 text-left">ধরন</th>
                        <th className="border p-2 text-left">ব্যবহার</th>
                        <th className="border p-2 text-left">সময়</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.resourceData.map(item => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="border p-2">{item.project.name}</td>
                          <td className="border p-2">{item.type}</td>
                          <td className="border p-2">{item.usage}</td>
                          <td className="border p-2">{new Date(item.timestamp).toLocaleString('bn-BD')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="greenspace" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>গ্রীন স্পেস ডাটা</CardTitle>
                <CardDescription>সবুজ এলাকার তথ্য</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2 text-left">প্রজেক্ট</th>
                        <th className="border p-2 text-left">অবস্থান</th>
                        <th className="border p-2 text-left">এলাকা</th>
                        <th className="border p-2 text-left">ধরন</th>
                        <th className="border p-2 text-left">সময়</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.greenSpaceData.map(item => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="border p-2">{item.project.name}</td>
                          <td className="border p-2">{item.location}</td>
                          <td className="border p-2">{item.area}</td>
                          <td className="border p-2">{item.type}</td>
                          <td className="border p-2">{new Date(item.timestamp).toLocaleString('bn-BD')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="p-8 bg-yellow-50 rounded-lg text-center">
          <p className="text-yellow-700">কোন ডাটা পাওয়া যায়নি। আপনার ডাটাবেসে রেকর্ড আছে কিনা নিশ্চিত করুন।</p>
        </div>
      )}
    </div>
  );
} 