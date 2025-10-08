// Local Storage utilities for dashboard data persistence

const STORAGE_KEYS = {
  DASHBOARD_WIDGETS: 'dashboard-widgets',
  DASHBOARD_LAYOUTS: 'dashboard-layouts',
  DASHBOARD_SETTINGS: 'dashboard-settings',
  USER_PREFERENCES: 'user-preferences'
};

// Generic storage functions
export const storage = {
  // Get item from localStorage
  get: (key, defaultValue = null) => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  // Set item in localStorage
  set: (key, value) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
      return false;
    }
  },

  // Remove item from localStorage
  remove: (key) => {
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage key "${key}":`, error);
      return false;
    }
  },

  // Clear all dashboard-related data
  clearDashboardData: () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        window.localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Error clearing dashboard data:', error);
      return false;
    }
  },

  // Get storage usage information
  getStorageInfo: () => {
    try {
      let totalSize = 0;
      Object.values(STORAGE_KEYS).forEach(key => {
        const item = window.localStorage.getItem(key);
        if (item) {
          totalSize += new Blob([item]).size;
        }
      });
      
      return {
        totalSize: totalSize,
        totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
        items: Object.values(STORAGE_KEYS).map(key => ({
          key,
          size: new Blob([window.localStorage.getItem(key) || '']).size,
          hasData: !!window.localStorage.getItem(key)
        }))
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return null;
    }
  }
};

// Dashboard-specific storage functions
export const dashboardStorage = {
  // Widgets
  getWidgets: () => storage.get(STORAGE_KEYS.DASHBOARD_WIDGETS, []),
  setWidgets: (widgets) => storage.set(STORAGE_KEYS.DASHBOARD_WIDGETS, widgets),
  
  // Layouts
  getLayouts: () => storage.get(STORAGE_KEYS.DASHBOARD_LAYOUTS, { lg: [], md: [], sm: [], xs: [], xxs: [] }),
  setLayouts: (layouts) => storage.set(STORAGE_KEYS.DASHBOARD_LAYOUTS, layouts),
  
  // Settings
  getSettings: () => storage.get(STORAGE_KEYS.DASHBOARD_SETTINGS, {
    name: 'My Dashboard',
    description: 'A customizable dashboard with drag-and-drop widgets',
    theme: 'light',
    gridSize: 12,
    enableAnimations: true,
    autoRefresh: false,
    refreshInterval: 5
  }),
  setSettings: (settings) => storage.set(STORAGE_KEYS.DASHBOARD_SETTINGS, settings),
  
  // User Preferences
  getPreferences: () => storage.get(STORAGE_KEYS.USER_PREFERENCES, {
    recentWidgets: [],
    favoriteLayouts: [],
    collapsedSections: []
  }),
  setPreferences: (preferences) => storage.set(STORAGE_KEYS.USER_PREFERENCES, preferences)
};

// Migration utilities for future updates
export const storageMigration = {
  // Check if migration is needed
  needsMigration: (version = '1.0.0') => {
    const currentVersion = storage.get('dashboard-version');
    return currentVersion !== version;
  },

  // Migrate data to new version
  migrate: (fromVersion, toVersion = '1.0.0') => {
    console.log(`Migrating dashboard data from ${fromVersion} to ${toVersion}`);
    
    try {
      // Example migration logic
      const widgets = dashboardStorage.getWidgets();
      const layouts = dashboardStorage.getLayouts();
      
      // Add migration transformations here
      const migratedWidgets = widgets.map(widget => ({
        ...widget,
        // Ensure new fields exist
        version: toVersion,
        createdAt: widget.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      
      // Save migrated data
      dashboardStorage.setWidgets(migratedWidgets);
      storage.set('dashboard-version', toVersion);
      
      return true;
    } catch (error) {
      console.error('Migration failed:', error);
      return false;
    }
  },

  // Initialize storage with current version
  initialize: (version = '1.0.0') => {
    if (!storage.get('dashboard-version')) {
      storage.set('dashboard-version', version);
    }
  }
};

// Backup and restore utilities
export const backupUtils = {
  // Export all dashboard data as JSON
  exportData: () => {
    try {
      const data = {
        version: storage.get('dashboard-version'),
        widgets: dashboardStorage.getWidgets(),
        layouts: dashboardStorage.getLayouts(),
        settings: dashboardStorage.getSettings(),
        preferences: dashboardStorage.getPreferences(),
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Export failed:', error);
      return false;
    }
  },

  // Import dashboard data from JSON
  importData: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          
          // Validate imported data
          if (!data.widgets || !data.layouts) {
            throw new Error('Invalid backup file format');
          }
          
          // Save imported data
          dashboardStorage.setWidgets(data.widgets);
          dashboardStorage.setLayouts(data.layouts);
          if (data.settings) dashboardStorage.setSettings(data.settings);
          if (data.preferences) dashboardStorage.setPreferences(data.preferences);
          if (data.version) storage.set('dashboard-version', data.version);
          
          resolve(true);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }
};

// Export storage keys for external use
export { STORAGE_KEYS };

export default storage;