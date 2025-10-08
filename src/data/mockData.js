// Mock data generators for dashboard widgets

/**
 * Generate sample table data based on column configuration
 */
export const generateTableData = (columns, count = 25) => {
  const data = [];
  
  // Available options for different field types
  const statusOptions = ['Active', 'Pending', 'Completed', 'Cancelled', 'On Hold'];
  const priorityOptions = ['Low', 'Medium', 'High', 'Critical'];
  const categoryOptions = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys'];
  const departmentOptions = ['Sales', 'Marketing', 'Engineering', 'Support', 'HR', 'Finance'];
  const countryOptions = ['USA', 'Canada', 'UK', 'Germany', 'France', 'Australia', 'Japan'];
  const currencyOptions = ['USD', 'EUR', 'GBP', 'JPY', 'CAD'];
  
  for (let i = 0; i < count; i++) {
    const row = {};
    const id = 1000 + i;
    
    columns.forEach(column => {
      switch (column.key) {
        case 'id':
          row[column.key] = `ID-${id}`;
          break;
          
        case 'name':
          row[column.key] = `Product ${id}`;
          break;
          
        case 'title':
          row[column.key] = `Project ${id}`;
          break;
          
        case 'description':
          row[column.key] = `This is a sample description for item ${id}`;
          break;
          
        case 'email':
          row[column.key] = `user${id}@example.com`;
          break;
          
        case 'status':
          row[column.key] = statusOptions[Math.floor(Math.random() * statusOptions.length)];
          break;
          
        case 'priority':
          row[column.key] = priorityOptions[Math.floor(Math.random() * priorityOptions.length)];
          break;
          
        case 'category':
          row[column.key] = categoryOptions[Math.floor(Math.random() * categoryOptions.length)];
          break;
          
        case 'department':
          row[column.key] = departmentOptions[Math.floor(Math.random() * departmentOptions.length)];
          break;
          
        case 'country':
          row[column.key] = countryOptions[Math.floor(Math.random() * countryOptions.length)];
          break;
          
        case 'currency':
          row[column.key] = currencyOptions[Math.floor(Math.random() * currencyOptions.length)];
          break;
          
        case 'price':
        case 'amount':
        case 'revenue':
        case 'value':
          row[column.key] = Math.floor(Math.random() * 10000) + 100;
          break;
          
        case 'quantity':
          row[column.key] = Math.floor(Math.random() * 100) + 1;
          break;
          
        case 'progress':
          row[column.key] = Math.floor(Math.random() * 100);
          break;
          
        case 'rating':
          row[column.key] = (Math.random() * 5).toFixed(1);
          break;
          
        case 'date':
        case 'createdAt':
        case 'updatedAt':
          const date = new Date();
          date.setDate(date.getDate() - Math.floor(Math.random() * 365));
          row[column.key] = date.toISOString().split('T')[0];
          break;
          
        case 'timestamp':
          const time = new Date();
          time.setHours(time.getHours() - Math.floor(Math.random() * 24));
          row[column.key] = time.toISOString();
          break;
          
        case 'isActive':
        case 'verified':
        case 'completed':
          row[column.key] = Math.random() > 0.3;
          break;
          
        default:
          row[column.key] = `Data ${i + 1}`;
      }
    });
    
    data.push(row);
  }
  
  return data;
};

/**
 * Generate sample chart data for different chart types
 */
export const generateChartData = (type = 'bar', count = 6) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const categories = ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'];
  const data = [];
  
  switch (type) {
    case 'bar':
    case 'line':
      for (let i = 0; i < count; i++) {
        data.push({
          label: months[i % months.length],
          value: Math.floor(Math.random() * 1000) + 200,
          secondaryValue: Math.floor(Math.random() * 800) + 100,
          tertiaryValue: Math.floor(Math.random() * 600) + 50
        });
      }
      break;
      
    case 'pie':
    case 'doughnut':
      for (let i = 0; i < Math.min(count, 5); i++) {
        data.push({
          label: categories[i],
          value: Math.floor(Math.random() * 100) + 20,
          color: getColor(i)
        });
      }
      break;
      
    case 'area':
      for (let i = 0; i < count; i++) {
        data.push({
          label: `Q${i + 1}`,
          value: Math.floor(Math.random() * 500) + 100,
          growth: (Math.random() * 50 - 10).toFixed(1)
        });
      }
      break;
      
    default:
      for (let i = 0; i < count; i++) {
        data.push({
          label: `Item ${i + 1}`,
          value: Math.floor(Math.random() * 100) + 10
        });
      }
  }
  
  return data;
};

/**
 * Generate KPI data with trends and targets
 */
export const generateKPIData = (config = {}) => {
  const {
    type = 'revenue',
    format = 'number',
    hasTarget = true
  } = config;
  
  const baseData = {
    revenue: { min: 50000, max: 200000, trendRange: [-15, 25] },
    users: { min: 1000, max: 50000, trendRange: [-5, 20] },
    conversion: { min: 2, max: 15, trendRange: [-2, 8] },
    satisfaction: { min: 75, max: 98, trendRange: [-3, 5] },
    orders: { min: 500, max: 5000, trendRange: [-10, 30] }
  };
  
  const configData = baseData[type] || baseData.revenue;
  const value = Math.floor(Math.random() * (configData.max - configData.min)) + configData.min;
  const trend = (Math.random() * (configData.trendRange[1] - configData.trendRange[0]) + configData.trendRange[0]).toFixed(1);
  
  const kpiData = {
    value: value,
    trend: parseFloat(trend),
    period: 'this month',
    previousValue: Math.floor(value * (100 - Math.abs(trend)) / 100),
    color: getKpiColor(parseFloat(trend))
  };
  
  if (hasTarget) {
    kpiData.target = Math.floor(value * (1 + (Math.random() * 0.3 + 0.1))); // 10-40% above current value
  }
  
  // Add type-specific formatting
  switch (type) {
    case 'revenue':
      kpiData.valueFormatted = formatCurrency(kpiData.value);
      kpiData.previousValueFormatted = formatCurrency(kpiData.previousValue);
      if (kpiData.target) kpiData.targetFormatted = formatCurrency(kpiData.target);
      kpiData.icon = 'dollar';
      break;
      
    case 'users':
      kpiData.valueFormatted = formatNumber(kpiData.value);
      kpiData.previousValueFormatted = formatNumber(kpiData.previousValue);
      if (kpiData.target) kpiData.targetFormatted = formatNumber(kpiData.target);
      kpiData.icon = 'users';
      break;
      
    case 'conversion':
      kpiData.valueFormatted = `${kpiData.value}%`;
      kpiData.previousValueFormatted = `${kpiData.previousValue}%`;
      if (kpiData.target) kpiData.targetFormatted = `${kpiData.target}%`;
      kpiData.icon = 'trending-up';
      break;
      
    case 'satisfaction':
      kpiData.valueFormatted = `${kpiData.value}%`;
      kpiData.previousValueFormatted = `${kpiData.previousValue}%`;
      if (kpiData.target) kpiData.targetFormatted = `${kpiData.target}%`;
      kpiData.icon = 'heart';
      break;
      
    case 'orders':
      kpiData.valueFormatted = formatNumber(kpiData.value);
      kpiData.previousValueFormatted = formatNumber(kpiData.previousValue);
      if (kpiData.target) kpiData.targetFormatted = formatNumber(kpiData.target);
      kpiData.icon = 'shopping-cart';
      break;
  }
  
  return kpiData;
};

/**
 * Generate sample user data for user tables
 */
export const generateUserData = (count = 15) => {
  const users = [];
  const departments = ['Engineering', 'Sales', 'Marketing', 'Support', 'HR', 'Finance'];
  const positions = ['Manager', 'Developer', 'Analyst', 'Specialist', 'Director', 'Coordinator'];
  const statuses = ['Active', 'Inactive', 'On Leave', 'Pending'];
  
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    
    users.push({
      id: `EMP${1000 + i}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
      department,
      position: positions[Math.floor(Math.random() * positions.length)],
      salary: Math.floor(Math.random() * 80000) + 40000,
      joinDate: new Date(Date.now() - Math.floor(Math.random() * 1000) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`
    });
  }
  
  return users;
};

/**
 * Generate sales data for sales performance widgets
 */
export const generateSalesData = (period = 'monthly', count = 12) => {
  const data = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const regions = ['North America', 'Europe', 'Asia', 'South America'];
  const products = ['Product A', 'Product B', 'Product C', 'Product D'];
  
  let baseValue = 50000;
  
  for (let i = 0; i < count; i++) {
    const growth = (Math.random() * 20 - 5) / 100; // -5% to +15% growth
    baseValue = baseValue * (1 + growth);
    
    data.push({
      period: period === 'monthly' ? months[i] : `Q${(i % 4) + 1} ${2023 + Math.floor(i / 4)}`,
      sales: Math.floor(baseValue),
      revenue: Math.floor(baseValue * (Math.random() * 100 + 50)),
      units: Math.floor(baseValue / 100),
      growth: (growth * 100).toFixed(1),
      region: regions[Math.floor(Math.random() * regions.length)],
      product: products[Math.floor(Math.random() * products.length)]
    });
  }
  
  return data;
};

/**
 * Generate real-time activity data
 */
export const generateActivityData = (count = 10) => {
  const activities = [];
  const actionTypes = ['login', 'purchase', 'view', 'download', 'share', 'comment'];
  const pages = ['/dashboard', '/products', '/settings', '/analytics', '/reports'];
  
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now.getTime() - Math.floor(Math.random() * 60) * 60 * 1000);
    const action = actionTypes[Math.floor(Math.random() * actionTypes.length)];
    
    activities.push({
      id: `ACT${1000 + i}`,
      user: `user${Math.floor(Math.random() * 100) + 1}`,
      action,
      page: pages[Math.floor(Math.random() * pages.length)],
      timestamp: timestamp.toISOString(),
      duration: Math.floor(Math.random() * 300) + 30, // 30-330 seconds
      status: Math.random() > 0.2 ? 'success' : 'error'
    });
  }
  
  // Sort by timestamp (newest first)
  return activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

/**
 * Generate performance metrics data
 */
export const generatePerformanceData = (metric = 'responseTime', count = 24) => {
  const data = [];
  const now = new Date();
  
  const ranges = {
    responseTime: { min: 50, max: 500, unit: 'ms' },
    cpu: { min: 10, max: 95, unit: '%' },
    memory: { min: 30, max: 90, unit: '%' },
    uptime: { min: 99.5, max: 100, unit: '%' }
  };
  
  const range = ranges[metric] || ranges.responseTime;
  
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now.getTime() - (count - i - 1) * 60 * 60 * 1000);
    const value = metric === 'uptime' 
      ? (Math.random() * (range.max - range.min) + range.min).toFixed(2)
      : Math.floor(Math.random() * (range.max - range.min)) + range.min;
    
    data.push({
      timestamp: timestamp.toISOString(),
      value: parseFloat(value),
      unit: range.unit,
      status: getPerformanceStatus(metric, value)
    });
  }
  
  return data;
};

// Utility functions
const getColor = (index) => {
  const colors = [
    '#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8',
    '#6f42c1', '#e83e8c', '#fd7e14', '#20c997', '#6610f2'
  ];
  return colors[index % colors.length];
};

const getKpiColor = (trend) => {
  if (trend > 5) return '#28a745'; // Green for strong positive
  if (trend > 0) return '#20c997'; // Teal for positive
  if (trend > -5) return '#ffc107'; // Yellow for slight negative
  return '#dc3545'; // Red for strong negative
};

const getPerformanceStatus = (metric, value) => {
  const thresholds = {
    responseTime: { good: 100, warning: 300 },
    cpu: { good: 50, warning: 80 },
    memory: { good: 60, warning: 80 },
    uptime: { good: 99.9, warning: 99.5 }
  };
  
  const threshold = thresholds[metric] || thresholds.responseTime;
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.warning) return 'warning';
  return 'critical';
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const formatNumber = (number) => {
  return new Intl.NumberFormat('en-US').format(number);
};

// Sample name arrays
const firstNames = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
  'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'
];

// Pre-defined sample datasets for quick setup
export const sampleDatasets = {
  // Table datasets
  users: {
    columns: [
      { key: 'id', name: 'ID', type: 'text', sortable: true },
      { key: 'firstName', name: 'First Name', type: 'text', sortable: true },
      { key: 'lastName', name: 'Last Name', type: 'text', sortable: true },
      { key: 'email', name: 'Email', type: 'text', sortable: true },
      { key: 'department', name: 'Department', type: 'text', sortable: true },
      { key: 'position', name: 'Position', type: 'text', sortable: true },
      { key: 'salary', name: 'Salary', type: 'number', sortable: true },
      { key: 'status', name: 'Status', type: 'text', sortable: true }
    ],
    data: generateUserData(15),
    title: 'Employee Directory'
  },
  
  sales: {
    columns: [
      { key: 'period', name: 'Period', type: 'text', sortable: true },
      { key: 'sales', name: 'Sales', type: 'number', sortable: true },
      { key: 'revenue', name: 'Revenue', type: 'number', sortable: true },
      { key: 'units', name: 'Units', type: 'number', sortable: true },
      { key: 'growth', name: 'Growth %', type: 'number', sortable: true },
      { key: 'region', name: 'Region', type: 'text', sortable: true }
    ],
    data: generateSalesData('monthly', 12),
    title: 'Sales Performance'
  },
  
  products: {
    columns: [
      { key: 'id', name: 'ID', type: 'text', sortable: true },
      { key: 'name', name: 'Product Name', type: 'text', sortable: true },
      { key: 'category', name: 'Category', type: 'text', sortable: true },
      { key: 'price', name: 'Price', type: 'number', sortable: true },
      { key: 'quantity', name: 'Quantity', type: 'number', sortable: true },
      { key: 'status', name: 'Status', type: 'text', sortable: true },
      { key: 'rating', name: 'Rating', type: 'number', sortable: true }
    ],
    data: generateTableData([
      { key: 'id' }, { key: 'name' }, { key: 'category' }, 
      { key: 'price' }, { key: 'quantity' }, { key: 'status' }, { key: 'rating' }
    ], 20),
    title: 'Product Inventory'
  },
  
  // Chart datasets
  revenueChart: {
    type: 'bar',
    data: generateChartData('bar', 6),
    title: 'Monthly Revenue',
    config: {
      showGrid: true,
      showLegend: true,
      colors: ['#007bff', '#28a745', '#ffc107']
    }
  },
  
  salesChart: {
    type: 'line',
    data: generateChartData('line', 12),
    title: 'Sales Trend',
    config: {
      showGrid: true,
      smooth: true,
      fill: true
    }
  },
  
  marketShare: {
    type: 'pie',
    data: generateChartData('pie', 5),
    title: 'Market Share',
    config: {
      showLabels: true,
      donut: false
    }
  },
  
  // KPI datasets
  revenueKPI: {
    ...generateKPIData({ type: 'revenue', hasTarget: true }),
    title: 'Total Revenue',
    description: 'Monthly recurring revenue'
  },
  
  usersKPI: {
    ...generateKPIData({ type: 'users', hasTarget: true }),
    title: 'Active Users',
    description: 'Registered active users'
  },
  
  conversionKPI: {
    ...generateKPIData({ type: 'conversion', hasTarget: true }),
    title: 'Conversion Rate',
    description: 'Website conversion rate'
  },
  
  satisfactionKPI: {
    ...generateKPIData({ type: 'satisfaction', hasTarget: true }),
    title: 'Customer Satisfaction',
    description: 'Average satisfaction score'
  }
};

// API simulation functions
export const mockAPI = {
  // Simulate API delay
  delay: (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Fetch table data
  fetchTableData: async (dataset = 'users') => {
    await mockAPI.delay(800);
    return sampleDatasets[dataset] || sampleDatasets.users;
  },
  
  // Fetch chart data
  fetchChartData: async (type = 'bar') => {
    await mockAPI.delay(600);
    return {
      type,
      data: generateChartData(type),
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Chart`
    };
  },
  
  // Fetch KPI data
  fetchKPIData: async (type = 'revenue') => {
    await mockAPI.delay(400);
    return {
      ...generateKPIData({ type }),
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} KPI`
    };
  },
  
  // Fetch real-time updates
  fetchRealtimeData: async () => {
    await mockAPI.delay(200);
    return {
      activities: generateActivityData(5),
      performance: generatePerformanceData('responseTime', 1)[0],
      timestamp: new Date().toISOString()
    };
  }
};

export default {
  generateTableData,
  generateChartData,
  generateKPIData,
  generateUserData,
  generateSalesData,
  generateActivityData,
  generatePerformanceData,
  sampleDatasets,
  mockAPI
};