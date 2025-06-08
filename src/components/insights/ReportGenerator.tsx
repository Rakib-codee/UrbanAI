import { useState } from 'react';
import { TrendDataPoint, PredictionDataPoint } from '@/services/AnalyticsService';
import { AIRecommendation, generateReportData, convertReportToCSV } from '@/services/AIInsightsService';

interface ReportGeneratorProps {
  cityName: string;
  trafficData: {
    current: number;
    trend: TrendDataPoint[];
    prediction: PredictionDataPoint[];
  };
  airQualityData: {
    current: number;
    trend: TrendDataPoint[];
    prediction: PredictionDataPoint[];
  };
  recommendations: AIRecommendation[];
  isGenerating?: boolean;
}

export default function ReportGenerator({
  cityName,
  trafficData,
  airQualityData,
  recommendations,
  isGenerating = false
}: ReportGeneratorProps) {
  const [reportFormat, setReportFormat] = useState<'pdf' | 'csv'>('pdf');
  const [includeRecommendations, setIncludeRecommendations] = useState(true);
  const [includeRawData, setIncludeRawData] = useState(false);
  const [reportGenerating, setReportGenerating] = useState(false);
  
  // Generate and download report
  const handleGenerateReport = async () => {
    try {
      setReportGenerating(true);
      
      // Generate report data
      const reportData = generateReportData(
        cityName,
        trafficData,
        airQualityData,
        includeRecommendations ? recommendations : []
      );
      
      // Remove raw data if not requested
      if (!includeRawData) {
        delete reportData.rawData;
      }
      
      if (reportFormat === 'csv') {
        // Convert to CSV
        const csvContent = convertReportToCSV(reportData);
        
        // Create download link
        const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `urban_analytics_report_${cityName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        
        // Trigger download
        link.click();
        document.body.removeChild(link);
      } else {
        // For PDF we would use a library like jsPDF or pdfmake
        // Since that would require additional dependencies, we'll simulate it for now
        const jsonString = JSON.stringify(reportData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `urban_analytics_report_${cityName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        // In a real implementation, you would convert to PDF here
        console.log('In production, this would generate a PDF with formatted data');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setReportGenerating(false);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        Report Generator
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Report Format
          </label>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <input
                id="format-pdf"
                type="radio"
                name="report-format"
                checked={reportFormat === 'pdf'}
                onChange={() => setReportFormat('pdf')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="format-pdf" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                PDF
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="format-csv"
                type="radio"
                name="report-format"
                checked={reportFormat === 'csv'}
                onChange={() => setReportFormat('csv')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="format-csv" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                CSV
              </label>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Report Content
          </label>
          
          <div className="flex items-center">
            <input
              id="include-recommendations"
              type="checkbox"
              checked={includeRecommendations}
              onChange={(e) => setIncludeRecommendations(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="include-recommendations" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Include AI Recommendations
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="include-raw-data"
              type="checkbox"
              checked={includeRawData}
              onChange={(e) => setIncludeRawData(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="include-raw-data" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Include Raw Data
            </label>
          </div>
        </div>
        
        <div className="pt-2">
          <button
            onClick={handleGenerateReport}
            disabled={reportGenerating || isGenerating}
            className={`w-full px-4 py-2 text-white rounded-md ${
              reportGenerating || isGenerating 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {reportGenerating || isGenerating ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Report...
              </div>
            ) : (
              'Generate Report'
            )}
          </button>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-sm rounded-md">
        <p>
          <span className="font-semibold">Note:</span> Report will include current status, trends, and predictions for {cityName}&apos;s traffic and air quality.
        </p>
      </div>
    </div>
  );
} 