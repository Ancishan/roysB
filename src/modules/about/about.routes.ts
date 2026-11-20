
import { Router } from "express";

import { aboutController } from "./about.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

// ==========================================
// PUBLIC ROUTE
// ==========================================

router.get(
  "/public",
  aboutController.getPublicAbout
);

// ==========================================
// ADMIN ROUTES
// ==========================================

router.get(
  "/admin",
  authMiddleware,
  aboutController.getAdminAbout
);

router.patch(
  "/page",
  authMiddleware,
  aboutController.updateAboutPage
);

// ==========================================
// TEAM MEMBER ROUTES
// ==========================================

router.post(
  "/team",
  authMiddleware,
  aboutController.createTeamMember
);

router.patch(
  "/team/:id",
  authMiddleware,
  aboutController.updateTeamMember
);

router.delete(
  "/team/:id",
  authMiddleware,
  aboutController.deleteTeamMember
);

// ==========================================
// GOALS / FEATURES ROUTES
// ==========================================

router.post(
  "/features",
  authMiddleware,
  aboutController.createFeature
);

router.patch(
  "/features/:id",
  authMiddleware,
  aboutController.updateFeature
);

router.delete(
  "/features/:id",
  authMiddleware,
  aboutController.deleteFeature
);

export default router;
