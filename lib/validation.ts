export type LeadFormValues = {
  name: string;
  phone: string;
  email: string;
  whatsappOptIn: boolean;
};

export type LeadFormErrors = Partial<Record<'name' | 'phone' | 'email', string>>;

const PHONE_PATTERN = /^\d{10}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLeadForm(values: LeadFormValues): LeadFormErrors {
  const errors: LeadFormErrors = {};

  if (!values.name.trim()) {
    errors.name = 'Please enter your name.';
  }

  if (!PHONE_PATTERN.test(values.phone.trim())) {
    errors.phone = 'Please enter a valid 10-digit phone number.';
  }

  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  return errors;
}
