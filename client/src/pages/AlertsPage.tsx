import { useEffect, useState } from 'react';
import { CreateAlertForm } from '../components/CreateAlertForm.tsx';
import { AlertList } from '../components/AlertList.tsx';
import type { Alert } from '../types/alert';
import { api } from '../services/api.ts';

export const AlertsPage = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAlerts = async () => {
        try {
            setLoading(true);
            const data = await api.getAlerts();
            setAlerts(data);
        } catch (err) {
            console.error('Failed to load alerts', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();
    }, []);

    return (
        <div className="min-h-screen bg-[#0B1120] text-white px-4 py-10 font-sans">
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold text-center">🔔 Weather Alerts</h1>

                <div className="bg-[#1E2636] rounded-lg shadow-lg p-6">
                    <CreateAlertForm onAlertCreated={fetchAlerts} />
                </div>

                <div className="bg-[#1E2636] rounded-lg shadow-lg p-6">
                    <AlertList alerts={alerts} loading={loading} setAlerts={setAlerts} />
                </div>
            </div>
        </div>
    );
};
