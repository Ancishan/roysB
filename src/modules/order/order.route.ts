import { Router } from "express";

import { orderController } from "./order.controller";

import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

// =====================================================
// CUSTOMER ORDER CREATE
// Public
// =====================================================

router.post("/", orderController.createOrder);

// =====================================================
// ADMIN ORDER MANAGEMENT
// Protected
// =====================================================

// Get all orders

router.get("/", authMiddleware, orderController.getOrders);

// Get single order

router.get("/:id", authMiddleware, orderController.getOrderById);

// Customer order history

router.get(
  "/customer/:phone",
  authMiddleware,
  orderController.getCustomerOrders,
);

// Update order status

router.patch("/:id/status", authMiddleware, orderController.updateOrderStatus);

// Update payment status

router.patch(
  "/:id/payment",
  authMiddleware,
  orderController.updatePaymentStatus,
);

// Update admin note

router.patch("/:id/note", authMiddleware, orderController.updateOrderNote);

// Update source (Facebook / Instagram / TikTok)

router.patch("/:id/source", authMiddleware, orderController.updateOrderSource);

// Delete order

router.delete("/:id", authMiddleware, orderController.deleteOrder);

export default router;
