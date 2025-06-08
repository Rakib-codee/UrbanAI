'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DebugPage() {
  const [projectId, setProjectId] = useState('sample-project-id');
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Debug Page for Navigation</h1>
      
      <div className="mb-4">
        <label className="block mb-2">Project ID for testing:</label>
        <input 
          type="text" 
          value={projectId} 
          onChange={(e) => setProjectId(e.target.value)}
          className="px-4 py-2 border rounded w-full mb-2"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Main Project Navigation</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/projects" className="text-blue-500 hover:underline">
                Project List
              </Link>
            </li>
            <li>
              <Link href={`/projects/${projectId}`} className="text-blue-500 hover:underline">
                Project Detail
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="border p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Green Spaces Navigation</h2>
          <ul className="space-y-2">
            <li>
              <Link href={`/projects/${projectId}/green-spaces`} className="text-blue-500 hover:underline">
                Green Spaces List
              </Link>
            </li>
            <li>
              <Link href={`/projects/${projectId}/green-spaces/new`} className="text-blue-500 hover:underline">
                Add New Green Space
              </Link>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Path Information:</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Current URL:</strong> <span id="current-url"></span>
            <script dangerouslySetInnerHTML={{ __html: `document.getElementById('current-url').textContent = window.location.href;` }} />
          </li>
          <li>
            <strong>Base Path:</strong> <span id="base-path"></span>
            <script dangerouslySetInnerHTML={{ __html: `document.getElementById('base-path').textContent = window.location.origin;` }} />
          </li>
        </ul>
      </div>
    </div>
  );
} 