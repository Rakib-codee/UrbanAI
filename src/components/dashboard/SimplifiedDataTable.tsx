import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

// Simplified data structure
interface SimpleDataItem {
  id: string;
  location: string;
  timestamp: string;
  status: "normal" | "warning" | "critical";
}

interface SimplifiedDataTableProps {
  title: string;
  description?: string;
  data: SimpleDataItem[];
  loading?: boolean;
  onRefresh?: () => void;
  className?: string;
}

export function SimplifiedDataTable({
  title,
  description,
  data,
  loading = false,
  onRefresh,
  className
}: SimplifiedDataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = data.slice(startIndex, endIndex);
  
  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);
  
  // Status badge styles
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getStatusText = (status: string | number) => {
    // Convert to number if it's a string
    const numStatus = typeof status === 'string' ? parseInt(status) : status;
    
    if (numStatus < 30) {
      return "Normal";
    } else if (numStatus < 70) {
      return "Warning";
    } else {
      return "Critical";
    }
  };

  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {onRefresh && (
            <Button 
              variant="outline" 
              size="sm" 
              className="h-10" 
              onClick={onRefresh}
              disabled={loading}
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
              <span className="ml-2">Refresh</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto rounded-md border border-gray-200">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-gray-50">
              <tr>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Loading state
                Array.from({ length: 3 }).map((_, index) => (
                  <tr key={`skeleton-${index}`} className="border-b">
                    {Array.from({ length: 3 }).map((_, cellIndex) => (
                      <td key={`skeleton-cell-${cellIndex}`} className="px-4 py-3">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : currentItems.length > 0 ? (
                // Data rows
                currentItems.map((item) => (
                  <tr 
                    key={item.id} 
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-medium">{item.location}</td>
                    <td className="px-4 py-3">{item.timestamp}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "px-2 py-1 text-xs font-medium rounded-full",
                        getStatusBadgeClass(item.status)
                      )}>
                        {getStatusText(item.status)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                // No data state
                <tr className="bg-white">
                  <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {!loading && data.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage <= 1}
            >
              Previous
            </Button>
            
            <span className="text-sm">
              Page {currentPage} / {totalPages}
            </span>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage >= totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 