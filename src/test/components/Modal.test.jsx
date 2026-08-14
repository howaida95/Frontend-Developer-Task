import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from '@shared/ui/Modal';

// Mock the SVG icon import
vi.mock('@/assets/icons/close.svg?react', () => ({
  default: () => <svg data-testid="close-icon" />,
}));

describe('Modal', () => {
  it('supports a centered placement and closes with Escape', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal open title="Details" labelledBy="details-title" placement="center" onClose={onClose}>
        Content
      </Modal>,
    );
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByRole('dialog', { name: 'Details' })).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
