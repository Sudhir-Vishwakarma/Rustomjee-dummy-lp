import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfigurationTabs from './ConfigurationTabs';

describe('ConfigurationTabs', () => {
  it('shows the 3 BHK panel by default', () => {
    render(<ConfigurationTabs />);
    expect(screen.getByText('1,089 – 1,407 sq. ft.')).toBeInTheDocument();
  });

  it('switches to the 4 BHK panel on click', () => {
    render(<ConfigurationTabs />);
    fireEvent.click(screen.getByRole('tab', { name: '4 BHK' }));
    expect(screen.getByText('1,664 – 1,898 sq. ft.')).toBeInTheDocument();
    expect(screen.queryByText('1,089 – 1,407 sq. ft.')).not.toBeInTheDocument();
  });
});
