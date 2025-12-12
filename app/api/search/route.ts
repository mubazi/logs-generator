import { serverLogger } from "@/lib/server-logger"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const body = await request.json()
    const query = body.query || ""
    const page = body.page || 1
    const limit = body.limit || 20

    serverLogger.info("Search request received", "search_start", {
      method: "POST",
      endpoint: "/api/search",
      ip_address: request.ip || "127.0.0.1",
      user_agent: request.headers.get("user-agent") || "unknown",
      page_number: page,
      limit,
      tags: ["search", "query"],
      metadata: { search_query: query },
    })

    // Log index search
    serverLogger.debug("Searching index", "search_index", {
      query_time_ms: Math.floor(Math.random() * 200) + 50,
      cache_hit: Math.random() > 0.7,
      items_processed: Math.floor(Math.random() * 10000) + 1000,
      tags: ["elasticsearch", "index"],
    })

    // Log ranking
    serverLogger.trace("Ranking results", "search_rank", {
      items_processed: Math.floor(Math.random() * 100) + 10,
      cpu_usage: Math.floor(Math.random() * 80) + 20,
      memory_usage_mb: Math.floor(Math.random() * 512) + 128,
    })

    // Log filtering
    serverLogger.debug("Applying filters", "search_filter", {
      query_time_ms: Math.floor(Math.random() * 50) + 10,
      items_processed: limit,
      page_number: page,
    })

    const responseTime = Date.now() - startTime
    const resultCount = Math.floor(Math.random() * 50) + 1

    serverLogger.info("Search completed successfully", "search_success", {
      status_code: 200,
      response_time_ms: responseTime,
      items_processed: resultCount,
      page_number: page,
      limit,
      data_size_bytes: resultCount * 512,
      tags: ["success", "search"],
    })

    return NextResponse.json({
      success: true,
      results: resultCount,
      page,
      query,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    const responseTime = Date.now() - startTime
    const err = error as Error

    serverLogger.error("Search request failed", "search_error", {
      status_code: 500,
      response_time_ms: responseTime,
      error_type: err.name,
      error_code: "SEARCH_ERROR",
      error_message: err.message,
      stack_trace: err.stack,
    })

    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
