import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';
import { CurrentStatePage } from './CurrentStatePage';
import { api } from '../services/api';
import type { Alert } from '../types/alert';

vi.mock('../services/api.ts', async () => {
    const actual = await vi.importActual('../services/api.ts');
    return {
        ...actual,
        api: {
            getAlerts: vi.fn()
        }
    };
});

describe('CurrentStatePage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows loading message initially', () => {
        (api.getAlerts as any).mockResolvedValue([]);
        render(<CurrentStatePage />);
        expect(screen.getByText(/Loading current state.../i)).toBeInTheDocument();
    });

    it('renders no alert message if no triggered alerts', async () => {
        const mockAlerts: Alert[] = [
            {
                _id: '1',
                location: 'Tel Aviv',
                parameter: 'temperature',
                operator: '>',
                threshold: 30,
                description: 'Hot',
                email: 'test@example.com',
                status: 'not_triggered',
                lastChecked: new Date().toISOString(),
                lastNotified: null,
                createdAt: new Date().toISOString(),
            }
        ];

        (api.getAlerts as any).mockResolvedValue(mockAlerts);
        render(<CurrentStatePage />);

        await waitFor(() => {
            expect(screen.getByText(/✅ All Clear/i)).toBeInTheDocument();
        });
    });

    it('renders triggered alerts correctly', async () => {
        const mockAlerts: Alert[] = [
            {
                _id: '2',
                location: 'Jerusalem',
                parameter: 'windSpeed',
                operator: '>',
                threshold: 50,
                description: 'Windy',
                email: 'test@example.com',
                status: 'triggered',
                lastChecked: new Date().toISOString(),
                lastNotified: null,
                createdAt: new Date().toISOString(),
            }
        ];

        (api.getAlerts as any).mockResolvedValue(mockAlerts);
        render(<CurrentStatePage />);

        await waitFor(() => {
            expect(screen.getByText(/Jerusalem/)).toBeInTheDocument();
            expect(screen.getByText(/windSpeed > 50/)).toBeInTheDocument();
            expect(screen.getByText(/Last checked:/)).toBeInTheDocument();
        });
    });

    it('handles fetch error gracefully', async () => {
        (api.getAlerts as any).mockRejectedValue(new Error('API Error'));
        render(<CurrentStatePage />);

        await waitFor(() => {
            // כל עוד אין קריסה והמסך נעלם – עברנו
            expect(screen.queryByText(/Loading current state.../)).not.toBeInTheDocument();
        });
    });
});
