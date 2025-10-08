import React, { useCallback } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useDashboard } from '../../contexts/DashboardContext';
import Widget from '../widgets/Widget';
import DashboardHeader from './DashboardHeader';
import SettingsPanel from '../settings/SettingsPanel';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './Dashboard.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const Dashboard = () => {
  const { 
    widgets, 
    layouts, 
    updateLayout,
    isSettingsOpen 
  } = useDashboard();

  const handleLayoutChange = useCallback((currentLayout, allLayouts) => {
    updateLayout(allLayouts);
  }, [updateLayout]);

  const generateLayoutData = () => {
    return widgets.map(widget => {
      const layout = layouts.lg?.find(l => l.i === widget.id) || widget.layout || {
        i: widget.id,
        x: 0,
        y: 0,
        w: 4,
        h: 3,
        minW: 2,
        minH: 2
      };
      
      return {
        ...layout,
        i: widget.id,
        minW: 2,
        minH: 2,
        maxW: 12,
        maxH: 8
      };
    });
  };

  const currentLayouts = {
    lg: generateLayoutData(),
    md: generateLayoutData(),
    sm: generateLayoutData(),
    xs: generateLayoutData(),
    xxs: generateLayoutData()
  };

  return (
    <div className="dashboard">
      <DashboardHeader />
      
      <SettingsPanel />

      {widgets.length > 0 ? (
        <ResponsiveGridLayout
          className="layout"
          layouts={currentLayouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={100}
          onLayoutChange={handleLayoutChange}
          isDraggable={!isSettingsOpen}
          isResizable={!isSettingsOpen}
          margin={[10, 10]}
          containerPadding={[10, 10]}
          compactType="vertical"
          preventCollision={false}
          useCSSTransforms={true}
          draggableCancel=".no-drag, input, button, select, textarea, .table-controls, .table-actions, .pagination-btn, .action-btn, .page-number, .search-input, .widget-actions-container"
          draggableHandle=".widget-header"
          resizeHandles={['se']}
        >
          {widgets.map(widget => (
            <div key={widget.id} className="widget-container">
              <Widget widget={widget} />
            </div>
          ))}
        </ResponsiveGridLayout>
      ) : (
        <div className="empty-dashboard">
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3>No widgets yet</h3>
            <p>Click "Add Widget" to start building your dashboard</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;