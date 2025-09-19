import type { Dataset } from '@/pages/Upload';

export const sampleDatasets: Record<string, Dataset> = {
  sales: {
    name: 'Sales Performance',
    columns: [
      { name: 'Month', type: 'category', values: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
      { name: 'Revenue', type: 'number', values: [45000, 52000, 48000, 61000, 55000, 67000] },
      { name: 'Units Sold', type: 'number', values: [450, 520, 480, 610, 550, 670] },
      { name: 'Region', type: 'category', values: ['North', 'South', 'North', 'West', 'East', 'South'] },
    ],
    rows: [
      { Month: 'Jan', Revenue: 45000, 'Units Sold': 450, Region: 'North' },
      { Month: 'Feb', Revenue: 52000, 'Units Sold': 520, Region: 'South' },
      { Month: 'Mar', Revenue: 48000, 'Units Sold': 480, Region: 'North' },
      { Month: 'Apr', Revenue: 61000, 'Units Sold': 610, Region: 'West' },
      { Month: 'May', Revenue: 55000, 'Units Sold': 550, Region: 'East' },
      { Month: 'Jun', Revenue: 67000, 'Units Sold': 670, Region: 'South' },
    ],
  },
  
  website: {
    name: 'Website Analytics',
    columns: [
      { name: 'Date', type: 'date', values: ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05'] },
      { name: 'Page Views', type: 'number', values: [1250, 1420, 1180, 1650, 1890] },
      { name: 'Unique Visitors', type: 'number', values: [890, 1020, 840, 1150, 1340] },
      { name: 'Bounce Rate', type: 'number', values: [0.35, 0.42, 0.38, 0.29, 0.31] },
    ],
    rows: [
      { Date: '2024-01-01', 'Page Views': 1250, 'Unique Visitors': 890, 'Bounce Rate': 0.35 },
      { Date: '2024-01-02', 'Page Views': 1420, 'Unique Visitors': 1020, 'Bounce Rate': 0.42 },
      { Date: '2024-01-03', 'Page Views': 1180, 'Unique Visitors': 840, 'Bounce Rate': 0.38 },
      { Date: '2024-01-04', 'Page Views': 1650, 'Unique Visitors': 1150, 'Bounce Rate': 0.29 },
      { Date: '2024-01-05', 'Page Views': 1890, 'Unique Visitors': 1340, 'Bounce Rate': 0.31 },
    ],
  },
  
  survey: {
    name: 'Customer Survey',
    columns: [
      { name: 'Age Group', type: 'category', values: ['18-25', '26-35', '36-45', '46-55', '56+'] },
      { name: 'Satisfaction', type: 'number', values: [4.2, 4.5, 4.1, 4.7, 4.3] },
      { name: 'Response Count', type: 'number', values: [120, 180, 145, 95, 67] },
      { name: 'Category', type: 'category', values: ['Product', 'Service', 'Support', 'Pricing', 'Overall'] },
    ],
    rows: [
      { 'Age Group': '18-25', Satisfaction: 4.2, 'Response Count': 120, Category: 'Product' },
      { 'Age Group': '26-35', Satisfaction: 4.5, 'Response Count': 180, Category: 'Service' },
      { 'Age Group': '36-45', Satisfaction: 4.1, 'Response Count': 145, Category: 'Support' },
      { 'Age Group': '46-55', Satisfaction: 4.7, 'Response Count': 95, Category: 'Pricing' },
      { 'Age Group': '56+', Satisfaction: 4.3, 'Response Count': 67, Category: 'Overall' },
    ],
  },

  stock: {
    name: 'Stock Prices',
    columns: [
      { name: 'Date', type: 'date', values: ['2024-01-01', '2024-01-08', '2024-01-15', '2024-01-22', '2024-01-29'] },
      { name: 'AAPL', type: 'number', values: [185.64, 182.31, 188.63, 191.25, 187.45] },
      { name: 'GOOGL', type: 'number', values: [140.93, 138.21, 142.56, 145.82, 144.15] },
      { name: 'MSFT', type: 'number', values: [376.04, 372.75, 380.12, 385.64, 382.89] },
      { name: 'Volume', type: 'number', values: [4500000, 3200000, 5100000, 4800000, 3900000] },
    ],
    rows: [
      { Date: '2024-01-01', AAPL: 185.64, GOOGL: 140.93, MSFT: 376.04, Volume: 4500000 },
      { Date: '2024-01-08', AAPL: 182.31, GOOGL: 138.21, MSFT: 372.75, Volume: 3200000 },
      { Date: '2024-01-15', AAPL: 188.63, GOOGL: 142.56, MSFT: 380.12, Volume: 5100000 },
      { Date: '2024-01-22', AAPL: 191.25, GOOGL: 145.82, MSFT: 385.64, Volume: 4800000 },
      { Date: '2024-01-29', AAPL: 187.45, GOOGL: 144.15, MSFT: 382.89, Volume: 3900000 },
    ],
  },

  ecommerce: {
    name: 'E-commerce Metrics',
    columns: [
      { name: 'Product Category', type: 'category', values: ['Electronics', 'Clothing', 'Books', 'Home', 'Sports'] },
      { name: 'Units Sold', type: 'number', values: [234, 456, 123, 345, 178] },
      { name: 'Revenue', type: 'number', values: [15600, 22800, 2460, 13800, 8900] },
      { name: 'Avg Price', type: 'number', values: [66.67, 50.00, 20.00, 40.00, 50.00] },
      { name: 'Return Rate', type: 'number', values: [0.08, 0.15, 0.02, 0.05, 0.12] },
    ],
    rows: [
      { 'Product Category': 'Electronics', 'Units Sold': 234, Revenue: 15600, 'Avg Price': 66.67, 'Return Rate': 0.08 },
      { 'Product Category': 'Clothing', 'Units Sold': 456, Revenue: 22800, 'Avg Price': 50.00, 'Return Rate': 0.15 },
      { 'Product Category': 'Books', 'Units Sold': 123, Revenue: 2460, 'Avg Price': 20.00, 'Return Rate': 0.02 },
      { 'Product Category': 'Home', 'Units Sold': 345, Revenue: 13800, 'Avg Price': 40.00, 'Return Rate': 0.05 },
      { 'Product Category': 'Sports', 'Units Sold': 178, Revenue: 8900, 'Avg Price': 50.00, 'Return Rate': 0.12 },
    ],
  },
};