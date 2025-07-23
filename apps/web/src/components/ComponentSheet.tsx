'use client';

import { useState, useMemo } from 'react';
import { ComponentCategoryType, Component } from '@kinben/shared-types';
import { ComponentDataManager } from '@kinben/data-model';

interface ComponentSheetProps {
  category: ComponentCategoryType;
  title: string;
  dataManager: ComponentDataManager;
}

interface ComponentFilters {
  search: string;
  manufacturer: string;
  status: string;
  package: string;
}

export function ComponentSheet({ category, title, dataManager }: ComponentSheetProps) {
  const [filters, setFilters] = useState<ComponentFilters>({
    search: '',
    manufacturer: '',
    status: '',
    package: '',
  });

  const components = dataManager.getComponentsByCategory(category);
  
  const filteredComponents = useMemo(() => {
    return components.filter(component => {
      const matchesSearch = !filters.search || 
        component.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        component.kpn.toLowerCase().includes(filters.search.toLowerCase()) ||
        component.description.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesManufacturer = !filters.manufacturer || 
        (component.manufacturer && component.manufacturer.toLowerCase().includes(filters.manufacturer.toLowerCase()));
      
      const matchesStatus = !filters.status || 
        component.status.toLowerCase() === filters.status;
      
      const matchesPackage = !filters.package || 
        (component.package && component.package.toLowerCase().includes(filters.package.toLowerCase()));
      
      return matchesSearch && matchesManufacturer && matchesStatus && matchesPackage;
    });
  }, [components, filters]);

  const handleFilterChange = (field: keyof ComponentFilters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      manufacturer: '',
      status: '',
      package: '',
    });
  };

  const getTableHeaders = () => {
    switch (category) {
      case 'capacitors':
        return [
          'Kinben PN', 'Value', 'Voltage Rating', 'Tolerance', 'Package',
          'Mounting', 'Temperature Range', 'Manufacturer', 'Manufacturer PN',
          'Description', 'Preferred Supplier', 'Mouser PN', 'DigiKey PN',
          'Unit Cost', 'MOQ', 'Status', 'Symbol File', 'Footprint File',
          '3D Model File', 'Notes'
        ];
      case 'resistors':
        return [
          'Kinben PN', 'Value', 'Power Rating', 'Tolerance', 'Package',
          'Mounting', 'Temperature Range', 'Manufacturer', 'Manufacturer PN',
          'Description', 'Preferred Supplier', 'Mouser PN', 'DigiKey PN',
          'Unit Cost', 'MOQ', 'Status', 'Symbol File', 'Footprint File',
          '3D Model File', 'Notes'
        ];
      default:
        return [
          'Kinben PN', 'Name', 'Value', 'Package', 'Manufacturer', 'Manufacturer PN',
          'Description', 'Status', 'Date Added', 'Notes'
        ];
    }
  };

  const renderComponentRow = (component: Component) => {
    const headers = getTableHeaders();
    
    return (
      <tr key={component.id}>
        <td>{component.kpn}</td>
        <td>{component.value || '-'}</td>
        {category === 'capacitors' && (
          <>
            <td>{component.voltage || '-'}</td>
            <td>{component.tolerance || '-'}</td>
            <td>{component.package || '-'}</td>
            <td>SMT</td>
            <td>-40°C to +85°C</td>
            <td>{component.manufacturer || '-'}</td>
            <td>{component.partNumber || '-'}</td>
            <td>{component.description}</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td className={`status-${component.status.toLowerCase()}`}>
              {component.status}
            </td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>{component.notes || '-'}</td>
          </>
        )}
        {category === 'resistors' && (
          <>
            <td>1/4W</td>
            <td>{component.tolerance || '-'}</td>
            <td>{component.package || '-'}</td>
            <td>SMT</td>
            <td>-40°C to +85°C</td>
            <td>{component.manufacturer || '-'}</td>
            <td>{component.partNumber || '-'}</td>
            <td>{component.description}</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td className={`status-${component.status.toLowerCase()}`}>
              {component.status}
            </td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>{component.notes || '-'}</td>
          </>
        )}
        {category !== 'capacitors' && category !== 'resistors' && (
          <>
            <td>{component.name}</td>
            <td>{component.package || '-'}</td>
            <td>{component.manufacturer || '-'}</td>
            <td>{component.partNumber || '-'}</td>
            <td>{component.description}</td>
            <td className={`status-${component.status.toLowerCase()}`}>
              {component.status}
            </td>
            <td>{component.dateAdded}</td>
            <td>{component.notes || '-'}</td>
          </>
        )}
      </tr>
    );
  };

  return (
    <div className="sheet active">
      <div className="section-header">{title}</div>
      
      <div className="action-buttons">
        <button className="btn btn-primary">
          ➕ Add {category.charAt(0).toUpperCase() + category.slice(1, -1)}
        </button>
        <button className="btn btn-success">📄 Export CSV</button>
        <button className="btn btn-info">📊 Export JSON</button>
      </div>

      {/* Category Filters */}
      <div className="category-filters">
        <h4 className="text-lg font-semibold mb-4">
          🔍 Filter {category.charAt(0).toUpperCase() + category.slice(1)}
        </h4>
        <div className="filter-grid">
          <div className="filter-group">
            <label>Search</label>
            <input
              type="text"
              className="filter-input"
              placeholder={`Search ${category}...`}
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>Manufacturer</label>
            <input
              type="text"
              className="filter-input"
              placeholder="e.g. Murata, Samsung..."
              value={filters.manufacturer}
              onChange={(e) => handleFilterChange('manufacturer', e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>Status</label>
            <select
              className="filter-select"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="development">Development</option>
              <option value="obsolete">Obsolete</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Package</label>
            <input
              type="text"
              className="filter-input"
              placeholder="e.g. 0603, SOIC-8..."
              value={filters.package}
              onChange={(e) => handleFilterChange('package', e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <button className="btn btn-warning text-sm px-4 py-2" onClick={clearFilters}>
            🔄 Clear
          </button>
          <div className="text-sm text-gray-600">
            Showing {filteredComponents.length} of {components.length} components
          </div>
        </div>
      </div>

      {/* Component Table */}
      <div className="overflow-x-auto">
        <table className="component-table">
          <thead>
            <tr>
              {getTableHeaders().map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredComponents.length > 0 ? (
              filteredComponents.map(renderComponentRow)
            ) : (
              <tr>
                <td colSpan={getTableHeaders().length} className="text-center text-gray-500 py-5">
                  {components.length === 0 
                    ? `No components added yet. Click "Add ${category.charAt(0).toUpperCase() + category.slice(1, -1)}" to get started!`
                    : 'No components match the current filters.'
                  }
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}