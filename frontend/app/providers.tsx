'use client';

import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useWeb3Store } from '../store/web3Store';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const { setupEventListeners } = useWeb3Store();

  useEffect(() => {
    // Setup web3 event listeners
    const cleanup = setupEventListeners();
    return cleanup;
  }, [setupEventListeners]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
