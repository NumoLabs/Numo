"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { VaultAlert } from "@/types/Vault"
import { getVaultAlerts } from "@/lib/vault-data"

interface VaultAlertsProps {
  vaultId: string
}

export function VaultAlerts({ vaultId }: VaultAlertsProps) {
  const [alerts, setAlerts] = useState<VaultAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const loadAlerts = async () => {
      setIsLoading(true)
      try {
        const vaultAlerts = getVaultAlerts(vaultId, !showAll)
        setAlerts(vaultAlerts)
      } catch (error) {
        console.error('Failed to load alerts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAlerts()
  }, [vaultId, showAll])

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'rebalance': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'threshold': return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'error': return <X className="h-4 w-4 text-red-600" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case 'info': return <Info className="h-4 w-4 text-blue-600" />
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'rebalance': return 'bg-green-50 border-green-200'
      case 'threshold': return 'bg-yellow-50 border-yellow-200'
      case 'error': return 'bg-red-50 border-red-200'
      case 'warning': return 'bg-orange-50 border-orange-200'
      case 'info': return 'bg-blue-50 border-blue-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  const getAlertBadgeColor = (type: string) => {
    switch (type) {
      case 'rebalance': return 'bg-green-100 text-green-800 border-green-200'
      case 'threshold': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'error': return 'bg-red-100 text-red-800 border-red-200'
      case 'warning': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ))
  }

  const unreadCount = alerts.filter(alert => !alert.read).length

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alerts</CardTitle>
          <CardDescription>Loading alerts...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alerts</CardTitle>
          <CardDescription>No alerts at this time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <p className="text-gray-600">All systems running smoothly</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Alerts
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {showAll ? 'All alerts' : 'Unread alerts only'}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Unread' : 'Show All'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-3 rounded-lg border transition-colors ${
              alert.read ? 'opacity-60' : ''
            } ${getAlertColor(alert.type)}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">{alert.title}</h4>
                      <Badge className={getAlertBadgeColor(alert.type)}>
                        {alert.type}
                      </Badge>
                      {alert.actionRequired && (
                        <Badge variant="destructive" className="text-xs">
                          Action Required
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{new Date(alert.timestamp).toLocaleString()}</span>
                      {!alert.read && (
                        <Badge variant="outline" className="text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {!alert.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(alert.id)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                    {alert.actionUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(alert.actionUrl, '_blank')}
                        className="h-6 px-2 text-xs"
                      >
                        View
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Mark All as Read */}
        {unreadCount > 0 && (
          <div className="pt-3 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setAlerts(prev => prev.map(alert => ({ ...alert, read: true })))
              }}
              className="w-full"
            >
              Mark All as Read
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
