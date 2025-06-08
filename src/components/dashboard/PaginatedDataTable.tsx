import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { DashboardPager } from "@/components/dashboard/DashboardPager";
import { Button } from "@/components/ui/Button";
import { Download, Filter, RefreshCw, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface UrbanDataItem {
  id: string;
  location: string;
  timestamp: string;
  trafficDensity: number;
  airQuality: number;
  noiseLevel: number;
  status: "normal" | "warning" | "critical";
}

interface PaginatedDataTableProps {
  title: string;
  description?: string;
  data: UrbanDataItem[];
  loading?: boolean;
  onRefresh?: () => void;
  onExport?: () => void;
  className?: string;
}

export function PaginatedDataTable({
  title,
  description,
  data,
  loading = false,
  onRefresh,
  onExport,
  className
}: PaginatedDataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filteredData, setFilteredData] = useState<UrbanDataItem[]>(data);
  const [searchTerm, setSearchTerm] = useState("");

  // Update filtered data when data changes or search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredData(data);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = data.filter(item => 
        item.location.toLowerCase().includes(lowercasedSearch) ||
        item.status.toLowerCase().includes(lowercasedSearch)
      );
      setFilteredData(filtered);
    }
    // Reset to first page when filter changes
    setCurrentPage(1);
  }, [data, searchTerm]);

  // Calculate pagination
  const totalItems = filteredData.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Status badge styles
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
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
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <input
                type="search"
                placeholder="অনুসন্ধান করুন..."
                className="h-10 w-full rounded-md border border-gray-200 bg-white pl-8 pr-3 text-sm dark:border-gray-800 dark:bg-gray-950"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="h-10">
              <Filter className="mr-2 h-4 w-4" />
              <span>ফিল্টার</span>
            </Button>
            {onRefresh && (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-10" 
                onClick={onRefresh}
                disabled={loading}
              >
                <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
              </Button>
            )}
            {onExport && (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-10" 
                onClick={onExport}
              >
                <Download className="mr-2 h-4 w-4" />
                <span>এক্সপোর্ট</span>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto rounded-md border border-gray-200 dark:border-gray-800">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3">অবস্থান</th>
                <th className="px-4 py-3">সময়</th>
                <th className="px-4 py-3">ট্রাফিক ঘনত্ব</th>
                <th className="px-4 py-3">বায়ু মান</th>
                <th className="px-4 py-3">শব্দ মাত্রা</th>
                <th className="px-4 py-3">অবস্থা</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Loading state
                Array.from({ length: itemsPerPage }).map((_, index) => (
                  <tr key={`skeleton-${index}`} className="border-b dark:border-gray-700">
                    {Array.from({ length: 6 }).map((_, cellIndex) => (
                      <td key={`skeleton-cell-${cellIndex}`} className="px-4 py-3">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : currentItems.length > 0 ? (
                // Data rows
                currentItems.map((item) => (
                  <tr 
                    key={item.id} 
                    className="bg-white border-b dark:bg-gray-950 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50"
                  >
                    <td className="px-4 py-3 font-medium">{item.location}</td>
                    <td className="px-4 py-3">{item.timestamp}</td>
                    <td className="px-4 py-3">{item.trafficDensity}</td>
                    <td className="px-4 py-3">{item.airQuality}</td>
                    <td className="px-4 py-3">{item.noiseLevel}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "px-2 py-1 text-xs font-medium rounded-full",
                        getStatusBadgeClass(item.status)
                      )}>
                        {item.status === "normal" ? "স্বাভাবিক" : 
                         item.status === "warning" ? "সতর্কতা" : "সঙ্কটপূর্ণ"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                // No data state
                <tr className="bg-white dark:bg-gray-950">
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    কোন ডাটা পাওয়া যায়নি
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4">
          <DashboardPager
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            showItemsPerPageSelector={true}
            onItemsPerPageChange={setItemsPerPage}
          />
        </div>
      </CardContent>
    </Card>
  );
} 