import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity,
  Download,
  RefreshCw,
  Filter,
  Upload,
  Calendar
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toPng } from 'html-to-image';
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

const defaultMonthlyData = [
  { name: "Jan", value: 4000, growth: 2400, users: 2400, conversionRate: 3.2, avgSession: 4.32, desktopUsers: 1080, mobileUsers: 1200, tabletUsers: 120 },
  { name: "Feb", value: 3000, growth: 1398, users: 1398, conversionRate: 3.4, avgSession: 4.45, desktopUsers: 1116, mobileUsers: 1240, tabletUsers: 124 },
  { name: "Mar", value: 2000, growth: 9800, users: 9800, conversionRate: 3.6, avgSession: 4.58, desktopUsers: 1179, mobileUsers: 1310, tabletUsers: 131 },
  { name: "Apr", value: 2780, growth: 3908, users: 3908, conversionRate: 3.8, avgSession: 4.72, desktopUsers: 1238, mobileUsers: 1375, tabletUsers: 137 },
  { name: "May", value: 1890, growth: 4800, users: 4800, conversionRate: 4.0, avgSession: 4.85, desktopUsers: 1301, mobileUsers: 1445, tabletUsers: 144 },
  { name: "Jun", value: 2390, growth: 3800, users: 3800, conversionRate: 4.2, avgSession: 4.98, desktopUsers: 1359, mobileUsers: 1510, tabletUsers: 151 },
  { name: "Jul", value: 3490, growth: 4300, users: 4300, conversionRate: 4.4, avgSession: 5.12, desktopUsers: 1418, mobileUsers: 1575, tabletUsers: 157 },
];

const defaultPieData = [
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

// CSV parsing utility function
const parseCSV = (csvText: string) => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const row: any = {};
    
    headers.forEach((header, index) => {
      const value = values[index];
      // Try to parse as number, fallback to string
      const numValue = parseFloat(value);
      row[header.toLowerCase()] = isNaN(numValue) ? value : numValue;
    });
    
    data.push(row);
  }
  
  return data;
};

// Transform CSV data to chart format
const transformDataForCharts = (csvData: any[]) => {
  return csvData.map((row, index) => ({
    name: row.month || row.name || `Month ${index + 1}`,
    value: row['total revenue'] || row.revenue || row.value || 0,
    growth: row['growth rate'] || row.growth || 0,
    users: row['active users'] || row.users || 0,
    conversionRate: row['conversion rate'] || 0,
    avgSession: row['avg session'] || 0,
    desktopUsers: row['desktop users'] || 0,
    mobileUsers: row['mobile users'] || 0,
    tabletUsers: row['tablet users'] || 0,
  }));
};

export default function Dashboard() {
  const [monthlyData, setMonthlyData] = useState(defaultMonthlyData);
  const [pieData, setPieData] = useState(defaultPieData);
  const [statsData, setStatsData] = useState(stats);
  const [isDataUploaded, setIsDataUploaded] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        const parsedData = parseCSV(csvText);
        const transformedData = transformDataForCharts(parsedData);
        
        // Update monthly data for charts
        setMonthlyData(transformedData);
        
        // Update stats cards based on current filter selection
        updateStatsForMonth();
        // Pie chart data will be updated automatically by useEffect when monthlyData changes
        
        setIsDataUploaded(true);
      } catch (error) {
        console.error('Error parsing CSV:', error);
        alert('Error parsing CSV file. Please check the format.');
      }
    };
    reader.readAsText(file);
  };

  const handleRefresh = () => {
    setMonthlyData(defaultMonthlyData);
    setPieData(defaultPieData);
    setStatsData(stats);
    setIsDataUploaded(false);
    setSelectedMonth("all");
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    console.log('Dashboard refreshed to default state');
  };

  // Get available months for filter dropdown
  const getAvailableMonths = () => {
    return monthlyData.map(item => item.name);
  };

  // Update stats cards based on selected month
  const updateStatsForMonth = () => {
    if (selectedMonth === "all") {
      // For all months, show sum/average of all months data
      const totalRevenue = monthlyData.reduce((sum, month) => sum + (month.value || 0), 0);
      const totalUsers = monthlyData.reduce((sum, month) => sum + (month.users || 0), 0);
      const avgConversionRate = monthlyData.reduce((sum, month) => sum + (month.conversionRate || 0), 0) / monthlyData.length;
      const avgSession = monthlyData.reduce((sum, month) => sum + (month.avgSession || 0), 0) / monthlyData.length;
      
      setStatsData([
        {
          title: "Total Revenue",
          value: `$${totalRevenue.toLocaleString()}`,
          change: "All Months",
          changeType: "positive" as const,
          icon: DollarSign,
        },
        {
          title: "Active Users",
          value: totalUsers.toLocaleString(),
          change: "All Months",
          changeType: "positive" as const,
          icon: Users,
        },
        {
          title: "Conversion Rate",
          value: `${avgConversionRate.toFixed(1)}%`,
          change: "Average",
          changeType: "positive" as const,
          icon: TrendingUp,
        },
        {
          title: "Avg. Session",
          value: `${Math.floor(avgSession)}m ${Math.round((avgSession % 1) * 60)}s`,
          change: "Average",
          changeType: "positive" as const,
          icon: Activity,
        },
      ]);
    } else {
      // For specific month, show that month's data
      const monthData = monthlyData.find(month => month.name === selectedMonth);
      if (monthData) {
        setStatsData([
          {
            title: "Total Revenue",
            value: `$${monthData.value.toLocaleString()}`,
            change: "Current Month",
            changeType: "positive" as const,
            icon: DollarSign,
          },
          {
            title: "Active Users",
            value: monthData.users.toLocaleString(),
            change: "Current Month",
            changeType: "positive" as const,
            icon: Users,
          },
          {
            title: "Conversion Rate",
            value: `${monthData.conversionRate}%`,
            change: "Current Month",
            changeType: "positive" as const,
            icon: TrendingUp,
          },
          {
            title: "Avg. Session",
            value: `${Math.floor(monthData.avgSession)}m ${Math.round((monthData.avgSession % 1) * 60)}s`,
            change: "Current Month",
            changeType: "positive" as const,
            icon: Activity,
          },
        ]);
      }
    }
  };

  // Handle month filter change
  const handleMonthFilter = (month: string) => {
    console.log('Month filter changed to:', month);
    setSelectedMonth(month);
    // Force update pie data immediately
    setTimeout(() => {
      updatePieDataForMonth();
    }, 100);
    // Note: Only stats cards and device charts update with month filter
    // Revenue and user charts always show all data
  };

  // Update pie chart data based on selected month (only device charts update with month filter)
  const updatePieDataForMonth = () => {
    console.log('=== UPDATING PIE DATA ===');
    console.log('Selected month:', selectedMonth);
    console.log('Monthly data length:', monthlyData.length);
    console.log('Monthly data:', monthlyData);
    
    if (selectedMonth === "all") {
      console.log('Processing all months data');
      // For all months, calculate total device usage across all months
      const totalDesktopUsers = monthlyData.reduce((sum, month) => sum + (month.desktopUsers || 0), 0);
      const totalMobileUsers = monthlyData.reduce((sum, month) => sum + (month.mobileUsers || 0), 0);
      const totalTabletUsers = monthlyData.reduce((sum, month) => sum + (month.tabletUsers || 0), 0);
      const totalDeviceUsers = totalDesktopUsers + totalMobileUsers + totalTabletUsers;
      
      console.log('All months device totals:', { totalDesktopUsers, totalMobileUsers, totalTabletUsers, totalDeviceUsers });
      
      if (totalDeviceUsers > 0) {
        const newPieData = [
          { 
            name: "Desktop", 
            value: Math.round((totalDesktopUsers / totalDeviceUsers) * 100), 
            color: "hsl(var(--chart-1))" 
          },
          { 
            name: "Mobile", 
            value: Math.round((totalMobileUsers / totalDeviceUsers) * 100), 
            color: "hsl(var(--chart-2))" 
          },
          { 
            name: "Tablet", 
            value: Math.round((totalTabletUsers / totalDeviceUsers) * 100), 
            color: "hsl(var(--chart-3))" 
          },
        ];
        console.log('Setting pie data for all months:', newPieData);
        setPieData(newPieData);
        console.log('Pie data updated successfully');
      } else {
        console.log('No device users found for all months');
      }
    } else {
      console.log('Processing specific month:', selectedMonth);
      // For specific month, show that month's device distribution
      const monthData = monthlyData.find(month => month.name === selectedMonth);
      console.log('Found month data:', monthData);
      
      if (monthData) {
        const totalDeviceUsers = (monthData.desktopUsers || 0) + (monthData.mobileUsers || 0) + (monthData.tabletUsers || 0);
        console.log('Month device totals:', { 
          desktopUsers: monthData.desktopUsers, 
          mobileUsers: monthData.mobileUsers, 
          tabletUsers: monthData.tabletUsers, 
          totalDeviceUsers 
        });
        
        if (totalDeviceUsers > 0) {
          const newPieData = [
            { 
              name: "Desktop", 
              value: Math.round(((monthData.desktopUsers || 0) / totalDeviceUsers) * 100), 
              color: "hsl(var(--chart-1))" 
            },
            { 
              name: "Mobile", 
              value: Math.round(((monthData.mobileUsers || 0) / totalDeviceUsers) * 100), 
              color: "hsl(var(--chart-2))" 
            },
            { 
              name: "Tablet", 
              value: Math.round(((monthData.tabletUsers || 0) / totalDeviceUsers) * 100), 
              color: "hsl(var(--chart-3))" 
            },
          ];
          console.log('Setting pie data for month:', newPieData);
          setPieData(newPieData);
          console.log('Pie data updated successfully');
        } else {
          console.log('No device users found for month:', selectedMonth);
        }
      } else {
        console.log('No data found for month:', selectedMonth);
      }
    }
    console.log('=== END PIE DATA UPDATE ===');
  };

  // Always use all monthly data for charts (no filtering)
  const filteredData = monthlyData;

  // Update stats and device charts when month filter changes
  useEffect(() => {
    updateStatsForMonth();
    updatePieDataForMonth(); // Device charts update with month filter
  }, [selectedMonth, monthlyData]);

  // Debug pie data changes
  useEffect(() => {
    console.log('Pie data state changed:', pieData);
  }, [pieData]);

  const handleExportPDF = async () => {
    try {
      // Get the dashboard container
      const dashboardElement = document.getElementById('dashboard-container');
      if (!dashboardElement) {
        console.error('Dashboard container not found');
        return;
      }

      // Show loading state
      const exportButton = document.querySelector('button[onclick*="handleExportPDF"]') as HTMLButtonElement;
      if (exportButton) {
        exportButton.disabled = true;
        exportButton.textContent = 'Exporting PDF...';
      }

      // Create a new PDF document
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Define margins
      const leftMargin = 25;
      const rightMargin = 25;
      const topMargin = 30;
      const bottomMargin = 25;
      const contentWidth = pageWidth - leftMargin - rightMargin;
      const contentHeight = pageHeight - topMargin - bottomMargin;

      // Helper function to add a line
      const addLine = (y: number) => {
        pdf.setDrawColor(200, 200, 200);
        pdf.line(leftMargin, y, pageWidth - rightMargin, y);
      };

      // Helper function to add a section header
      const addSectionHeader = (text: string, y: number) => {
        pdf.setFontSize(16);
        pdf.setTextColor(51, 51, 51);
        pdf.setFont('helvetica', 'bold');
        pdf.text(text, leftMargin, y);
        addLine(y + 2);
      };

      // Helper function to add a subsection
      const addSubsection = (text: string, y: number) => {
        pdf.setFontSize(12);
        pdf.setTextColor(102, 102, 102);
        pdf.setFont('helvetica', 'bold');
        pdf.text(text, leftMargin, y);
      };

      // Helper function to add regular text
      const addText = (text: string, x: number, y: number, options: any = {}) => {
        pdf.setFontSize(options.fontSize || 10);
        pdf.setTextColor(options.color || 51, 51, 51);
        pdf.setFont('helvetica', options.style || 'normal');
        pdf.text(text, x, y);
      };

      // Page 1: Cover Page
      // Header with gradient effect (simulated with rectangles)
      pdf.setFillColor(59, 130, 246); // Blue
      pdf.rect(0, 0, pageWidth, 60, 'F');
      
      // Title
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(28);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Analytics Dashboard', pageWidth / 2, 25, { align: 'center' });
      
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Comprehensive Business Intelligence Report', pageWidth / 2, 35, { align: 'center' });
      
      // Date and time
      pdf.setFontSize(12);
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      const timeStr = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      pdf.text(`Generated on ${dateStr} at ${timeStr}`, pageWidth / 2, 45, { align: 'center' });

      // Reset text color
      pdf.setTextColor(51, 51, 51);

      // Executive Summary
      addSectionHeader('Executive Summary', 80);
      
      const totalRevenue = monthlyData.reduce((sum, month) => sum + (month.value || 0), 0);
      const totalUsers = monthlyData.reduce((sum, month) => sum + (month.users || 0), 0);
      const avgConversionRate = monthlyData.reduce((sum, month) => sum + (month.conversionRate || 0), 0) / monthlyData.length;
      const avgSessionDuration = monthlyData.reduce((sum, month) => sum + (month.avgSession || 0), 0) / monthlyData.length;
      const latestMonth = monthlyData[monthlyData.length - 1];
      const firstMonth = monthlyData[0];
      const revenueGrowth = ((latestMonth.value - firstMonth.value) / firstMonth.value * 100);
      const userGrowth = ((latestMonth.users - firstMonth.users) / firstMonth.users * 100);

      addSubsection('Key Performance Indicators', 100);
      addText(`• Total Revenue: $${totalRevenue.toLocaleString()}`, leftMargin + 5, 110);
      addText(`• Total Active Users: ${totalUsers.toLocaleString()}`, leftMargin + 5, 120);
      addText(`• Average Conversion Rate: ${avgConversionRate.toFixed(1)}%`, leftMargin + 5, 130);
      addText(`• Average Session Duration: ${Math.floor(avgSessionDuration)}m ${Math.round((avgSessionDuration % 1) * 60)}s`, leftMargin + 5, 140);

      addSubsection('Growth Analysis', 155);
      addText(`• Revenue Growth: ${revenueGrowth >= 0 ? '+' : ''}${revenueGrowth.toFixed(1)}%`, leftMargin + 5, 165);
      addText(`• User Growth: ${userGrowth >= 0 ? '+' : ''}${userGrowth.toFixed(1)}%`, leftMargin + 5, 175);
      addText(`• Data Period: ${monthlyData.length} months (${firstMonth.name} - ${latestMonth.name})`, leftMargin + 5, 185);

      // Add new page for dashboard
      pdf.addPage();

      // Page 2: Current Tab Visualizations
      addSectionHeader('Dashboard Visualizations', 20);

      // Wait for charts to render
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Find the active tab content specifically
      let activeTabContent = null;
      
      // Try different selectors to find the active tab
      const possibleSelectors = [
        '[data-state="active"]',
        '[role="tabpanel"]',
        '.space-y-4[style*="block"]',
        '.space-y-4:not([style*="none"])'
      ];
      
      for (const selector of possibleSelectors) {
        activeTabContent = document.querySelector(selector);
        if (activeTabContent) {
          console.log('Found active tab with selector:', selector);
          break;
        }
      }
      
      // If still not found, try to find any visible tab content
      if (!activeTabContent) {
        const allTabContents = document.querySelectorAll('.space-y-4');
        for (const tab of allTabContents) {
          const style = window.getComputedStyle(tab);
          if (style.display !== 'none' && style.visibility !== 'hidden') {
            activeTabContent = tab;
            console.log('Found visible tab content');
            break;
          }
        }
      }
      
      console.log('Active tab content found:', activeTabContent);
      
      if (activeTabContent) {
        try {
          // Wait for charts to render completely
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Force a synchronous layout calculation
          const charts = activeTabContent.querySelectorAll('.recharts-wrapper');
          charts.forEach(chart => chart.getBoundingClientRect());
          
          // Get dimensions after charts are rendered
          const rect = activeTabContent.getBoundingClientRect();
          const scrollWidth = Math.max(activeTabContent.scrollWidth, rect.width);
          const scrollHeight = Math.max(activeTabContent.scrollHeight, rect.height);
          
          console.log('Processing charts for export:', charts.length);
          
          // Capture the content
          const tabCanvas = await html2canvas(activeTabContent as HTMLElement, {
            scale: 2, // Higher scale for better quality
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: true,
            width: scrollWidth,
            height: scrollHeight,
            scrollX: -window.scrollX,
            scrollY: -window.scrollY,
            windowWidth: scrollWidth,
            windowHeight: scrollHeight,
            foreignObjectRendering: true, // Enable better SVG rendering
            onclone: (clonedDoc) => {
              // Process chart containers first
              const chartContainers = clonedDoc.querySelectorAll('.recharts-wrapper');
              console.log('Processing chart containers:', chartContainers.length);
              
              chartContainers.forEach(container => {
                const containerEl = container as HTMLElement;
                const rect = container.getBoundingClientRect();
                
                // Set explicit dimensions
                containerEl.style.width = `${rect.width}px`;
                containerEl.style.height = `${rect.height}px`;
                containerEl.style.position = 'relative';
                containerEl.style.display = 'block';
                containerEl.style.overflow = 'visible';
              });

              // Handle chart SVGs
              const chartSvgs = clonedDoc.querySelectorAll('.recharts-wrapper svg');
              chartSvgs.forEach(svg => {
                const svgEl = svg as SVGElement;
                // Preserve viewBox
                const viewBox = svgEl.getAttribute('viewBox');
                if (viewBox) {
                  svgEl.setAttribute('preserveAspectRatio', 'xMidYMid meet');
                }
                // Set dimensions
                svgEl.style.width = '100%';
                svgEl.style.height = '100%';
                svgEl.style.overflow = 'visible';
              });

              // Handle specific chart elements
              ['line', 'area', 'bar', 'pie', 'cell'].forEach(type => {
                const elements = clonedDoc.querySelectorAll(`.recharts-${type}`);
                elements.forEach(el => {
                  const element = el as SVGElement;
                  element.style.opacity = '1';
                  element.style.visibility = 'visible';
                });
              });

              // Handle chart text and labels
              const textElements = clonedDoc.querySelectorAll('.recharts-text, .recharts-label');
              textElements.forEach(el => {
                const element = el as SVGElement;
                element.style.fontFamily = 'Arial, sans-serif';
                element.style.visibility = 'visible';
              });

              // Ensure tooltips are hidden
              const tooltips = clonedDoc.querySelectorAll('.recharts-tooltip-wrapper');
              tooltips.forEach(tooltip => {
                (tooltip as HTMLElement).style.display = 'none';
              });
            }
          });

          console.log('Canvas captured, processing image...');
          
          // Convert to high-quality PNG
          const tabImgData = tabCanvas.toDataURL('image/png', 1.0);
          
          if (!tabImgData) {
            throw new Error('Failed to generate image data from canvas');
          }
          
          console.log('Image data generated successfully');
          console.log('Canvas dimensions:', { 
            width: tabCanvas.width, 
            height: tabCanvas.height 
          });
          
          // Calculate optimal dimensions for PDF
          const maxWidth = contentWidth;
          const maxHeight = contentHeight - 40; // Leave margin for headers/footers
          
          // Calculate scaling while maintaining aspect ratio
          const aspectRatio = tabCanvas.width / tabCanvas.height;
          let imgWidth = maxWidth;
          let imgHeight = imgWidth / aspectRatio;
          
          // If height exceeds maximum, scale based on height
          if (imgHeight > maxHeight) {
            imgHeight = maxHeight;
            imgWidth = imgHeight * aspectRatio;
          }
          
          // Ensure minimum dimensions
          imgWidth = Math.max(imgWidth, 100);
          imgHeight = Math.max(imgHeight, 100);
          
          console.log('Final image dimensions:', { imgWidth, imgHeight });
          
          console.log('Final image dimensions:', { imgWidth, imgHeight });
          
          // Center the image
          const xOffset = leftMargin + (maxWidth - imgWidth) / 2;
          const yOffset = topMargin + 20;

          pdf.addImage(tabImgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);
          
        } catch (error) {
          console.error('Error capturing tab content:', error);
          
          // Fallback: Add text saying charts couldn't be captured
          addText('Charts could not be captured in this export.', leftMargin, topMargin + 50);
          addText('Please ensure charts are fully loaded before exporting.', leftMargin, topMargin + 60);
        }
      } else {
        console.log('No active tab content found');
        addText('No active tab content found for export.', leftMargin, topMargin + 50);
      }

      // Add new page for detailed data
      pdf.addPage();

      // Page 6: Detailed Data Analysis
      addSectionHeader('Detailed Monthly Analysis', 20);

      // Create a professional table
      const tableHeaders = ['Month', 'Revenue ($)', 'Users', 'Conv. Rate (%)', 'Avg. Session', 'Growth (%)'];
      const colWidths = [30, 35, 25, 25, 25, 20];
      const startY = topMargin + 20;
      
      // Table header with background
      pdf.setFillColor(248, 250, 252);
      pdf.rect(leftMargin, startY - 5, contentWidth, 12, 'F');
      
      // Header text
      pdf.setFontSize(10);
      pdf.setTextColor(51, 51, 51);
      pdf.setFont('helvetica', 'bold');
      
      let xPos = leftMargin;
      tableHeaders.forEach((header, index) => {
        pdf.text(header, xPos + 2, startY + 3);
        xPos += colWidths[index];
      });

      // Add line under header
      addLine(startY + 5);

      // Table data with alternating row colors
      let yPos = startY + 15;
      monthlyData.forEach((row, index) => {
        if (yPos > pageHeight - bottomMargin - 20) {
          pdf.addPage();
          yPos = topMargin + 20;
        }

        // Alternate row colors
        if (index % 2 === 0) {
          pdf.setFillColor(249, 250, 251);
          pdf.rect(leftMargin, yPos - 3, contentWidth, 10, 'F');
        }

        xPos = leftMargin;
        const rowData = [
          row.name,
          `$${row.value?.toLocaleString() || 0}`,
          row.users?.toLocaleString() || 0,
          `${row.conversionRate?.toFixed(1) || 0}%`,
          `${Math.floor(row.avgSession || 0)}m ${Math.round((row.avgSession % 1) * 60)}s`,
          `${row.growth?.toFixed(1) || 0}%`
        ];

        pdf.setFontSize(9);
        pdf.setTextColor(51, 51, 51);
        pdf.setFont('helvetica', 'normal');

        rowData.forEach((data, colIndex) => {
          pdf.text(String(data), xPos + 2, yPos + 3);
          xPos += colWidths[colIndex];
        });

        yPos += 10;
      });

      // Add summary statistics
      const summaryY = yPos + 20;
      addSectionHeader('Statistical Summary', summaryY);

      // Calculate comprehensive statistics
      const revenues = monthlyData.map(m => m.value);
      const maxRevenue = Math.max(...revenues);
      const minRevenue = Math.min(...revenues);
      const avgRevenue = revenues.reduce((a, b) => a + b, 0) / revenues.length;
      const revenueStdDev = Math.sqrt(revenues.reduce((sq, n) => sq + Math.pow(n - avgRevenue, 2), 0) / revenues.length);

      const users = monthlyData.map(m => m.users);
      const maxUsers = Math.max(...users);
      const minUsers = Math.min(...users);
      const avgUsers = users.reduce((a, b) => a + b, 0) / users.length;

      const conversions = monthlyData.map(m => m.conversionRate);
      const maxConversion = Math.max(...conversions);
      const minConversion = Math.min(...conversions);
      const avgConversionRateStats = conversions.reduce((a, b) => a + b, 0) / conversions.length;

      const sessions = monthlyData.map(m => m.avgSession);
      const maxSession = Math.max(...sessions);
      const minSession = Math.min(...sessions);
      const avgSessionDurationStats = sessions.reduce((a, b) => a + b, 0) / sessions.length;

      const growths = monthlyData.map(m => m.growth);
      const maxGrowth = Math.max(...growths);
      const minGrowth = Math.min(...growths);
      const avgGrowth = growths.reduce((a, b) => a + b, 0) / growths.length;

      addSubsection('Revenue Analysis', summaryY + 20);
      addText(`• Highest Revenue: $${maxRevenue.toLocaleString()}`, leftMargin + 5, summaryY + 30);
      addText(`• Lowest Revenue: $${minRevenue.toLocaleString()}`, leftMargin + 5, summaryY + 40);
      addText(`• Average Monthly Revenue: $${avgRevenue.toLocaleString()}`, leftMargin + 5, summaryY + 50);
      addText(`• Revenue Standard Deviation: $${revenueStdDev.toLocaleString()}`, leftMargin + 5, summaryY + 60);
      addText(`• Revenue Range: $${(maxRevenue - minRevenue).toLocaleString()}`, leftMargin + 5, summaryY + 70);

      addSubsection('User Engagement Analysis', summaryY + 90);
      addText(`• Peak Users: ${maxUsers.toLocaleString()}`, leftMargin + 5, summaryY + 100);
      addText(`• Lowest Users: ${minUsers.toLocaleString()}`, leftMargin + 5, summaryY + 110);
      addText(`• Average Monthly Users: ${Math.round(avgUsers).toLocaleString()}`, leftMargin + 5, summaryY + 120);
      addText(`• User Growth Rate: ${userGrowth >= 0 ? '+' : ''}${userGrowth.toFixed(1)}%`, leftMargin + 5, summaryY + 130);

      addSubsection('Conversion Performance', summaryY + 150);
      addText(`• Highest Conversion Rate: ${maxConversion.toFixed(1)}%`, leftMargin + 5, summaryY + 160);
      addText(`• Lowest Conversion Rate: ${minConversion.toFixed(1)}%`, leftMargin + 5, summaryY + 170);
      addText(`• Average Conversion Rate: ${avgConversionRateStats.toFixed(1)}%`, leftMargin + 5, summaryY + 180);

      addSubsection('Session Duration Analysis', summaryY + 200);
      addText(`• Longest Avg Session: ${Math.floor(maxSession)}m ${Math.round((maxSession % 1) * 60)}s`, leftMargin + 5, summaryY + 210);
      addText(`• Shortest Avg Session: ${Math.floor(minSession)}m ${Math.round((minSession % 1) * 60)}s`, leftMargin + 5, summaryY + 220);
      addText(`• Average Session Duration: ${Math.floor(avgSessionDurationStats)}m ${Math.round((avgSessionDurationStats % 1) * 60)}s`, leftMargin + 5, summaryY + 230);

      // Add new page for device analysis
      pdf.addPage();

      // Page 7: Device Distribution Analysis
      addSectionHeader('Device Distribution Analysis', 20);

      // Calculate device statistics
      const latestData = monthlyData[monthlyData.length - 1];
      const totalDeviceUsers = (latestData.desktopUsers || 0) + (latestData.mobileUsers || 0) + (latestData.tabletUsers || 0);
      
      if (totalDeviceUsers > 0) {
        const desktopPercent = Math.round(((latestData.desktopUsers || 0) / totalDeviceUsers) * 100);
        const mobilePercent = Math.round(((latestData.mobileUsers || 0) / totalDeviceUsers) * 100);
        const tabletPercent = Math.round(((latestData.tabletUsers || 0) / totalDeviceUsers) * 100);

        addSubsection('Current Device Distribution', 40);
        addText(`• Desktop Users: ${latestData.desktopUsers?.toLocaleString() || 0} (${desktopPercent}%)`, leftMargin + 5, 50);
        addText(`• Mobile Users: ${latestData.mobileUsers?.toLocaleString() || 0} (${mobilePercent}%)`, leftMargin + 5, 60);
        addText(`• Tablet Users: ${latestData.tabletUsers?.toLocaleString() || 0} (${tabletPercent}%)`, leftMargin + 5, 70);
        addText(`• Total Device Users: ${totalDeviceUsers.toLocaleString()}`, leftMargin + 5, 80);

        // Device trend analysis
        const firstMonthData = monthlyData[0];
        const firstTotalDeviceUsers = (firstMonthData.desktopUsers || 0) + (firstMonthData.mobileUsers || 0) + (firstMonthData.tabletUsers || 0);
        
        if (firstTotalDeviceUsers > 0) {
          const firstDesktopPercent = Math.round(((firstMonthData.desktopUsers || 0) / firstTotalDeviceUsers) * 100);
          const firstMobilePercent = Math.round(((firstMonthData.mobileUsers || 0) / firstTotalDeviceUsers) * 100);
          const firstTabletPercent = Math.round(((firstMonthData.tabletUsers || 0) / firstTotalDeviceUsers) * 100);

          addSubsection('Device Trend Analysis', 100);
          addText(`Desktop: ${firstDesktopPercent}% → ${desktopPercent}% (${desktopPercent - firstDesktopPercent >= 0 ? '+' : ''}${desktopPercent - firstDesktopPercent}%)`, leftMargin + 5, 110);
          addText(`Mobile: ${firstMobilePercent}% → ${mobilePercent}% (${mobilePercent - firstMobilePercent >= 0 ? '+' : ''}${mobilePercent - firstMobilePercent}%)`, leftMargin + 5, 120);
          addText(`Tablet: ${firstTabletPercent}% → ${tabletPercent}% (${tabletPercent - firstTabletPercent >= 0 ? '+' : ''}${tabletPercent - firstTabletPercent}%)`, leftMargin + 5, 130);
        }
      }

      // Add new page for insights and recommendations
      pdf.addPage();

      // Page 8: Business Insights & Recommendations
      addSectionHeader('Business Insights & Recommendations', 20);

      // Generate insights based on data
      const insights = [];
      const recommendations = [];

      // Revenue insights
      if (revenueGrowth > 10) {
        insights.push(`Strong revenue growth of ${revenueGrowth.toFixed(1)}% indicates healthy business expansion`);
        recommendations.push('Continue current growth strategies and consider scaling operations');
      } else if (revenueGrowth < 0) {
        insights.push(`Revenue decline of ${Math.abs(revenueGrowth).toFixed(1)}% requires immediate attention`);
        recommendations.push('Review pricing strategy, marketing efforts, and customer retention programs');
      } else {
        insights.push(`Stable revenue growth of ${revenueGrowth.toFixed(1)}% shows consistent performance`);
        recommendations.push('Focus on optimizing existing processes and exploring new growth opportunities');
      }

      // User insights
      if (userGrowth > 15) {
        insights.push(`Excellent user acquisition with ${userGrowth.toFixed(1)}% growth`);
        recommendations.push('Maintain user acquisition momentum and focus on retention strategies');
      } else if (userGrowth < 5) {
        insights.push(`Slow user growth of ${userGrowth.toFixed(1)}% suggests need for marketing optimization`);
        recommendations.push('Invest in marketing campaigns and user acquisition channels');
      }

      // Conversion insights
      if (avgConversionRate > 5) {
        insights.push(`High conversion rate of ${avgConversionRate.toFixed(1)}% indicates effective user experience`);
        recommendations.push('Maintain current UX/UI and consider A/B testing for further optimization');
      } else if (avgConversionRate < 2) {
        insights.push(`Low conversion rate of ${avgConversionRate.toFixed(1)}% suggests UX improvements needed`);
        recommendations.push('Conduct user research and optimize conversion funnel');
      }

      // Device insights
      if (totalDeviceUsers > 0) {
        const desktopPercent = Math.round(((latestData.desktopUsers || 0) / totalDeviceUsers) * 100);
        const mobilePercent = Math.round(((latestData.mobileUsers || 0) / totalDeviceUsers) * 100);
        if (desktopPercent > 60) {
          insights.push(`Desktop-dominant user base (${desktopPercent}%) suggests B2B or professional focus`);
          recommendations.push('Optimize desktop experience and consider mobile-first features');
        } else if (mobilePercent > 60) {
          insights.push(`Mobile-dominant user base (${mobilePercent}%) indicates consumer-focused product`);
          recommendations.push('Prioritize mobile optimization and responsive design');
        }
      }

      addSubsection('Key Insights', 40);
      insights.forEach((insight, index) => {
        addText(`• ${insight}`, leftMargin + 5, 50 + (index * 10));
      });

      addSubsection('Strategic Recommendations', 40 + (insights.length * 10) + 20);
      recommendations.forEach((rec, index) => {
        addText(`• ${rec}`, leftMargin + 5, 50 + (insights.length * 10) + 20 + (index * 10));
      });

      // Add new page for technical details
      pdf.addPage();

      // Page 9: Technical Details & Methodology
      addSectionHeader('Technical Details & Methodology', 20);

      addSubsection('Data Sources', 40);
      addText('• CSV file upload with monthly business metrics', leftMargin + 5, 50);
      addText('• Real-time dashboard visualization using React and Recharts', leftMargin + 5, 60);
      addText('• Statistical analysis and trend calculations', leftMargin + 5, 70);

      addSubsection('Metrics Definitions', 80);
      addText('• Total Revenue: Monthly revenue generated from all sources', leftMargin + 5, 90);
      addText('• Active Users: Number of unique users who engaged with the platform', leftMargin + 5, 100);
      addText('• Conversion Rate: Percentage of users who completed desired actions', leftMargin + 5, 110);
      addText('• Average Session: Mean duration of user sessions in minutes', leftMargin + 5, 120);
      addText('• Growth Rate: Month-over-month percentage change in metrics', leftMargin + 5, 130);

      addSubsection('Analysis Methods', 150);
      addText('• Trend Analysis: Linear regression and growth rate calculations', leftMargin + 5, 160);
      addText('• Statistical Measures: Mean, standard deviation, min/max values', leftMargin + 5, 170);
      addText('• Comparative Analysis: Period-over-period and benchmark comparisons', leftMargin + 5, 180);
      addText('• Device Analytics: User distribution across device types', leftMargin + 5, 190);

      // Save the PDF
      const fileName = `analytics-dashboard-report-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      console.log('PDF exported successfully');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Error exporting PDF. Please try again.');
    } finally {
      // Reset button state
      const exportButton = document.querySelector('button[onclick*="handleExportPDF"]') as HTMLButtonElement;
      if (exportButton) {
        exportButton.disabled = false;
        exportButton.innerHTML = '<svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>Export PDF';
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div id="dashboard-container" className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground font-serif">
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground">
              Monitor your key metrics and performance indicators.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload CSV
              </Button>
            </div>
            <Select value={selectedMonth} onValueChange={handleMonthFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    All Months
                  </div>
                </SelectItem>
                {getAvailableMonths().map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="default" size="sm" onClick={handleExportPDF}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="hover-lift animate-fade-in relative overflow-hidden group" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-300 hover-rotate" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold group-hover:scale-105 transition-transform duration-300">{stat.value}</div>
                  <p className={`text-xs flex items-center gap-1 ${
                    stat.changeType === 'positive' ? 'text-success' : 'text-destructive'
                  }`}>
                    <TrendingUp className={`h-3 w-3 ${stat.changeType === 'positive' ? 'animate-bounce-gentle' : ''}`} />
                    {stat.change} from last month
                  </p>
                </CardContent>
                {/* Subtle background accent */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Card>
            );
          })}
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4 hover-lift">
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>Monthly revenue growth over time</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={filteredData}>
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
                  <CardTitle>Device Usage</CardTitle>
                  <CardDescription>User distribution by device type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart key={`pie-chart-${selectedMonth}-${pieData.length}`}>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}-${entry.value}`} fill={entry.color} />
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

          <TabsContent value="revenue" className="space-y-4">
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
                <CardDescription>Detailed revenue breakdown and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="value" fill="#3b82f6" name="Revenue ($)" />
                    <Bar yAxisId="right" dataKey="growth" fill="#10b981" name="Growth Rate (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>User acquisition and retention metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="users" 
                      stroke="hsl(var(--chart-3))" 
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--chart-3))", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="devices" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle>Device Distribution</CardTitle>
                  <CardDescription>Current device usage breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart key={`device-pie-chart-${selectedMonth}-${pieData.length}`}>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`device-cell-${index}-${entry.value}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle>Device Trends</CardTitle>
                  <CardDescription>Monthly device usage trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={filteredData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="users" 
                        stroke="hsl(var(--chart-4))" 
                        fill="hsl(var(--chart-4))" 
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}