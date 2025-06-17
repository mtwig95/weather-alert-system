import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AlertList } from './AlertList';
import type { Alert } from '../types/alert';
import { api } from '../services/api';
import { vi } from 'vitest';

vi.mock('../services/api');

const mockAlerts: Alert[] = [
    {
        _id: '1',
        location: 'Tel Aviv',
        parameter: 'temperature',
        operator: '>',
        threshold: 30,
        description: 'Hot!',
        email: 'test@example.com',
        status: 'not_triggered',
        lastChecked: null,
        lastNotified: null,
        createdAt: new Date().toISOString(),
    },
];

describe('AlertList', () => {
    const setAlerts = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('displays loading message', () => {
        render(<AlertList alerts={[]} loading={true} setAlerts={setAlerts} />);
        expect(screen.getByText(/Loading alerts/i)).toBeInTheDocument();
    });

    it('displays error message', () => {
        render(<AlertList alerts={[]} loading={false} error="Error!" setAlerts={setAlerts} />);
        expect(screen.getByText(/Error!/i)).toBeInTheDocument();
    });

    it('displays no alerts message', () => {
        render(<AlertList alerts={[]} loading={false} setAlerts={setAlerts} />);
        expect(screen.getByText(/No alerts saved yet/i)).toBeInTheDocument();
    });

    it('renders list of alerts', () => {
        render(<AlertList alerts={mockAlerts} loading={false} setAlerts={setAlerts} />);
        expect(screen.getByText(/Tel Aviv/)).toBeInTheDocument();
        expect(screen.getByText(/temperature > 30/)).toBeInTheDocument();
    });

    it('calls delete handler', async () => {
        vi.spyOn(window, 'confirm').mockReturnValueOnce(true);
        (api.deleteAlert as any).mockResolvedValue({});
        render(<AlertList alerts={mockAlerts} loading={false} setAlerts={setAlerts} />);
        fireEvent.click(screen.getByText(/🗑️ Delete/));
        await waitFor(() => {
            expect(api.deleteAlert).toHaveBeenCalledWith('1');
        });
    });

    it('cancels delete on reject', async () => {
        vi.spyOn(window, 'confirm').mockReturnValueOnce(false);
        render(<AlertList alerts={mockAlerts} loading={false} setAlerts={setAlerts} />);
        fireEvent.click(screen.getByText(/🗑️ Delete/));
        expect(api.deleteAlert).not.toHaveBeenCalled();
    });

    it('enters edit mode', () => {
        render(<AlertList alerts={mockAlerts} loading={false} setAlerts={setAlerts} />);
        fireEvent.click(screen.getByText(/✏️ Edit/));
        expect(screen.getByRole('button', { name: /Update Alert/i })).toBeInTheDocument();
    });

    it('cancels edit mode', () => {
        render(<AlertList alerts={mockAlerts} loading={false} setAlerts={setAlerts} />);
        fireEvent.click(screen.getByText(/✏️ Edit/));
        fireEvent.click(screen.getByText(/Cancel/));
        expect(screen.queryByText(/Save Alert/i)).not.toBeInTheDocument();
    });
});
