import React, { useState, useEffect } from 'react';
import { Filter, Search, Download, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../../ui/Button';
import Loader from '../../ui/Loader';
import { generateTableData } from '../../../data/mockData';
import './TableWidget.css';

const TableWidget = ({ config }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    loadData();
  }, [config.dataSource]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockData = generateTableData(config.columns, 32);
      setData(mockData);
    } catch (err) {
      setError('Failed to load table data');
      console.error('Error loading table data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const exportToCSV = () => {
    const headers = config.columns.map(col => `"${col.name}"`).join(',');
    const csvData = filteredAndSortedData.map(row =>
      config.columns.map(col => `"${row[col.key]}"`).join(',')
    ).join('\n');
    
    const csv = `${headers}\n${csvData}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.title || 'table-data'}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filter and sort data
  const filteredAndSortedData = React.useMemo(() => {
    let filtered = data;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        config.columns.some(column =>
          String(item[column.key]).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    // Apply sorting
    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filtered;
  }, [data, searchTerm, sortConfig, config.columns]);

  // Paginate data
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (loading) {
    return (
      <div className="table-widget">
        <Loader text="Loading table data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="table-widget">
        <div className="error-message">
          {error}
          <Button
            variant="outline"
            onClick={loadData}
            className="retry-btn"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="table-widget no-drag">
      {/* Table Controls */}
      <div className="table-controls">
        <div className="table-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search in table..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input no-drag"
          />
          {searchTerm && (
            <button
              className="clear-search"
              onClick={() => setSearchTerm('')}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        
        <div className="table-actions">
          <div className="results-count">
            Showing {paginatedData.length} of {filteredAndSortedData.length} records
          </div>
          
          <Button
            variant="outline"
            icon={<Filter size={14} />}
            onClick={() => console.log('Filter clicked')}
            className="action-btn no-drag"
            title="Filter data"
          >
            Filter
          </Button>
          
          <Button
            variant="outline"
            icon={<Download size={14} />}
            onClick={exportToCSV}
            className="action-btn no-drag"
            title="Export to CSV"
          >
            Export
          </Button>
          
          <Button
            variant="outline"
            icon={<RefreshCw size={14} />}
            onClick={loadData}
            className="action-btn no-drag"
            title="Refresh data"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {config.columns.map(column => (
                <th 
                  key={column.key}
                  onClick={() => handleSort(column.key)}
                  className={`no-drag ${column.sortable !== false ? 'sortable' : ''} ${
                    sortConfig.key === column.key ? `sort-${sortConfig.direction}` : ''
                  }`}
                >
                  <div className="th-content">
                    {column.name}
                    {column.sortable !== false && (
                      <span className="sort-indicator">
                        {sortConfig.key === column.key ? (
                          sortConfig.direction === 'asc' ? '↑' : '↓'
                        ) : (
                          '↕'
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? 'even' : 'odd'}>
                {config.columns.map(column => (
                  <td key={column.key} className="no-drag">
                    <div className="cell-content">
                      {column.format ? column.format(row[column.key]) : row[column.key]}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        
        {paginatedData.length === 0 && (
          <div className="no-data">
            <div className="no-data-icon">📭</div>
            <h4>No data found</h4>
            <p>
              {searchTerm 
                ? `No records match "${searchTerm}"`
                : 'No data available for the current filters'
              }
            </p>
            {searchTerm && (
              <Button
                variant="outline"
                onClick={() => setSearchTerm('')}
                className="clear-filters-btn"
              >
                Clear Search
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="table-pagination no-drag">
          <div className="pagination-info">
            Page {currentPage} of {totalPages} • {filteredAndSortedData.length} total records
          </div>
          
          <div className="pagination-controls">
            <Button
              variant="outline"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="pagination-btn no-drag"
              title="First page"
            >
              <ChevronLeft size={14} />
              <ChevronLeft size={14} style={{ marginLeft: -8 }} />
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-btn no-drag"
              title="Previous page"
            >
              <ChevronLeft size={14} />
              Previous
            </Button>

            <div className="page-numbers">
              {getPageNumbers().map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`page-number ${currentPage === page ? 'active' : ''} no-drag`}
                >
                  {page}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-btn no-drag"
              title="Next page"
            >
              Next
              <ChevronRight size={14} />
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="pagination-btn no-drag"
              title="Last page"
            >
              <ChevronRight size={14} style={{ marginRight: -8 }} />
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableWidget;