import React, { useState } from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import AddTableForm from './AddTableForm';
import { WIDGET_TYPES } from '../../utils/constants';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Search, Filter } from 'lucide-react';
import './WidgetLibrary.css';

const WidgetLibrary = ({ onWidgetAdded }) => {
  const { addWidget } = useDashboard();
  const [selectedType, setSelectedType] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const handleAddDefaultWidget = (widgetType) => {
    const defaultConfig = getDefaultConfig(widgetType);
    addWidget(widgetType, defaultConfig);
    
    // Close settings after adding widget
    if (onWidgetAdded) {
      onWidgetAdded();
    }
  };

  const handleAddTable = (tableConfig) => {
    addWidget('table', tableConfig);
    setSelectedType(null);
    
    // Close settings after adding widget
    if (onWidgetAdded) {
      onWidgetAdded();
    }
  };

  const getDefaultConfig = (widgetType) => {
    const baseConfig = {
      title: `${widgetType.charAt(0).toUpperCase() + widgetType.slice(1)} Widget`,
      dataSource: 'default'
    };

    switch (widgetType) {
      case 'table':
        return {
          ...baseConfig,
          columns: [
            { key: 'id', name: 'ID' },
            { key: 'name', name: 'Name' },
            { key: 'value', name: 'Value' },
            { key: 'status', name: 'Status' }
          ]
        };
      case 'chart':
        return {
          ...baseConfig,
          chartType: 'bar',
          categories: 6
        };
      case 'kpi':
        return {
          ...baseConfig,
          format: 'number',
          icon: 'target'
        };
      default:
        return baseConfig;
    }
  };

  const categories = [
    { id: 'all', label: 'All Widgets' },
    { id: 'data', label: 'Data Display' },
    { id: 'visualization', label: 'Visualization' },
    { id: 'metrics', label: 'Metrics' }
  ];

  const getWidgetCategory = (widgetType) => {
    switch (widgetType) {
      case 'table':
        return 'data';
      case 'chart':
        return 'visualization';
      case 'kpi':
        return 'metrics';
      default:
        return 'data';
    }
  };

  const filteredWidgets = WIDGET_TYPES.filter(widget => {
    const matchesSearch = widget.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         widget.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || getWidgetCategory(widget.type) === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (selectedType === 'table') {
    return (
      <AddTableForm 
        onSubmit={handleAddTable} 
        onCancel={() => setSelectedType(null)}
      />
    );
  }

  return (
    <div className="widget-library">
      <div className="library-header">
        <h3>Widget Library</h3>
        <p>Choose from available widgets to add to your dashboard</p>
      </div>

      <div className="library-controls">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search widgets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <Filter size={16} />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="category-filter"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="widget-grid">
        {filteredWidgets.map(widget => (
          <Card key={widget.type} className="widget-card">
            <div className="widget-card-header">
              <div className="widget-icon-large">{widget.icon}</div>
              <span className="widget-category">{getWidgetCategory(widget.type)}</span>
            </div>
            
            <div className="widget-card-content">
              <h4 className="widget-name">{widget.name}</h4>
              <p className="widget-description">{widget.description}</p>
              
              <div className="widget-features">
                <span className="feature-tag">Drag & Drop</span>
                <span className="feature-tag">Responsive</span>
                <span className="feature-tag">Customizable</span>
              </div>
            </div>

            <div className="widget-card-actions">
              <Button
                variant="primary"
                onClick={() => widget.type === 'table' 
                  ? setSelectedType('table') 
                  : handleAddDefaultWidget(widget.type)
                }
                className="add-widget-btn"
                fullWidth
              >
                Add to Dashboard
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredWidgets.length === 0 && (
        <div className="no-widgets-found">
          <div className="no-widgets-icon">🔍</div>
          <h4>No widgets found</h4>
          <p>Try adjusting your search or filter criteria</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default WidgetLibrary;