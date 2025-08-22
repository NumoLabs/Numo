"use client"

import { useState } from 'react'
import { useCavosAuth } from '@/hooks/use-cavos-auth'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'
import { Alert, AlertDescription } from './alert'
import { Loader2, Send, CheckCircle, XCircle } from 'lucide-react'

export function CavosTransactionExample() {
  const { user, isAuthenticated, executeTransaction } = useCavosAuth()
  const currentWalletAddress = user?.wallet?.address
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [isExecuting, setIsExecuting] = useState(false)
  const [transactionResult, setTransactionResult] = useState<{
    success: boolean
    hash?: string
    error?: string
  } | null>(null)

  const handleExecuteTransaction = async () => {
    if (!recipient || !amount) {
      setTransactionResult({
        success: false,
        error: 'Please fill in all fields'
      })
      return
    }

    setIsExecuting(true)
    setTransactionResult(null)

    try {
      // Example transaction call for STRK token transfer
      const calls = [{
        contractAddress: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d', // STRK token
        entrypoint: 'transfer',
        calldata: [
          recipient, // recipient address
          amount, // amount (in wei)
          '0' // high part (for u256)
        ]
      }]

      const result = await executeTransaction(currentWalletAddress!, calls)
      
      setTransactionResult({
        success: true,
        hash: result.txHash
      })
    } catch (error: any) {
      setTransactionResult({
        success: false,
        error: error.message || 'Transaction failed'
      })
    } finally {
      setIsExecuting(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction Example</CardTitle>
          <CardDescription>
            Please authenticate with Cavos to execute transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              You need to be authenticated with Cavos to execute transactions. Please register or sign in.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Execute Transaction</CardTitle>
        <CardDescription>
          Execute transaction using your Cavos wallet
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="wallet-address">Your Cavos Wallet Address</Label>
          <Input
            id="wallet-address"
            value={currentWalletAddress || 'No wallet connected'}
            readOnly
            className="font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="recipient">Recipient Address</Label>
          <Input
            id="recipient"
            placeholder="0x..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="font-mono"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount (in wei)</Label>
          <Input
            id="amount"
            placeholder="1000000000000000000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
          />
        </div>

        <Button
          onClick={handleExecuteTransaction}
          disabled={isExecuting || !recipient || !amount}
          className="w-full"
        >
          {isExecuting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Executing Transaction...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Execute Transaction
            </>
          )}
        </Button>

        {transactionResult && (
          <Alert variant={transactionResult.success ? "default" : "destructive"}>
            {transactionResult.success ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <AlertDescription>
              {transactionResult.success ? (
                <>
                  Transaction successful! Hash: {transactionResult.hash}
                </>
              ) : (
                transactionResult.error
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
