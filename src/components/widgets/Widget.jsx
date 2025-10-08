import React from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import { TableWidget, ChartWidget, KPIWidget } from './types';
import WidgetHeader from './common/WidgetHeader';
import './Widget.css';

const Widget = ({ widget }) => {
  const { removeWidget, isSettingsOpen } = useDashboard();

  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'table':
        return <TableWidget config={widget.config} />;
      case 'chart':
        return <ChartWidget config={widget.config} />;
      case 'kpi':
        return <KPIWidget config={widget.config} />;
      default:
        return <div>Unknown widget type</div>;
    }
  };

  const handleRemove = () => {
    if (window.confirm('Are you sure you want to remove this widget?')) {
      removeWidget(widget.id);
    }
  };

  const handleRefresh = () => {
    console.log('Refreshing widget:', widget.id);
    // Implement refresh logic here
  };

  const handleExport = () => {
    console.log('Exporting widget:', widget.id);
    // Implement export logic here
  };

  const handleSettings = () => {
    console.log('Opening widget settings:', widget.id);
    // Implement settings logic here
  };

  return (
    <div className={`widget ${isSettingsOpen ? 'settings-open' : ''}`}>
      <WidgetHeader 
        title={widget.config.title}
        onRemove={handleRemove}
        onRefresh={handleRefresh}
        onExport={handleExport}
        onSettings={handleSettings}
        widgetType={widget.type}
      />
      <div className="widget-content">
        {renderWidgetContent()}
      </div>
    </div>
  );
};

export default Widget;