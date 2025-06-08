'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

// Import UI components from the unified export
import { Button, Input, Label, Textarea } from '@/components/ui';

// Define interface for props
interface NewGreenSpaceProps {
  params: {
    id: string;
  };
}

const spaceTypes = [
  { value: 'park', label: 'Park' },
  { value: 'garden', label: 'Garden' },
  { value: 'forest', label: 'Forest' },
  { value: 'playground', label: 'Playground' },
  { value: 'recreational', label: 'Recreational Area' },
];

export default function NewGreenSpace({ params }: NewGreenSpaceProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    location: '',
    area: '',
    type: 'park',
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!params || !params.id) {
      setError('Project ID is missing');
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${params.id}/green-spaces`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          area: parseFloat(formData.area),
        }),
      });

      if (response.ok) {
        router.push(`/projects/${params.id}/green-spaces`);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || 'Failed to create green space');
      }
    } catch (err) {
      console.error('Error creating green space:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-10">
        <Link 
          href={`/projects/${params.id}/green-spaces`}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-2 inline-flex items-center"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="ml-2">Back to Green Spaces</span>
        </Link>
      </div>

      <div className="bg-gray-800 rounded-xl p-8 shadow-lg max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-white">New Green Space</h1>
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <Label htmlFor="location" className="text-white mb-2 block">
              Location
            </Label>
            <Input 
              id="location"
              name="location" 
              className="bg-gray-700 border-gray-600 text-white" 
              placeholder="Enter area location"
              required
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
          </div>
          
          <div>
            <Label htmlFor="area" className="text-white mb-2 block">
              Area (Hectares)
            </Label>
            <Input 
              id="area"
              name="area" 
              type="number"
              step="0.01"
              min="0.01"
              className="bg-gray-700 border-gray-600 text-white" 
              placeholder="Enter area size"
              required
              value={formData.area}
              onChange={(e) =>
                setFormData({ ...formData, area: e.target.value })
              }
            />
          </div>
          
          <div>
            <Label htmlFor="type" className="text-white mb-2 block">
              Type
            </Label>
            <select 
              id="type"
              name="type" 
              className="w-full p-2 rounded-md bg-gray-700 border-gray-600 text-white"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              {spaceTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <Label htmlFor="description" className="text-white mb-2 block">
              Description
            </Label>
            <Textarea 
              id="description"
              name="description" 
              className="bg-gray-700 border-gray-600 text-white min-h-[100px]" 
            />
          </div>
          
          <Button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700">
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              <span>Add Green Space</span>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
} 