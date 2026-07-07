import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('testing harness', () => {
  it('renders and queries a basic element', () => {
    render(<div>hello rustomjee</div>);
    expect(screen.getByText('hello rustomjee')).toBeInTheDocument();
  });
});
