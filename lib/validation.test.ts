import { describe, it, expect } from 'vitest';
import { validateLeadForm } from './validation';

describe('validateLeadForm', () => {
  it('returns no errors for valid values', () => {
    const errors = validateLeadForm({
      name: 'Asha Mehta',
      phone: '9876543210',
      email: 'asha@example.com',
      whatsappOptIn: true,
    });
    expect(errors).toEqual({});
  });

  it('flags an empty name', () => {
    const errors = validateLeadForm({
      name: '',
      phone: '9876543210',
      email: 'asha@example.com',
      whatsappOptIn: false,
    });
    expect(errors.name).toBe('Please enter your name.');
  });

  it('flags an invalid phone number', () => {
    const errors = validateLeadForm({
      name: 'Asha Mehta',
      phone: '123',
      email: 'asha@example.com',
      whatsappOptIn: false,
    });
    expect(errors.phone).toBe('Please enter a valid 10-digit phone number.');
  });

  it('flags an invalid email', () => {
    const errors = validateLeadForm({
      name: 'Asha Mehta',
      phone: '9876543210',
      email: 'not-an-email',
      whatsappOptIn: false,
    });
    expect(errors.email).toBe('Please enter a valid email address.');
  });
});
