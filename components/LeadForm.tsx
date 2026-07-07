'use client';

import { useState } from 'react';
import { validateLeadForm, type LeadFormValues, type LeadFormErrors } from '@/lib/validation';

export type LeadFormProps = {
  formId: string;
  submitLabel?: string;
};

const initialValues: LeadFormValues = {
  name: '',
  phone: '',
  email: '',
  whatsappOptIn: false,
};

export default function LeadForm({ formId, submitLabel = 'Submit' }: LeadFormProps) {
  const [values, setValues] = useState<LeadFormValues>(initialValues);
  const [errors, setErrors] = useState<LeadFormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <p className="rounded-md bg-navy/5 p-4 text-navy">
        Thanks! We&apos;ll be in touch shortly.
      </p>
    );
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const validationErrors = validateLeadForm(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      setSubmitted(true);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
      <div>
        <label htmlFor={`${formId}-name`}>Name</label>
        <input
          id={`${formId}-name`}
          type="text"
          value={values.name}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
          className="mt-1 w-full rounded border border-navy/20 p-2"
        />
        {errors.name && <p className="text-sm text-red-700">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor={`${formId}-phone`}>Phone</label>
        <input
          id={`${formId}-phone`}
          type="tel"
          value={values.phone}
          onChange={(e) => setValues({ ...values, phone: e.target.value })}
          className="mt-1 w-full rounded border border-navy/20 p-2"
        />
        {errors.phone && <p className="text-sm text-red-700">{errors.phone}</p>}
      </div>

      <div>
        <label htmlFor={`${formId}-email`}>Email</label>
        <input
          id={`${formId}-email`}
          type="email"
          value={values.email}
          onChange={(e) => setValues({ ...values, email: e.target.value })}
          className="mt-1 w-full rounded border border-navy/20 p-2"
        />
        {errors.email && <p className="text-sm text-red-700">{errors.email}</p>}
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={values.whatsappOptIn}
          onChange={(e) => setValues({ ...values, whatsappOptIn: e.target.checked })}
        />
        Contact me on WhatsApp
      </label>

      <button
        type="submit"
        className="mt-2 rounded bg-navy px-4 py-2 font-medium text-sand hover:bg-navy-light"
      >
        {submitLabel}
      </button>
    </form>
  );
}
