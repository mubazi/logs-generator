"use client"

import { ButtonActions } from "@/components/button-actions"
import { LogViewer } from "@/components/log-viewer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">ELK Stack Log Monitoring Demo</h1>
          <p className="text-muted-foreground">
            A Next.js application that generates extensive server-side logs with 30+ fields on every button click.
            Perfect for practicing ELK stack (Elasticsearch, Logstash, Kibana) monitoring and log aggregation.
          </p>
          <div className="mt-4 p-4 bg-muted rounded-lg text-sm space-y-2">
            <p className="font-semibold">Server Logs Output:</p>
            <p>
              All server-side logs are printed as JSON to the console (stdout). Run this app with{" "}
              <code className="bg-background px-1 py-0.5 rounded">npm run dev</code> and pipe logs to your ELK stack for
              visualization in Kibana.
            </p>
            <p className="text-muted-foreground text-xs">
              Each button click generates 4-6 server logs with fields including: timestamp, level, service, request_id,
              user_id, ip_address, response_time_ms, memory_usage_mb, cpu_usage, tags, and more.
            </p>
          </div>
        </div>

        <ButtonActions />
        <LogViewer />
      </div>
    </main>
  )
}
