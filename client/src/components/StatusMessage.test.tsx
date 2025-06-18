import { render, screen } from '@testing-library/react';
import { StatusMessage } from './StatusMessage';

describe('StatusMessage', () => {
  it('renders error message with correct styling', () => {
    render(<StatusMessage message="Something went wrong" type="error" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    const container = screen.getByText('Something went wrong').parentElement;
    expect(container).toHaveClass('bg-red-100');
  });

  it('renders success message with correct styling', () => {
    render(<StatusMessage message="Operation successful" type="success" />);
    expect(screen.getByText('Operation successful')).toBeInTheDocument();
    const container = screen.getByText('Operation successful').parentElement;
    expect(container).toHaveClass('bg-green-50');
  });

  it('renders loading message with correct styling and animation', () => {
    render(<StatusMessage message="Loading..." type="loading" />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    const container = screen.getByText('Loading...').parentElement;
    expect(container).toHaveClass('animate-pulse');
  });

  it('renders spinner when withSpinner is true', () => {
    render(<StatusMessage message="Loading..." type="loading" withSpinner />);
    const spinner = screen.getByRole('status', { hidden: true });
    expect(spinner).toBeInTheDocument();
  });

  it('does not render spinner when withSpinner is false', () => {
    render(<StatusMessage message="Loading..." type="loading" />);
    const spinner = screen.queryByRole('status', { hidden: true });
    expect(spinner).not.toBeInTheDocument();
  });
});
