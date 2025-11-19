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
import { xverse } from "./connectors/xverse-connector";

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  // Static RPC provider configuration
  const provider = useMemo(() => {
    function rpc() {
      return {
        nodeUrl: `https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_9/c0P2DVGVr0OOBtgc3tSqm`
      }
    }
    return jsonRpcProvider({ rpc });
  }, []);

  // Static connectors configuration - no useInjectedConnectors to prevent wallet triggers
  const connectors = useMemo(() => [
    braavos(),
    argent(),
    xverse(),
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