import { NextRequest, NextResponse } from "next/server";

type NextHandler = (
  req: NextRequest,
  ctx?: any
) => Promise<Response> | Response;

interface RateLimitOptions {
  limit: number;    // 时间窗口内最大请求数
  windowMs: number; // 窗口大小（毫秒）
  getIdentifier?: (req: NextRequest) => string; // 用来区分调用者（IP / userId 等）
}

// 内存计数：Map<key, { count, resetAt }>
const store = new Map<string, { count: number; resetAt: number }>();

export function withRateLimit(options: RateLimitOptions) {
  const { limit, windowMs, getIdentifier } = options;

  return function decorate(handler: NextHandler): NextHandler {
    return async function (req: NextRequest, ctx?: any) {
      const id =
        getIdentifier?.(req) ??
        req.headers.get("x-real-ip") ??
        req.headers.get("x-forwarded-for") ??
        "global";

      const key = `${req.nextUrl.pathname}:${id}`;
      const now = Date.now();

      let entry = store.get(key);
      if (!entry || entry.resetAt <= now) {
        entry = { count: 0, resetAt: now + windowMs };
        store.set(key, entry);
      }

      if (entry.count >= limit) {
        const retryAfterSec = Math.ceil((entry.resetAt - now) / 1000);
        return new NextResponse("Too Many Requests", {
          status: 429,
          headers: {
            "Retry-After": String(retryAfterSec),
          },
        });
      }

      entry.count += 1;
      return handler(req, ctx);
    };
  };
}