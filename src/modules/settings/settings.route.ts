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
// Public settings - Customer access
router.get("/public", settingsController.getPublicSettings);

// Admin settings - Protected
router.get("/",  settingsController.getSettings);

// Protected: Only Admin can update settings
router.patch("/", authMiddleware, settingsController.updateSettings);

export default router;