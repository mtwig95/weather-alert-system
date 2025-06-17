import { useState } from 'react';
import { StatusMessage } from './StatusMessage.tsx';
import type { Alert } from '../types/alert';
import { api } from '../services/api.ts';
import { type AlertFormData, CreateOrEditAlertForm } from './CreateAlertForm.tsx';

type AlertListProps = {
  alerts: Alert[];
  loading: boolean;
  setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>;
  error?: string | null;
};

export const AlertList = ({ alerts, loading, setAlerts, error }: AlertListProps) => {
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

  const handleUpdate = async (data: AlertFormData) => {
    if (!editingId) return;
    try {
      const updatedAlert: Alert = {
        _id: editingId,
        ...data,
        status: 'not_triggered',
        lastChecked: null,
        createdAt: new Date().toISOString(),
        lastNotified: null,
        description: data.description ?? '',
      };
      const updated = await api.updateAlert(updatedAlert);
      setAlerts((prev) => prev.map((a) => (a._id === updated._id ? updated : a)));
      setEditingId(null);
      setEditForm(null);
    } catch (err) {
      alert('Failed to update alert');
      console.error(err);
    }
  };

  const alertToFormData = (alert: Alert): AlertFormData => ({
    location: alert.location,
    email: alert.email,
    parameter: alert.parameter as 'temperature' | 'windSpeed' | 'precipitation',
    operator: alert.operator as '>' | '<',
    threshold: alert.threshold,
    description: alert.description,
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-text">📋 Saved Alerts</h2>

      {error && <StatusMessage message={error} type="error" />}

      {loading && <StatusMessage message="Loading alerts..." type="loading" withSpinner />}

      {!loading && !error && alerts.length === 0 && (
        <p className="text-gray-400 text-sm">No alerts saved yet.</p>
      )}

      <ul className="space-y-4">
        {alerts
          .slice()
          .reverse()
          .map((alert) =>
            editingId === alert._id && editForm ? (
              <li key={alert._id} className="bg-card p-4 rounded-lg shadow-md space-y-3 text-text">
                <CreateOrEditAlertForm
                  mode="edit"
                  initialData={alertToFormData(alert)}
                  onSubmit={handleUpdate}
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-gray-400 hover:underline text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </li>
            ) : (
              <li key={alert._id} className="bg-card p-4 rounded-lg shadow-md text-text space-y-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">{alert.location}</h3>
                  <span className="text-sm text-gray-400">
                    {new Date(alert.createdAt).toLocaleString('en-GB')}
                  </span>
                </div>

                <p className="text-sm text-gray-300">
                  🔍 <span className="font-medium">Condition:</span> {alert.parameter}{' '}
                  {alert.operator} {alert.threshold}
                </p>

                {alert.description && (
                  <p className="text-sm text-gray-400 italic">📝 {alert.description}</p>
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
            ),
          )}
      </ul>
    </div>
  );
};
