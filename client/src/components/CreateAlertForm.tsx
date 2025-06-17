import React, { useEffect, useState } from 'react';
import { StatusMessage } from './StatusMessage';

type Mode = 'create' | 'edit';

export type AlertFormData = {
  location: string;
  email: string;
  parameter: 'temperature' | 'windSpeed' | 'precipitation';
  operator: '>' | '<';
  threshold: number;
  description?: string;
};

type CreateOrEditAlertFormProps = {
  mode: Mode;
  onSubmit: (data: AlertFormData) => Promise<void>;
  initialData?: Partial<AlertFormData>;
};

export const CreateOrEditAlertForm = ({
  mode,
  onSubmit,
  initialData = {},
}: CreateOrEditAlertFormProps) => {
  const [location, setLocation] = useState('');
  const [parameter, setParameter] = useState<'temperature' | 'windSpeed' | 'precipitation'>(
    'temperature',
  );
  const [operator, setOperator] = useState<'>' | '<'>('>');
  const [threshold, setThreshold] = useState(0);
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setLocation(initialData.location || '');
      setParameter(initialData.parameter || 'temperature');
      setOperator(initialData.operator || '>');
      setThreshold(initialData.threshold ?? 0);
      setDescription(initialData.description || '');
      setEmail(initialData.email || '');
    }
  }, [mode, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit({ location, parameter, operator, threshold, description, email });
    } catch (err: any) {
      setError(err.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-text">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="location">
          Location
        </label>
        <input
          id="location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="w-full bg-[#1A2233] text-text px-4 py-2 rounded-lg shadow-sm focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="email">
          Email for notifications
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-[#1A2233] text-text px-4 py-2 rounded-lg shadow-sm focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="parameter">
          Parameter
        </label>
        <select
          id="parameter"
          value={parameter}
          onChange={(e) => setParameter(e.target.value as any)}
          className="w-full bg-[#1A2233] text-text px-4 py-2 rounded-lg"
        >
          <option value="temperature">🌡️ Temperature</option>
          <option value="windSpeed">🌬️ Wind Speed</option>
          <option value="precipitation">🌧️ Precipitation</option>
        </select>
      </div>

      <div className="flex gap-4">
        <div className="w-1/3">
          <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="operator">
            Operator
          </label>
          <select
            id="operator"
            value={operator}
            onChange={(e) => setOperator(e.target.value as any)}
            className="w-full bg-[#1A2233] text-text px-3 py-2 rounded-lg"
          >
            <option value=">">&gt;</option>
            <option value="<">&lt;</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="threshold">
            Threshold
          </label>
          <input
            id="threshold"
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            required
            className="w-full bg-[#1A2233] text-text px-4 py-2 rounded-lg"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="description">
          Description (optional)
        </label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-[#1A2233] text-text px-4 py-2 rounded-lg"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg"
      >
        {mode === 'edit' ? 'Update Alert' : 'Save Alert'}
      </button>

      {error && <StatusMessage message={error} type="error" />}
      {loading && <StatusMessage message="Saving alert..." type="loading" withSpinner />}
    </form>
  );
};
