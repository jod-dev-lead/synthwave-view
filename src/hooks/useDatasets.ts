import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SavedDataset {
  id: string;
  name: string;
  columns: any[];
  row_count: number;
  sample_rows: any[];
  chart_config?: any;
  created_at: string;
  updated_at: string;
}

export function useDatasets() {
  const [datasets, setDatasets] = useState<SavedDataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchDatasets = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: functionError } = await supabase.functions.invoke('get-datasets');

      if (functionError) {
        throw new Error(functionError.message || 'Failed to fetch datasets');
      }

      setDatasets(data.datasets || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch datasets';
      setError(errorMessage);
      toast({
        title: "Error loading datasets",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteDataset = async (id: string) => {
    try {
      const { error } = await supabase
        .from('datasets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDatasets(prev => prev.filter(dataset => dataset.id !== id));
      toast({
        title: "Dataset deleted",
        description: "Dataset has been removed successfully",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete dataset';
      toast({
        title: "Delete failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  return {
    datasets,
    loading,
    error,
    refreshDatasets: fetchDatasets,
    deleteDataset,
  };
}