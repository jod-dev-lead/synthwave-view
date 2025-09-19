import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, Settings, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { DataColumn } from '@/pages/Upload';

interface SchemaEditorProps {
  columns: DataColumn[];
  onSchemaUpdated: (columns: DataColumn[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const dataTypes = [
  { value: 'string', label: 'Text', description: 'Any text or string values' },
  { value: 'number', label: 'Number', description: 'Numeric values for calculations' },
  { value: 'date', label: 'Date', description: 'Date and time values' },
  { value: 'category', label: 'Category', description: 'Categorical/discrete values' },
];

export const SchemaEditor: React.FC<SchemaEditorProps> = ({
  columns,
  onSchemaUpdated,
  onNext,
  onBack,
}) => {
  const [editedColumns, setEditedColumns] = useState<DataColumn[]>(columns);
  const [hasChanges, setHasChanges] = useState(false);

  const handleColumnNameChange = useCallback((index: number, newName: string) => {
    const updated = [...editedColumns];
    updated[index] = { ...updated[index], name: newName };
    setEditedColumns(updated);
    setHasChanges(true);
  }, [editedColumns]);

  const handleColumnTypeChange = useCallback((index: number, newType: DataColumn['type']) => {
    const updated = [...editedColumns];
    updated[index] = { ...updated[index], type: newType };
    setEditedColumns(updated);
    setHasChanges(true);
  }, [editedColumns]);

  const handleApplyChanges = useCallback(() => {
    onSchemaUpdated(editedColumns);
    setHasChanges(false);
  }, [editedColumns, onSchemaUpdated]);

  const handleResetChanges = useCallback(() => {
    setEditedColumns(columns);
    setHasChanges(false);
  }, [columns]);

  // Validate schema
  const validationErrors = React.useMemo(() => {
    const errors: string[] = [];
    
    // Check for empty names
    const emptyNames = editedColumns.filter(col => !col.name.trim());
    if (emptyNames.length > 0) {
      errors.push(`${emptyNames.length} columns have empty names`);
    }

    // Check for duplicate names
    const names = editedColumns.map(col => col.name.trim().toLowerCase());
    const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
    if (duplicates.length > 0) {
      errors.push(`Duplicate column names detected`);
    }

    return errors;
  }, [editedColumns]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'number': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'date': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'string': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 'category': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getSampleValues = (column: DataColumn) => {
    const samples = column.values
      .filter(val => val !== null && val !== undefined && val !== '')
      .slice(0, 3);
    return samples.length > 0 ? samples.join(', ') : 'No valid samples';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Schema Editor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription>
                  <div className="font-medium mb-2">Schema Validation Errors:</div>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Changes Notice */}
            {hasChanges && (
              <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
                <span className="text-sm text-amber-800 dark:text-amber-200">
                  You have unsaved changes to the schema
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleResetChanges}>
                    Reset
                  </Button>
                  <Button size="sm" onClick={handleApplyChanges}>
                    Apply Changes
                  </Button>
                </div>
              </div>
            )}

            {/* Column Editor */}
            <div className="space-y-4">
              <h3 className="font-medium">Column Configuration</h3>
              <div className="grid gap-4">
                {editedColumns.map((column, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                      {/* Column Name */}
                      <div className="md:col-span-4">
                        <Label htmlFor={`column-name-${index}`} className="text-sm font-medium">
                          Column Name
                        </Label>
                        <Input
                          id={`column-name-${index}`}
                          value={column.name}
                          onChange={(e) => handleColumnNameChange(index, e.target.value)}
                          placeholder="Enter column name"
                          className="mt-1"
                        />
                      </div>

                      {/* Data Type */}
                      <div className="md:col-span-3">
                        <Label className="text-sm font-medium">Data Type</Label>
                        <Select
                          value={column.type}
                          onValueChange={(value) => handleColumnTypeChange(index, value as DataColumn['type'])}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {dataTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                <div>
                                  <div className="font-medium">{type.label}</div>
                                  <div className="text-xs text-muted-foreground">{type.description}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Current Type Badge */}
                      <div className="md:col-span-2">
                        <Label className="text-sm font-medium">Inferred</Label>
                        <div className="mt-1">
                          <Badge className={getTypeColor(column.originalType || column.type)}>
                            {column.originalType || column.type}
                          </Badge>
                        </div>
                      </div>

                      {/* Sample Values */}
                      <div className="md:col-span-3">
                        <Label className="text-sm font-medium">Sample Values</Label>
                        <div className="mt-1 text-sm text-muted-foreground font-mono bg-secondary/50 p-2 rounded">
                          {getSampleValues(column)}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Data Type Suggestions */}
            <Card className="bg-secondary/20">
              <CardHeader>
                <h4 className="font-medium">Data Type Guidelines</h4>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div><strong>Number:</strong> Use for quantitative data, calculations, and aggregations</div>
                <div><strong>Date:</strong> Use for temporal data, time series analysis</div>
                <div><strong>Category:</strong> Use for discrete values, grouping, and filtering</div>
                <div><strong>Text:</strong> Use for descriptive text, IDs, and free-form content</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Preview
        </Button>
        <Button 
          onClick={onNext} 
          className="flex items-center gap-2"
          disabled={validationErrors.length > 0}
        >
          Build Charts
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};