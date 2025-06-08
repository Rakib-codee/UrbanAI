import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExportSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: string;
}

export default function ExportSimulationModal({ isOpen, onClose, scenario }: ExportSimulationModalProps) {
  const [exportFormat, setExportFormat] = useState('pdf');
  const [includeMetrics, setIncludeMetrics] = useState(true);
  const [includeVisuals, setIncludeVisuals] = useState(true);
  const [includeRecommendations, setIncludeRecommendations] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      onClose();
      // In a real app, this would trigger a download or open a new tab
    }, 2000);
  };

  // Get scenario name
  const getScenarioName = () => {
    switch (scenario) {
      case 'baseline':
        return 'Baseline';
      case 'optimized':
        return 'Optimized Traffic';
      case 'sustainable':
        return 'Sustainable City';
      case 'future':
        return 'Future City 2040';
      default:
        return 'Unknown';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            >
              <div className="px-6 py-4 border-b border-gray-700">
                <h3 className="text-xl font-semibold text-white">Export Simulation Results</h3>
              </div>
              <div className="px-6 py-4">
                <div className="mb-4">
                  <p className="text-gray-300">
                    Export the simulation results for the <span className="font-semibold">{getScenarioName()}</span> scenario.
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Export Format</label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500"
                        name="exportFormat"
                        value="pdf"
                        checked={exportFormat === 'pdf'}
                        onChange={() => setExportFormat('pdf')}
                      />
                      <span className="ml-2 text-gray-300">PDF</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500"
                        name="exportFormat"
                        value="csv"
                        checked={exportFormat === 'csv'}
                        onChange={() => setExportFormat('csv')}
                      />
                      <span className="ml-2 text-gray-300">CSV</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500"
                        name="exportFormat"
                        value="json"
                        checked={exportFormat === 'json'}
                        onChange={() => setExportFormat('json')}
                      />
                      <span className="ml-2 text-gray-300">JSON</span>
                    </label>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Include in Export</label>
                  <div className="space-y-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500 rounded"
                        checked={includeMetrics}
                        onChange={() => setIncludeMetrics(!includeMetrics)}
                      />
                      <span className="ml-2 text-gray-300">Performance Metrics</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500 rounded"
                        checked={includeVisuals}
                        onChange={() => setIncludeVisuals(!includeVisuals)}
                      />
                      <span className="ml-2 text-gray-300">Visualizations & Screenshots</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500 rounded"
                        checked={includeRecommendations}
                        onChange={() => setIncludeRecommendations(!includeRecommendations)}
                      />
                      <span className="ml-2 text-gray-300">AI Recommendations</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-700 flex justify-end space-x-2">
                <button
                  type="button"
                  className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md transition-colors"
                  onClick={onClose}
                  disabled={isExporting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors flex items-center"
                  onClick={handleExport}
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Exporting...
                    </>
                  ) : (
                    'Export'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}