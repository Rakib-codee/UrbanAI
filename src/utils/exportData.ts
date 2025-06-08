import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

type ExportFormat = 'csv' | 'xlsx' | 'json' | 'pdf';

interface ExportOptions {
  fileName: string;
  format: ExportFormat;
  sheetName?: string;
}

/**
 * Export data to various formats (CSV, XLSX, JSON, PDF)
 * @param data Data to export (array of objects)
 * @param options Export options (fileName, format, sheetName)
 */
export const exportData = <T extends Record<string, any>>(
  data: T[],
  options: ExportOptions
): void => {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  const { fileName, format, sheetName = 'Sheet1' } = options;
  const fileNameWithExt = `${fileName}.${format}`;

  try {
    switch (format) {
      case 'csv':
        exportAsCSV(data, fileNameWithExt);
        break;
      case 'xlsx':
        exportAsXLSX(data, fileNameWithExt, sheetName);
        break;
      case 'json':
        exportAsJSON(data, fileNameWithExt);
        break;
      case 'pdf':
        exportAsPDF(data, fileNameWithExt);
        break;
      default:
        console.error('Unsupported export format');
    }
  } catch (error) {
    console.error('Error exporting data:', error);
  }
};

/**
 * Export data as CSV file
 */
const exportAsCSV = <T extends Record<string, any>>(
  data: T[],
  fileName: string
): void => {
  if (data.length === 0) return;

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Convert data to CSV format
  const csvRows = [];
  
  // Add headers
  csvRows.push(headers.join(','));
  
  // Add rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      // Handle values with commas, quotes, etc.
      return typeof value === 'string' 
        ? `"${value.replace(/"/g, '""')}"` 
        : value;
    });
    csvRows.push(values.join(','));
  }
  
  // Create blob and download
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, fileName);
};

/**
 * Export data as XLSX file
 */
const exportAsXLSX = <T extends Record<string, any>>(
  data: T[],
  fileName: string,
  sheetName: string
): void => {
  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  
  // Generate and save file
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, fileName);
};

/**
 * Export data as JSON file
 */
const exportAsJSON = <T extends Record<string, any>>(
  data: T[],
  fileName: string
): void => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  saveAs(blob, fileName);
};

/**
 * Export data as PDF file
 * Note: This is a placeholder implementation that would need to be replaced
 * with a proper PDF generation library like jsPDF or pdfmake
 */
const exportAsPDF = <T extends Record<string, any>>(
  data: T[],
  fileName: string
): void => {
  // In a real implementation, you would use a PDF library
  console.log('PDF export not implemented yet. Use a library like jsPDF or pdfmake.');
  alert('PDF export will be available in the next update.');
  
  // Example implementation using jsPDF would go here
  /*
  import jsPDF from 'jspdf';
  import 'jspdf-autotable';
  
  const doc = new jsPDF();
  
  // Add title
  doc.text(fileName.replace('.pdf', ''), 14, 15);
  
  // Convert data to appropriate format for autotable
  const headers = Object.keys(data[0]);
  const rows = data.map(item => headers.map(key => item[key]));
  
  // Add table
  doc.autoTable({
    head: [headers],
    body: rows,
    startY: 20
  });
  
  // Save PDF
  doc.save(fileName);
  */
};

/**
 * Utility function to format date for filenames
 */
export const getFormattedDate = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}${month}${day}_${hours}${minutes}`;
}; 