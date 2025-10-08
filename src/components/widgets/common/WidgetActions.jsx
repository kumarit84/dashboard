import React from 'react';
import { 
  Trash2, 
  Settings, 
  RefreshCw, 
  Download, 
  Copy, 
  Edit3,
  Eye,
  EyeOff
} from 'lucide-react';
import './WidgetActions.css';

const WidgetActions = ({ widgetType, onAction, onClose }) => {
  const handleActionClick = (action, e) => {
    e.stopPropagation();
    e.preventDefault();
    onAction(action);
  };

  const getWidgetSpecificActions = () => {
    switch (widgetType) {
      case 'table':
        return [
          { id: 'filter', label: 'Filter Data', icon: <Eye size={14} /> },
          { id: 'columns', label: 'Manage Columns', icon: <Settings size={14} /> },
          { id: 'sort', label: 'Sort Data', icon: <Edit3 size={14} /> }
        ];
      case 'chart':
        return [
          { id: 'chart-type', label: 'Change Chart Type', icon: <Settings size={14} /> },
          { id: 'data-range', label: 'Set Data Range', icon: <Edit3 size={14} /> },
          { id: 'colors', label: 'Customize Colors', icon: <Eye size={14} /> }
        ];
      case 'kpi':
        return [
          { id: 'threshold', label: 'Set Threshold', icon: <Settings size={14} /> },
          { id: 'format', label: 'Change Format', icon: <Edit3 size={14} /> },
          { id: 'comparison', label: 'Add Comparison', icon: <Eye size={14} /> }
        ];
      default:
        return [];
    }
  };

  const commonActions = [
    { id: 'refresh', label: 'Refresh Data', icon: <RefreshCw size={14} /> },
    { id: 'export', label: 'Export Data', icon: <Download size={14} /> },
    { id: 'duplicate', label: 'Duplicate Widget', icon: <Copy size={14} /> },
    { id: 'settings', label: 'Widget Settings', icon: <Settings size={14} /> },
    { id: 'remove', label: 'Remove Widget', icon: <Trash2 size={14} />, danger: true }
  ];

  const widgetSpecificActions = getWidgetSpecificActions();

  return (
    <div className="widget-actions-dropdown" onClick={(e) => e.stopPropagation()}>
      <div className="actions-section">
        <div className="section-title">Widget Actions</div>
        {widgetSpecificActions.map(action => (
          <button
            key={action.id}
            className="action-item"
            onClick={(e) => handleActionClick(action.id, e)}
          >
            <span className="action-icon">{action.icon}</span>
            <span className="action-label">{action.label}</span>
          </button>
        ))}
      </div>

      <div className="actions-section">
        <div className="section-title">General</div>
        {commonActions.map(action => (
          <button
            key={action.id}
            className={`action-item ${action.danger ? 'danger' : ''}`}
            onClick={(e) => handleActionClick(action.id, e)}
          >
            <span className="action-icon">{action.icon}</span>
            <span className="action-label">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WidgetActions;