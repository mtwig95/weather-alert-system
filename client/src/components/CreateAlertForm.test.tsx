import {describe, it, vi, expect} from 'vitest';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {CreateOrEditAlertForm, type AlertFormData} from './CreateAlertForm';

describe('CreateOrEditAlertForm', () => {
    const setup = (mode: 'create' | 'edit', initialData?: Partial<AlertFormData>, onSubmit?: any) => {
        const submitFn = onSubmit || vi.fn().mockResolvedValue(undefined);
        render(<CreateOrEditAlertForm mode={mode} initialData={initialData} onSubmit={submitFn} />);
        return submitFn;
    };

    it('renders form fields with default values in create mode', () => {
        setup('create');
        expect(screen.getByLabelText(/Location/i)).toHaveValue('');
        expect(screen.getByLabelText(/Email/i)).toHaveValue('');
        expect(screen.getByLabelText(/Parameter/i)).toHaveValue('temperature');
        expect(screen.getByLabelText(/Operator/i)).toHaveValue('>');
        expect(screen.getByLabelText(/Threshold/i)).toHaveValue(0);
        expect(screen.getByLabelText(/Description/i)).toHaveValue('');
        expect(screen.getByText(/Save Alert/i)).toBeInTheDocument();
    });

    it('renders form fields with initial values in edit mode', () => {
        setup('edit', {
            location: 'Tel Aviv',
            email: 'test@example.com',
            parameter: 'windSpeed',
            operator: '<',
            threshold: 15,
            description: 'Rainy',
        });

        expect(screen.getByLabelText(/Location/i)).toHaveValue('Tel Aviv');
        expect(screen.getByLabelText(/Email/i)).toHaveValue('test@example.com');
        expect(screen.getByLabelText(/Parameter/i)).toHaveValue('windSpeed');
        expect(screen.getByLabelText(/Operator/i)).toHaveValue('<');
        expect(screen.getByLabelText(/Threshold/i)).toHaveValue(15);
        expect(screen.getByLabelText(/Description/i)).toHaveValue('Rainy');
        expect(screen.getByText(/Update Alert/i)).toBeInTheDocument();
    });

    it('submits form with user-entered values', async () => {
        const mockSubmit = vi.fn().mockResolvedValue(undefined);
        setup('create', {}, mockSubmit);

        fireEvent.change(screen.getByLabelText(/Location/i), {target: {value: 'NYC'}});
        fireEvent.change(screen.getByLabelText(/Email/i), {target: {value: 'user@test.com'}});
        fireEvent.change(screen.getByLabelText(/Parameter/i), {target: {value: 'precipitation'}});
        fireEvent.change(screen.getByLabelText(/Operator/i), {target: {value: '<'}});
        fireEvent.change(screen.getByLabelText(/Threshold/i), {target: {value: 22}});
        fireEvent.change(screen.getByLabelText(/Description/i), {target: {value: 'Storm warning'}});

        fireEvent.click(screen.getByRole('button', {name: /Save Alert/i}));

        await waitFor(() =>
            expect(mockSubmit).toHaveBeenCalledWith({
                location: 'NYC',
                email: 'user@test.com',
                parameter: 'precipitation',
                operator: '<',
                threshold: 22,
                description: 'Storm warning',
            })
        );
    });

    it('shows error message on submit failure', async () => {
        const mockSubmit = vi.fn().mockRejectedValue(new Error('Failed to save'));
        setup('create', {}, mockSubmit);

        fireEvent.change(screen.getByLabelText(/Location/i), {target: {value: 'Test City'}});
        fireEvent.change(screen.getByLabelText(/Email/i), {target: {value: 'fail@test.com'}});
        fireEvent.click(screen.getByRole('button', {name: /Save Alert/i}));

        await screen.findByText(/Failed to save/i);
    });

    it('shows loading indicator during submit', async () => {
        const mockSubmit = vi.fn(() => new Promise((resolve) => setTimeout(resolve, 500)));
        setup('create', {}, mockSubmit);

        fireEvent.change(screen.getByLabelText(/Location/i), {target: {value: 'Nowhere'}});
        fireEvent.change(screen.getByLabelText(/Email/i), {target: {value: 'wait@test.com'}});
        fireEvent.click(screen.getByRole('button', {name: /Save Alert/i}));

        expect(screen.getByText(/Saving alert/i)).toBeInTheDocument();
        await waitFor(() => expect(mockSubmit).toHaveBeenCalled());
    });
});
