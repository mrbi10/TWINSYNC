export type HealthState = 'healthy' | 'neutral' | 'needs-attention';

export type HabitType = 'hydration' | 'break' | 'mood';

export interface Activity {
  id: string;
  type: HabitType;
  timestamp: Date;
  value: number | string;
  icon: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

export interface AnalyticsData {
  date: string;
  hydration: number;
  focusHours: number;
  breaks: number;
}

export interface TwinCustomization {
  id: string;
  name: string;
  type: 'accessory' | 'background' | 'color';
  unlocked: boolean;
  icon: string;
}
