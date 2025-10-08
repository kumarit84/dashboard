import React, { createContext, useContext, useReducer } from 'react';
import { dashboardReducer, getDefaultLayout } from '../utils/dashboardHelpers';
import { useLocalStorageUtils } from '../hooks/useLocalStorage';

const DashboardContext = createContext();

const initialState = {
  widgets: [],
  layouts: { lg: [], md: [], sm: [], xs: [], xxs: [] },
  isSettingsOpen: false
};

export const DashboardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);
  const { setItem, getItem } = useLocalStorageUtils();

  React.useEffect(() => {
    const savedWidgets = getItem('dashboard-widgets');
    const savedLayouts = getItem('dashboard-layouts');
    
    if (savedWidgets) {
      dispatch({ type: 'LOAD_WIDGETS', payload: savedWidgets });
    }
    if (savedLayouts) {
      dispatch({ type: 'LOAD_LAYOUTS', payload: savedLayouts });
    }
  }, []);

  React.useEffect(() => {
    setItem('dashboard-widgets', state.widgets);
    setItem('dashboard-layouts', state.layouts);
  }, [state.widgets, state.layouts]);

  const addWidget = (widgetType, config) => {
    const newWidget = {
      id: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // More unique ID
      type: widgetType,
      config: config,
      layout: getDefaultLayout(widgetType, state.widgets.length)
    };
    dispatch({ type: 'ADD_WIDGET', payload: newWidget });
  };

  const removeWidget = (widgetId) => {
    dispatch({ type: 'REMOVE_WIDGET', payload: widgetId });
  };

  const updateLayout = (layouts) => {
    dispatch({ type: 'UPDATE_LAYOUT', payload: layouts });
  };

  const toggleSettings = () => {
    dispatch({ type: 'TOGGLE_SETTINGS' });
  };

  // New function to update individual widget layout
  const updateWidgetLayout = (widgetId, newLayout) => {
    dispatch({ 
      type: 'UPDATE_WIDGET_LAYOUT', 
      payload: { widgetId, newLayout } 
    });
  };

  return (
    <DashboardContext.Provider value={{
      ...state,
      addWidget,
      removeWidget,
      updateLayout,
      updateWidgetLayout,
      toggleSettings
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
};