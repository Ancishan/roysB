import {
  Router,
  type Response,
  type NextFunction,
} from "express";

import { settingsController } from "./settings.controller";

import {
  authMiddleware,
  type AuthRequest,
} from "../../middleware/auth.middleware";

const router = Router();

// Admin role verification
const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const allowedRoles = [
    "ADMIN",
    "SUPER_ADMIN",
  ];

  const userRole = req.admin?.role
    ?.trim()
    .toUpperCase();

  if (!userRole || !allowedRoles.includes(userRole)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only.",
    });
  }

  next();
};

// Public settings
router.get(
  "/public",
  settingsController.getPublicSettings,
);

// Admin settings
router.get(
  "/",
  authMiddleware,
  adminOnly,
  settingsController.getSettings,
);

router.patch(
  "/",
  authMiddleware,
  adminOnly,
  settingsController.updateSettings,
);

export default router;