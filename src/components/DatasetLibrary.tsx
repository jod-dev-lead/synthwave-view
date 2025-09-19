import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useDatasets } from "@/hooks/useDatasets";
import { Database, Calendar, BarChart3, Trash2, RefreshCw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface DatasetLibraryProps {
  onDatasetSelect?: (dataset: any) => void;
}

export function DatasetLibrary({ onDatasetSelect }: DatasetLibraryProps) {
  const { datasets, loading, refreshDatasets, deleteDataset } = useDatasets();

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Your Saved Datasets</h3>
          <Skeleton className="h-9 w-24" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (datasets.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Database className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Saved Datasets</h3>
          <p className="text-muted-foreground text-center">
            Upload and save datasets to see them here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Your Saved Datasets</h3>
        <Button variant="outline" size="sm" onClick={refreshDatasets}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {datasets.map((dataset) => (
          <Card key={dataset.id} className="hover-lift cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-base line-clamp-2">{dataset.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 text-xs">
                    <Calendar className="h-3 w-3" />
                    {formatDistanceToNow(new Date(dataset.created_at), { addSuffix: true })}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteDataset(dataset.id);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardHeader>
            <CardContent 
              className="pt-0 space-y-3"
              onClick={() => onDatasetSelect?.(dataset)}
            >
              <div className="flex items-center justify-between text-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Database className="h-3 w-3" />
                    <span>{dataset.row_count.toLocaleString()} rows</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <BarChart3 className="h-3 w-3" />
                    <span>{dataset.columns.length} columns</span>
                  </div>
                </div>
                {dataset.chart_config && (
                  <Badge variant="secondary" className="text-xs">
                    Chart Saved
                  </Badge>
                )}
              </div>
              
              <div className="flex flex-wrap gap-1">
                {dataset.columns.slice(0, 3).map((col: any, idx: number) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {col.name}
                  </Badge>
                ))}
                {dataset.columns.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{dataset.columns.length - 3} more
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}