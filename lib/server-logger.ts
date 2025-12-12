// Server-side logger with extensive fields for ELK stack/Kibana
export type LogLevel = "info" | "warn" | "error" | "debug" | "trace"

export interface ServerLogEntry {
  // Core fields
  timestamp: string
  level: LogLevel
  message: string
  service: string
  environment: string

  // Request context
  request_id: string
  session_id: string
  user_id: string
  ip_address: string
  user_agent: string

  // HTTP details
  method: string
  endpoint: string
  status_code: number
  response_time_ms: number

  // Application context
  action: string
  module: string
  function_name: string

  // Performance metrics
  cpu_usage?: number
  memory_usage_mb?: number
  query_time_ms?: number
  cache_hit?: boolean

  // Business metrics
  items_processed?: number
  data_size_bytes?: number
  page_number?: number
  limit?: number

  // Error details
  error_type?: string
  error_code?: string
  error_message?: string
  stack_trace?: string

  // Additional metadata
  tags?: string[]
  correlation_id?: string
  parent_request_id?: string
  metadata?: Record<string, any>

  // Geographic/Network
  country?: string
  region?: string
  city?: string
  isp?: string

  // Device info
  device_type?: string
  browser?: string
  os?: string
  screen_resolution?: string
}

export class ServerLogger {
  private getBaseLog(level: LogLevel, message: string, action: string): ServerLogEntry {
    const timestamp = new Date().toISOString()
    const request_id = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const session_id = `sess_${Math.random().toString(36).substr(2, 16)}`

    return {
      timestamp,
      level,
      message,
      service: "log-monitoring-app",
      environment: process.env.NODE_ENV || "development",
      request_id,
      session_id,
      user_id: `user_${Math.floor(Math.random() * 1000)}`,
      ip_address: this.generateFakeIP(),
      user_agent: "Next.js Server",
      method: "POST",
      endpoint: "/api/logs",
      status_code: 200,
      response_time_ms: Math.floor(Math.random() * 500) + 50,
      action,
      module: "api",
      function_name: action.replace(/\s+/g, "_").toLowerCase(),
      tags: ["monitoring", "demo", action.toLowerCase()],
      correlation_id: `corr_${Date.now()}`,
    }
  }

  private generateFakeIP(): string {
    return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
  }

  log(level: LogLevel, message: string, action: string, additionalData?: Partial<ServerLogEntry>) {
    const logEntry = {
      ...this.getBaseLog(level, message, action),
      ...additionalData,
    }

    // Output as JSON for ELK stack
    console.log(JSON.stringify(logEntry))

    return logEntry
  }

  info(message: string, action: string, data?: Partial<ServerLogEntry>) {
    return this.log("info", message, action, data)
  }

  warn(message: string, action: string, data?: Partial<ServerLogEntry>) {
    return this.log("warn", message, action, data)
  }

  error(message: string, action: string, data?: Partial<ServerLogEntry>) {
    return this.log("error", message, action, { status_code: 500, ...data })
  }

  debug(message: string, action: string, data?: Partial<ServerLogEntry>) {
    return this.log("debug", message, action, data)
  }

  trace(message: string, action: string, data?: Partial<ServerLogEntry>) {
    return this.log("trace", message, action, data)
  }
}

export const serverLogger = new ServerLogger()
