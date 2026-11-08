
import {
  Response,
  NextFunction,
  Request,
} from "express";

import {
  verifyToken,
} from "../utils/jwt";

// ==========================================
// AUTH REQUEST INTERFACE
// ==========================================

export interface AuthRequest extends Request {
  admin?: {
    id: string;
    role: string;
  };
}

// ==========================================
// ADMIN AUTH MIDDLEWARE
// ==========================================

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // Get Admin JWT from cookie
    const token = req.cookies?.admin_token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    // Verify JWT
    const decoded = verifyToken(token);

    // ==========================================
    // DEBUG LOGS
    // ==========================================

    console.log(
      "Authenticated Admin ID:",
      decoded.id
    );

    console.log(
      "Authenticated Admin Role:",
      decoded.role
    );

    console.log(
      "Role Type:",
      typeof decoded.role
    );

    // ==========================================
    // ALLOWED ADMIN ROLES
    // ==========================================

    const allowedRoles = [
      "ADMIN",
      "SUPER_ADMIN",
    ];

    const userRole = decoded.role
      ?.trim()
      .toUpperCase();

    if (
      !decoded.id ||
      !userRole ||
      !allowedRoles.includes(userRole)
    ) {
      return res.status(403).json({
        success: false,
        message: "Admin access only",
      });
    }

    // Attach Admin information to request
    req.admin = {
      id: decoded.id,
      role: userRole,
    };

    next();

  } catch (error) {
    console.error(
      "Admin Authentication Error:",
      error
    );

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}
