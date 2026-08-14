import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '@shared/components/ErrorBoundary/index.js';

let consoleErrorSpy;

function Broken() {
  throw new Error('boom');
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('renders the fallback when a child throws', () => {
    render(
      <ErrorBoundary lang="en">
        <Broken />
      </ErrorBoundary>,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});
