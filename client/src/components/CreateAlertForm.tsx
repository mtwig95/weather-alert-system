import React, {useState} from 'react';
import {StatusMessage} from "./StatusMessage.tsx";
import {api} from "../services/api.ts";

type CreateAlertFormProps = {
    onAlertCreated: () => Promise<void>;
};

export const CreateAlertForm = ({onAlertCreated}: CreateAlertFormProps) => {
    const [location, setLocation] = useState('');
    const [parameter, setParameter] = useState('temperature');
    const [operator, setOperator] = useState('>');
    const [threshold, setThreshold] = useState(0);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        setError(null);

        try {
            const res = await api.createAlert(location, parameter, operator, threshold, description);

            const data = await res.json();

            if (!res.ok) {
                // noinspection ExceptionCaughtLocallyJS
                throw new Error(data.error || 'Failed to save alert');
            }
            await onAlertCreated();
            setSuccess(true);
            setLocation('');
            setParameter('temperature');
            setOperator('>');
            setThreshold(0);
            setDescription('');
        } catch (err: any) {
            setError(err.message || 'Unexpected error');
        } finally {
            setLoading(false);
        }
    };

    return (<div className="max-w-2xl mx-auto px-4 py-6">
        <h2 className="text-xl font-semibold mb-4 text-center">⚠️ Create New Alert</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block mb-1 font-medium">Location</label>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Tel Aviv"
                    required
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">Parameter</label>
                <select
                    value={parameter}
                    onChange={(e) => setParameter(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none"
                >
                    <option value="temperature">🌡️ Temperature</option>
                    <option value="windSpeed">🌬️ Wind Speed</option>
                    <option value="precipitation">🌧️ Precipitation</option>
                </select>
            </div>

            <div className="flex gap-2">
                <div className="w-1/3">
                    <label className="block mb-1 font-medium">Operator</label>
                    <select
                        value={operator}
                        onChange={(e) => setOperator(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
                    >
                        <option value=">">&gt;</option>
                        <option value="<">&lt;</option>
                    </select>
                </div>

                <div className="flex-1">
                    <label className="block mb-1 font-medium">Threshold</label>
                    <input
                        type="number"
                        value={threshold}
                        onChange={(e) => setThreshold(Number(e.target.value))}
                        required
                        className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
            </div>

            <div>
                <label className="block mb-1 font-medium">Description (optional)</label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Hot day alert"
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none"
                />
            </div>

            <button
                type="submit"
                className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
            >
                Save Alert
            </button>
        </form>
        {loading && <StatusMessage message="Saving alert..." type="loading" withSpinner/>}
        {error && <StatusMessage message={error} type="error"/>}
        {success && <StatusMessage message="✅ Alert saved!" type="success"/>}
    </div>);
};
