
import { Router, type Response, type NextFunction } from "express";

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
  if (req.admin?.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only.",
    });
  }

  next();
};

// Public: Customer can read store settings
router.get("/public", settingsController.getPublicSettings);

// Admin: Only authenticated admins can read settings
router.get("/", authMiddleware, adminOnly, settingsController.getSettings);

// Admin: Only authenticated admins can update settings
router.patch("/", authMiddleware, adminOnly, settingsController.updateSettings);

export default router;
