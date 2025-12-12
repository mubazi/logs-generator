export type LogLevel = "info" | "warn" | "error" | "debug" | "trace"

export interface LogEntry {
  id: string
  timestamp: string
  level: LogLevel
  message: string
  action: string
  metadata?: Record<string, any>
  stack?: string
}

class Logger {
  private logs: LogEntry[] = []
  private listeners: ((logs: LogEntry[]) => void)[] = []
  private logCount = 0

  subscribe(callback: (logs: LogEntry[]) => void) {
    this.listeners.push(callback)
    callback(this.logs)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback)
    }
  }

  private notify() {
    this.listeners.forEach((listener) => listener([...this.logs]))
  }

  private createLog(level: LogLevel, message: string, action: string, metadata?: Record<string, any>): LogEntry {
    return {
      id: `log-${++this.logCount}-${Date.now()}`,
      timestamp: new Date().toISOString(),
      level,
      message,
      action,
      metadata,
      stack: new Error().stack,
    }
  }

  log(level: LogLevel, message: string, action: string, metadata?: Record<string, any>) {
    const log = this.createLog(level, message, action, metadata)
    this.logs.push(log)
    console.log(`[${level.toUpperCase()}] ${action}: ${message}`, metadata)
    this.notify()
  }

  info(message: string, action: string, metadata?: Record<string, any>) {
    this.log("info", message, action, metadata)
  }

  warn(message: string, action: string, metadata?: Record<string, any>) {
    this.log("warn", message, action, metadata)
  }

  error(message: string, action: string, metadata?: Record<string, any>) {
    this.log("error", message, action, metadata)
  }

  debug(message: string, action: string, metadata?: Record<string, any>) {
    this.log("debug", message, action, metadata)
  }

  trace(message: string, action: string, metadata?: Record<string, any>) {
    this.log("trace", message, action, metadata)
  }

  clear() {
    this.logs = []
    this.logCount = 0
    this.notify()
  }

  getLogs() {
    return [...this.logs]
  }
}

export const logger = new Logger()
