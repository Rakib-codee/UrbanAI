'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Users2,
  Edit2,
  Trash2,
  BarChart2,
  Map,
  TreePine,
} from 'lucide-react';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true);
      try {
        if (!params || !params.id) {
          console.error('Project ID is missing');
          setError('Project ID is missing');
          return;
        }
        
        const response = await fetch(`/api/projects/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setProject(data);
        } else {
          console.error('Failed to fetch project');
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [params?.id]);

  const handleDelete = async () => {
    if (!params || !params.id) {
      setDeleteError('Project ID is missing');
      return;
    }
    
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/projects/${params.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/projects');
      } else {
        console.error('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    } finally {
      setIsDeleting(false);
    }
  };

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

  if (!project) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Project not found
          </h1>
          <Link
            href="/projects"
            className="text-indigo-500 hover:text-indigo-400"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/projects"
            className="text-gray-400 hover:text-white flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Projects</span>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-xl p-8 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">{project.name}</h1>
            <div className="flex items-center gap-4">
              <Link
                href={`/projects/${project.id}/edit`}
                className="p-2 text-gray-400 hover:text-white"
              >
                <Edit2 className="w-5 h-5" />
              </Link>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-2 text-red-500 hover:text-red-400 disabled:opacity-50"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <p className="text-gray-400 mb-8">{project.description}</p>

          <div className="flex items-center gap-6 text-sm text-gray-400 mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                Created: {new Date(project.createdAt).toLocaleDateString('en-US')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users2 className="w-4 h-4" />
              <span>3 Members</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href={`/projects/${project.id}/traffic`}
              className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <BarChart2 className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="font-medium text-white">Traffic Data</h3>
              </div>
              <p className="text-sm text-gray-400">
                Traffic monitoring and analysis
              </p>
            </Link>

            <Link
              href={`/projects/${project.id}/resources`}
              className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Map className="w-5 h-5 text-green-500" />
                </div>
                <h3 className="font-medium text-white">Resource Map</h3>
              </div>
              <p className="text-sm text-gray-400">
                Resource location and management
              </p>
            </Link>

            <Link
              href={`/projects/${project.id}/green-spaces`}
              className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <TreePine className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="font-medium text-white">Green Spaces</h3>
              </div>
              <p className="text-sm text-gray-400">
                Green spaces information and management
              </p>
            </Link>
          </div>
        </motion.div>

        {deleteError && (
          <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md">
            {deleteError}
          </div>
        )}
      </div>
    </div>
  );
} 