import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { AlertsPage } from './AlertsPage';
import { vi } from 'vitest';
import { api } from '../services/api';

vi.mock('../services/api', () => ({
  api: {
    getAlerts: vi.fn(),
    createAlert: vi.fn(),
    deleteAlert: vi.fn(),
    updateAlert: vi.fn(),
  },
}));

describe('AlertsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders + Add Alert button', () => {
    (api.getAlerts as any).mockResolvedValue([]);
    render(<AlertsPage />);
    expect(screen.getByText('+ Add Alert')).toBeInTheDocument();
  });

  it('shows loading and then empty message if no alerts', async () => {
    (api.getAlerts as any).mockResolvedValue([]);
    render(<AlertsPage />);
    expect(screen.getByText(/loading alerts/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/no alerts saved yet/i)).toBeInTheDocument();
    });
  });

  it('renders fetched alerts', async () => {
    (api.getAlerts as any).mockResolvedValue([
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
    ]);

    await waitFor(() => render(<AlertsPage />));

    await waitFor(() => {
      expect(screen.getByText('Tel Aviv')).toBeInTheDocument();
      expect(screen.getByText(/Hot!/i)).toBeInTheDocument();
    });
  });

  it('toggles create form', async () => {
    (api.getAlerts as any).mockResolvedValue([]);
    render(<AlertsPage />);
    const addButton = screen.getByText('+ Add Alert');
    fireEvent.click(addButton);
    expect(await screen.findByText(/Save Alert/i)).toBeInTheDocument();
  });
});
