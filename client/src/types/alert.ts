export type Alert = {
    _id: string;
    location: string;
    parameter: string;
    operator: '>' | '<';
    threshold: number;
    description: string;
    createdAt: string;
};
