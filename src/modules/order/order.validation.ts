import { z } from "zod";

// ===============================
// ORDER ITEM
// ===============================

const orderItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),

  quantity: z.number().int().min(1),
});

// ===============================
// CREATE ORDER
// ===============================

export const createOrderSchema = z.object({
  customerName: z.string().min(2),

  customerPhone: z.string().min(11),

  customerEmail: z.string().email().optional(),

  shippingAddress: z.string().min(5),

  city: z.string().min(2),

  area: z.string().optional(),

  paymentMethod: z.literal("COD"),

  // NEW

  source: z
    .enum(["FACEBOOK", "INSTAGRAM", "TIKTOK", "WHATSAPP", "WEBSITE", "DIRECT"])
    .optional(),

  campaignName: z.string().optional(),

  items: z.array(orderItemSchema).min(1),
});

export type CreateOrderData = z.infer<typeof createOrderSchema>;

// ===============================
// UPDATE ORDER STATUS
// ===============================

export const updateOrderStatusSchema = z.object({
  orderStatus: z.enum([
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ]),
});

// ===============================
// UPDATE PAYMENT STATUS
// ===============================

export const updatePaymentStatusSchema = z.object({
  paymentStatus: z.enum(["PENDING", "PAID", "FAILED", "REFUNDED"]),
});

// ===============================
// ADMIN ORDER NOTE
// ===============================

export const updateOrderNoteSchema = z.object({
  adminNote: z.string().max(500).optional(),
});

export const updateOrderSourceSchema = z.object({
  source: z.enum([
    "DIRECT",
    "FACEBOOK",
    "INSTAGRAM",
    "TIKTOK",
    "WHATSAPP",
  ]),

  campaignName: z.string().optional(),
});