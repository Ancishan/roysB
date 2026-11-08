import { Request, Response } from "express";

import {
  createOrderSchema,
  updateOrderStatusSchema,
  updatePaymentStatusSchema,
  updateOrderNoteSchema,
  updateOrderSourceSchema,
} from "./order.validation";

import { orderService } from "./order.service";

// =====================================================
// CREATE ORDER
// =====================================================

const createOrder = async (req: Request, res: Response) => {
  try {
    const data = createOrderSchema.parse(req.body);

    const order = await orderService.createOrder(data);

    return res.status(201).json({
      success: true,

      message: "Order created successfully",

      data: order,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,

      message: error.message || "Failed to create order",
    });
  }
};

// =====================================================
// GET ALL ORDERS
// =====================================================

// const getOrders = async (req: Request, res: Response) => {
//   try {
//     const page = Number(req.query.page) || 1;

//     const limit = Number(req.query.limit) || 20;

//     const result = await orderService.getOrders(page, limit);

//     return res.status(200).json({
//       success: true,

//       message: "Orders retrieved successfully",

//       data: result.orders,

//       pagination: result.pagination,
//     });
//   } catch (error: any) {
//     return res.status(500).json({
//       success: false,

//       message: error.message,
//     });
//   }
// };
const getOrders = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const search = String(req.query.search || "");
    const status = String(req.query.status || "ALL");

    const result = await orderService.getOrders(
      page,
      limit,
      search,
      status,
    );

    return res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: result.orders,
      pagination: result.pagination,
      stats: result.stats,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET ORDER BY ID
// =====================================================

const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await orderService.getOrderById(req.params.id as string);

    return res.status(200).json({
      success: true,

      message: "Order retrieved successfully",

      data: order,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,

      message: error.message,
    });
  }
};

// =====================================================
// CUSTOMER ORDER HISTORY
// =====================================================

const getCustomerOrders = async (req: Request, res: Response) => {
  try {
    const result = await orderService.getCustomerOrders(
      req.params.phone as string,
    );

    return res.status(200).json({
      success: true,

      message: "Customer order history retrieved successfully",

      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};

// =====================================================
// UPDATE ORDER STATUS
// =====================================================

const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const data = updateOrderStatusSchema.parse(req.body);

    const order = await orderService.updateOrderStatus(
      req.params.id as string,

      data.orderStatus,
    );

    return res.status(200).json({
      success: true,

      message: "Order status updated successfully",

      data: order,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};

// =====================================================
// UPDATE PAYMENT STATUS
// =====================================================

const updatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const data = updatePaymentStatusSchema.parse(req.body);

    const order = await orderService.updatePaymentStatus(
      req.params.id as string,

      data.paymentStatus,
    );

    return res.status(200).json({
      success: true,

      message: "Payment status updated successfully",

      data: order,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};

// =====================================================
// UPDATE ADMIN NOTE
// =====================================================

const updateOrderNote = async (req: Request, res: Response) => {
  try {
    const data = updateOrderNoteSchema.parse(req.body);

    const order = await orderService.updateOrderNote(
      req.params.id as string,

      data.adminNote || "",
    );

    return res.status(200).json({
      success: true,

      message: "Order note updated successfully",

      data: order,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};

// =====================================================
// UPDATE ORDER SOURCE
// =====================================================

const updateOrderSource = async (req: Request, res: Response) => {
  try {
    const data = updateOrderSourceSchema.parse(req.body);

    const order = await orderService.updateOrderSource(
      req.params.id as string,

      data.source,

      data.campaignName,
    );

    return res.status(200).json({
      success: true,

      message: "Order source updated successfully",

      data: order,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};

// =====================================================
// DELETE ORDER
// =====================================================

const deleteOrder = async (req: Request, res: Response) => {
  try {
    const result = await orderService.deleteOrder(req.params.id as string);

    return res.status(200).json({
      success: true,

      message: result.message,

      orderId: result.orderId,

      orderNumber: result.orderNumber,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,

      message: error.message,
    });
  }
};

export const orderController = {
  createOrder,

  getOrders,

  getOrderById,

  getCustomerOrders,

  updateOrderStatus,

  updatePaymentStatus,

  updateOrderNote,

  updateOrderSource,

  deleteOrder,
};
