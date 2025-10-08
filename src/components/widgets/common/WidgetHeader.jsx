import React, { useState } from 'react';
import { MoreVertical, Settings, RefreshCw, Download, Maximize2, Minimize2 } from 'lucide-react';
import Button from '../../ui/Button';
import WidgetActions from './WidgetActions';
import './WidgetHeader.css';

const WidgetHeader = ({ title, widgetType, onRemove, onRefresh, onExport, onSettings }) => {
  const [showActions, setShowActions] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  // Stop event propagation to prevent drag events
  const stopPropagation = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleActionClick = (action) => {
    setShowActions(false);
    switch (action) {
      case 'refresh':
        onRefresh?.();
        break;
      case 'export':
        onExport?.();
        break;
      case 'settings':
        onSettings?.();
        break;
      case 'maximize':
        setIsMaximized(!isMaximized);
        break;
      case 'remove':
        onRemove?.();
        break;
      default:
        break;
    }
  };

  const getWidgetIcon = () => {
    switch (widgetType) {
      case 'table':
        return '📊';
      case 'chart':
        return '📈';
      case 'kpi':
        return '🎯';
      default:
        return '📦';
    }
  };

  return (
    <div className="widget-header" onClick={stopPropagation}>
      <div className="widget-header-left">
        <span className="widget-icon">{getWidgetIcon()}</span>
        <h3 className="widget-title">{title}</h3>
        <span className="widget-badge">{widgetType}</span>
      </div>

      <div className="widget-header-right">
        <div className="widget-actions-container">
          {/* Quick Actions */}
          <div className="quick-actions">
            {onRefresh && (
              <Button
                variant="ghost"
                icon={<RefreshCw size={14} />}
                onClick={(e) => {
                  stopPropagation(e);
                  handleActionClick('refresh');
                }}
                className="action-btn"
                title="Refresh"
              />
            )}
            
            {onExport && (
              <Button
                variant="ghost"
                icon={<Download size={14} />}
                onClick={(e) => {
                  stopPropagation(e);
                  handleActionClick('export');
                }}
                className="action-btn"
                title="Export"
              />
            )}
            
            <Button
              variant="ghost"
              icon={isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              onClick={(e) => {
                stopPropagation(e);
                handleActionClick('maximize');
              }}
              className="action-btn"
              title={isMaximized ? "Minimize" : "Maximize"}
            />
          </div>

          {/* More Actions Dropdown */}
          <div className="more-actions">
            <Button
              variant="ghost"
              icon={<MoreVertical size={14} />}
              onClick={(e) => {
                stopPropagation(e);
                setShowActions(!showActions);
              }}
              className="more-actions-btn"
              title="More actions"
            />
            
            {showActions && (
              <>
                {/* Overlay to close dropdown when clicking outside */}
                <div 
                  className="widget-actions-overlay"
                  onClick={(e) => {
                    stopPropagation(e);
                    setShowActions(false);
                  }}
                />
                <WidgetActions
                  widgetType={widgetType}
                  onAction={handleActionClick}
                  onClose={() => setShowActions(false)}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {isMaximized && (
        <div className="widget-maximized-overlay">
          <div className="maximized-content">
            <Button
              variant="outline"
              icon={<Minimize2 size={16} />}
              onClick={(e) => {
                stopPropagation(e);
                setIsMaximized(false);
              }}
              className="minimize-btn"
            >
              Minimize
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WidgetHeader;