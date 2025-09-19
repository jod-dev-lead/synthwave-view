import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Eye, ArrowLeft, ArrowRight, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Dataset } from '@/pages/Upload';

interface DataPreviewProps {
  dataset: Dataset;
  onNext: () => void;
  onBack: () => void;
}

const ROWS_PER_PAGE = 50;

export const DataPreview: React.FC<DataPreviewProps> = ({ dataset, onNext, onBack }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(dataset.rows.length / ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const endIndex = Math.min(startIndex + ROWS_PER_PAGE, dataset.rows.length);
  const currentRows = dataset.rows.slice(startIndex, endIndex);

  // Detect potential issues
  const issues = useMemo(() => {
    const detectedIssues: string[] = [];
    
    // Check for duplicate column names
    const columnNames = dataset.columns.map(col => col.name);
    const duplicates = columnNames.filter((name, index) => columnNames.indexOf(name) !== index);
    if (duplicates.length > 0) {
      detectedIssues.push(`Duplicate column names: ${[...new Set(duplicates)].join(', ')}`);
    }

    // Check for invalid column names
    const invalidNames = columnNames.filter(name => !name || name.trim() === '');
    if (invalidNames.length > 0) {
      detectedIssues.push(`${invalidNames.length} columns have empty or invalid names`);
    }

    // Check for missing data
    const missingDataColumns = dataset.columns.filter(col => {
      const missingCount = col.values.filter(val => val === null || val === undefined || val === '').length;
      return missingCount > col.values.length * 0.5; // More than 50% missing
    });
    if (missingDataColumns.length > 0) {
      detectedIssues.push(`Columns with >50% missing data: ${missingDataColumns.map(col => col.name).join(', ')}`);
    }

    return detectedIssues;
  }, [dataset]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'number': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'date': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'string': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 'category': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const formatCellValue = (value: any, type: string) => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-muted-foreground italic">—</span>;
    }
    
    if (type === 'date' && value instanceof Date) {
      return value.toLocaleDateString();
    }
    
    if (type === 'number' && typeof value === 'number') {
      return value.toLocaleString();
    }
    
    return String(value);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Data Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Dataset Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-secondary/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">{dataset.rows.length}</div>
                <div className="text-sm text-muted-foreground">Rows</div>
              </div>
              <div className="text-center p-4 bg-secondary/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">{dataset.columns.length}</div>
                <div className="text-sm text-muted-foreground">Columns</div>
              </div>
              <div className="text-center p-4 bg-secondary/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {dataset.originalFile ? (dataset.originalFile.size / 1024 / 1024).toFixed(2) : 'N/A'}
                </div>
                <div className="text-sm text-muted-foreground">MB</div>
              </div>
              <div className="text-center p-4 bg-secondary/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {dataset.originalFile?.name.split('.').pop()?.toUpperCase() || 'SAMPLE'}
                </div>
                <div className="text-sm text-muted-foreground">Format</div>
              </div>
            </div>

            {/* Issues Alert */}
            {issues.length > 0 && (
              <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription>
                  <div className="font-medium mb-2">Data Quality Issues Detected:</div>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {issues.map((issue, index) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Column Types */}
            <div>
              <h3 className="font-medium mb-3">Column Types</h3>
              <div className="flex flex-wrap gap-2">
                {dataset.columns.map((column, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-card border rounded">
                    <span className="font-medium text-sm">{column.name}</span>
                    <Badge className={getTypeColor(column.type)}>
                      {column.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Table */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">
                  Data Preview ({startIndex + 1}-{endIndex} of {dataset.rows.length})
                </h3>
                {totalPages > 1 && (
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </div>
                )}
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background">
                      <TableRow>
                        {dataset.columns.map((column, index) => (
                          <TableHead key={index} className="whitespace-nowrap">
                            {column.name}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentRows.map((row, rowIndex) => (
                        <TableRow key={startIndex + rowIndex}>
                          {dataset.columns.map((column, colIndex) => (
                            <TableCell key={colIndex} className="whitespace-nowrap">
                              {formatCellValue(row[column.name], column.type)}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              onClick={() => setCurrentPage(pageNum)}
                              isActive={currentPage === pageNum}
                              className="cursor-pointer"
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Upload
        </Button>
        <Button onClick={onNext} className="flex items-center gap-2">
          Edit Schema
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};