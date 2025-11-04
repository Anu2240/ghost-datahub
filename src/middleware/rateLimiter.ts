import rateLimit from "express-rate-limit";
import { Request, Response } from "express";

// Create a reusable rate limiter middleware
const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute per IP
  keyGenerator: (req: Request) => req.ip || "global",
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: "Too many requests. Please try again later.",
    });
  },
});

export default rateLimiter;
