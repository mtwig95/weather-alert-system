import { useState } from 'react';
import { StatusMessage } from './StatusMessage.tsx';
import type { Alert } from '../types/alert';
import { api } from '../services/api.ts';

type AlertListProps = {
    alerts: Alert[];
    loading: boolean;
    setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>;
};

export const AlertList = ({ alerts, loading, setAlerts }: AlertListProps) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Alert | null>(null);

    const handleDelete = async (id: string) => {
        const confirmDelete = confirm('Are you sure you want to delete this alert?');
        if (!confirmDelete) return;
        try {
            await api.deleteAlert(id);
            setAlerts((prev) => prev.filter((a) => a._id !== id));
        } catch (err) {
            alert('Failed to delete alert');
            console.error(err);
        }
    };

    const handleEdit = (alert: Alert) => {
        setEditingId(alert._id);
        setEditForm({ ...alert });
    };

    const handleUpdate = async () => {
        if (!editForm) return;
        try {
            const updated = await api.updateAlert(editForm);
            setAlerts((prev) => prev.map((a) => (a._id === updated._id ? updated : a)));
            setEditingId(null);
            setEditForm(null);
        } catch (err) {
            alert('Failed to update alert');
            console.error(err);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-text">📋 Saved Alerts</h2>

            {loading && <StatusMessage message="Loading alerts..." type="loading" withSpinner />}
            {!loading && alerts.length === 0 && (
                <p className="text-gray-400 text-sm">No alerts saved yet.</p>
            )}

            <ul className="space-y-4">
                {alerts
                    .slice()
                    .reverse()
                    .map((alert) =>
                            editingId === alert._id && editForm ? (
                                <li
                                    key={alert._id}
                                    className="bg-card p-4 rounded-lg shadow-md space-y-3 text-text"
                                >
                                    <input
                                        value={editForm.location}
                                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                        className="w-full bg-[#1A2233] px-3 py-2 rounded-lg text-text placeholder-gray-400 focus:outline-none"
                                    />
                                    <input
                                        type="email"
                                        value={editForm.email}
                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                        className="w-full bg-[#1A2233] px-3 py-2 rounded-lg text-text placeholder-gray-400 focus:outline-none"
                                    />
                                    <select
                                        value={editForm.parameter}
                                        onChange={(e) => setEditForm({ ...editForm, parameter: e.target.value })}
                                        className="w-full bg-[#1A2233] px-3 py-2 rounded-lg text-text"
                                    >
                                        <option value="temperature">🌡️ Temperature</option>
                                        <option value="windSpeed">🌬️ Wind Speed</option>
                                        <option value="precipitation">🌧️ Precipitation</option>
                                    </select>
                                    <div className="flex gap-4">
                                        <select
                                            value={editForm.operator}
                                            onChange={(e) =>
                                                setEditForm({ ...editForm, operator: e.target.value as '>' | '<' })
                                            }
                                            className="w-1/3 bg-[#1A2233] px-3 py-2 rounded-lg text-text"
                                        >
                                            <option value=">">&gt;</option>
                                            <option value="<">&lt;</option>
                                        </select>
                                        <input
                                            type="number"
                                            value={editForm.threshold}
                                            onChange={(e) =>
                                                setEditForm({ ...editForm, threshold: Number(e.target.value) })
                                            }
                                            className="flex-1 bg-[#1A2233] px-3 py-2 rounded-lg text-text"
                                        />
                                    </div>
                                    <input
                                        value={editForm.description}
                                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                        className="w-full bg-[#1A2233] px-3 py-2 rounded-lg text-text placeholder-gray-400"
                                    />
                                    <div className="flex justify-end gap-3 mt-2">
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="text-gray-400 hover:underline text-sm"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleUpdate}
                                            className="text-blue-400 hover:text-blue-600 font-semibold text-sm"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </li>
                            ) : (
                                <li
                                    key={alert._id}
                                    className="bg-card p-4 rounded-lg shadow-md text-text space-y-1"
                                >
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold text-lg">{alert.location}</h3>
                                        <span className="text-sm text-gray-400">
                    {new Date(alert.createdAt).toLocaleString('en-GB')}
                  </span>
                                    </div>

                                    <p className="text-sm text-gray-300">
                                        🔍 <span className="font-medium">Condition:</span>{' '}
                                        {alert.parameter} {alert.operator} {alert.threshold}
                                    </p>

                                    {alert.description && (
                                        <p className="text-sm text-gray-400 italic">
                                            📝 {alert.description}
                                        </p>
                                    )}

                                    <div className="flex gap-4 pt-2">
                                        <button
                                            onClick={() => handleEdit(alert)}
                                            className="text-blue-400 hover:text-blue-600 text-sm"
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(alert._id)}
                                            className="text-red-400 hover:text-red-600 text-sm"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </li>
                            )
                    )}
            </ul>
        </div>
    );
};
