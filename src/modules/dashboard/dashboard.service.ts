import { prisma } from "../../prisma/prisma";

// =====================================================
// MAIN DASHBOARD
// =====================================================

const getDashboardData = async () => {
  // ================= BASIC COUNT =================

  const totalProducts = await prisma.product.count();

  const totalCategories = await prisma.category.count();

  const totalBrands = await prisma.brand.count();

  const totalOrders = await prisma.order.count();

  // Unique customers by phone

  const customers = await prisma.order.findMany({
    select: {
      customerPhone: true,
    },

    distinct: ["customerPhone"],
  });

  const totalCustomers = customers.length;

  // ================= REVENUE =================

  const revenue = await prisma.order.aggregate({
    _sum: {
      totalAmount: true,
    },

    where: {
      orderStatus: {
        not: "CANCELLED",
      },
    },
  });

  const totalRevenue = Number(revenue._sum.totalAmount || 0);

  // ================= ORDER STATUS =================

  const pending = await prisma.order.count({
    where: {
      orderStatus: "PENDING",
    },
  });

  const confirmed = await prisma.order.count({
    where: {
      orderStatus: "CONFIRMED",
    },
  });

  const processing = await prisma.order.count({
    where: {
      orderStatus: "PROCESSING",
    },
  });

  const shipped = await prisma.order.count({
    where: {
      orderStatus: "SHIPPED",
    },
  });

  const delivered = await prisma.order.count({
    where: {
      orderStatus: "DELIVERED",
    },
  });

  const cancelled = await prisma.order.count({
    where: {
      orderStatus: "CANCELLED",
    },
  });

  // ================= INVENTORY =================

  const lowStockProducts = await prisma.product.count({
    where: {
      stock: {
        lte: 5,
      },
    },
  });

  const outOfStockProducts = await prisma.product.count({
    where: {
      stock: 0,
    },
  });

  // ================= RECENT ORDERS =================

  const recentOrders = await prisma.order.findMany({
    take: 10,

    orderBy: {
      createdAt: "desc",
    },

    select: {
      id: true,

      orderNumber: true,

      customerName: true,

      totalAmount: true,

      orderStatus: true,

      paymentStatus: true,

      source: true,

      createdAt: true,
    },
  });

  // ================= TOP PRODUCTS =================

  const topProducts = await prisma.orderItem.groupBy({
    by: ["productId", "productName"],

    _sum: {
      quantity: true,

      subtotal: true,
    },

    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },

    take: 10,
  });

  // ================= SOURCE ANALYTICS =================

  const sourceAnalytics = await prisma.order.groupBy({
    by: ["source"],

    _count: {
      id: true,
    },

    _sum: {
      totalAmount: true,
    },
  });

  // ================= SALES GRAPH =================

  const salesGraph = await prisma.order.findMany({
    where: {
      orderStatus: {
        not: "CANCELLED",
      },
    },

    select: {
      createdAt: true,

      totalAmount: true,
    },

    orderBy: {
      createdAt: "asc",
    },
  });

  const salesMap: any = {};

  salesGraph.forEach((order) => {
    const date = order.createdAt.toISOString().split("T")[0];

    if (!salesMap[date]) {
      salesMap[date] = 0;
    }

    salesMap[date] += Number(order.totalAmount);
  });

  const salesChart = Object.keys(salesMap).map((date) => ({
    date,

    sales: salesMap[date],
  }));

  return {
    overview: {
      totalProducts,

      totalCategories,

      totalBrands,

      totalOrders,

      totalCustomers,

      totalRevenue,
    },

    orders: {
      pending,

      confirmed,

      processing,

      shipped,

      delivered,

      cancelled,
    },

    inventory: {
      lowStockProducts,

      outOfStockProducts,
    },

    sales: {
      totalRevenue,

      chart: salesChart,
    },

    sourceAnalytics: sourceAnalytics.map((item) => ({
      source: item.source,

      orders: item._count.id,

      sales: Number(item._sum.totalAmount || 0),
    })),

    topProducts: topProducts.map((item) => ({
      productId: item.productId,

      productName: item.productName,

      quantity: item._sum.quantity || 0,

      revenue: Number(item._sum.subtotal || 0),
    })),

    recentOrders,
  };
};

export const dashboardService = {
  getDashboardData,
};
