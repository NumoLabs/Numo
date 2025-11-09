"use client";
import React, { useMemo } from "react";

import { sepolia } from "@starknet-react/chains";
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
        nodeUrl: `https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_8/yI1L61QqzPDE0eXH4nVDl`
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
      chains={[sepolia]}
      provider={provider}
      connectors={connectors}
      explorer={voyager}
      autoConnect={true}
    >
      {children}
    </StarknetConfig>
  );
} 