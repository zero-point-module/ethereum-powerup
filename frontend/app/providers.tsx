'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Web3Provider } from '../contexts/Web3Context';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Web3Provider>
        {children}
      </Web3Provider>
    </QueryClientProvider>
  );
} 