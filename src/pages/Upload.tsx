import React, { useState, useCallback } from 'react';
import { FileUpload } from '@/components/upload/FileUpload';
import { DataPreview } from '@/components/upload/DataPreview';
import { ChartBuilder } from '@/components/upload/ChartBuilder';
import { SchemaEditor } from '@/components/upload/SchemaEditor';
import { ExportPanel } from '@/components/upload/ExportPanel';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

export interface DataColumn {
  name: string;
  type: 'number' | 'date' | 'string' | 'category';
  originalType?: string;
  values: any[];
}

export interface Dataset {
  name: string;
  columns: DataColumn[];
  rows: Record<string, any>[];
  originalFile?: File;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'scatter' | 'histogram' | 'pie' | 'area';
  xAxis?: string;
  yAxis?: string;
  groupBy?: string;
  title?: string;
  options: {
    stacking?: boolean;
    smoothing?: boolean;
    legend?: boolean;
    tooltips?: boolean;
    colorPalette?: string[];
  };
}

const Upload: React.FC = () => {
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [chartConfig, setChartConfig] = useState<ChartConfig | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<'upload' | 'preview' | 'schema' | 'transform' | 'chart'>('upload');
  const { toast } = useToast();

  const handleFileProcessed = useCallback((processedDataset: Dataset) => {
    setDataset(processedDataset);
    setCurrentStep('preview');
    toast({
      title: "File uploaded successfully",
      description: `Processed ${processedDataset.rows.length} rows with ${processedDataset.columns.length} columns.`,
    });
  }, [toast]);

  const handleSchemaUpdated = useCallback((updatedColumns: DataColumn[]) => {
    if (dataset) {
      setDataset({ ...dataset, columns: updatedColumns });
    }
  }, [dataset]);

  const handleChartConfigured = useCallback((config: ChartConfig) => {
    setChartConfig(config);
  }, []);

  const handleExportComplete = useCallback(() => {
    toast({
      title: "Export successful",
      description: "Your chart and data have been saved.",
    });
  }, [toast]);

  const handleStepChange = useCallback((step: typeof currentStep) => {
    setCurrentStep(step);
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-foreground">Data Upload & Visualization</h1>
        <p className="text-lg text-muted-foreground">Upload your data, explore it, and create beautiful visualizations</p>
      </div>

      {/* Progress indicator */}
      {isProcessing && (
        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Processing your data...</span>
              <span>{processingProgress}%</span>
            </div>
            <Progress value={processingProgress} />
          </div>
        </Card>
      )}

      {/* Step indicators */}
      <div className="flex justify-center space-x-4 mb-8">
        {[
          { key: 'upload', label: 'Upload', icon: '📁' },
          { key: 'preview', label: 'Preview', icon: '👁️' },
          { key: 'schema', label: 'Schema', icon: '🔧' },
          { key: 'transform', label: 'Transform', icon: '⚙️' },
          { key: 'chart', label: 'Chart', icon: '📊' },
        ].map((step, index) => (
          <div key={step.key} className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep === step.key
                  ? 'bg-primary text-primary-foreground'
                  : dataset || step.key === 'upload'
                  ? 'bg-secondary text-secondary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <span className="text-sm">{step.icon}</span>
            </div>
            <span className="ml-2 text-sm font-medium">{step.label}</span>
            {index < 4 && <div className="w-8 h-px bg-border ml-4" />}
          </div>
        ))}
      </div>

      <Separator />

      {/* Main content area */}
      <div className="space-y-6">
        {/* File Upload Section */}
        {currentStep === 'upload' && (
          <FileUpload
            onFileProcessed={handleFileProcessed}
            setIsProcessing={setIsProcessing}
            setProcessingProgress={setProcessingProgress}
          />
        )}

        {/* Data Preview Section */}
        {dataset && currentStep === 'preview' && (
          <DataPreview
            dataset={dataset}
            onNext={() => handleStepChange('schema')}
            onBack={() => handleStepChange('upload')}
          />
        )}

        {/* Schema Editor Section */}
        {dataset && currentStep === 'schema' && (
          <SchemaEditor
            columns={dataset.columns}
            onSchemaUpdated={handleSchemaUpdated}
            onNext={() => handleStepChange('chart')}
            onBack={() => handleStepChange('preview')}
          />
        )}

        {/* Chart Builder Section */}
        {dataset && currentStep === 'chart' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartBuilder
              dataset={dataset}
              chartConfig={chartConfig}
              onChartConfigured={handleChartConfigured}
            />
            {chartConfig && (
              <ExportPanel
                dataset={dataset}
                chartConfig={chartConfig}
                onExportComplete={handleExportComplete}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;