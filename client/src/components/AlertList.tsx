import { StatusMessage } from "./StatusMessage.tsx";
import type { Alert } from "../types/alert";

type AlertListProps = {
    alerts: Alert[];
    loading: boolean;
};

export const AlertList = ({ alerts, loading }: AlertListProps) => {
    return (
        <div className="max-w-3xl mx-auto px-4 py-6">
            <h2 className="text-2xl font-semibold mb-6">📋 Saved Alerts</h2>

            {loading && <StatusMessage message="Loading alerts..." type="loading" withSpinner />}
            {!loading && alerts.length === 0 && (
                <p className="text-gray-500">No alerts saved yet.</p>
            )}

            <ul className="space-y-4">
                {alerts
                    .slice()
                    .reverse()
                    .map((alert) => (
                    <li key={alert._id} className="border rounded-lg p-4 bg-white shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold text-lg">{alert.location}</h3>
                            <span className="text-sm text-gray-400">
                {new Date(alert.createdAt).toLocaleString('en-GB')}
              </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-1">
                            🔍 Condition: <strong>{alert.parameter}</strong> {alert.operator} {alert.threshold}
                        </p>
                        {alert.description && (
                            <p className="text-sm text-gray-700">
                                📝 Description: <span className="italic">{alert.description}</span>
                            </p>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};
