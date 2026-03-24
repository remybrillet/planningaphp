// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

// Clean old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitMap) {
    if (now > value.resetAt) {
      rateLimitMap.delete(key)
    }
  }
}, 5 * 60 * 1000)

type RateLimitConfig = {
  maxRequests: number
  windowMs: number
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = { maxRequests: 5, windowMs: 60 * 1000 }
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const entry = rateLimitMap.get(identifier)

  if (!entry || now > entry.resetAt) {
    const resetAt = now + config.windowMs
    rateLimitMap.set(identifier, { count: 1, resetAt })
    return { allowed: true, remaining: config.maxRequests - 1, resetAt }
  }

  if (entry.count >= config.maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count++
  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt,
  }
}
