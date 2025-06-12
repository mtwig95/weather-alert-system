import { useState, useEffect } from "react";
import { CreateAlertForm } from "../components/CreateAlertForm.tsx";
import { AlertList } from "../components/AlertList.tsx";
import type {Alert} from "../types/alert";

export const AlertsPage = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAlerts = async () => {
        try {
            setLoading(true);
            const res = await fetch("http://localhost:3000/alerts");
            const data = await res.json();
            setAlerts(data);
        } catch (err) {
            console.error("Failed to load alerts", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();
    }, []);

    return (
        <div className="max-w-3xl mx-auto px-4 space-y-6">
            <CreateAlertForm onAlertCreated={fetchAlerts} />
            <AlertList alerts={alerts} loading={loading} />
        </div>
    );
};
