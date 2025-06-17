import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { NavBar } from './NavBar';

describe('NavBar', () => {
  it('renders the app title', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Weather Alerts/i)).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: /Home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Alerts/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Current State/i })).toBeInTheDocument();
  });

  it('applies active class to the correct link', () => {
    render(
      <MemoryRouter initialEntries={['/alerts']}>
        <NavBar />
      </MemoryRouter>,
    );

    const alertsLink = screen.getByRole('link', { name: /Alerts/i });
    expect(alertsLink).toHaveClass('text-blue-400');
  });
});
