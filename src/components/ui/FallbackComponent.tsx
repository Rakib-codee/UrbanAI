import React from 'react';

interface FallbackComponentProps {
  componentName: string;
  [key: string]: string | number | boolean | object | React.ReactNode;
}

/**
 * A fallback component to be used when a UI component can't be found
 * This helps prevent crashing when component imports fail
 */
export function FallbackComponent({ componentName, ...props }: FallbackComponentProps) {
  console.warn(`Missing component: ${componentName}. Using fallback.`);
  
  // Render a simple div that doesn't break the app
  return (
    <div 
      style={{ 
        padding: '8px', 
        border: '1px dashed #999',
        borderRadius: '4px',
        backgroundColor: '#f7f7f7',
        color: '#555'
      }}
      {...props}
    >
      {componentName} (fallback)
    </div>
  );
}

export default FallbackComponent; 