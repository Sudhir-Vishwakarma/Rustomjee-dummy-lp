import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FaqAccordion from './FaqAccordion';

const items = [
  { question: 'Q1', answer: 'A1' },
  { question: 'Q2', answer: 'A2' },
];

describe('FaqAccordion', () => {
  it('starts with all answers collapsed', () => {
    render(<FaqAccordion items={items} />);
    expect(screen.queryByText('A1')).not.toBeInTheDocument();
    expect(screen.queryByText('A2')).not.toBeInTheDocument();
  });

  it('expands an answer on click and collapses it on a second click', () => {
    render(<FaqAccordion items={items} />);
    fireEvent.click(screen.getByText('Q1'));
    expect(screen.getByText('A1')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Q1'));
    expect(screen.queryByText('A1')).not.toBeInTheDocument();
  });

  it('only keeps one answer open at a time', () => {
    render(<FaqAccordion items={items} />);
    fireEvent.click(screen.getByText('Q1'));
    fireEvent.click(screen.getByText('Q2'));
    expect(screen.queryByText('A1')).not.toBeInTheDocument();
    expect(screen.getByText('A2')).toBeInTheDocument();
  });
});
