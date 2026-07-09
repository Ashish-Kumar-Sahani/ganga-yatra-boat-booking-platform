import { Request, Response, NextFunction } from "express";

interface RequestLog {
  count: number;
  firstRequestTime: number;
}

const ipRequestMap = new Map<string, RequestLog>();

/**
 * Lightweight, dependency-free, in-memory rate limiter.
 * @param limit Max number of requests allowed in the window
 * @param windowMs Time window in milliseconds
 */
export const rateLimiter = (limit: number, windowMs: number) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Basic IP detection
    const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "unknown-ip";
    // We scope the rate limit by IP + Request Path to prevent locking users out of all endpoints
    const key = `${ip}:${req.originalUrl || req.path}`;
    const now = Date.now();

    const requestLog = ipRequestMap.get(key);

    if (!requestLog) {
      ipRequestMap.set(key, { count: 1, firstRequestTime: now });
      next();
      return;
    }

    if (now - requestLog.firstRequestTime > windowMs) {
      // Window expired, reset window log
      ipRequestMap.set(key, { count: 1, firstRequestTime: now });
      next();
      return;
    }

    requestLog.count += 1;
    if (requestLog.count > limit) {
      const resetTimeSeconds = Math.ceil((requestLog.firstRequestTime + windowMs - now) / 1000);
      res.status(429).json({
        message: `Too many requests. Please try again in ${resetTimeSeconds} seconds.`,
      });
      return;
    }

    next();
  };
};
