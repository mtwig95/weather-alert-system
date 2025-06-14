import { useEffect, useState } from 'react';
import type { Alert } from '../types/alert';
import { api } from '../services/api.ts';

export const CurrentStatePage = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAlerts = async () => {
        try {
            const res = await api.getAlerts();
            setAlerts(res);
        } catch (err) {
            console.error('Failed to fetch alerts', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();
        const interval = setInterval(fetchAlerts, 10000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B1120] text-white flex items-center justify-center font-sans">
                <p>Loading current state...</p>
            </div>
        );
    }

    const triggeredAlerts = alerts.filter((alert) => alert.status === 'triggered');

    return (
        <div className="min-h-screen bg-[#0B1120] text-white px-6 py-10 font-sans">
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold text-center">🌦️ Current Alert State</h1>

                {triggeredAlerts.length === 0 ? (
                    <div className="bg-green-700/30 border border-green-500 text-green-300 p-6 rounded-lg shadow text-center">
                        ✅ All Clear – No active alerts!
                    </div>
                ) : (
                    <div className="space-y-4">
                        {triggeredAlerts.map((alert) => (
                            <div
                                key={alert._id}
                                className="bg-red-700/30 border border-red-500 p-5 rounded-lg shadow-md"
                            >
                                <p className="text-lg font-semibold">📍 {alert.location}</p>
                                <p className="text-sm text-red-300 mt-1">
                                    {alert.parameter} {alert.operator} {alert.threshold}
                                </p>
                                {alert.lastChecked && (
                                    <p className="text-xs text-gray-400 mt-2">
                                        ⏱ Last checked: {new Date(alert.lastChecked).toLocaleString()}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
