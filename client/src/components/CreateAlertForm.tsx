import React, { useState } from 'react';
import { StatusMessage } from './StatusMessage.tsx';
import { api } from '../services/api.ts';

type CreateAlertFormProps = {
    onAlertCreated: () => Promise<void>;
};

export const CreateAlertForm = ({ onAlertCreated }: CreateAlertFormProps) => {
    const [location, setLocation] = useState('');
    const [parameter, setParameter] = useState('temperature');
    const [operator, setOperator] = useState('>');
    const [threshold, setThreshold] = useState(0);
    const [description, setDescription] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        setError(null);

        try {
            const res = await api.createAlert(location, parameter, operator, threshold, description, email);
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to save alert');

            await onAlertCreated();
            setSuccess(true);
            setLocation('');
            setParameter('temperature');
            setOperator('>');
            setThreshold(0);
            setDescription('');
            setEmail('');
        } catch (err: any) {
            setError(err.message || 'Unexpected error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="text-text font-sans">
            <h2 className="text-2xl font-bold mb-6 text-center">⚠️ Create New Alert</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Tel Aviv"
                        required
                        className="w-full bg-[#1A2233] text-text placeholder-gray-500 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email for notifications</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="w-full bg-[#1A2233] text-text placeholder-gray-500 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Parameter</label>
                    <select
                        value={parameter}
                        onChange={(e) => setParameter(e.target.value)}
                        className="w-full bg-[#1A2233] text-text px-4 py-2 rounded-lg shadow-sm focus:outline-none"
                    >
                        <option value="temperature">🌡️ Temperature</option>
                        <option value="windSpeed">🌬️ Wind Speed</option>
                        <option value="precipitation">🌧️ Precipitation</option>
                    </select>
                </div>

                <div className="flex gap-4">
                    <div className="w-1/3">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Operator</label>
                        <select
                            value={operator}
                            onChange={(e) => setOperator(e.target.value)}
                            className="w-full bg-[#1A2233] text-text px-3 py-2 rounded-lg shadow-sm focus:outline-none"
                        >
                            <option value=">">&gt;</option>
                            <option value="<">&lt;</option>
                        </select>
                    </div>

                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Threshold</label>
                        <input
                            type="number"
                            value={threshold}
                            onChange={(e) => setThreshold(Number(e.target.value))}
                            required
                            className="w-full bg-[#1A2233] text-text px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Description (optional)</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="e.g. Hot day alert"
                        className="w-full bg-[#1A2233] text-text placeholder-gray-500 px-4 py-2 rounded-lg shadow-sm focus:outline-none"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-text font-semibold px-6 py-3 ounded-2xl shadow-lg transition"
                >
                    Save Alert
                </button>
            </form>

            <div className="mt-4">
                {loading && <StatusMessage message="Saving alert..." type="loading" withSpinner />}
                {error && <StatusMessage message={error} type="error" />}
                {success && <StatusMessage message="✅ Alert saved!" type="success" />}
            </div>
        </div>
    );
};
