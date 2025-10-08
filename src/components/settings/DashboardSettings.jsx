import React from 'react';
import { Save, RefreshCw, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { useDashboard } from '../../contexts/DashboardContext';
import './DashboardSettings.css';

const DashboardSettings = () => {
  const { widgets } = useDashboard();
  const [settings, setSettings] = React.useState({
    name: 'My Dashboard',
    description: 'A customizable dashboard with drag-and-drop widgets',
    theme: 'light',
    gridSize: 12,
    enableAnimations: true,
    autoRefresh: false,
    refreshInterval: 5
  });

  const handleSave = () => {
    // Save settings implementation
    console.log('Saving settings:', settings);
    alert('Settings saved successfully!');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      setSettings({
        name: 'My Dashboard',
        description: 'A customizable dashboard with drag-and-drop widgets',
        theme: 'light',
        gridSize: 12,
        enableAnimations: true,
        autoRefresh: false,
        refreshInterval: 5
      });
    }
  };

  const handleClearData = () => {
    if (window.confirm('This will remove all widgets and reset the dashboard. This action cannot be undone.')) {
      localStorage.removeItem('dashboard-widgets');
      localStorage.removeItem('dashboard-layouts');
      window.location.reload();
    }
  };

  return (
    <div className="dashboard-settings">
      <div className="settings-section">
        <Card>
          <h4 className="section-title">General Settings</h4>
          <div className="settings-grid">
            <div className="form-group">
              <label>Dashboard Name</label>
              <input
                type="text"
                value={settings.name}
                onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter dashboard name"
              />
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={settings.description}
                onChange={(e) => setSettings(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter dashboard description"
                rows="3"
              />
            </div>
            
            <div className="form-group">
              <label>Theme</label>
              <select
                value={settings.theme}
                onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value }))}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto (System)</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Grid Columns</label>
              <select
                value={settings.gridSize}
                onChange={(e) => setSettings(prev => ({ ...prev, gridSize: parseInt(e.target.value) }))}
              >
                <option value={6}>6 Columns</option>
                <option value={12}>12 Columns</option>
                <option value={24}>24 Columns</option>
              </select>
            </div>
          </div>
        </Card>
      </div>

      <div className="settings-section">
        <Card>
          <h4 className="section-title">Behavior</h4>
          <div className="settings-options">
            <label className="checkbox-option">
              <input
                type="checkbox"
                checked={settings.enableAnimations}
                onChange={(e) => setSettings(prev => ({ ...prev, enableAnimations: e.target.checked }))}
              />
              <span>Enable animations</span>
            </label>
            
            <label className="checkbox-option">
              <input
                type="checkbox"
                checked={settings.autoRefresh}
                onChange={(e) => setSettings(prev => ({ ...prev, autoRefresh: e.target.checked }))}
              />
              <span>Enable auto-refresh</span>
            </label>
            
            {settings.autoRefresh && (
              <div className="form-group">
                <label>Refresh Interval (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.refreshInterval}
                  onChange={(e) => setSettings(prev => ({ ...prev, refreshInterval: parseInt(e.target.value) }))}
                />
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="settings-section">
        <Card>
          <h4 className="section-title">Dashboard Information</h4>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Total Widgets</span>
              <span className="info-value">{widgets.length}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Table Widgets</span>
              <span className="info-value">{widgets.filter(w => w.type === 'table').length}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Chart Widgets</span>
              <span className="info-value">{widgets.filter(w => w.type === 'chart').length}</span>
            </div>
            <div className="info-item">
              <span className="info-label">KPI Widgets</span>
              <span className="info-value">{widgets.filter(w => w.type === 'kpi').length}</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="settings-section">
        <Card className="danger-zone">
          <h4 className="section-title">Danger Zone</h4>
          <div className="danger-actions">
            <div className="danger-action">
              <div className="action-info">
                <h5>Reset Settings</h5>
                <p>Reset all settings to their default values</p>
              </div>
              <Button
                variant="outline"
                icon={<RefreshCw size={16} />}
                onClick={handleReset}
              >
                Reset Settings
              </Button>
            </div>
            
            <div className="danger-action">
              <div className="action-info">
                <h5>Clear All Data</h5>
                <p>Remove all widgets and reset the dashboard</p>
              </div>
              <Button
                variant="danger"
                icon={<Trash2 size={16} />}
                onClick={handleClearData}
              >
                Clear Dashboard
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="settings-actions">
        <Button
          variant="primary"
          icon={<Save size={16} />}
          onClick={handleSave}
          className="save-btn"
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default DashboardSettings;