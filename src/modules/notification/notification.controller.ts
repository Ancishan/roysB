import {
  Request,
  Response,
} from "express";

import {
  notificationService,
} from "./notification.service";

export const notificationController = {

  // GET ALL NOTIFICATIONS
  getNotifications: async (
    req: Request,
    res: Response
  ) => {
    try {
      const notifications =
        await notificationService.getNotifications();

      const unreadCount =
        await notificationService.getUnreadCount();

      return res.status(200).json({
        success: true,
        data: notifications,
        unreadCount,
      });

    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // MARK ONE AS READ
  markAsRead: async (
    req: Request,
    res: Response
  ) => {
    try {
      const { id } = req.params;

      const notification =
        await notificationService.markAsRead(id);

      return res.status(200).json({
        success: true,
        message: "Notification marked as read",
        data: notification,
      });

    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  },

  // MARK ALL AS READ
  markAllAsRead: async (
    req: Request,
    res: Response
  ) => {
    try {
      await notificationService.markAllAsRead();

      return res.status(200).json({
        success: true,
        message: "All notifications marked as read",
      });

    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};