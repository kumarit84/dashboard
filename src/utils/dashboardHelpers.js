import { WIDGET_TYPES } from './constants';

export const dashboardReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_WIDGETS':
      return { ...state, widgets: action.payload };
    
    case 'LOAD_LAYOUTS':
      return { ...state, layouts: action.payload };
    
    case 'ADD_WIDGET':
      return {
        ...state,
        widgets: [...state.widgets, action.payload],
        layouts: updateLayoutsWithNewWidget(state.layouts, action.payload, state.widgets)
      };
    
    case 'REMOVE_WIDGET':
      const filteredWidgets = state.widgets.filter(w => w.id !== action.payload);
      return {
        ...state,
        widgets: filteredWidgets,
        layouts: updateLayoutsAfterRemove(state.layouts, action.payload)
      };
    
    case 'UPDATE_LAYOUT':
      return { ...state, layouts: action.payload };
    
    case 'UPDATE_WIDGET_LAYOUT':
      return {
        ...state,
        widgets: state.widgets.map(widget =>
          widget.id === action.payload.widgetId
            ? { ...widget, layout: action.payload.newLayout }
            : widget
        )
      };
    
    case 'TOGGLE_SETTINGS':
      return { ...state, isSettingsOpen: !state.isSettingsOpen };
    
    default:
      return state;
  }
};

// Improved positioning algorithm that properly scans the entire grid
export const getDefaultLayout = (widgetType, existingLayouts = {}) => {
  const widgetConfig = WIDGET_TYPES.find(w => w.type === widgetType);
  const defaultSize = widgetConfig?.defaultSize || { w: 4, h: 3 };
  
  // Get all existing widget positions
  const allWidgets = Object.values(existingLayouts).flat();
  
  if (allWidgets.length === 0) {
    // First widget - place at top left
    return {
      x: 0,
      y: 0,
      w: defaultSize.w,
      h: defaultSize.h,
      minW: 2,
      minH: 2,
      maxW: 12,
      maxH: 8
    };
  }

  // Find the maximum Y position to know how far to scan
  let maxY = 0;
  allWidgets.forEach(widget => {
    if (widget.y + widget.h > maxY) {
      maxY = widget.y + widget.h;
    }
  });

  // Scan all possible positions in a grid-like fashion
  for (let y = 0; y <= maxY + 6; y++) { // Look 6 rows beyond current content
    for (let x = 0; x <= 12 - defaultSize.w; x++) {
      const canPlace = !allWidgets.some(existing => 
        x < existing.x + existing.w &&
        x + defaultSize.w > existing.x &&
        y < existing.y + existing.h &&
        y + defaultSize.h > existing.y
      );
      
      if (canPlace) {
        return {
          x: x,
          y: y,
          w: defaultSize.w,
          h: defaultSize.h,
          minW: 2,
          minH: 2,
          maxW: 12,
          maxH: 8
        };
      }
    }
  }

  // Fallback: place below everything
  return {
    x: 0,
    y: maxY + 1,
    w: defaultSize.w,
    h: defaultSize.h,
    minW: 2,
    minH: 2,
    maxW: 12,
    maxH: 8
  };
};

const updateLayoutsWithNewWidget = (layouts, widget, existingWidgets) => {
  const newLayouts = { ...layouts };
  
  // Create layout for all breakpoints
  Object.keys(newLayouts).forEach(breakpoint => {
    const currentBreakpointLayouts = newLayouts[breakpoint] || [];
    
    // Get existing widgets in this breakpoint to calculate position
    const existingWidgetLayouts = currentBreakpointLayouts.filter(l => 
      existingWidgets.some(w => w.id === l.i && w.id !== widget.id)
    );
    
    // Calculate position based on existing widgets
    const position = calculateWidgetPosition(widget, existingWidgetLayouts);
    
    newLayouts[breakpoint] = [
      ...currentBreakpointLayouts.filter(l => l.i !== widget.id),
      { 
        ...position, 
        i: widget.id,
        minW: 2,
        minH: 2,
        maxW: 12,
        maxH: 8
      }
    ];
  });
  
  return newLayouts;
};

const calculateWidgetPosition = (widget, existingWidgets) => {
  const widgetConfig = WIDGET_TYPES.find(w => w.type === widget.type);
  const defaultSize = widgetConfig?.defaultSize || { w: 4, h: 3 };
  
  if (existingWidgets.length === 0) {
    return { x: 0, y: 0, w: defaultSize.w, h: defaultSize.h };
  }

  // Find the maximum Y position
  let maxY = 0;
  existingWidgets.forEach(widget => {
    if (widget.y + widget.h > maxY) {
      maxY = widget.y + widget.h;
    }
  });

  // Scan the grid systematically
  for (let y = 0; y <= maxY + 6; y++) {
    for (let x = 0; x <= 12 - defaultSize.w; x++) {
      const canPlace = !existingWidgets.some(existing => 
        x < existing.x + existing.w &&
        x + defaultSize.w > existing.x &&
        y < existing.y + existing.h &&
        y + defaultSize.h > existing.y
      );
      
      if (canPlace) {
        return { x: x, y: y, w: defaultSize.w, h: defaultSize.h };
      }
    }
  }

  // Fallback position
  return { x: 0, y: maxY + 1, w: defaultSize.w, h: defaultSize.h };
};

const updateLayoutsAfterRemove = (layouts, widgetId) => {
  const newLayouts = { ...layouts };
  Object.keys(newLayouts).forEach(breakpoint => {
    newLayouts[breakpoint] = newLayouts[breakpoint].filter(l => l.i !== widgetId);
  });
  return newLayouts;
};

// Helper to ensure layout data is valid
export const validateLayout = (layout) => {
  return {
    i: layout.i || '',
    x: Math.max(0, layout.x || 0),
    y: Math.max(0, layout.y || 0),
    w: Math.max(2, Math.min(12, layout.w || 4)),
    h: Math.max(2, Math.min(8, layout.h || 3)),
    minW: Math.max(1, layout.minW || 2),
    minH: Math.max(1, layout.minH || 2),
    maxW: Math.min(12, layout.maxW || 12),
    maxH: Math.min(12, layout.maxH || 8)
  };
};