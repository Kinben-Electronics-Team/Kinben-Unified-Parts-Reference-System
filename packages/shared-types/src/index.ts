import { z } from 'zod';

/**
 * Base component interface
 */
export const ComponentSchema = z.object({
  id: z.number(),
  kpn: z.string(), // Kinben Part Number
  name: z.string(),
  value: z.string().optional(),
  package: z.string().optional(),
  voltage: z.string().optional(),
  tolerance: z.string().optional(),
  manufacturer: z.string().optional(),
  partNumber: z.string().optional(),
  datasheet: z.string().optional(),
  description: z.string(),
  category: z.string(),
  files: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  dateAdded: z.string(),
  notes: z.string().optional(),
  status: z.enum(['Active', 'Obsolete', 'Development']).default('Active'),
});

export type Component = z.infer<typeof ComponentSchema>;

/**
 * Assembly component reference
 */
export const AssemblyComponentSchema = z.object({
  kpn: z.string(),
  name: z.string(),
  quantity: z.number(),
  refdes: z.string().optional(),
});

export type AssemblyComponent = z.infer<typeof AssemblyComponentSchema>;

/**
 * 3D printed part reference
 */
export const Part3DRefSchema = z.object({
  kn: z.string(),
  name: z.string(),
  quantity: z.number(),
});

export type Part3DRef = z.infer<typeof Part3DRefSchema>;

/**
 * Cable reference
 */
export const CableRefSchema = z.object({
  kn: z.string(),
  name: z.string(),
  quantity: z.number(),
});

export type CableRef = z.infer<typeof CableRefSchema>;

/**
 * Assembly interface
 */
export const AssemblySchema = z.object({
  id: z.number(),
  assemblyKN: z.string(),
  name: z.string(),
  type: z.enum(['PCBA', 'MECH', 'SENS', 'RF', 'PWR']),
  version: z.string(),
  status: z.enum(['Active', 'Obsolete', 'Development']).default('Active'),
  components: z.number(),
  description: z.string(),
  files: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  dateAdded: z.string(),
  assemblyComponents: z.array(AssemblyComponentSchema).default([]),
  assembly3DParts: z.array(Part3DRefSchema).default([]),
  assemblyCables: z.array(CableRefSchema).default([]),
});

export type Assembly = z.infer<typeof AssemblySchema>;

/**
 * System interface
 */
export const SystemSchema = z.object({
  id: z.number(),
  systemKN: z.string(),
  name: z.string(),
  type: z.enum(['PROD', 'PROTO', 'EVAL', 'DEV']),
  version: z.string(),
  status: z.enum(['Active', 'Obsolete', 'Development']).default('Active'),
  assemblies: z.number(),
  description: z.string(),
  owner: z.string(),
  files: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  dateAdded: z.string(),
  systemAssemblies: z.array(z.object({
    kn: z.string(),
    name: z.string(),
    quantity: z.number()
  })).default([]),
  systemComponents: z.array(AssemblyComponentSchema).default([]),
  system3DParts: z.array(Part3DRefSchema).default([]),
  systemCables: z.array(CableRefSchema).default([]),
});

export type System = z.infer<typeof SystemSchema>;

/**
 * 3D printed part interface
 */
export const Part3DSchema = z.object({
  id: z.number(),
  partKN: z.string(),
  name: z.string(),
  material: z.string().optional(),
  color: z.string().optional(),
  infill: z.string().optional(),
  printTime: z.string().optional(),
  description: z.string(),
  files: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  dateAdded: z.string(),
  status: z.enum(['Active', 'Obsolete', 'Development']).default('Active'),
});

export type Part3D = z.infer<typeof Part3DSchema>;

/**
 * Cable interface
 */
export const CableSchema = z.object({
  id: z.number(),
  cableKN: z.string(),
  name: z.string(),
  type: z.string().optional(),
  length: z.string().optional(),
  gauge: z.string().optional(),
  connectors: z.string().optional(),
  description: z.string(),
  files: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  dateAdded: z.string(),
  status: z.enum(['Active', 'Obsolete', 'Development']).default('Active'),
});

export type Cable = z.infer<typeof CableSchema>;

/**
 * Component categories
 */
export const ComponentCategory = z.enum([
  'capacitors',
  'resistors', 
  'inductors',
  'diodes',
  'transistors',
  'ics',
  'connectors',
  'crystals',
  'fuses',
  'switches',
  'relays',
  'optocouplers',
  'sensors',
  'mechanical',
  'hardware',
  'cables'
]);

export type ComponentCategoryType = z.infer<typeof ComponentCategory>;

/**
 * Component data structure
 */
export const ComponentDataSchema = z.object({
  capacitors: z.array(ComponentSchema).default([]),
  resistors: z.array(ComponentSchema).default([]),
  inductors: z.array(ComponentSchema).default([]),
  diodes: z.array(ComponentSchema).default([]),
  transistors: z.array(ComponentSchema).default([]),
  ics: z.array(ComponentSchema).default([]),
  connectors: z.array(ComponentSchema).default([]),
  crystals: z.array(ComponentSchema).default([]),
  fuses: z.array(ComponentSchema).default([]),
  switches: z.array(ComponentSchema).default([]),
  relays: z.array(ComponentSchema).default([]),
  optocouplers: z.array(ComponentSchema).default([]),
  sensors: z.array(ComponentSchema).default([]),
  mechanical: z.array(ComponentSchema).default([]),
  hardware: z.array(ComponentSchema).default([]),
  cables: z.array(ComponentSchema).default([]),
});

export type ComponentData = z.infer<typeof ComponentDataSchema>;

/**
 * System data structure
 */
export const SystemDataSchema = z.object({
  systems: z.array(SystemSchema).default([]),
  assemblies: z.array(AssemblySchema).default([]),
  parts3D: z.array(Part3DSchema).default([]),
  cables: z.array(CableSchema).default([]),
  components: z.array(ComponentSchema).default([]),
});

export type SystemData = z.infer<typeof SystemDataSchema>;

/**
 * Statistics interface
 */
export interface Stats {
  totalComponents: number;
  totalAssemblies: number;
  totalSystems: number;
  total3DParts: number;
  totalCables: number;
  componentsByCategory: Record<ComponentCategoryType, number>;
}

/**
 * Search and filter interfaces
 */
export interface SearchFilters {
  query: string;
  category?: ComponentCategoryType;
  status?: 'Active' | 'Obsolete' | 'Development';
  manufacturer?: string;
}

export interface SortOptions {
  field: 'name' | 'kpn' | 'dateAdded' | 'manufacturer';
  direction: 'asc' | 'desc';
}