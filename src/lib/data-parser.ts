import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import type { Dataset, DataColumn } from '@/pages/Upload';

export const parseFile = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<Dataset> => {
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result;
        if (!content) throw new Error('Failed to read file');

        onProgress?.(50);

        let rawData: any[][] = [];
        
        switch (fileExtension) {
          case '.csv':
            rawData = parseCSV(content as string);
            break;
          case '.json':
            rawData = parseJSON(content as string);
            break;
          case '.xlsx':
          case '.xls':
            rawData = parseExcel(content as ArrayBuffer);
            break;
          default:
            throw new Error(`Unsupported file type: ${fileExtension}`);
        }

        onProgress?.(80);

        const dataset = processRawData(rawData, file.name);
        
        onProgress?.(100);
        resolve(dataset);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));

    if (fileExtension === '.xlsx' || fileExtension === '.xls') {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  });
};

const parseCSV = (content: string): any[][] => {
  const result = Papa.parse(content, {
    header: false,
    skipEmptyLines: true,
    dynamicTyping: true,
  });

  if (result.errors.length > 0) {
    console.warn('CSV parsing warnings:', result.errors);
  }

  return result.data as any[][];
};

const parseJSON = (content: string): any[][] => {
  const data = JSON.parse(content);
  
  if (Array.isArray(data)) {
    if (data.length === 0) return [];
    
    // If array of objects, convert to 2D array
    if (typeof data[0] === 'object' && data[0] !== null) {
      const keys = Object.keys(data[0]);
      return [keys, ...data.map(obj => keys.map(key => obj[key]))];
    }
    
    // If array of arrays, use as is
    if (Array.isArray(data[0])) {
      return data;
    }
    
    // If array of primitives, create single column
    return [['value'], ...data.map(val => [val])];
  }
  
  throw new Error('JSON must contain an array of data');
};

const parseExcel = (content: ArrayBuffer): any[][] => {
  const workbook = XLSX.read(content, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  
  if (!sheetName) throw new Error('No sheets found in Excel file');
  
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet, { 
    header: 1,
    defval: null,
  }) as any[][];
  
  return data.filter(row => row.some(cell => cell !== null && cell !== undefined && cell !== ''));
};

const processRawData = (rawData: any[][], fileName: string): Dataset => {
  if (rawData.length === 0) {
    throw new Error('No data found in file');
  }

  // Extract headers (first row)
  const headers = rawData[0].map((header, index) => 
    header && String(header).trim() ? String(header).trim() : `Column ${index + 1}`
  );

  // Extract data rows
  const dataRows = rawData.slice(1);

  // Infer column types and process data
  const columns: DataColumn[] = headers.map((name, colIndex) => {
    const values = dataRows.map(row => row[colIndex]);
    const type = inferColumnType(values);
    
    return {
      name,
      type,
      originalType: type,
      values,
    };
  });

  // Convert rows to objects
  const rows = dataRows.map(row => {
    const rowObj: Record<string, any> = {};
    headers.forEach((header, index) => {
      rowObj[header] = row[index];
    });
    return rowObj;
  });

  return {
    name: fileName.replace(/\.[^/.]+$/, ''), // Remove extension
    columns,
    rows,
  };
};

const inferColumnType = (values: any[]): DataColumn['type'] => {
  const nonNullValues = values.filter(val => val !== null && val !== undefined && val !== '');
  
  if (nonNullValues.length === 0) return 'string';

  // Count different types of values
  let numberCount = 0;
  let dateCount = 0;
  let stringCount = 0;
  
  const uniqueValues = new Set();

  for (const value of nonNullValues) {
    uniqueValues.add(value);
    
    // Check if it's a number
    if (typeof value === 'number' || (!isNaN(Number(value)) && !isNaN(parseFloat(String(value))))) {
      numberCount++;
      continue;
    }
    
    // Check if it's a date
    const dateValue = new Date(value);
    if (!isNaN(dateValue.getTime()) && isValidDateString(String(value))) {
      dateCount++;
      continue;
    }
    
    stringCount++;
  }

  const total = nonNullValues.length;
  
  // Type inference rules
  if (numberCount / total >= 0.8) {
    return 'number';
  }
  
  if (dateCount / total >= 0.6) {
    return 'date';
  }
  
  // If few unique values relative to total, consider it categorical
  if (uniqueValues.size < Math.min(50, total * 0.1) && stringCount > 0) {
    return 'category';
  }
  
  return 'string';
};

const isValidDateString = (str: string): boolean => {
  // Common date patterns
  const datePatterns = [
    /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
    /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY
    /^\d{2}-\d{2}-\d{4}$/, // MM-DD-YYYY
    /^\d{4}\/\d{2}\/\d{2}$/, // YYYY/MM/DD
  ];
  
  return datePatterns.some(pattern => pattern.test(str)) || 
         !isNaN(Date.parse(str));
};