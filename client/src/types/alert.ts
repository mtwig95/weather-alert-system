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
    lastNotified: string;
};

//todo remove model
export type NewAlert = {
    location: string;
    parameter: 'temperature' | 'windSpeed' | 'precipitation';
    operator: '>' | '<';
    threshold: number;
    description: string;
};
