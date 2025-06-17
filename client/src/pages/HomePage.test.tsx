import { render, screen, waitFor } from '@testing-library/react';
import { HomePage } from './HomePage';
import { vi } from 'vitest';

beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          location: 'tel aviv',
          temperature: 27,
          windSpeed: 15,
          precipitation: 0.3,
        }),
    }),
  ) as any;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('HomePage', () => {
  it('renders title', () => {
    render(<HomePage />);
    expect(screen.getByText('🌤️ Current Weather')).toBeInTheDocument();
  });

  it('shows loading initially', () => {
    render(<HomePage />);
    expect(screen.getByText(/loading weather/i)).toBeInTheDocument();
  });

  it('renders weather data when fetch succeeds', async () => {
    render(<HomePage />);
    await waitFor(() => expect(screen.getByText('🌡️ Temperature')).toBeInTheDocument());
    expect(screen.getByText('27°C')).toBeInTheDocument();
    expect(screen.getByText('15 km/h')).toBeInTheDocument();
    expect(screen.getByText('0.3 mm/h')).toBeInTheDocument();
  });

  it('shows error message when fetch fails', async () => {
    (global.fetch as any).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Invalid location' }),
      }),
    );

    render(<HomePage />);
    await waitFor(() => expect(screen.getByText(/invalid location/i)).toBeInTheDocument());
  });
});
