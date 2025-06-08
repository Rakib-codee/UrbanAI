import React from 'react';

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description, 
  actions 
}) => {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
        
        {description && (
          <p className="mt-1 text-gray-700 dark:text-gray-300 max-w-2xl">
            {description}
          </p>
        )}
      </div>
      
      {actions && (
        <div className="flex space-x-2 mt-2 md:mt-0">
          {actions}
        </div>
      )}
    </div>
  );
}; 