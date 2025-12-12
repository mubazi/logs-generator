"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { logger } from "@/lib/logger"
import { Activity, Zap, Database, Upload, RefreshCw, Save, Send, Download } from "lucide-react"

export function ButtonActions() {
  const [clickCounts, setClickCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState<string | null>(null)

  const handleClick = async (buttonName: string, action: string, apiEndpoint: string, apiData: any) => {
    const count = (clickCounts[buttonName] || 0) + 1
    setClickCounts({ ...clickCounts, [buttonName]: count })
    setLoading(buttonName)

    logger.info(`User clicked ${buttonName}`, action, {
      buttonName,
      clickCount: count,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
    })

    logger.debug(`Button interaction initiated`, action, {
      buttonId: buttonName.toLowerCase().replace(/\s/g, "-"),
      previousClicks: count - 1,
      sessionDuration: performance.now(),
    })

    logger.trace(`Event propagation details`, action, {
      eventType: "click",
      phase: "capture",
      coordinates: { x: Math.random() * 100, y: Math.random() * 100 },
    })

    try {
      logger.debug(`Sending API request to ${apiEndpoint}`, action, {
        endpoint: apiEndpoint,
        method: "POST",
        payload: apiData,
      })

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      })

      const data = await response.json()

      logger.info(`API response received from ${apiEndpoint}`, action, {
        status: response.status,
        success: data.success,
        responseTime: data.responseTime,
      })

      if (!response.ok) {
        throw new Error(data.error || "API request failed")
      }

      logger.info(`${buttonName} action completed successfully`, action, {
        success: true,
        result: data,
      })
    } catch (error) {
      const err = error as Error
      logger.error(`API request failed for ${buttonName}`, action, {
        errorMessage: err.message,
        endpoint: apiEndpoint,
      })
    } finally {
      setLoading(null)
    }

    if (count % 5 === 0) {
      logger.warn(`High click frequency detected on ${buttonName}`, action, {
        clickCount: count,
        threshold: 5,
        recommendation: "Consider rate limiting",
      })
    }

    if (count % 10 === 0) {
      logger.error(`Simulated error on ${buttonName}`, action, {
        errorCode: "SIM_ERROR_001",
        message: "This is a simulated error for testing",
        recoverable: true,
      })
    }
  }

  const buttons = [
    {
      name: "User Operation",
      icon: Activity,
      action: "USER_OPERATION",
      variant: "default" as const,
      endpoint: "/api/user",
      data: { action: "user_operation" },
    },
    {
      name: "Analytics Event",
      icon: Zap,
      action: "ANALYTICS_EVENT",
      variant: "secondary" as const,
      endpoint: "/api/analytics",
      data: { eventType: "button_click" },
    },
    {
      name: "Database Query",
      icon: Database,
      action: "DB_QUERY",
      variant: "outline" as const,
      endpoint: "/api/database",
      data: { operation: "read" },
    },
    {
      name: "Search Request",
      icon: Upload,
      action: "SEARCH_REQUEST",
      variant: "default" as const,
      endpoint: "/api/search",
      data: { query: "sample search", page: 1, limit: 20 },
    },
    {
      name: "Auth Request",
      icon: RefreshCw,
      action: "AUTH_REQUEST",
      variant: "secondary" as const,
      endpoint: "/api/auth",
      data: { action: "login" },
    },
    {
      name: "DB Write",
      icon: Save,
      action: "DB_WRITE",
      variant: "outline" as const,
      endpoint: "/api/database",
      data: { operation: "write" },
    },
    {
      name: "Track Event",
      icon: Send,
      action: "TRACK_EVENT",
      variant: "default" as const,
      endpoint: "/api/analytics",
      data: { eventType: "conversion" },
    },
    {
      name: "Fetch Data",
      icon: Download,
      action: "FETCH_DATA",
      variant: "secondary" as const,
      endpoint: "/api/user",
      data: { action: "fetch_profile" },
    },
  ]

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Action Buttons (Server Logging)</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Click any button to generate extensive server-side logs with 30+ fields for ELK/Kibana monitoring. Each click
        triggers multiple API calls with rich metadata including performance metrics, error tracking, and business
        analytics.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {buttons.map((button) => {
          const Icon = button.icon
          const count = clickCounts[button.name] || 0
          const isLoading = loading === button.name
          return (
            <div key={button.name} className="relative">
              <Button
                variant={button.variant}
                className="w-full h-auto py-6 flex flex-col gap-2"
                onClick={() => handleClick(button.name, button.action, button.endpoint, button.data)}
                disabled={isLoading}
              >
                <Icon className={`w-6 h-6 ${isLoading ? "animate-spin" : ""}`} />
                <span className="text-sm">{button.name}</span>
              </Button>
              {count > 0 && (
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold">
                  {count}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
