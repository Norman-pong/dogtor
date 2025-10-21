import '@testing-library/jest-dom';

import { expect, test, vi } from 'vitest';

import { render, getQueriesForElement } from '@lynx-js/react/testing-library';

test('useUsers loads and returns users', async () => {
  (globalThis as any).__trpcClientOverride = {
    users: {
      list: {
        query: vi.fn().mockResolvedValue({
          users: [{ id: 1, email: 'u@example.com', name: 'User One' }]
        })
      }
    }
  };

  const { useUsers } = await import('..');

  const Probe = () => {
    const { users, loading, error } = useUsers();

    return (
      <view>
        <text>{loading ? 'loading-yes' : 'loading-no'}</text>
        <text>{error ? 'error-yes' : 'error-no'}</text>
        <text>{String(users.length)}</text>
      </view>
    );
  };

  render(<Probe />);

  const q = getQueriesForElement(elementTree.root!);

  // initially loading

  const loadingText = await q.findByText('loading-yes');

  expect(loadingText).toBeInTheDocument();

  // eventually not loading, no error, one user

  const notLoading = await q.findByText('loading-no');

  expect(notLoading).toBeInTheDocument();

  const noError = await q.findByText('error-no');

  expect(noError).toBeInTheDocument();

  const userCount = await q.findByText('1');

  expect(userCount).toBeInTheDocument();
});

// Failure case: query rejects and sets error

test('useUsers handles error state', async () => {
  (globalThis as any).__trpcClientOverride = {
    users: {
      list: {
        query: vi.fn().mockRejectedValue(new Error('network'))
      }
    }
  };

  const { useUsers } = await import('..');

  const Probe = () => {
    const { users, loading, error } = useUsers();

    return (
      <view>
        <text>{loading ? 'loading-yes' : 'loading-no'}</text>
        <text>{error ? 'error-yes' : 'error-no'}</text>
        <text>{String(users.length)}</text>
      </view>
    );
  };

  render(<Probe />);

  const q = getQueriesForElement(elementTree.root!);

  // initially loading

  const loadingText = await q.findByText('loading-yes');

  expect(loadingText).toBeInTheDocument();

  // eventually not loading, error shown, zero users

  const notLoading = await q.findByText('loading-no');

  expect(notLoading).toBeInTheDocument();

  const hasError = await q.findByText('error-yes');

  expect(hasError).toBeInTheDocument();

  const userCount = await q.findByText('0');

  expect(userCount).toBeInTheDocument();
});
