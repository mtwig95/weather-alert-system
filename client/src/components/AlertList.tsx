import {StatusMessage} from "./StatusMessage.tsx";
import type {Alert} from "../types/alert";

type AlertListProps = {
    alerts: Alert[]; loading: boolean; setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>;
};

export const AlertList = ({alerts, loading, setAlerts}: AlertListProps) => {
    const handleDelete = async (id: string) => {
        const confirmDelete = confirm("Are you sure you want to delete this alert?");
        if (!confirmDelete) return;

        try {
            const res = await fetch(`http://localhost:3000/alerts/${id}`, {
                method: 'DELETE',
            });

            if (res.status === 204) {
                setAlerts(prev => prev.filter(a => a._id !== id));
            } else {
                const data = await res.json();
                alert(data.error || "Failed to delete alert");
            }
        } catch (err) {
            alert("Failed to delete alert");
        }
    };



    return (<div className="max-w-3xl mx-auto px-4 py-6">
            <h2 className="text-2xl font-semibold mb-6">📋 Saved Alerts</h2>

            {loading && <StatusMessage message="Loading alerts..." type="loading" withSpinner/>}
            {!loading && alerts.length === 0 && (<p className="text-gray-500">No alerts saved yet.</p>)}

            <ul className="space-y-4">
                {alerts
                    .slice()
                    .reverse()
                    .map((alert) => (<li key={alert._id} className="border rounded-lg p-4 bg-white shadow-sm">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold text-lg">{alert.location}</h3>
                                <span className="text-sm text-gray-400">
                {new Date(alert.createdAt).toLocaleString('en-GB')}
              </span>
                            </div>
                            <p className="text-sm text-gray-700 mb-1">
                                🔍 Condition: <strong>{alert.parameter}</strong> {alert.operator} {alert.threshold}
                            </p>
                            {alert.description && (<p className="text-sm text-gray-700">
                                    📝 Description: <span className="italic">{alert.description}</span>
                                </p>)}

                            <button
                                onClick={() => handleDelete(alert._id)}
                                className="text-red-500 hover:text-red-700 text-sm"
                            >
                                🗑️ Delete
                            </button>
                        </li>))}
            </ul>
        </div>);
};
