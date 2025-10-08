import React, { useState } from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import { 
  Plus, 
  Settings, 
  RefreshCw, 
  Search, 
  Grid, 
  List, 
  Download,
  Eye,
  EyeOff
} from 'lucide-react';
import Button from '../ui/Button';
import './DashboardHeader.css';

const DashboardHeader = () => {
  const { toggleSettings, widgets, isSettingsOpen } = useDashboard();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh action
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleSettingsClick = () => {
    toggleSettings();
  };

  const widgetStats = {
    total: widgets.length,
    tables: widgets.filter(w => w.type === 'table').length,
    charts: widgets.filter(w => w.type === 'chart').length,
    kpis: widgets.filter(w => w.type === 'kpi').length,
  };

  return (
    <header className="dashboard-header">
      <div className="header-content">
        <div className="header-left">
          <div className="dashboard-title-section">
            <h1 className="dashboard-title">
              <span className="dashboard-title-icon">📊</span>
              Analytics Dashboard
            </h1>
            <p className="dashboard-subtitle">
              Monitor your data in real-time
            </p>
          </div>

          <div className="dashboard-stats">
            <div className="stat-item">
              <div className="stat-icon">📦</div>
              <div className="stat-info">
                <div className="stat-value">{widgetStats.total}</div>
                <div className="stat-label">Widgets</div>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <div className="stat-value">{widgetStats.tables}</div>
                <div className="stat-label">Tables</div>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon">📈</div>
              <div className="stat-info">
                <div className="stat-value">{widgetStats.charts}</div>
                <div className="stat-label">Charts</div>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon">🎯</div>
              <div className="stat-info">
                <div className="stat-value">{widgetStats.kpis}</div>
                <div className="stat-label">KPIs</div>
              </div>
            </div>
          </div>
        </div>

        <div className="header-right">
          <div className="header-actions">
            <Button
              variant="primary"
              onClick={handleSettingsClick}
              icon={<Plus size={16} />}
              className="add-widget-btn"
              disabled={isSettingsOpen}
            >
              Add Widget
            </Button>
            
            <Button
              variant="outline"
              onClick={handleSettingsClick}
              icon={<Settings size={16} />}
              className="settings-btn"
            >
              Settings
            </Button>
          </div>

          <div className="quick-actions">
            <button
              className={`quick-action-btn ${isRefreshing ? 'active' : ''}`}
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh data"
            >
              <RefreshCw size={16} className={isRefreshing ? 'btn-loading' : ''} />
            </button>
            
            <button
              className="quick-action-btn"
              onClick={() => {/* Export functionality */}}
              title="Export dashboard"
            >
              <Download size={16} />
            </button>
            
            <button
              className="quick-action-btn"
              onClick={() => {/* Toggle visibility */}}
              title="Toggle grid visibility"
            >
              <Eye size={16} />
            </button>
          </div>

          <div className="view-controls">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <Grid size={14} />
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              <List size={14} />
            </button>
          </div>

          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search widgets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="status-indicators">
            <div className="status-item">
              <div className="status-dot online"></div>
              <span>Online</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;