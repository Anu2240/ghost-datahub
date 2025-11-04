import { Request, Response, NextFunction } from "express";

// Global error handler middleware
const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("❌ Error:", err.message || err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};

export default errorHandler;
