import React, { useCallback, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, Database, Table } from 'lucide-react';
import { parseFile } from '@/lib/data-parser';
import { sampleDatasets } from '@/lib/sample-datasets';
import type { Dataset } from '@/pages/Upload';

interface FileUploadProps {
  onFileProcessed: (dataset: Dataset) => void;
  setIsProcessing: (processing: boolean) => void;
  setProcessingProgress: (progress: number) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileProcessed,
  setIsProcessing,
  setProcessingProgress,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['.csv', '.json', '.xlsx', '.xls'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      toast({
        title: "Unsupported file type",
        description: "Please upload CSV, JSON, or Excel files only.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (8MB limit for client-side processing)
    const maxSize = 8 * 1024 * 1024; // 8MB
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Files larger than 8MB will be processed on the server. This feature is coming soon.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    setIsProcessing(true);
    setProcessingProgress(10);

    try {
      const dataset = await parseFile(file, (progress) => {
        setProcessingProgress(10 + progress * 0.9);
      });
      
      setProcessingProgress(100);
      onFileProcessed(dataset);
    } catch (error) {
      console.error('File processing error:', error);
      toast({
        title: "Error processing file",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  }, [onFileProcessed, setIsProcessing, setProcessingProgress, toast]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleSampleDataset = useCallback(async (sampleKey: string) => {
    setIsProcessing(true);
    setProcessingProgress(20);
    
    try {
      const sampleDataset = sampleDatasets[sampleKey];
      if (sampleDataset) {
        setProcessingProgress(80);
        onFileProcessed(sampleDataset);
      }
    } catch (error) {
      toast({
        title: "Error loading sample dataset",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  }, [onFileProcessed, setIsProcessing, setProcessingProgress, toast]);

  return (
    <div className="space-y-6">
      {/* File Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Your Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50 hover:bg-primary/5'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              
              <div>
                <p className="text-lg font-medium">Drop your file here</p>
                <p className="text-muted-foreground">or click to browse</p>
              </div>
              
              <Button onClick={() => fileInputRef.current?.click()}>
                Choose File
              </Button>
              
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Supported formats: CSV, JSON, XLSX</p>
                <p>Maximum size: 8MB</p>
              </div>
            </div>
          </div>

          {selectedFile && (
            <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type || 'Unknown type'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.json,.xlsx,.xls"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Sample Datasets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Try Sample Datasets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(sampleDatasets).map(([key, sample]) => (
              <Card
                key={key}
                className="cursor-pointer hover:bg-accent transition-colors"
                onClick={() => handleSampleDataset(key)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Table className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">{sample.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {sample.rows.length} rows • {sample.columns.length} columns
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};