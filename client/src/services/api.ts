const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = {
  getWeather: async (location: string) => {
    const res = await fetch(`${BASE_URL}/weather?location=${encodeURIComponent(location)}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to fetch weather');
    }
    return res.json();
  },

  getAlerts: async () => {
    const res = await fetch(`${BASE_URL}/alerts`);
    if (!res.ok) throw new Error('Failed to fetch alerts');
    return res.json();
  },

  createAlert: async (
    location: string,
    parameter: string,
    operator: string,
    threshold: number,
    description: string,
    email: string,
  ) => {
    const res = await fetch(`${BASE_URL}/alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location,
        parameter,
        operator,
        threshold: Number(threshold),
        description,
        email,
      }),
    });
    if (!res.ok) throw new Error('Failed to create alert');
    return res;
  },

  deleteAlert: async (id: string) => {
    const res = await fetch(`${BASE_URL}/alerts/${id}`, {
      method: 'DELETE',
    });
    if (res.status !== 204) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to delete alert');
    }
  },

  updateAlert: async (updatedAlert: any) => {
    const res = await fetch(`${BASE_URL}/alerts/${updatedAlert._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedAlert),
    });
    if (!res.ok) throw new Error('Failed to update alert');
    return res.json();
  },
};
