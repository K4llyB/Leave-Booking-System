import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

export interface AuthenticatedRequest extends Request {
  user?: any; 
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  const token = authHeader?.split(" ")[1]; 

  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED).json({ error: "No token provided" });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET || "defaultsecret";
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(StatusCodes.FORBIDDEN).json({ error: "Invalid token" });
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(StatusCodes.FORBIDDEN).json({ error: "Insufficient role permissions" });
      return;
    }
    next();
  };
};

