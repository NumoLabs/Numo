'use client';

import { StarknetProvider } from '@/components/starknet-provider';
import { WalletProvider } from '@/components/wallet-provider';
import { QueryProvider } from '@/providers/query-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <StarknetProvider>
        <WalletProvider>
          {children}
        </WalletProvider>
      </StarknetProvider>
    </QueryProvider>
  );
}
