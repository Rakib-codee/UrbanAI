'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  TreePine,
  MapPin,
  Plus,
  Ruler,
  Leaf,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface GreenSpace {
  id: string;
  location: string;
  area: number;
  type: string;
  timestamp: string;
}

const spaceTypes = {
  park: 'Park',
  garden: 'Garden',
  forest: 'Forest',
  playground: 'Playground',
};

export default function GreenSpacesPage() {
  const params = useParams();
  const router = useRouter();
  const [greenSpaces, setGreenSpaces] = useState<GreenSpace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGreenSpaces = async () => {
      try {
        if (!params || !params.id) {
          console.error('Project ID is missing');
          setError('Project ID is missing');
          return;
        }
        
        const response = await fetch(`/api/projects/${params.id}/green-spaces`);
        if (response.ok) {
          const data = await response.json();
          setGreenSpaces(data);
        }
      } catch (error) {
        console.error('Error fetching green spaces:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGreenSpaces();
  }, [params?.id]);

  const filteredSpaces = selectedType
    ? greenSpaces.filter((space) => space.type === selectedType)
    : greenSpaces;

  const totalArea = filteredSpaces.reduce((sum, space) => sum + space.area, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md">
        <p>Error: {error}</p>
        <button 
          onClick={() => router.push('/projects')}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link
            href={`/projects/${params?.id || ''}`}
            className="text-gray-400 hover:text-white flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Project</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Green Spaces</h2>
                <Link
                  href={`/projects/${params?.id || ''}/green-spaces/new`}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>New Area</span>
                </Link>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  <button
                    onClick={() => setSelectedType(null)}
                    className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                      selectedType === null
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    All
                  </button>
                  {Object.entries(spaceTypes).map(([type, label]) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                        selectedType === type
                          ? 'bg-gray-700 text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-gray-700 rounded-lg p-6 animate-pulse h-48"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredSpaces.map((space) => (
                    <motion.div
                      key={space.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-500/10 rounded-lg">
                            <TreePine className="w-5 h-5 text-green-500" />
                          </div>
                          <div>
                            <h3 className="font-medium text-white">
                              {spaceTypes[space.type as keyof typeof spaceTypes]}
                            </h3>
                            <div className="flex items-center gap-1 text-sm text-gray-400">
                              <MapPin className="w-4 h-4" />
                              <span>{space.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-gray-400">
                            <Ruler className="w-4 h-4" />
                            <span>Area Size</span>
                          </div>
                          <span className="text-white">
                            {space.area.toFixed(2)} hectares
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>Added on</span>
                          </div>
                          <span className="text-white">
                            {new Date(space.timestamp).toLocaleDateString('en-US')}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-lg font-medium text-white mb-4">
                Summary
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Ruler className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-400">Total Area</span>
                  </div>
                  <span className="text-white">{totalArea.toFixed(2)} hectares</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TreePine className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-400">Total Count</span>
                  </div>
                  <span className="text-white">{filteredSpaces.length}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-lg font-medium text-white mb-4">
                Environmental Impact
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Leaf className="w-5 h-5 text-green-500" />
                    <span className="text-white">Carbon Sequestration</span>
                  </div>
                  <p className="text-sm text-gray-400">
                    These green spaces absorb approximately {(totalArea * 2.5).toFixed(2)} tons of CO2 per year
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 