import { Document } from 'mongoose';

export interface AlertDoc extends Document {
  location: string;
  parameter: 'temperature' | 'windSpeed' | 'precipitation';
  operator: '>' | '<';
  threshold: number;
  description?: string;
  createdAt: Date;
  status?: 'triggered' | 'not_triggered';
  email: string;
  lastChecked: Date | null;
  lastNotified: Date | null;
}
