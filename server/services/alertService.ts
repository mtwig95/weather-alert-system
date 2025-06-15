import { Alert } from '../models/Alert';

export async function createAlert(data: {
    location: string;
    parameter: string;
    operator: string;
    threshold: number;
    description?: string;
    email: string;
}) {
    const alert = new Alert(data);
    return await alert.save();
}

export async function getAllAlerts() {
    return await Alert.find();
}

export async function deleteAlertById(id: string) {
    return await Alert.findByIdAndDelete(id);
}

export async function updateAlertById(id: string, data: {
    location: string;
    parameter: string;
    operator: string;
    threshold: number;
    description?: string;
    email: string;
}) {
    return await Alert.findByIdAndUpdate(id, data, { new: true });
}
