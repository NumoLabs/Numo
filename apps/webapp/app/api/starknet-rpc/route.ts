import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy route for Starknet RPC to avoid CORS issues
 * This allows the frontend to make RPC calls through Next.js server
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // MAINNET ONLY: Always use mainnet RPC URL
    const rpcUrl = process.env.NEXT_PUBLIC_STARKNET_RPC_URL || 
      'https://starknet-mainnet.public.blastapi.io/rpc/v0_7';
    
    // Forward the request to the Starknet RPC endpoint
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Starknet RPC error:', response.status, errorText);
      return NextResponse.json(
        { 
          error: 'RPC request failed',
          status: response.status,
          message: errorText
        },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Starknet RPC proxy error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to proxy RPC request',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

