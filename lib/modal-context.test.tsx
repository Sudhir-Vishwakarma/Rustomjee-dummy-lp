import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModalProvider, useModal } from './modal-context';

function TestConsumer() {
  const { activeModal, openModal, closeModal } = useModal();
  return (
    <div>
      <p>active: {activeModal ?? 'none'}</p>
      <button onClick={() => openModal('enquire')}>open enquire</button>
      <button onClick={closeModal}>close</button>
    </div>
  );
}

describe('modal context', () => {
  it('starts with no active modal', () => {
    render(
      <ModalProvider>
        <TestConsumer />
      </ModalProvider>
    );
    expect(screen.getByText('active: none')).toBeInTheDocument();
  });

  it('opens and closes a modal by type', () => {
    render(
      <ModalProvider>
        <TestConsumer />
      </ModalProvider>
    );
    fireEvent.click(screen.getByText('open enquire'));
    expect(screen.getByText('active: enquire')).toBeInTheDocument();
    fireEvent.click(screen.getByText('close'));
    expect(screen.getByText('active: none')).toBeInTheDocument();
  });
});
