import { Router } from "express";

import {
  notificationController,
} from "./notification.controller";

import {
  authMiddleware,
} from "../../middleware/auth.middleware";

const router = Router();

// All routes are Admin protected
router.use(authMiddleware);

router.get(
  "/",
  notificationController.getNotifications
);

router.patch(
  "/read-all",
  notificationController.markAllAsRead
);

router.patch(
  "/:id/read",
  notificationController.markAsRead
);

export default router;