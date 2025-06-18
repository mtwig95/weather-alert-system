export type Alert = {
  _id: string;
  location: string;
  parameter: string;
  operator: '>' | '<';
  threshold: number;
  description: string;
  status: 'triggered' | 'not_triggered';
  lastChecked: string | null;
  createdAt: string;
  email: string;
  lastNotified: string | null;
};
