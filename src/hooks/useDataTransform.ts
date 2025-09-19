import { useMemo } from 'react';
import type { Dataset, DataColumn } from '@/pages/Upload';

interface FilterConfig {
  column: string;
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'between';
  value: any;
  value2?: any; // For 'between' operator
}

interface AggregateConfig {
  groupBy: string[];
  aggregations: {
    column: string;
    operation: 'sum' | 'avg' | 'count' | 'min' | 'max';
    alias?: string;
  }[];
}

export function useDataTransform(dataset: Dataset | null) {
  const transformedData = useMemo(() => {
    if (!dataset) return null;

    const filterData = (filters: FilterConfig[]) => {
      if (!filters.length) return dataset.rows;

      return dataset.rows.filter(row => {
        return filters.every(filter => {
          const value = row[filter.column];
          
          switch (filter.operator) {
            case 'equals':
              return value === filter.value;
            case 'contains':
              return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
            case 'greater':
              return Number(value) > Number(filter.value);
            case 'less':
              return Number(value) < Number(filter.value);
            case 'between':
              return Number(value) >= Number(filter.value) && Number(value) <= Number(filter.value2);
            default:
              return true;
          }
        });
      });
    };

    const aggregateData = (config: AggregateConfig, data: any[]) => {
      if (!config.groupBy.length) return data;

      const grouped = data.reduce((acc, row) => {
        const key = config.groupBy.map(col => row[col]).join('|');
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(row);
        return acc;
      }, {} as Record<string, any[]>);

      return Object.entries(grouped).map(([key, rows]) => {
        const result: any = {};
        
        // Add group by columns
        config.groupBy.forEach((col, index) => {
          result[col] = key.split('|')[index];
        });

        // Add aggregations
        config.aggregations.forEach(agg => {
          const alias = agg.alias || `${agg.operation}_${agg.column}`;
          const values = (rows as any[]).map(row => Number(row[agg.column])).filter(v => !isNaN(v));
          
          switch (agg.operation) {
            case 'sum':
              result[alias] = values.reduce((sum, val) => sum + val, 0);
              break;
            case 'avg':
              result[alias] = values.length ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
              break;
            case 'count':
              result[alias] = (rows as any[]).length;
              break;
            case 'min':
              result[alias] = values.length ? Math.min(...values) : 0;
              break;
            case 'max':
              result[alias] = values.length ? Math.max(...values) : 0;
              break;
          }
        });

        return result;
      });
    };

    const sortData = (data: any[], column: string, direction: 'asc' | 'desc' = 'asc') => {
      return [...data].sort((a, b) => {
        const valueA = a[column];
        const valueB = b[column];
        
        // Handle numbers
        if (typeof valueA === 'number' && typeof valueB === 'number') {
          return direction === 'asc' ? valueA - valueB : valueB - valueA;
        }
        
        // Handle strings
        const strA = String(valueA).toLowerCase();
        const strB = String(valueB).toLowerCase();
        
        if (direction === 'asc') {
          return strA < strB ? -1 : strA > strB ? 1 : 0;
        } else {
          return strA > strB ? -1 : strA < strB ? 1 : 0;
        }
      });
    };

    const addDerivedColumn = (data: any[], config: {
      name: string;
      expression: string;
      type: DataColumn['type'];
    }) => {
      return data.map(row => {
        try {
          // Simple expression evaluator for basic operations
          let expression = config.expression;
          
          // Replace column references with actual values
          Object.keys(row).forEach(col => {
            const regex = new RegExp(`\\b${col}\\b`, 'g');
            expression = expression.replace(regex, String(row[col]));
          });
          
          // Evaluate simple mathematical expressions
          const result = Function(`"use strict"; return (${expression})`)();
          
          return {
            ...row,
            [config.name]: result
          };
        } catch (error) {
          console.error('Error evaluating expression:', error);
          return {
            ...row,
            [config.name]: null
          };
        }
      });
    };

    const getUniqueValues = (column: string) => {
      if (!dataset) return [];
      return [...new Set(dataset.rows.map(row => row[column]))].filter(v => v != null);
    };

    const getColumnStats = (column: string) => {
      if (!dataset) return { count: 0, min: 0, max: 0, mean: 0, median: 0, std: 0 };
      
      const values = dataset.rows.map(row => Number(row[column])).filter(v => !isNaN(v));
      
      if (values.length === 0) {
        return {
          count: 0,
          min: 0,
          max: 0,
          mean: 0,
          median: 0,
          std: 0
        };
      }

      const sorted = values.sort((a, b) => a - b);
      const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
      const median = sorted.length % 2 === 0 
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)];
      
      const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
      const std = Math.sqrt(variance);

      return {
        count: values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        mean: Number(mean.toFixed(2)),
        median: Number(median.toFixed(2)),
        std: Number(std.toFixed(2))
      };
    };

    return {
      filterData,
      aggregateData,
      sortData,
      addDerivedColumn,
      getUniqueValues,
      getColumnStats,
    };
  }, [dataset]);

  return transformedData;
}