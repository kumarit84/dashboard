import React, { useState } from 'react';
import { Plus, Trash2, Save, X, Settings } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import './AddTableForm.css';

const AddTableForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: 'Data Table',
    dataSource: 'mock',
    description: '',
    columns: [
      { key: 'id', name: 'ID', type: 'text', sortable: true, filterable: true },
      { key: 'name', name: 'Name', type: 'text', sortable: true, filterable: true },
      { key: 'value', name: 'Value', type: 'number', sortable: true, filterable: false },
      { key: 'status', name: 'Status', type: 'text', sortable: true, filterable: true }
    ]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addColumn = () => {
    setFormData(prev => ({
      ...prev,
      columns: [
        ...prev.columns,
        { key: '', name: '', type: 'text', sortable: true, filterable: true }
      ]
    }));
  };

  const removeColumn = (index) => {
    if (formData.columns.length <= 1) return;
    
    setFormData(prev => ({
      ...prev,
      columns: prev.columns.filter((_, i) => i !== index)
    }));
  };

  const updateColumn = (index, field, value) => {
    const newColumns = [...formData.columns];
    newColumns[index][field] = value;
    setFormData(prev => ({ ...prev, columns: newColumns }));
  };

  const updateFormField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const columnTypes = [
    { value: 'text', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'date', label: 'Date' },
    { value: 'boolean', label: 'Boolean' },
    { value: 'currency', label: 'Currency' },
    { value: 'percentage', label: 'Percentage' }
  ];

  return (
    <div className="add-table-form">
      <div className="form-header">
        <div className="header-content">
          <Settings size={20} />
          <h3>Configure Table Widget</h3>
        </div>
        <p>Set up your data table with custom columns and settings</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-sections">
          {/* Basic Settings */}
          <Card className="form-section">
            <h4 className="section-title">Basic Settings</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Table Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateFormField('title', e.target.value)}
                  placeholder="Enter table title"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Data Source</label>
                <select
                  value={formData.dataSource}
                  onChange={(e) => updateFormField('dataSource', e.target.value)}
                >
                  <option value="mock">Mock Data</option>
                  <option value="api">API Endpoint</option>
                  <option value="static">Static Data</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormField('description', e.target.value)}
                placeholder="Optional description for your table"
                rows="3"
              />
            </div>
          </Card>

          {/* Column Configuration */}
          <Card className="form-section">
            <div className="section-header">
              <h4 className="section-title">Columns Configuration</h4>
              <Button
                type="button"
                variant="outline"
                icon={<Plus size={14} />}
                onClick={addColumn}
                className="add-column-btn"
              >
                Add Column
              </Button>
            </div>
            
            <div className="columns-list">
              {formData.columns.map((column, index) => (
                <div key={index} className="column-item">
                  <div className="column-header">
                    <span className="column-number">Column {index + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      icon={<Trash2 size={14} />}
                      onClick={() => removeColumn(index)}
                      disabled={formData.columns.length <= 1}
                      className="remove-column-btn"
                      title="Remove column"
                    />
                  </div>
                  
                  <div className="column-fields">
                    <div className="form-group">
                      <label>Key *</label>
                      <input
                        type="text"
                        value={column.key}
                        onChange={(e) => updateColumn(index, 'key', e.target.value)}
                        placeholder="e.g., id, name, value"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Display Name *</label>
                      <input
                        type="text"
                        value={column.name}
                        onChange={(e) => updateColumn(index, 'name', e.target.value)}
                        placeholder="e.g., ID, Name, Value"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Data Type</label>
                      <select
                        value={column.type}
                        onChange={(e) => updateColumn(index, 'type', e.target.value)}
                      >
                        {columnTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="column-options">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={column.sortable}
                          onChange={(e) => updateColumn(index, 'sortable', e.target.checked)}
                        />
                        <span>Sortable</span>
                      </label>
                      
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={column.filterable}
                          onChange={(e) => updateColumn(index, 'filterable', e.target.checked)}
                        />
                        <span>Filterable</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="form-actions">
          <Button
            type="button"
            variant="outline"
            icon={<X size={16} />}
            onClick={onCancel}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            icon={<Save size={16} />}
          >
            Create Table Widget
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddTableForm;