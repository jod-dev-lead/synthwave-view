import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { BarChart, LineChart, ScatterChart, PieChart, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Plot from 'react-plotly.js';
import type { Dataset, ChartConfig } from '@/pages/Upload';

interface ChartBuilderProps {
  dataset: Dataset;
  chartConfig: ChartConfig | null;
  onChartConfigured: (config: ChartConfig) => void;
}

const chartTypes = [
  { value: 'bar', label: 'Bar Chart', icon: BarChart, description: 'Compare categories' },
  { value: 'line', label: 'Line Chart', icon: LineChart, description: 'Show trends over time' },
  { value: 'area', label: 'Area Chart', icon: LineChart, description: 'Show cumulative trends' },
  { value: 'scatter', label: 'Scatter Plot', icon: ScatterChart, description: 'Show correlations' },
  { value: 'histogram', label: 'Histogram', icon: BarChart, description: 'Show distribution' },
  { value: 'pie', label: 'Pie Chart', icon: PieChart, description: 'Show proportions' },
] as const;

export const ChartBuilder: React.FC<ChartBuilderProps> = ({
  dataset,
  chartConfig,
  onChartConfigured,
}) => {
  const [selectedType, setSelectedType] = useState<ChartConfig['type']>(chartConfig?.type || 'bar');
  const [xAxis, setXAxis] = useState<string>(chartConfig?.xAxis || '');
  const [yAxis, setYAxis] = useState<string>(chartConfig?.yAxis || '');
  const [groupBy, setGroupBy] = useState<string>(chartConfig?.groupBy || '');
  const [title, setTitle] = useState<string>(chartConfig?.title || '');
  const [options, setOptions] = useState(chartConfig?.options || {
    stacking: false,
    smoothing: false,
    legend: true,
    tooltips: true,
    colorPalette: [],
  });

  // Get column options based on type
  const numericColumns = dataset.columns.filter(col => col.type === 'number');
  const categoricalColumns = dataset.columns.filter(col => col.type === 'category' || col.type === 'string');
  const dateColumns = dataset.columns.filter(col => col.type === 'date');
  const allColumns = dataset.columns;

  // Chart recommendations based on data
  const recommendations = useMemo(() => {
    const recs: Array<{ type: ChartConfig['type']; reason: string; confidence: number }> = [];

    // Line chart for time series
    if (dateColumns.length > 0 && numericColumns.length > 0) {
      recs.push({ type: 'line', reason: 'Time series data detected', confidence: 0.9 });
      recs.push({ type: 'area', reason: 'Good for cumulative time trends', confidence: 0.7 });
    }

    // Bar chart for categorical vs numeric
    if (categoricalColumns.length > 0 && numericColumns.length > 0) {
      recs.push({ type: 'bar', reason: 'Categories with numeric values', confidence: 0.8 });
    }

    // Scatter plot for numeric correlations
    if (numericColumns.length >= 2) {
      recs.push({ type: 'scatter', reason: 'Multiple numeric variables for correlation', confidence: 0.7 });
    }

    // Histogram for single numeric distribution
    if (numericColumns.length >= 1) {
      recs.push({ type: 'histogram', reason: 'Analyze numeric distribution', confidence: 0.6 });
    }

    // Pie chart for categorical proportions
    if (categoricalColumns.length > 0) {
      recs.push({ type: 'pie', reason: 'Show category proportions', confidence: 0.5 });
    }

    return recs.sort((a, b) => b.confidence - a.confidence);
  }, [dateColumns, numericColumns, categoricalColumns]);

  // Generate chart data
  const chartData = useMemo(() => {
    if (!xAxis && selectedType !== 'histogram') return null;

    const colors = [
      'hsl(var(--chart-1))',
      'hsl(var(--chart-2))', 
      'hsl(var(--chart-3))',
      'hsl(var(--chart-4))',
      'hsl(var(--chart-5))',
    ];

    try {
      switch (selectedType) {
        case 'bar':
        case 'line':
        case 'area': {
          if (!xAxis || !yAxis) return null;
          
          const data = groupBy ? 
            // Grouped data
            dataset.rows.reduce((acc, row) => {
              const xVal = row[xAxis];
              const yVal = row[yAxis];
              const groupVal = row[groupBy];
              
              if (!acc[groupVal]) {
                acc[groupVal] = { x: [], y: [], name: String(groupVal) };
              }
              acc[groupVal].x.push(xVal);
              acc[groupVal].y.push(yVal);
              return acc;
            }, {} as Record<string, any>) :
            // Single series
            { main: {
              x: dataset.rows.map(row => row[xAxis]),
              y: dataset.rows.map(row => row[yAxis]),
              name: yAxis
            }};

          return Object.values(data).map((series: any, index) => ({
            ...series,
            type: selectedType === 'area' ? 'scatter' : selectedType,
            mode: selectedType === 'line' ? 'lines+markers' : undefined,
            fill: selectedType === 'area' ? 'tonexty' : undefined,
            line: options.smoothing ? { shape: 'spline' } : undefined,
            marker: { color: colors[index % colors.length] },
          }));
        }

        case 'scatter': {
          if (!xAxis || !yAxis) return null;
          
          return [{
            x: dataset.rows.map(row => row[xAxis]),
            y: dataset.rows.map(row => row[yAxis]),
            mode: 'markers',
            type: 'scatter',
            name: `${xAxis} vs ${yAxis}`,
            marker: { 
              color: colors[0],
              size: 8,
            },
          }];
        }

        case 'histogram': {
          const column = yAxis || numericColumns[0]?.name;
          if (!column) return null;
          
          return [{
            x: dataset.rows.map(row => row[column]),
            type: 'histogram',
            name: column,
            marker: { color: colors[0] },
          }];
        }

        case 'pie': {
          if (!xAxis) return null;
          
          const valueCounts = dataset.rows.reduce((acc, row) => {
            const val = row[xAxis];
            acc[val] = (acc[val] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          return [{
            values: Object.values(valueCounts),
            labels: Object.keys(valueCounts),
            type: 'pie',
            marker: { colors: colors },
          }];
        }

        default:
          return null;
      }
    } catch (error) {
      console.error('Error generating chart data:', error);
      return null;
    }
  }, [dataset, selectedType, xAxis, yAxis, groupBy, options.smoothing]);

  const handleConfigChange = useCallback(() => {
    const config: ChartConfig = {
      type: selectedType,
      xAxis: xAxis || undefined,
      yAxis: yAxis || undefined,
      groupBy: groupBy || undefined,
      title: title || undefined,
      options,
    };
    onChartConfigured(config);
  }, [selectedType, xAxis, yAxis, groupBy, title, options, onChartConfigured]);

  // Auto-apply config when settings change
  React.useEffect(() => {
    if (chartData) {
      handleConfigChange();
    }
  }, [chartData, handleConfigChange]);

  const plotLayout = {
    title: title || `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Chart`,
    showlegend: options.legend,
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { family: 'var(--font-sans)', color: 'hsl(var(--foreground))' },
    xaxis: { title: xAxis, gridcolor: 'hsl(var(--border))' },
    yaxis: { title: yAxis, gridcolor: 'hsl(var(--border))' },
    margin: { t: 60, r: 40, b: 60, l: 60 },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5" />
          Chart Builder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recommendations */}
        {recommendations.length > 0 && (
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <div className="font-medium mb-2">Recommended Charts:</div>
              <div className="flex flex-wrap gap-2">
                {recommendations.slice(0, 3).map((rec, index) => (
                  <Badge
                    key={index}
                    variant={rec.type === selectedType ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => setSelectedType(rec.type)}
                  >
                    {chartTypes.find(t => t.value === rec.type)?.label} ({Math.round(rec.confidence * 100)}%)
                  </Badge>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Chart Type Selection */}
        <div>
          <Label className="text-base font-medium">Chart Type</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
            {chartTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Card
                  key={type.value}
                  className={`cursor-pointer transition-colors ${
                    selectedType === type.value ? 'ring-2 ring-primary' : 'hover:bg-accent'
                  }`}
                  onClick={() => setSelectedType(type.value)}
                >
                  <CardContent className="p-3 text-center">
                    <Icon className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-medium text-sm">{type.label}</div>
                    <div className="text-xs text-muted-foreground">{type.description}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Axis Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedType !== 'histogram' && (
            <div>
              <Label htmlFor="x-axis">X-Axis</Label>
              <Select value={xAxis} onValueChange={setXAxis}>
                <SelectTrigger>
                  <SelectValue placeholder="Select X-axis column" />
                </SelectTrigger>
                <SelectContent>
                  {allColumns.map((col) => (
                    <SelectItem key={col.name} value={col.name}>
                      <div className="flex items-center gap-2">
                        <span>{col.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {col.type}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {(selectedType !== 'pie' && selectedType !== 'histogram') && (
            <div>
              <Label htmlFor="y-axis">Y-Axis</Label>
              <Select value={yAxis} onValueChange={setYAxis}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Y-axis column" />
                </SelectTrigger>
                <SelectContent>
                  {allColumns.map((col) => (
                    <SelectItem key={col.name} value={col.name}>
                      <div className="flex items-center gap-2">
                        <span>{col.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {col.type}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedType === 'histogram' && (
            <div>
              <Label htmlFor="histogram-column">Column</Label>
              <Select value={yAxis} onValueChange={setYAxis}>
                <SelectTrigger>
                  <SelectValue placeholder="Select column for histogram" />
                </SelectTrigger>
                <SelectContent>
                  {numericColumns.map((col) => (
                    <SelectItem key={col.name} value={col.name}>
                      <div className="flex items-center gap-2">
                        <span>{col.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {col.type}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Group By */}
        {(selectedType === 'bar' || selectedType === 'line' || selectedType === 'area') && (
          <div>
            <Label htmlFor="group-by">Group By (Optional)</Label>
            <Select value={groupBy} onValueChange={setGroupBy}>
              <SelectTrigger>
                <SelectValue placeholder="Select grouping column" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No grouping</SelectItem>
                {categoricalColumns.map((col) => (
                  <SelectItem key={col.name} value={col.name}>
                    <div className="flex items-center gap-2">
                      <span>{col.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {col.type}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Chart Title */}
        <div>
          <Label htmlFor="chart-title">Chart Title</Label>
          <Input
            id="chart-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter chart title"
          />
        </div>

        {/* Chart Options */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Chart Options</Label>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="legend"
                checked={options.legend}
                onCheckedChange={(checked) => setOptions(prev => ({ ...prev, legend: checked }))}
              />
              <Label htmlFor="legend" className="text-sm">Show Legend</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="tooltips"
                checked={options.tooltips}
                onCheckedChange={(checked) => setOptions(prev => ({ ...prev, tooltips: checked }))}
              />
              <Label htmlFor="tooltips" className="text-sm">Show Tooltips</Label>
            </div>

            {(selectedType === 'line' || selectedType === 'area') && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="smoothing"
                  checked={options.smoothing}
                  onCheckedChange={(checked) => setOptions(prev => ({ ...prev, smoothing: checked }))}
                />
                <Label htmlFor="smoothing" className="text-sm">Smooth Lines</Label>
              </div>
            )}

            {selectedType === 'bar' && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="stacking"
                  checked={options.stacking}
                  onCheckedChange={(checked) => setOptions(prev => ({ ...prev, stacking: checked }))}
                />
                <Label htmlFor="stacking" className="text-sm">Stack Bars</Label>
              </div>
            )}
          </div>
        </div>

        {/* Chart Preview */}
        <div>
          <Label className="text-base font-medium">Preview</Label>
          <div className="mt-2 border rounded-lg p-4 bg-card">
            {chartData ? (
              <Plot
                data={chartData}
                layout={plotLayout}
                config={{
                  displayModeBar: false,
                  responsive: true,
                }}
                style={{ width: '100%', height: '400px' }}
              />
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Configure your chart settings to see a preview
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};