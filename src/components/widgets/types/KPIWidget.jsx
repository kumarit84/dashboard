import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Target, Calendar, Users, DollarSign } from 'lucide-react';
import Loader from '../../ui/Loader';
import { generateKPIData } from '../../../data/mockData';
import './KPIWidget.css';

const KPIWidget = ({ config }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [config]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockData = generateKPIData(config);
      setData(mockData);
    } catch (err) {
      setError('Failed to load KPI data');
      console.error('Error loading KPI data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = () => {
    switch (config.icon) {
      case 'target':
        return <Target size={24} />;
      case 'users':
        return <Users size={24} />;
      case 'dollar':
        return <DollarSign size={24} />;
      case 'calendar':
        return <Calendar size={24} />;
      default:
        return <Target size={24} />;
    }
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) {
      return <TrendingUp size={16} className="trend-up" />;
    } else if (trend < 0) {
      return <TrendingDown size={16} className="trend-down" />;
    } else {
      return <Minus size={16} className="trend-neutral" />;
    }
  };

  const formatValue = (value, format) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(value);
      case 'percent':
        return `${value}%`;
      case 'number':
        return new Intl.NumberFormat().format(value);
      default:
        return value;
    }
  };

  if (loading) return <Loader text="Loading KPI..." size="small" />;
  if (error) return <div className="kpi-error">{error}</div>;
  if (!data) return <div className="kpi-error">No data available</div>;

  return (
    <div className="kpi-widget">
      <div className="kpi-header">
        <div className="kpi-icon" style={{ color: data.color }}>
          {getIcon()}
        </div>
        <div className="kpi-info">
          <h3 className="kpi-title">{config.title || 'KPI'}</h3>
          <span className="kpi-period">{data.period}</span>
        </div>
      </div>

      <div className="kpi-value">
        {formatValue(data.value, config.format)}
      </div>

      <div className="kpi-trend">
        <div className="trend-indicator">
          {getTrendIcon(data.trend)}
          <span className={`trend-value ${data.trend > 0 ? 'trend-up' : data.trend < 0 ? 'trend-down' : 'trend-neutral'}`}>
            {Math.abs(data.trend)}%
          </span>
        </div>
        <span className="trend-label">vs previous period</span>
      </div>

      {data.target && (
        <div className="kpi-progress">
          <div className="progress-header">
            <span>Progress to target</span>
            <span>{((data.value / data.target) * 100).toFixed(1)}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${Math.min((data.value / data.target) * 100, 100)}%`,
                backgroundColor: data.color
              }}
            />
          </div>
          <div className="progress-target">
            Target: {formatValue(data.target, config.format)}
          </div>
        </div>
      )}

      <div className="kpi-footer">
        <button 
          className="refresh-kpi" 
          onClick={loadData}
          title="Refresh KPI"
        >
          Refresh
        </button>
        <span className="kpi-updated">Updated just now</span>
      </div>
    </div>
  );
};

export default KPIWidget;