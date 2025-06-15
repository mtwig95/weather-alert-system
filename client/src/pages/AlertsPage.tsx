import {useEffect, useState} from 'react';
import {CreateOrEditAlertForm} from '../components/CreateAlertForm';
import {AlertList} from '../components/AlertList';
import type {Alert} from '../types/alert';
import {api} from '../services/api';

export const AlertsPage = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const fetchAlerts = async () => {
        try {
            setLoading(true);
            const data = await api.getAlerts();
            setAlerts(data);
        } catch (err) {
            console.error('Failed to load alerts', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();
    }, []);

    return (<div className="min-h-screen bg-background text-text px-4 py-10 font-sans">
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold text-center">🔔 Weather Alerts</h1>

                <div className="text-right">
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-accent text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
                    >
                        {showForm ? 'Close' : '+ Add Alert'}
                    </button>
                </div>

                {showForm && (<div className="bg-card rounded-2xl shadow-lg p-6">
                        <CreateOrEditAlertForm
                            mode="create"
                            onSubmit={async ({location, parameter, operator, threshold, description, email}) => {
                                await api.createAlert(location, parameter, operator, threshold, description || '', email);
                                await fetchAlerts();
                                setShowForm(false);
                            }}
                        />
                    </div>)}

                <div className="bg-card rounded-2xl shadow-lg p-6">
                    <AlertList alerts={alerts} loading={loading} setAlerts={setAlerts}/>
                </div>
            </div>
        </div>);
};
