import {useEffect, useState} from 'react';
import type {Alert} from '../types/alert';
import {api} from "../services/api.ts";

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

        const interval = setInterval(() => {
            fetchAlerts();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    if (loading) return <div>Loading current state...</div>;
    console.log('alerts',alerts);
    if (!alerts || alerts.length === 0) return null;

    const triggeredAlerts = alerts.filter(alert => alert.status === 'triggered');

    return (<div className="p-4">
            <h1 className="text-xl font-bold mb-4">🌦️ Current Alert State</h1>
            {triggeredAlerts.length === 0 ? (<div className="bg-green-100 text-green-800 p-4 rounded shadow">
                    ✅ All Clear – No active alerts!
                </div>) : (<div className="space-y-3">
                    {triggeredAlerts.map(alert => (<div key={alert._id} className="p-4 bg-red-100 rounded shadow">
                            <p><strong>📍 {alert.location}</strong></p>
                            <p>{alert.parameter} {alert.operator} {alert.threshold}</p>
                            {alert.lastChecked && (<p className="text-sm text-gray-600">
                                    Last checked: {new Date(alert.lastChecked).toLocaleString()}
                                </p>)}
                        </div>))}
                </div>)}
        </div>);
};
