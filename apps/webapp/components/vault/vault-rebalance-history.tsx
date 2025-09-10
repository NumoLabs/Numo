"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Clock, ArrowUpDown, AlertCircle, CheckCircle, XCircle } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { VaultRebalanceEvent } from "@/types/Vault"
import { getVaultRebalanceEvents } from "@/lib/vault-data"

interface VaultRebalanceHistoryProps {
  vaultId: string
}

export function VaultRebalanceHistory({ vaultId }: VaultRebalanceHistoryProps) {
  const [rebalanceEvents, setRebalanceEvents] = useState<VaultRebalanceEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadRebalanceEvents = async () => {
      setIsLoading(true)
      try {
        const events = getVaultRebalanceEvents(vaultId)
        setRebalanceEvents(events)
      } catch (error) {
        console.error('Failed to load rebalance events:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadRebalanceEvents()
  }, [vaultId])

  const getTriggerIcon = (trigger: string) => {
    switch (trigger) {
      case 'manual': return <ArrowUpDown className="h-4 w-4" />
      case 'automatic': return <Clock className="h-4 w-4" />
      case 'threshold': return <AlertCircle className="h-4 w-4" />
      case 'scheduled': return <Clock className="h-4 w-4" />
      default: return <ArrowUpDown className="h-4 w-4" />
    }
  }

  const getTriggerColor = (trigger: string) => {
    switch (trigger) {
      case 'manual': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'automatic': return 'bg-green-100 text-green-800 border-green-200'
      case 'threshold': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'scheduled': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (event: VaultRebalanceEvent) => {
    if (event.slippage < 0.5) return <CheckCircle className="h-4 w-4 text-green-600" />
    if (event.slippage < 1.0) return <AlertCircle className="h-4 w-4 text-yellow-600" />
    return <XCircle className="h-4 w-4 text-red-600" />
  }

  const getStatusColor = (event: VaultRebalanceEvent) => {
    if (event.slippage < 0.5) return 'bg-green-100 text-green-800 border-green-200'
    if (event.slippage < 1.0) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-red-100 text-red-800 border-red-200'
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rebalance History</CardTitle>
          <CardDescription>Loading rebalance events...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (rebalanceEvents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rebalance History</CardTitle>
          <CardDescription>No rebalance events found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No rebalancing events have occurred yet</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rebalance History</CardTitle>
        <CardDescription>
          Recent rebalancing events and their performance
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {rebalanceEvents.map((event, index) => (
          <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {getTriggerIcon(event.trigger)}
                <h4 className="font-semibold text-gray-900">
                  Rebalance Event #{rebalanceEvents.length - index}
                </h4>
                <Badge className={getTriggerColor(event.trigger)}>
                  {event.trigger}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(event)}
                <span className="text-sm text-gray-600">
                  {new Date(event.timestamp).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Event Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Gas Cost</p>
                <p className="font-medium">{event.gasCost.toFixed(4)} ETH</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Slippage</p>
                <p className="font-medium">{event.slippage.toFixed(2)}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">APY Change</p>
                <p className={`font-medium ${event.apyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {event.apyChange >= 0 ? '+' : ''}{event.apyChange.toFixed(2)}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Status</p>
                <Badge className={getStatusColor(event)}>
                  {event.slippage < 0.5 ? 'Optimal' : event.slippage < 1.0 ? 'Good' : 'Poor'}
                </Badge>
              </div>
            </div>

            {/* Allocation Changes */}
            <div className="space-y-3">
              <h5 className="font-medium text-gray-900">Allocation Changes</h5>
              <div className="space-y-2">
                {event.toAllocation.map((newPool, poolIndex) => {
                  const oldPool = event.fromAllocation.find(p => p.poolId === newPool.poolId)
                  const allocationChange = newPool.allocation - (oldPool?.allocation || 0)
                  
                  return (
                    <div key={newPool.poolId} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{newPool.poolName}</span>
                        <Badge variant="outline" className="text-xs">
                          {newPool.protocol}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {oldPool?.allocation || 0}% → {newPool.allocation}%
                        </span>
                        <span className={`text-sm font-medium ${
                          allocationChange > 0 ? 'text-green-600' : 
                          allocationChange < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {allocationChange > 0 ? '+' : ''}{allocationChange.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Performance Impact */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Performance Impact</span>
                <span className={`text-sm font-medium ${
                  event.apyChange >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {event.apyChange >= 0 ? 'Improved' : 'Reduced'} by {Math.abs(event.apyChange).toFixed(2)}%
                </span>
              </div>
              <div className="mt-2">
                <Progress 
                  value={Math.abs(event.apyChange) * 10} 
                  className="h-2" 
                />
              </div>
            </div>
          </div>
        ))}

        {/* Load More Button */}
        <div className="text-center pt-4">
          <Button variant="outline" size="sm">
            Load More Events
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
