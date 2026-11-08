import { prisma } from "../../prisma/prisma";

// Get latest notifications
const getNotifications = async () => {
  return prisma.notification.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });
};

// Get unread count
const getUnreadCount = async () => {
  return prisma.notification.count({
    where: {
      isRead: false,
    },
  });
};

// Mark one notification as read
const markAsRead = async (id: string) => {
  const notification =
    await prisma.notification.findUnique({
      where: { id },
    });

  if (!notification) {
    throw new Error("Notification not found");
  }

  return prisma.notification.update({
    where: { id },
    data: {
      isRead: true,
    },
  });
};

// Mark all notifications as read
const markAllAsRead = async () => {
  return prisma.notification.updateMany({
    where: {
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });
};

export const notificationService = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};