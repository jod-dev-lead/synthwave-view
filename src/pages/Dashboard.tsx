import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDatasets } from "@/hooks/useDatasets";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity,
  Download,
  RefreshCw,
  Filter,
  Database,
  Calendar,
  Plus
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

const monthlyData = [
  { name: "Jan", value: 4000, growth: 2400, users: 2400 },
  { name: "Feb", value: 3000, growth: 1398, users: 1398 },
  { name: "Mar", value: 2000, growth: 9800, users: 9800 },
  { name: "Apr", value: 2780, growth: 3908, users: 3908 },
  { name: "May", value: 1890, growth: 4800, users: 4800 },
  { name: "Jun", value: 2390, growth: 3800, users: 3800 },
  { name: "Jul", value: 3490, growth: 4300, users: 4300 },
];

const pieData = [
  { name: "Desktop", value: 45, color: "hsl(var(--chart-1))" },
  { name: "Mobile", value: 35, color: "hsl(var(--chart-2))" },
  { name: "Tablet", value: 20, color: "hsl(var(--chart-3))" },
];

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231",
    change: "+20.1%",
    changeType: "positive" as const,
    icon: DollarSign,
  },
  {
    title: "Active Users",
    value: "2,350",
    change: "+15.3%",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    title: "Conversion Rate",
    value: "3.2%",
    change: "-2.4%",
    changeType: "negative" as const,
    icon: TrendingUp,
  },
  {
    title: "Avg. Session",
    value: "4m 32s",
    change: "+8.1%",
    changeType: "positive" as const,
    icon: Activity,
  },
];

export default function Dashboard() {
  const { datasets, loading } = useDatasets();

  const stats = [
    {
      title: "Total Datasets",
      value: datasets.length.toString(),
      change: datasets.length > 0 ? "+100%" : "0%",
      changeType: "positive" as const,
      icon: Database,
    },
    {
      title: "Total Data Points",
      value: datasets.reduce((sum, d) => sum + d.row_count, 0).toLocaleString(),
      change: "+12.5%",
      changeType: "positive" as const,
      icon: BarChart3,
    },
    {
      title: "Charts Created", 
      value: datasets.filter(d => d.chart_config).length.toString(),
      change: datasets.filter(d => d.chart_config).length > 0 ? "+25%" : "0%",
      changeType: "positive" as const,
      icon: TrendingUp,
    },
    {
      title: "Avg. Dataset Size",
      value: datasets.length > 0 ? Math.round(datasets.reduce((sum, d) => sum + d.row_count, 0) / datasets.length).toLocaleString() : "0",
      change: "+8.1%",
      changeType: "positive" as const,
      icon: Activity,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground font-serif">
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground">
              Monitor your datasets and visualizations performance.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/upload">
              <Button variant="default" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Dataset
              </Button>
            </Link>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="hover-lift animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className={`text-xs flex items-center gap-1 ${
                    stat.changeType === 'positive' ? 'text-success' : 'text-destructive'
                  }`}>
                    <TrendingUp className="h-3 w-3" />
                    {stat.change} from last month
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Datasets */}
        {datasets.length > 0 && (
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle>Recent Datasets</CardTitle>
              <CardDescription>Your latest uploaded and processed datasets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {datasets.slice(0, 5).map((dataset) => (
                  <div key={dataset.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{dataset.name}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Database className="h-3 w-3" />
                          {dataset.row_count.toLocaleString()} rows
                        </span>
                        <span className="flex items-center gap-1">
                          <BarChart3 className="h-3 w-3" />
                          {dataset.columns.length} columns
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDistanceToNow(new Date(dataset.created_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {dataset.chart_config && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                          Chart Available
                        </span>
                      )}
                      <Link to="/upload?tab=saved">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
                {datasets.length > 5 && (
                  <div className="text-center pt-4">
                    <Link to="/upload?tab=saved">
                      <Button variant="outline">
                        View All Datasets ({datasets.length})
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Charts Section - Keep existing chart examples */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4 hover-lift">
                <CardHeader>
                  <CardTitle>Data Processing Over Time</CardTitle>
                  <CardDescription>Volume of data processed monthly</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                 <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={datasets.length > 0 ? 
                      datasets.slice(0, 7).map((d, i) => ({
                        name: `Dataset ${i + 1}`,
                        value: d.row_count,
                        columns: d.columns.length
                      })) : 
                      [
                        { name: "Sample 1", value: 4000, columns: 12 },
                        { name: "Sample 2", value: 3000, columns: 8 },
                        { name: "Sample 3", value: 2000, columns: 15 },
                      ]
                    }>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="hsl(var(--chart-1))" 
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="col-span-3 hover-lift">
                <CardHeader>
                  <CardTitle>Dataset Types</CardTitle>
                  <CardDescription>Distribution by data structure</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Tabular", value: 45, color: "hsl(var(--chart-1))" },
                          { name: "Time Series", value: 35, color: "hsl(var(--chart-2))" },
                          { name: "Categorical", value: 20, color: "hsl(var(--chart-3))" },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {[
                          { name: "Tabular", value: 45, color: "hsl(var(--chart-1))" },
                          { name: "Time Series", value: 35, color: "hsl(var(--chart-2))" },
                          { name: "Categorical", value: 20, color: "hsl(var(--chart-3))" },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Keep other existing tab content */}
          <TabsContent value="trends" className="space-y-4">
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle>Upload Trends</CardTitle>
                <CardDescription>Dataset upload patterns over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={datasets.length > 0 ? 
                    datasets.slice(0, 12).map((d, i) => ({
                      name: new Date(d.created_at).toLocaleDateString(),
                      uploads: 1,
                      size: d.row_count
                    })) : 
                    [
                      { name: "Jan", uploads: 4, size: 2400 },
                      { name: "Feb", uploads: 3, size: 1398 },
                      { name: "Mar", uploads: 2, size: 9800 },
                    ]
                  }>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="uploads" 
                      stroke="hsl(var(--chart-3))" 
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--chart-3))", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usage" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle>Feature Usage</CardTitle>
                  <CardDescription>Most used features and tools</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { name: "Data Upload", value: datasets.length },
                      { name: "Chart Creation", value: datasets.filter(d => d.chart_config).length },
                      { name: "Data Export", value: Math.floor(datasets.length * 0.7) },
                      { name: "AI Chat", value: Math.floor(datasets.length * 0.4) },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="hsl(var(--chart-4))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle>Processing Performance</CardTitle>
                  <CardDescription>Average processing times</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">File Upload</span>
                      <span className="text-sm font-medium">~2.3s</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Data Processing</span>
                      <span className="text-sm font-medium">~1.8s</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Chart Generation</span>
                      <span className="text-sm font-medium">~0.9s</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Export Operations</span>
                      <span className="text-sm font-medium">~1.2s</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle>Data Quality Score</CardTitle>
                  <CardDescription>Average data completeness</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-success">94%</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Excellent data quality across all datasets
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle>Most Common Data Type</CardTitle>
                  <CardDescription>Frequently used column types</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">Numeric</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    67% of columns contain numerical data
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle>AI Insights Generated</CardTitle>
                  <CardDescription>Automated analysis results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-chart-2">127</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    AI-powered insights across all datasets
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Empty State */}
        {datasets.length === 0 && !loading && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Database className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Datasets Yet</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Start by uploading your first dataset to see analytics and insights here
              </p>
              <Link to="/upload">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Your First Dataset
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}