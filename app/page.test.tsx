import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import Page from './page';

describe('Home page', () => {
  it('renders every major section landmark', () => {
    render(<Page />);
    expect(document.getElementById('home')).toBeInTheDocument();
    expect(document.getElementById('overview')).toBeInTheDocument();
    expect(document.getElementById('configuration')).toBeInTheDocument();
    expect(document.getElementById('amenities')).toBeInTheDocument();
    expect(document.getElementById('gallery')).toBeInTheDocument();
    expect(document.getElementById('about')).toBeInTheDocument();
    expect(document.getElementById('location')).toBeInTheDocument();
    expect(document.getElementById('faq')).toBeInTheDocument();
    expect(document.getElementById('contact')).toBeInTheDocument();
  });

  it('opens the Enquire Now modal from the header', () => {
    render(<Page />);
    const nav = screen.getByRole('navigation');
    fireEvent.click(within(nav).getByRole('button', { name: 'Enquire Now' }));
    expect(screen.getByRole('dialog', { name: /enquire now/i })).toBeInTheDocument();
  });
});
