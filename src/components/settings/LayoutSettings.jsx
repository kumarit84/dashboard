import React from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import { Grid, Rows, Columns, Lock, Unlock, Save, RotateCcw } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import './LayoutSettings.css';

const LayoutSettings = () => {
  const { widgets, layouts } = useDashboard();
  const [layoutSettings, setLayoutSettings] = React.useState({
    gridSize: 12,
    rowHeight: 100,
    margin: [10, 10],
    containerPadding: [10, 10],
    isDraggable: true,
    isResizable: true,
    preventCollision: false,
    compactType: 'vertical',
    useCssTransforms: true,
    allowOverlap: false
  });

  const gridSizes = [
    { value: 6, label: '6 Columns', description: 'Basic grid' },
    { value: 12, label: '12 Columns', description: 'Standard grid' },
    { value: 16, label: '16 Columns', description: 'Detailed grid' },
    { value: 24, label: '24 Columns', description: 'High precision' }
  ];

  const compactTypes = [
    { value: 'vertical', label: 'Vertical', description: 'Pack items vertically' },
    { value: 'horizontal', label: 'Horizontal', description: 'Pack items horizontally' },
    { value: null, label: 'None', description: 'No compaction' }
  ];

  const rowHeights = [
    { value: 50, label: '50px', description: 'Compact' },
    { value: 80, label: '80px', description: 'Balanced' },
    { value: 100, label: '100px', description: 'Standard' },
    { value: 120, label: '120px', description: 'Spacious' },
    { value: 150, label: '150px', description: 'Large' }
  ];

  const handleSave = () => {
    console.log('Saving layout settings:', layoutSettings);
    alert('Layout settings saved successfully!');
  };

  const handleReset = () => {
    if (window.confirm('Reset all layout settings to default?')) {
      setLayoutSettings({
        gridSize: 12,
        rowHeight: 100,
        margin: [10, 10],
        containerPadding: [10, 10],
        isDraggable: true,
        isResizable: true,
        preventCollision: false,
        compactType: 'vertical',
        useCssTransforms: true,
        allowOverlap: false
      });
    }
  };

  const handleExportLayout = () => {
    const layoutData = {
      settings: layoutSettings,
      widgets: widgets,
      layouts: layouts,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(layoutData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-layout-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportLayout = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        
        if (importedData.settings) {
          setLayoutSettings(importedData.settings);
        }
        
        alert('Layout imported successfully!');
      } catch (error) {
        alert('Error importing layout: Invalid file format');
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
    
    event.target.value = '';
  };

  const getGridDensity = () => {
    const totalCells = layoutSettings.gridSize * 10;
    const usedCells = widgets.reduce((total, widget) => {
      const layout = layouts.lg?.find(l => l.i === widget.id) || widget.layout;
      return total + (layout?.w || 0) * (layout?.h || 0);
    }, 0);
    
    return Math.min(Math.round((usedCells / totalCells) * 100), 100);
  };

  const gridDensity = getGridDensity();

  return (
    <div className="layout-settings">
      <div className="layout-header">
        <h3>Layout Configuration</h3>
        <p>Customize how widgets are arranged and behave on your dashboard</p>
      </div>

      <div className="layout-content">
        {/* Grid Configuration */}
        <Card className="settings-section">
          <h4 className="section-title">
            <Grid size={18} />
            Grid System
          </h4>
          
          <div className="settings-grid">
            <div className="form-group">
              <label>Grid Columns</label>
              <select
                value={layoutSettings.gridSize}
                onChange={(e) => setLayoutSettings(prev => ({ 
                  ...prev, 
                  gridSize: parseInt(e.target.value) 
                }))}
              >
                {gridSizes.map(size => (
                  <option key={size.value} value={size.value}>
                    {size.label}
                  </option>
                ))}
              </select>
              <div className="setting-description">
                Number of vertical columns in the grid
              </div>
            </div>
            
            <div className="form-group">
              <label>Row Height</label>
              <select
                value={layoutSettings.rowHeight}
                onChange={(e) => setLayoutSettings(prev => ({ 
                  ...prev, 
                  rowHeight: parseInt(e.target.value) 
                }))}
              >
                {rowHeights.map(height => (
                  <option key={height.value} value={height.value}>
                    {height.label}
                  </option>
                ))}
              </select>
              <div className="setting-description">
                Height of each grid row in pixels
              </div>
            </div>
          </div>

          <div className="settings-grid">
            <div className="form-group">
              <label>Margin X</label>
              <input
                type="number"
                min="0"
                max="50"
                value={layoutSettings.margin[0]}
                onChange={(e) => setLayoutSettings(prev => ({ 
                  ...prev, 
                  margin: [parseInt(e.target.value), prev.margin[1]]
                }))}
              />
              <div className="setting-description">
                Horizontal space between widgets
              </div>
            </div>
            
            <div className="form-group">
              <label>Margin Y</label>
              <input
                type="number"
                min="0"
                max="50"
                value={layoutSettings.margin[1]}
                onChange={(e) => setLayoutSettings(prev => ({ 
                  ...prev, 
                  margin: [prev.margin[0], parseInt(e.target.value)]
                }))}
              />
              <div className="setting-description">
                Vertical space between widgets
              </div>
            </div>
          </div>
        </Card>

        {/* Behavior Settings */}
        <Card className="settings-section">
          <h4 className="section-title">
            <Rows size={18} />
            Widget Behavior
          </h4>
          
          <div className="behavior-settings">
            <div className="toggle-group">
              <label className="toggle-item">
                <input
                  type="checkbox"
                  checked={layoutSettings.isDraggable}
                  onChange={(e) => setLayoutSettings(prev => ({ 
                    ...prev, 
                    isDraggable: e.target.checked 
                  }))}
                />
                <div className="toggle-content">
                  <div className="toggle-icon">
                    {layoutSettings.isDraggable ? <Unlock size={16} /> : <Lock size={16} />}
                  </div>
                  <div className="toggle-info">
                    <div className="toggle-label">Draggable Widgets</div>
                    <div className="toggle-description">
                      Allow widgets to be moved by dragging
                    </div>
                  </div>
                </div>
              </label>

              <label className="toggle-item">
                <input
                  type="checkbox"
                  checked={layoutSettings.isResizable}
                  onChange={(e) => setLayoutSettings(prev => ({ 
                    ...prev, 
                    isResizable: e.target.checked 
                  }))}
                />
                <div className="toggle-content">
                  <div className="toggle-icon">
                    <Columns size={16} />
                  </div>
                  <div className="toggle-info">
                    <div className="toggle-label">Resizable Widgets</div>
                    <div className="toggle-description">
                      Allow widgets to be resized
                    </div>
                  </div>
                </div>
              </label>

              <label className="toggle-item">
                <input
                  type="checkbox"
                  checked={layoutSettings.allowOverlap}
                  onChange={(e) => setLayoutSettings(prev => ({ 
                    ...prev, 
                    allowOverlap: e.target.checked 
                  }))}
                />
                <div className="toggle-content">
                  <div className="toggle-icon">⊞</div>
                  <div className="toggle-info">
                    <div className="toggle-label">Allow Overlap</div>
                    <div className="toggle-description">
                      Let widgets overlap each other
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Compaction Type</label>
            <select
              value={layoutSettings.compactType || 'none'}
              onChange={(e) => setLayoutSettings(prev => ({ 
                ...prev, 
                compactType: e.target.value === 'none' ? null : e.target.value
              }))}
            >
              {compactTypes.map(type => (
                <option key={type.value || 'none'} value={type.value || 'none'}>
                  {type.label}
                </option>
              ))}
            </select>
            <div className="setting-description">
              How widgets are packed when others are moved
            </div>
          </div>
        </Card>

        {/* Layout Analytics */}
        <Card className="settings-section">
          <h4 className="section-title">Layout Analytics</h4>
          
          <div className="analytics-grid">
            <div className="analytics-item">
              <div className="analytics-value">{widgets.length}</div>
              <div className="analytics-label">Total Widgets</div>
            </div>
            
            <div className="analytics-item">
              <div className="analytics-value">{layoutSettings.gridSize}</div>
              <div className="analytics-label">Grid Columns</div>
            </div>
            
            <div className="analytics-item">
              <div className="analytics-value">{gridDensity}%</div>
              <div className="analytics-label">Grid Density</div>
            </div>
            
            <div className="analytics-item">
              <div className="analytics-value">
                {layoutSettings.isDraggable ? 'Yes' : 'No'}
              </div>
              <div className="analytics-label">Draggable</div>
            </div>
          </div>

          <div className="density-meter">
            <div className="density-labels">
              <span>Grid Density</span>
              <span>{gridDensity}%</span>
            </div>
            <div className="density-bar">
              <div 
                className="density-fill"
                style={{ width: `${gridDensity}%` }}
                data-density={gridDensity < 30 ? 'low' : gridDensity < 70 ? 'medium' : 'high'}
              ></div>
            </div>
            <div className="density-tips">
              {gridDensity < 30 && 'Plenty of space available'}
              {gridDensity >= 30 && gridDensity < 70 && 'Good space utilization'}
              {gridDensity >= 70 && 'Grid is getting crowded'}
            </div>
          </div>
        </Card>

        {/* Import/Export */}
        <Card className="settings-section">
          <h4 className="section-title">Backup & Restore</h4>
          
          <div className="backup-actions">
            <div className="backup-action">
              <div className="backup-info">
                <h5>Export Layout</h5>
                <p>Download your current layout configuration</p>
              </div>
              <Button
                variant="outline"
                onClick={handleExportLayout}
                icon={<Save size={16} />}
              >
                Export Layout
              </Button>
            </div>
            
            <div className="backup-action">
              <div className="backup-info">
                <h5>Import Layout</h5>
                <p>Upload a previously saved layout file</p>
              </div>
              <div className="import-control">
                <input
                  type="file"
                  id="layout-import"
                  accept=".json"
                  onChange={handleImportLayout}
                  style={{ display: 'none' }}
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('layout-import').click()}
                >
                  Choose File
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="layout-actions">
        <Button
          variant="outline"
          onClick={handleReset}
          icon={<RotateCcw size={16} />}
        >
          Reset to Defaults
        </Button>
        
        <Button
          variant="primary"
          onClick={handleSave}
          icon={<Save size={16} />}
        >
          Save Layout Settings
        </Button>
      </div>
    </div>
  );
};

export default LayoutSettings;