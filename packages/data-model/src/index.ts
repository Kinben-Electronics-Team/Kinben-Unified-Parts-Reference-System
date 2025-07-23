import type {
  Component,
  ComponentData,
  ComponentCategoryType,
  Assembly,
  System,
  Part3D,
  Cable,
  SystemData,
  Stats,
  SearchFilters,
  SortOptions
} from '@kinben/shared-types';

/**
 * Component data management
 */
export class ComponentDataManager {
  private data: ComponentData;

  constructor(initialData?: ComponentData) {
    this.data = {
      capacitors: [],
      resistors: [],
      inductors: [],
      diodes: [],
      transistors: [],
      ics: [],
      connectors: [],
      crystals: [],
      fuses: [],
      switches: [],
      relays: [],
      optocouplers: [],
      sensors: [],
      mechanical: [],
      hardware: [],
      cables: [],
      ...initialData
    };
  }

  /**
   * Get all components in a category
   */
  getComponentsByCategory(category: ComponentCategoryType): Component[] {
    return this.data[category] || [];
  }

  /**
   * Get all components across all categories
   */
  getAllComponents(): Component[] {
    return Object.values(this.data).flat();
  }

  /**
   * Add component to category
   */
  addComponent(category: ComponentCategoryType, component: Component): void {
    if (!this.data[category]) {
      this.data[category] = [];
    }
    this.data[category].push(component);
  }

  /**
   * Update component
   */
  updateComponent(category: ComponentCategoryType, id: number, updates: Partial<Component>): boolean {
    if (category === '__proto__' || category === 'constructor' || category === 'prototype') {
      throw new Error('Invalid category key');
    }

    const components = this.data[category];
    if (!components) return false;

    const index = components.findIndex(c => c.id === id);
    if (index === -1) return false;

    components[index] = { ...components[index], ...updates };
    return true;
  }

  /**
   * Delete component
   */
  deleteComponent(category: ComponentCategoryType, id: number): boolean {
    const components = this.data[category];
    if (!components) return false;

    const index = components.findIndex(c => c.id === id);
    if (index === -1) return false;

    components.splice(index, 1);
    return true;
  }

  /**
   * Search components
   */
  searchComponents(filters: SearchFilters): Component[] {
    let components = this.getAllComponents();

    if (filters.category) {
      components = this.getComponentsByCategory(filters.category);
    }

    if (filters.query) {
      const query = filters.query.toLowerCase();
      components = components.filter(c => 
        c.name.toLowerCase().includes(query) ||
        c.kpn.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        (c.manufacturer && c.manufacturer.toLowerCase().includes(query)) ||
        (c.partNumber && c.partNumber.toLowerCase().includes(query))
      );
    }

    if (filters.status) {
      components = components.filter(c => c.status === filters.status);
    }

    if (filters.manufacturer) {
      components = components.filter(c => c.manufacturer === filters.manufacturer);
    }

    return components;
  }

  /**
   * Sort components
   */
  sortComponents(components: Component[], options: SortOptions): Component[] {
    return [...components].sort((a, b) => {
      let aValue: string;
      let bValue: string;

      switch (options.field) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'kpn':
          aValue = a.kpn;
          bValue = b.kpn;
          break;
        case 'dateAdded':
          aValue = a.dateAdded;
          bValue = b.dateAdded;
          break;
        case 'manufacturer':
          aValue = a.manufacturer || '';
          bValue = b.manufacturer || '';
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      const comparison = aValue.localeCompare(bValue);
      return options.direction === 'desc' ? -comparison : comparison;
    });
  }

  /**
   * Get statistics
   */
  getStats(): Stats {
    const components = this.getAllComponents();
    const componentsByCategory: Record<ComponentCategoryType, number> = {
      capacitors: this.data.capacitors.length,
      resistors: this.data.resistors.length,
      inductors: this.data.inductors.length,
      diodes: this.data.diodes.length,
      transistors: this.data.transistors.length,
      ics: this.data.ics.length,
      connectors: this.data.connectors.length,
      crystals: this.data.crystals.length,
      fuses: this.data.fuses.length,
      switches: this.data.switches.length,
      relays: this.data.relays.length,
      optocouplers: this.data.optocouplers.length,
      sensors: this.data.sensors.length,
      mechanical: this.data.mechanical.length,
      hardware: this.data.hardware.length,
      cables: this.data.cables.length,
    };

    return {
      totalComponents: components.length,
      totalAssemblies: 0, // Will be populated by SystemDataManager
      totalSystems: 0,    // Will be populated by SystemDataManager
      total3DParts: 0,    // Will be populated by SystemDataManager
      totalCables: 0,     // Will be populated by SystemDataManager
      componentsByCategory
    };
  }

  /**
   * Get all data
   */
  getData(): ComponentData {
    return { ...this.data };
  }

  /**
   * Set data
   */
  setData(data: ComponentData): void {
    this.data = data;
  }
}

/**
 * System data management
 */
export class SystemDataManager {
  private data: SystemData;

  constructor(initialData?: SystemData) {
    this.data = {
      systems: [],
      assemblies: [],
      parts3D: [],
      cables: [],
      components: [],
      ...initialData
    };
  }

  /**
   * Get all systems
   */
  getSystems(): System[] {
    return this.data.systems;
  }

  /**
   * Get all assemblies
   */
  getAssemblies(): Assembly[] {
    return this.data.assemblies;
  }

  /**
   * Get all 3D parts
   */
  get3DParts(): Part3D[] {
    return this.data.parts3D;
  }

  /**
   * Get all cables
   */
  getCables(): Cable[] {
    return this.data.cables;
  }

  /**
   * Add system
   */
  addSystem(system: System): void {
    this.data.systems.push(system);
  }

  /**
   * Add assembly
   */
  addAssembly(assembly: Assembly): void {
    this.data.assemblies.push(assembly);
  }

  /**
   * Get statistics
   */
  getStats(): Omit<Stats, 'componentsByCategory'> {
    return {
      totalComponents: this.data.components.length,
      totalAssemblies: this.data.assemblies.length,
      totalSystems: this.data.systems.length,
      total3DParts: this.data.parts3D.length,
      totalCables: this.data.cables.length,
    };
  }

  /**
   * Get data
   */
  getData(): SystemData {
    return { ...this.data };
  }

  /**
   * Set data
   */
  setData(data: SystemData): void {
    this.data = data;
  }
}

/**
 * Main data manager combining both component and system data
 */
export class DataManager {
  public components: ComponentDataManager;
  public systems: SystemDataManager;

  constructor(componentData?: ComponentData, systemData?: SystemData) {
    this.components = new ComponentDataManager(componentData);
    this.systems = new SystemDataManager(systemData);
  }

  /**
   * Get combined statistics
   */
  getStats(): Stats {
    const componentStats = this.components.getStats();
    const systemStats = this.systems.getStats();

    return {
      ...componentStats,
      ...systemStats
    };
  }

  /**
   * Search across all data types
   */
  globalSearch(query: string) {
    const lowerQuery = query.toLowerCase();
    
    return {
      components: this.components.searchComponents({ query }),
      systems: this.systems.getSystems().filter(s => 
        s.name.toLowerCase().includes(lowerQuery) ||
        s.systemKN.toLowerCase().includes(lowerQuery) ||
        s.description.toLowerCase().includes(lowerQuery)
      ),
      assemblies: this.systems.getAssemblies().filter(a =>
        a.name.toLowerCase().includes(lowerQuery) ||
        a.assemblyKN.toLowerCase().includes(lowerQuery) ||
        a.description.toLowerCase().includes(lowerQuery)
      )
    };
  }
}

// Export singleton instance for simple usage
export const dataManager = new DataManager();