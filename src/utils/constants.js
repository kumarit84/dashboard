export const WIDGET_TYPES = [
  {
    type: 'table',
    name: 'Data Table',
    description: 'Display data in a tabular format',
    icon: '📊',
    defaultSize: { w: 6, h: 4 }
  },
  {
    type: 'chart',
    name: 'Chart',
    description: 'Visualize data with charts',
    icon: '📈',
    defaultSize: { w: 4, h: 3 }
  },
  {
    type: 'kpi',
    name: 'KPI Card',
    description: 'Show key performance indicators',
    icon: '🎯',
    defaultSize: { w: 2, h: 2 }
  }
]

export const DEFAULT_TABLE_COLUMNS = [
  { key: 'id', name: 'ID' },
  { key: 'name', name: 'Name' },
  { key: 'value', name: 'Value' },
  { key: 'status', name: 'Status' }
]