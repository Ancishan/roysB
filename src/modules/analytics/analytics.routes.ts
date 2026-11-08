import { Router } from "express";

import { analyticsController } from "./analytics.controller";

const router = Router();

// =====================================================
// ORDER ANALYTICS
// =====================================================

router.get(
  "/orders",

  analyticsController.getOrderAnalytics,
);

// =====================================================
// SALES TREND
// =====================================================

router.get(
  "/sales-trend",

  analyticsController.getSalesTrend,
);

// =====================================================
// MONTHLY SALES
// =====================================================

router.get(
  "/monthly-sales",

  analyticsController.getMonthlySales,
);

// =====================================================
// CATEGORY SALES
// =====================================================

router.get(
  "/category-sales",

  analyticsController.getCategorySales,
);

// =====================================================
// TOP PRODUCTS
// =====================================================

router.get(
  "/top-products",

  analyticsController.getProductPerformance,
);

// =====================================================
// TOP CUSTOMERS
// =====================================================

router.get(
  "/top-customers",

  analyticsController.getTopCustomers,
);

export default router;
