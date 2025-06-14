import {useState} from "react";
import {StatusMessage} from "./StatusMessage.tsx";
import type {Alert} from "../types/alert";
import {api} from "../services/api.ts";

type AlertListProps = {
    alerts: Alert[]; loading: boolean; setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>;
};

export const AlertList = ({alerts, loading, setAlerts}: AlertListProps) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Alert | null>(null);

    const handleDelete = async (id: string) => {
        const confirmDelete = confirm("Are you sure you want to delete this alert?");
        if (!confirmDelete) return;

        try {
            await api.deleteAlert(id);
            setAlerts((prev) => prev.filter((a) => a._id !== id));
        } catch (err) {
            alert("Failed to delete alert");
            console.error(err);
        }
    };

    const handleEdit = (alert: Alert) => {
        setEditingId(alert._id);
        setEditForm({...alert});
    };

    const handleUpdate = async () => {
        if (!editForm) return;

        try {
            const updated = await api.updateAlert(editForm);
            setAlerts((prev) => prev.map((a) => (a._id === updated._id ? updated : a)));
            setEditingId(null);
            setEditForm(null);
        } catch (err) {
            alert("Failed to update alert");
            console.error(err);
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
                .map((alert) => editingId === alert._id && editForm ? (
                    <li key={alert._id} className="border rounded-lg p-4 bg-gray-50 shadow-sm space-y-2">
                        <input
                            value={editForm.location}
                            onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                            className="w-full border p-2 rounded"
                        />
                        <select
                            value={editForm.parameter}
                            onChange={(e) => setEditForm({...editForm, parameter: e.target.value})}
                            className="w-full border p-2 rounded"
                        >
                            <option value="temperature">🌡️ Temperature</option>
                            <option value="windSpeed">🌬️ Wind Speed</option>
                            <option value="precipitation">🌧️ Precipitation</option>
                        </select>
                        <select
                            value={editForm.operator}
                            onChange={(e) => setEditForm({...editForm, operator: e.target.value as '>' | '<'})}
                            className="w-full border p-2 rounded"
                        >
                            <option value="<">{">"}</option>
                            <option value="<">{"<"}</option>
                        </select>
                        <input
                            type="number"
                            value={editForm.threshold}
                            onChange={(e) => setEditForm({...editForm, threshold: Number(e.target.value)})}
                            className="w-full border p-2 rounded"
                        />
                        <input
                            value={editForm.description}
                            onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                            className="w-full border p-2 rounded"
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setEditingId(null)} className="text-gray-500">
                                Cancel
                            </button>
                            <button onClick={handleUpdate} className="text-blue-600 font-semibold">
                                Save
                            </button>
                        </div>
                    </li>) : (<li key={alert._id} className="border rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-lg">{alert.location}</h3>
                        <span className="text-sm text-gray-400">
                    {new Date(alert.createdAt).toLocaleString("en-GB")}
                  </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">
                        🔍 Condition: <strong>{alert.parameter}</strong> {alert.operator}{" "}
                        {alert.threshold}
                    </p>
                    {alert.description && (<p className="text-sm text-gray-700">
                        📝 Description: <span className="italic">{alert.description}</span>
                    </p>)}
                    <div className="flex gap-3 mt-2">
                        <button
                            onClick={() => handleEdit(alert)}
                            className="text-blue-500 hover:text-blue-700 text-sm"
                        >
                            ✏️ Edit
                        </button>
                        <button
                            onClick={() => handleDelete(alert._id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                        >
                            🗑️ Delete
                        </button>
                    </div>
                </li>))}
        </ul>
    </div>);
};
