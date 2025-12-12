"use client"

import { useEffect, useState } from "react"
import { logger, type LogEntry } from "@/lib/logger"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Trash2, Download } from "lucide-react"

const levelColors = {
  info: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  warn: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  error: "bg-red-500/10 text-red-600 border-red-500/20",
  debug: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  trace: "bg-gray-500/10 text-gray-600 border-gray-500/20",
}

export function LogViewer() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    const unsubscribe = logger.subscribe(setLogs)
    return unsubscribe
  }, [])

  const filteredLogs = filter === "all" ? logs : logs.filter((log) => log.level === filter)

  const handleClear = () => {
    logger.clear()
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(logs, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `logs-${new Date().toISOString()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Log Monitor</h2>
          <Badge variant="secondary">{filteredLogs.length} logs</Badge>
        </div>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border rounded-md bg-background"
          >
            <option value="all">All Levels</option>
            <option value="info">Info</option>
            <option value="warn">Warn</option>
            <option value="error">Error</option>
            <option value="debug">Debug</option>
            <option value="trace">Trace</option>
          </select>
          <Button size="sm" variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
          <Button size="sm" variant="outline" onClick={handleClear}>
            <Trash2 className="w-4 h-4 mr-1" />
            Clear
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[500px] rounded-md border">
        <div className="p-4 space-y-2">
          {filteredLogs.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No logs yet. Click some buttons to generate logs!
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-1">
                    <Badge variant="outline" className={levelColors[log.level]}>
                      {log.level.toUpperCase()}
                    </Badge>
                    <span className="font-medium text-sm">{log.action}</span>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm mb-2">{log.message}</p>
                {log.metadata && Object.keys(log.metadata).length > 0 && (
                  <details className="text-xs">
                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                      View metadata
                    </summary>
                    <pre className="mt-2 p-2 bg-muted rounded overflow-x-auto">
                      {JSON.stringify(log.metadata, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  )
}
