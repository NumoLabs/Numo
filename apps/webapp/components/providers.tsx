'use client';

import { StarknetProvider } from '@/components/starknet-provider';
import { WalletProvider } from '@/components/wallet-provider';
import { CavosAuthProvider } from '@/components/cavos-auth-provider';
import { QueryProvider } from '@/providers/query-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <StarknetProvider>
        <CavosAuthProvider>
          <WalletProvider>
            {children}
          </WalletProvider>
        </CavosAuthProvider>
      </StarknetProvider>
    </QueryProvider>
  );
}
