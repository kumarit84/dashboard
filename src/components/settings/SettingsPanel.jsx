import React from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import WidgetLibrary from './WidgetLibrary';
import DashboardSettings from './DashboardSettings';
import LayoutSettings from './LayoutSettings';
import Modal from '../ui/Modal';
import './SettingsPanel.css';

const SettingsPanel = () => {
  const { isSettingsOpen, toggleSettings } = useDashboard();
  const [activeTab, setActiveTab] = React.useState('widgets');

  // Close settings when clicking outside or pressing Escape
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isSettingsOpen) {
        toggleSettings();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isSettingsOpen, toggleSettings]);

  if (!isSettingsOpen) return null;

  const tabs = [
    { id: 'widgets', label: 'Add Widgets', icon: '➕' },
    { id: 'layout', label: 'Layout', icon: '📐' },
    { id: 'settings', label: 'Dashboard Settings', icon: '⚙️' }
  ];

  const handleClose = () => {
    toggleSettings();
  };

  return (
    <Modal 
      isOpen={isSettingsOpen} 
      onClose={handleClose}
      title="Dashboard Settings"
      size="lg"
    >
      <div className="settings-panel">
        <div className="settings-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="settings-content">
          {activeTab === 'widgets' && (
            <WidgetLibrary onWidgetAdded={handleClose} />
          )}
          {activeTab === 'layout' && <LayoutSettings />}
          {activeTab === 'settings' && <DashboardSettings />}
        </div>
      </div>
    </Modal>
  );
};

export default SettingsPanel;