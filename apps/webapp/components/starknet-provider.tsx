"use client";
import React, { useMemo } from "react";

import { mainnet } from "@starknet-react/chains";
import {
  StarknetConfig,
  argent,
  braavos,
  jsonRpcProvider,
  voyager,
} from "@starknet-react/core";

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  // Static RPC provider configuration
  const provider = useMemo(() => {
    function rpc() {
      return {
        nodeUrl: process.env.NEXT_PUBLIC_STARKNET_RPC_URL || `https://starknet-mainnet.public.blastapi.io/rpc/v0_7`
      }
    }
    return jsonRpcProvider({ rpc });
  }, []);

  // Static connectors configuration - no useInjectedConnectors to prevent wallet triggers
  const connectors = useMemo(() => [
    braavos(),
    argent(),
  ], []);

  return (
    <StarknetConfig
      chains={[mainnet]}
      provider={provider}
      connectors={connectors}
      explorer={voyager}
      autoConnect={false}
    >
      {children}
    </StarknetConfig>
  );
} 