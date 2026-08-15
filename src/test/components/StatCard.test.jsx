import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import StatCard from '@shared/components/StatCard/index.js';

describe('StatCard', () => {
  it('shows a retry state matching the failed summary card layout', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(
      <StatCard
        label="Sessions this month"
        value="1,200"
        error="We couldn’t load the overview."
        onRetry={onRetry}
      />,
    );

    expect(screen.getByText(/failed/i)).toBeInTheDocument();
    const retryButton = screen.getByRole('button', { name: /retry/i });
    expect(retryButton).toBeInTheDocument();

    await user.click(retryButton);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
