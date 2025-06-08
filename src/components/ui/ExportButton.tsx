import React, { useState } from 'react';
import { exportData, getFormattedDate } from '@/utils/exportData';

interface ExportButtonProps<T> {
  data: T[];
  fileName?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export default function ExportButton<T extends Record<string, any>>({
  data,
  fileName = `export_${getFormattedDate()}`,
  label = 'Export',
  className = '',
  disabled = false
}: ExportButtonProps<T>) {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleExport = (format: 'csv' | 'xlsx' | 'json' | 'pdf') => {
    try {
      exportData(data, {
        fileName,
        format,
        sheetName: fileName
      });
      setShowDropdown(false);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={disabled || data.length === 0}
        className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {label}
        <svg 
          className="ml-2 -mr-1 h-4 w-4" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
            clipRule="evenodd" 
          />
        </svg>
      </button>
      
      {showDropdown && (
        <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <button
              onClick={() => handleExport('csv')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
              role="menuitem"
            >
              CSV
            </button>
            <button
              onClick={() => handleExport('xlsx')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
              role="menuitem"
            >
              Excel (XLSX)
            </button>
            <button
              onClick={() => handleExport('json')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
              role="menuitem"
            >
              JSON
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
              role="menuitem"
            >
              PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 