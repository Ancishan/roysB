import { Request, Response } from "express";

import { analyticsService } from "./analytics.service";

// =====================================================
// ORDER ANALYTICS
// =====================================================

const getOrderAnalytics = async (
  req: Request,

  res: Response,
) => {
  try {
    const from = req.query.from as string | undefined;

    const to = req.query.to as string | undefined;

    const data = await analyticsService.getOrderAnalytics(from, to);

    return res.status(200).json({
      success: true,

      message: "Order analytics retrieved successfully",

      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,

      message: error.message || "Failed to get order analytics",
    });
  }
};

// =====================================================
// SALES TREND
// =====================================================

const getSalesTrend = async (
  req: Request,

  res: Response,
) => {
  try {
    const from = req.query.from as string | undefined;

    const to = req.query.to as string | undefined;

    const data = await analyticsService.getSalesTrend(from, to);

    return res.status(200).json({
      success: true,

      message: "Sales trend retrieved successfully",

      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// =====================================================
// MONTHLY SALES
// =====================================================

const getMonthlySales = async (
  req: Request,

  res: Response,
) => {
  try {
    const data = await analyticsService.getMonthlySales();

    return res.status(200).json({
      success: true,

      message: "Monthly sales retrieved successfully",

      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// =====================================================
// CATEGORY SALES
// =====================================================

const getCategorySales = async (
  req: Request,

  res: Response,
) => {
  try {
    const data = await analyticsService.getCategorySales();

    return res.status(200).json({
      success: true,

      message: "Category sales retrieved successfully",

      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// =====================================================
// TOP PRODUCTS
// =====================================================

const getProductPerformance = async (
  req: Request,

  res: Response,
) => {
  try {
    const data = await analyticsService.getProductPerformance();

    return res.status(200).json({
      success: true,

      message: "Product performance retrieved successfully",

      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// =====================================================
// TOP CUSTOMERS
// =====================================================

const getTopCustomers = async (
  req: Request,

  res: Response,
) => {
  try {
    const data = await analyticsService.getTopCustomers();

    return res.status(200).json({
      success: true,

      message: "Top customers retrieved successfully",

      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const analyticsController = {
  getOrderAnalytics,

  getSalesTrend,

  getMonthlySales,

  getCategorySales,

  getProductPerformance,

  getTopCustomers,
};
