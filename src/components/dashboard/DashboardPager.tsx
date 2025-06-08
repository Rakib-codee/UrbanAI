import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: string;
  showItemsPerPageSelector?: boolean;
  itemsPerPageOptions?: number[];
  onItemsPerPageChange?: (value: number) => void;
}

export function DashboardPager({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  className,
  showItemsPerPageSelector = false,
  itemsPerPageOptions = [10, 25, 50, 100],
  onItemsPerPageChange
}: PaginationProps) {
  // Simplified calculation
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;
  
  // Simplified page numbers calculation
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than or equal to maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Simplified logic for larger page counts
      pages.push(1);
      
      if (currentPage > 2) {
        pages.push(-1); // Ellipsis
      }
      
      if (currentPage !== 1 && currentPage !== totalPages) {
        pages.push(currentPage);
      }
      
      if (currentPage < totalPages - 1) {
        pages.push(-2); // Ellipsis
      }
      
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm", className)}>
      <div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-gray-500">
        <div>
          {totalItems === 0
            ? "No items found"
            : `Showing ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                currentPage * itemsPerPage,
                totalItems
              )} of ${totalItems} items`}
        </div>
        <div className="flex items-center space-x-2 ml-auto">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center justify-center w-9 h-9 rounded-md border ${
              currentPage === 1
                ? "border-gray-200 text-gray-300 cursor-not-allowed dark:border-gray-700 dark:text-gray-600"
                : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center space-x-1">
            {Array.from({ length: visiblePages }, (_, i) => {
              const pageNum = getPageNumbers()[i];
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`flex items-center justify-center w-9 h-9 rounded-md ${
                    currentPage === pageNum
                      ? "bg-primary text-primary-foreground shadow"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`}
                  aria-label={`Page ${pageNum}`}
                  aria-current={currentPage === pageNum ? "page" : undefined}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center justify-center w-9 h-9 rounded-md border ${
              currentPage === totalPages
                ? "border-gray-200 text-gray-300 cursor-not-allowed dark:border-gray-700 dark:text-gray-600"
                : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
            aria-label="Next page"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {showItemsPerPageSelector && onItemsPerPageChange && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Items per page:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="h-9 rounded-md border border-gray-300 py-1 text-sm dark:border-gray-600 dark:bg-gray-800"
            aria-label="Items per page"
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
} 