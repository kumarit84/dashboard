import React, { useEffect, useState } from 'react';
import { DashboardProvider } from './contexts/DashboardContext';
import Dashboard from './components/dashboard/Dashboard';
import { storage, dashboardStorage, storageMigration } from './utils/storage';
import { useLocalStorage } from './hooks/useLocalStorage';
import Loader from './components/ui/Loader';
import './styles/globals.css';

/**
 * Main App Component
 * Handles theme management, storage initialization, and global error boundary
 */
function App() {
  const [theme, setTheme] = useLocalStorage('dashboard-theme', 'light');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize app on mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        
        // Initialize storage migration
        storageMigration.initialize();
        
        // Check if migration is needed and perform if necessary
        if (storageMigration.needsMigration()) {
          console.log('Performing storage migration...');
          const currentVersion = storage.get('dashboard-version');
          storageMigration.migrate(currentVersion);
        }
        
        // Verify storage is working
        const testData = { test: 'storage_test', timestamp: Date.now() };
        storage.set('app-init-test', testData);
        const retrieved = storage.get('app-init-test');
        
        if (!retrieved || retrieved.test !== 'storage_test') {
          throw new Error('Local storage initialization failed');
        }
        
        // Clean up test data
        storage.remove('app-init-test');
        
        // Apply theme
        document.documentElement.setAttribute('data-theme', theme);
        
        // Simulate loading time for better UX
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (err) {
        console.error('App initialization error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [theme]);

  // Handle theme changes
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Global error handler
  useEffect(() => {
    const handleUnhandledRejection = (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      setError('An unexpected error occurred. Please refresh the page.');
    };

    const handleError = (event) => {
      console.error('Global error:', event.error);
      setError('A critical error occurred. Please refresh the page.');
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  // Render loading state
  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-content">
          <Loader size="large" text="Initializing Dashboard..." />
          <div className="loading-details">
            <p>Setting up your dashboard environment...</p>
            <div className="loading-steps">
              <div className="loading-step completed">✓ Loading components</div>
              <div className="loading-step completed">✓ Initializing storage</div>
              <div className="loading-step active">Setting up dashboard</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="app-error">
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <h1>Something went wrong</h1>
          <p>{error}</p>
          <div className="error-actions">
            <button 
              onClick={() => window.location.reload()}
              className="retry-btn"
            >
              Refresh Page
            </button>
            <button 
              onClick={() => {
                storage.clearDashboardData();
                window.location.reload();
              }}
              className="reset-btn"
            >
              Reset Dashboard
            </button>
          </div>
          <details className="error-details">
            <summary>Technical Details</summary>
            <pre>{error}</pre>
          </details>
        </div>
      </div>
    );
  }

  // Main app render
  return (
    <DashboardProvider>
      <div className="app" data-theme={theme}>
        <AppHeader onThemeChange={handleThemeChange} currentTheme={theme} />
        <main className="app-main">
          <Dashboard />
        </main>
        <AppFooter />
        <GlobalModals />
      </div>
    </DashboardProvider>
  );
}

/**
 * App Header Component
 * Shows theme switcher and app info
 */
const AppHeader = ({ onThemeChange, currentTheme }) => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="app-title">
            <span className="app-icon">📊</span>
            React Dashboard
          </h1>
          <span className="app-version">v1.0.0</span>
        </div>
        
        <div className="header-right">
          <div className="header-actions">
            <button
              className="theme-toggle"
              onClick={() => onThemeChange(currentTheme === 'light' ? 'dark' : 'light')}
              title={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`}
            >
              {currentTheme === 'light' ? '🌙' : '☀️'}
            </button>
            
            <button
              className="info-btn"
              onClick={() => setShowInfo(true)}
              title="About this dashboard"
            >
              ℹ️
            </button>
          </div>
        </div>
      </div>

      {/* Info Modal */}
      {showInfo && (
        <div className="info-modal-overlay" onClick={() => setShowInfo(false)}>
          <div className="info-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>About React Dashboard</h2>
              <button 
                className="close-btn"
                onClick={() => setShowInfo(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-content">
              <p>
                A modern, customizable React dashboard with drag-and-drop widgets 
                and real-time data visualization.
              </p>
              <div className="feature-list">
                <h3>Features</h3>
                <ul>
                  <li>🎯 Drag & Drop widget arrangement</li>
                  <li>📊 Multiple widget types (Tables, Charts, KPI)</li>
                  <li>⚙️ Customizable settings and layouts</li>
                  <li>💾 Local storage persistence</li>
                  <li>🎨 Responsive design with theme support</li>
                </ul>
              </div>
              <div className="tech-stack">
                <h3>Built With</h3>
                <div className="tech-tags">
                  <span className="tech-tag">React</span>
                  <span className="tech-tag">Vite</span>
                  <span className="tech-tag">CSS Variables</span>
                  <span className="tech-tag">React-Grid-Layout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

/**
 * App Footer Component
 */
const AppFooter = () => {
  const [showStorageInfo, setShowStorageInfo] = useState(false);
  const storageInfo = storage.getStorageInfo();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-left">
          <span>© 2024 React Dashboard</span>
          <span className="footer-separator">•</span>
          <span>Built with React & Vite</span>
        </div>
        
        <div className="footer-right">
          <button
            className="storage-info-btn"
            onClick={() => setShowStorageInfo(true)}
            title="Storage Information"
          >
            💾 Storage Info
          </button>
        </div>
      </div>

      {/* Storage Info Modal */}
      {showStorageInfo && (
        <div className="storage-modal-overlay" onClick={() => setShowStorageInfo(false)}>
          <div className="storage-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Storage Information</h2>
              <button 
                className="close-btn"
                onClick={() => setShowStorageInfo(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-content">
              {storageInfo ? (
                <div className="storage-stats">
                  <div className="storage-total">
                    <strong>Total Storage Used:</strong> {storageInfo.totalSizeMB} MB
                  </div>
                  <div className="storage-breakdown">
                    <h4>Storage Breakdown:</h4>
                    {storageInfo.items.map(item => (
                      <div key={item.key} className="storage-item">
                        <span className="storage-key">{item.key}:</span>
                        <span className="storage-size">
                          {(item.size / 1024).toFixed(2)} KB
                        </span>
                        <span className={`storage-status ${item.hasData ? 'has-data' : 'no-data'}`}>
                          {item.hasData ? '✓' : '✗'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="storage-actions">
                    <button
                      className="export-btn"
                      onClick={() => {
                        // Export functionality would go here
                        alert('Export feature coming soon!');
                      }}
                    >
                      Export Data
                    </button>
                    <button
                      className="clear-btn"
                      onClick={() => {
                        if (window.confirm('Clear all dashboard data? This cannot be undone.')) {
                          storage.clearDashboardData();
                          window.location.reload();
                        }
                      }}
                    >
                      Clear All Data
                    </button>
                  </div>
                </div>
              ) : (
                <p>Unable to load storage information.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

/**
 * Global Modals Component
 * Handles app-wide modals and notifications
 */
const GlobalModals = () => {
  const [notifications, setNotifications] = useState([]);

  // Add a sample notification (in real app, this would come from context)
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications([{
        id: 1,
        type: 'info',
        message: 'Welcome to React Dashboard! Drag and drop widgets to customize your layout.',
        duration: 5000
      }]);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  return (
    <div className="global-modals">
      {/* Notifications */}
      <div className="notifications-container">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`notification notification-${notification.type}`}
          >
            <span className="notification-message">{notification.message}</span>
            <button
              className="notification-close"
              onClick={() => removeNotification(notification.id)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Error Boundary Component (class component for error boundaries)
class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="app-error-boundary">
          <div className="error-content">
            <h1>Something went wrong</h1>
            <p>The application encountered an unexpected error.</p>
            <button
              onClick={() => window.location.reload()}
              className="reload-btn"
            >
              Reload Application
            </button>
            <details className="error-details">
              <summary>Error Details</summary>
              <pre>{this.state.error?.toString()}</pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrap the main App with Error Boundary
export default function AppWithErrorBoundary() {
  return (
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  );
}