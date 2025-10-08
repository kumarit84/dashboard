import React, { useState, useEffect } from 'react';
import { BarChart3, PieChart, LineChart, TrendingUp } from 'lucide-react';
import Button from '../../ui/Button';
import Loader from '../../ui/Loader';
import { generateChartData } from '../../../data/mockData';
import './ChartWidget.css';

const ChartWidget = ({ config }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState(config.chartType || 'bar');

  useEffect(() => {
    loadData();
  }, [config.dataSource]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockData = generateChartData(config.categories || 6);
      setData(mockData);
    } catch (err) {
      setError('Failed to load chart data');
      console.error('Error loading chart data:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderChart = () => {
    if (loading) return <Loader text="Loading chart..." />;
    if (error) return <div className="error-message">{error}</div>;

    switch (chartType) {
      case 'bar':
        return renderBarChart();
      case 'line':
        return renderLineChart();
      case 'pie':
        return renderPieChart();
      default:
        return renderBarChart();
    }
  };

  const renderBarChart = () => {
    const maxValue = Math.max(...data.map(d => d.value));
    
    return (
      <div className="bar-chart">
        {data.map((item, index) => (
          <div key={item.label} className="bar-container">
            <div className="bar-label">{item.label}</div>
            <div className="bar-wrapper">
              <div
                className="bar"
                style={{
                  height: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: getColor(index)
                }}
              >
                <span className="bar-value">{item.value}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderLineChart = () => {
    return (
      <div className="line-chart">
        <svg viewBox={`0 0 400 200`} className="line-svg">
          <path
            d={generateLinePath(data)}
            fill="none"
            stroke="#007bff"
            strokeWidth="2"
          />
          {data.map((point, index) => (
            <circle
              key={point.label}
              cx={index * (400 / (data.length - 1))}
              cy={200 - (point.value / 100) * 200}
              r="4"
              fill="#007bff"
            />
          ))}
        </svg>
        <div className="line-labels">
          {data.map(point => (
            <div key={point.label} className="line-label">
              {point.label}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    return (
      <div className="pie-chart">
        <svg viewBox="0 0 200 200" className="pie-svg">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const angle = (percentage / 100) * 360;
            const largeArc = angle > 180 ? 1 : 0;
            
            const x1 = 100 + 80 * Math.cos((currentAngle * Math.PI) / 180);
            const y1 = 100 + 80 * Math.sin((currentAngle * Math.PI) / 180);
            const x2 = 100 + 80 * Math.cos(((currentAngle + angle) * Math.PI) / 180);
            const y2 = 100 + 80 * Math.sin(((currentAngle + angle) * Math.PI) / 180);

            const pathData = [
              `M 100 100`,
              `L ${x1} ${y1}`,
              `A 80 80 0 ${largeArc} 1 ${x2} ${y2}`,
              `Z`
            ].join(' ');

            currentAngle += angle;

            return (
              <path
                key={item.label}
                d={pathData}
                fill={getColor(index)}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
        </svg>
        <div className="pie-legend">
          {data.map((item, index) => (
            <div key={item.label} className="legend-item">
              <div
                className="legend-color"
                style={{ backgroundColor: getColor(index) }}
              />
              <span className="legend-label">
                {item.label} ({((item.value / total) * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const generateLinePath = (points) => {
    if (points.length === 0) return '';
    
    const path = points.map((point, index) => {
      const x = index * (400 / (points.length - 1));
      const y = 200 - (point.value / 100) * 200;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
    
    return path;
  };

  const getColor = (index) => {
    const colors = [
      '#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8', '#6f42c1',
      '#e83e8c', '#fd7e14', '#20c997', '#6610f2'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="chart-widget">
      <div className="chart-header">
        <div className="chart-title">
          <TrendingUp size={20} />
          <h3>{config.title || 'Chart'}</h3>
        </div>
        
        <div className="chart-controls">
          <Button
            variant={chartType === 'bar' ? 'primary' : 'outline'}
            icon={<BarChart3 size={16} />}
            onClick={() => setChartType('bar')}
            className="chart-type-btn"
          >
            Bar
          </Button>
          
          <Button
            variant={chartType === 'line' ? 'primary' : 'outline'}
            icon={<LineChart size={16} />}
            onClick={() => setChartType('line')}
            className="chart-type-btn"
          >
            Line
          </Button>
          
          <Button
            variant={chartType === 'pie' ? 'primary' : 'outline'}
            icon={<PieChart size={16} />}
            onClick={() => setChartType('pie')}
            className="chart-type-btn"
          >
            Pie
          </Button>
        </div>
      </div>

      <div className="chart-container">
        {renderChart()}
      </div>

      <div className="chart-footer">
        <Button
          variant="outline"
          onClick={loadData}
          className="refresh-btn"
        >
          Refresh Data
        </Button>
        
        {data.length > 0 && (
          <div className="chart-stats">
            <span>Total: {data.reduce((sum, item) => sum + item.value, 0)}</span>
            <span>Avg: {(data.reduce((sum, item) => sum + item.value, 0) / data.length).toFixed(1)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartWidget;