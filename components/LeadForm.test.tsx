import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LeadForm from './LeadForm';

describe('LeadForm', () => {
  it('shows validation errors when submitted empty', () => {
    render(<LeadForm formId="test-form" />);
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(screen.getByText('Please enter your name.')).toBeInTheDocument();
    expect(screen.getByText('Please enter a valid 10-digit phone number.')).toBeInTheDocument();
    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
  });

  it('shows a success state after a valid submission', () => {
    render(<LeadForm formId="test-form" />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Asha Mehta' } });
    fireEvent.change(screen.getByLabelText('Phone'), { target: { value: '9876543210' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'asha@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(screen.getByText(/thanks/i)).toBeInTheDocument();
  });

  it('uses a custom submit label when provided', () => {
    render(<LeadForm formId="test-form" submitLabel="Download Brochure" />);
    expect(screen.getByRole('button', { name: 'Download Brochure' })).toBeInTheDocument();
  });
});
