const BASE_URL = "https://weather-alert-system.onrender.com";
// const BASE_URL = "http://localhost:3000";
//fixme structure
export const api = {
    getAlerts: async () => {
        const res = await fetch(`${BASE_URL}/alerts`);
        if (!res.ok) throw new Error("Failed to fetch alerts");
        return res.json();
    },

    createAlert: async (location: string, parameter: string, operator: string, threshold: number, description: string, email: string) => {
        // todo: remove threshold: Number(threshold)?, add parameter as 'temperature' | 'windSpeed' | 'precipitation' , add operator as '>' | '<'
        const res = await fetch(`${BASE_URL}/alerts`, {
            method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({
                location, parameter, operator, threshold: Number(threshold), description, email
            }),
        });
        if (!res.ok) throw new Error("Failed to create alert");
        return res;
    },

    deleteAlert: async (id: string) => {
        const res = await fetch(`${BASE_URL}/alerts/${id}`, {
            method: "DELETE",
        });
        if (res.status !== 204) {
            const data = await res.json();
            throw new Error(data.error || "Failed to delete alert");
        }
    },

    updateAlert: async (updatedAlert: any) => {
        console.log('updatedAlert',updatedAlert);
        const res = await fetch(`${BASE_URL}/alerts/${updatedAlert._id}`, {
            method: "PUT", headers: {"Content-Type": "application/json"}, body: JSON.stringify(updatedAlert),
        });
        if (!res.ok) throw new Error("Failed to update alert");
        return res.json();
    },
};
