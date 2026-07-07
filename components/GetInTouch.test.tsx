import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import GetInTouch from './GetInTouch';

describe('GetInTouch', () => {
  it('renders a heading and a lead form', () => {
    render(<GetInTouch />);
    expect(screen.getByText('Get in Touch')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
  });
});
