import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Save, Image, FileText, Database, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Plotly from 'plotly.js';
import type { Dataset, ChartConfig } from '@/pages/Upload';

interface ExportPanelProps {
  dataset: Dataset;
  chartConfig: ChartConfig;
  onExportComplete: () => void;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
  dataset,
  chartConfig,
  onExportComplete,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const exportAsPNG = useCallback(async () => {
    setIsExporting(true);
    try {
      const plotElement = document.querySelector('.js-plotly-plot') as any;
      if (!plotElement) {
        throw new Error('Chart not found');
      }

      const imageData = await Plotly.toImage(plotElement, {
        format: 'png',
        width: 1200,
        height: 800,
      });

      // Create download link
      const link = document.createElement('a');
      link.download = `${chartConfig.title || 'chart'}.png`;
      link.href = imageData;
      link.click();

      toast({
        title: "Chart exported",
        description: "PNG image downloaded successfully",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: "Could not export chart as PNG",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  }, [chartConfig.title, toast]);

  const exportAsHTML = useCallback(async () => {
    setIsExporting(true);
    try {
      const plotElement = document.querySelector('.js-plotly-plot') as any;
      if (!plotElement) {
        throw new Error('Chart not found');
      }

      // Generate HTML with embedded Plotly
      const plotData = plotElement.data;
      const plotLayout = plotElement.layout;
      
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
    <title>${chartConfig.title || 'Chart'}</title>
</head>
<body>
    <div id="chart-container" style="width:100%;height:600px;"></div>
    <script>
        Plotly.newPlot('chart-container', ${JSON.stringify(plotData)}, ${JSON.stringify(plotLayout)}, {responsive: true});
    </script>
</body>
</html>`;

      // Create download link
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${chartConfig.title || 'chart'}.html`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Interactive chart exported",
        description: "HTML file downloaded successfully",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: "Could not export chart as HTML",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  }, [chartConfig.title, toast]);

  const exportCSV = useCallback(() => {
    try {
      const headers = dataset.columns.map(col => col.name);
      const csvContent = [
        headers.join(','),
        ...dataset.rows.map(row => 
          headers.map(header => {
            const value = row[header];
            return typeof value === 'string' && value.includes(',') 
              ? `"${value}"` 
              : String(value || '');
          }).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${dataset.name}.csv`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Data exported",
        description: "CSV file downloaded successfully",
      });
    } catch (error) {
      console.error('CSV export error:', error);
      toast({
        title: "Export failed",
        description: "Could not export data as CSV",
        variant: "destructive",
      });
    }
  }, [dataset, toast]);

  const saveToSupabase = useCallback(async () => {
    setIsSaving(true);
    try {
      // Prepare dataset for saving
      const datasetRecord = {
        name: dataset.name,
        columns: dataset.columns.map(col => ({
          name: col.name,
          type: col.type,
        })),
        row_count: dataset.rows.length,
        sample_rows: dataset.rows.slice(0, 10), // Save first 10 rows as sample
        chart_config: chartConfig,
      };

      console.log('Saving dataset to Supabase:', datasetRecord);

      const { data, error } = await supabase.functions.invoke('save-dataset', {
        body: datasetRecord,
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to save dataset');
      }

      console.log('Dataset saved successfully:', data);

      toast({
        title: "Dataset saved",
        description: "Your data and chart configuration have been saved to the cloud",
      });

      onExportComplete();
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Could not save dataset to cloud",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [dataset, chartConfig, onExportComplete, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export & Save
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Chart Summary */}
        <div className="space-y-3">
          <h4 className="font-medium">Chart Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Type:</span>
              <Badge variant="outline" className="ml-2">
                {chartConfig.type}
              </Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Data Points:</span>
              <span className="ml-2 font-medium">{dataset.rows.length}</span>
            </div>
            {chartConfig.xAxis && (
              <div>
                <span className="text-muted-foreground">X-Axis:</span>
                <span className="ml-2 font-medium">{chartConfig.xAxis}</span>
              </div>
            )}
            {chartConfig.yAxis && (
              <div>
                <span className="text-muted-foreground">Y-Axis:</span>
                <span className="ml-2 font-medium">{chartConfig.yAxis}</span>
              </div>
            )}
          </div>
        </div>

        {/* Export Options */}
        <div className="space-y-4">
          <h4 className="font-medium">Export Chart</h4>
          <div className="grid grid-cols-1 gap-3">
            <Button
              variant="outline"
              onClick={exportAsPNG}
              disabled={isExporting}
              className="justify-start"
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Image className="h-4 w-4 mr-2" />
              )}
              Export as PNG Image
            </Button>

            <Button
              variant="outline"
              onClick={exportAsHTML}
              disabled={isExporting}
              className="justify-start"
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <FileText className="h-4 w-4 mr-2" />
              )}
              Export as Interactive HTML
            </Button>

            <Button
              variant="outline"
              onClick={exportCSV}
              className="justify-start"
            >
              <Database className="h-4 w-4 mr-2" />
              Export Data as CSV
            </Button>
          </div>
        </div>

        {/* Save to Cloud */}
        <div className="space-y-4">
          <h4 className="font-medium">Save to Cloud</h4>
          <div className="p-4 bg-secondary/20 rounded-lg">
            <p className="text-sm text-muted-foreground mb-3">
              Save your dataset and chart configuration to access them later and share with others.
            </p>
            <Button
              onClick={saveToSupabase}
              disabled={isSaving}
              className="w-full"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Dataset & Chart
            </Button>
          </div>
        </div>

        {/* Success Animation */}
        <div className="text-center p-4">
          <p className="text-sm text-muted-foreground">
            🎉 Your visualization is ready! Export or save it to preserve your work.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};