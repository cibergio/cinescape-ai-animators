export enum AppMode {
  CREATE = 'CREATE',
  EXPAND = 'EXPAND'
}

export interface ResolutionOption {
  id: string;
  width: number;
  height: number;
  label: string;
  description: string;
}

export const RESOLUTION_OPTIONS: ResolutionOption[] = [
  { 
    id: 'base', 
    width: 5100, 
    height: 3000, 
    label: 'Base Standard', 
    description: 'Standard Animation Background (5100 x 3000)' 
  },
  { 
    id: 'pan_sm', 
    width: 5650, 
    height: 3000, 
    label: 'Panning Extension (Small)', 
    description: 'Slight horizontal expansion (5650 x 3000)' 
  },
  { 
    id: 'pan_md', 
    width: 5700, 
    height: 3000, 
    label: 'Panning Extension (Medium)', 
    description: 'Medium horizontal expansion (5700 x 3000)' 
  },
  { 
    id: 'pan_lg', 
    width: 6000, 
    height: 3000, 
    label: 'Wide Panoramic', 
    description: 'Large horizontal expansion (6000 x 3000)' 
  },
];

export interface GenerationResult {
  imageUrl: string;
  prompt: string;
}