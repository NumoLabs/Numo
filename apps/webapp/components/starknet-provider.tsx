"use client";
import React from "react";

import { sepolia } from "@starknet-react/chains";
import {
  StarknetConfig,
  argent,
  braavos,
  jsonRpcProvider,
  useInjectedConnectors,
  voyager,
} from "@starknet-react/core";

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  function rpc() {
    return {
      nodeUrl: `https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_8/yI1L61QqzPDE0eXH4nVDl`
    }
  }
  const provider = jsonRpcProvider({ rpc });

  const { connectors } = useInjectedConnectors({
    recommended: [
      braavos(),
      argent(),
    ],
    
    includeRecommended: "onlyIfNoConnectors",
    order: "random"
  });

  return (
    <StarknetConfig
      chains={[sepolia]}
      provider={provider}
      connectors={connectors}
      explorer={voyager}
    >
      {children}
    </StarknetConfig>
  );
} 