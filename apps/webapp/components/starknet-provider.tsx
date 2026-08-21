"use client";
import type React from "react";
import { useMemo } from "react";

import { mainnet } from "@starknet-react/chains";
import {
  StarknetConfig,
  argent,
  braavos,
  jsonRpcProvider,
  voyager,
} from "@starknet-react/core";
import { getPublicRpcUrl } from "@/lib/rpc";

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  // Static RPC provider configuration
  const provider = useMemo(() => {
    function rpc() {
      return {
        nodeUrl: getPublicRpcUrl(),
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
      autoConnect={true}
    >
      {children}
    </StarknetConfig>
  );
} 