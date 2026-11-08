import { prisma } from "../../prisma/prisma";

// =====================================================
// COMMON DATE FILTER
// =====================================================

const getDateFilter = (from?: string, to?: string) => {
  const startDate = from ? new Date(from) : new Date("2020-01-01");

  const endDate = to ? new Date(to) : new Date();

  endDate.setHours(23, 59, 59, 999);

  return {
    createdAt: {
      gte: startDate,
      lte: endDate,
    },
  };
};

// =====================================================
// ORDER ANALYTICS SUMMARY
// =====================================================

const getOrderAnalytics = async (
  from?: string,

  to?: string,
) => {
  const dateFilter = getDateFilter(from, to);

  const totalOrders = await prisma.order.count({
    where: dateFilter,
  });

  const revenue = await prisma.order.aggregate({
    where: {
      ...dateFilter,

      orderStatus: {
        not: "CANCELLED",
      },
    },

    _sum: {
      totalAmount: true,
    },
  });

  const totalRevenue = Number(revenue._sum.totalAmount ?? 0);

  const pending = await prisma.order.count({
    where: {
      ...dateFilter,
      orderStatus: "PENDING",
    },
  });

  const confirmed = await prisma.order.count({
    where: {
      ...dateFilter,
      orderStatus: "CONFIRMED",
    },
  });

  const processing = await prisma.order.count({
    where: {
      ...dateFilter,
      orderStatus: "PROCESSING",
    },
  });

  const shipped = await prisma.order.count({
    where: {
      ...dateFilter,
      orderStatus: "SHIPPED",
    },
  });

  const delivered = await prisma.order.count({
    where: {
      ...dateFilter,
      orderStatus: "DELIVERED",
    },
  });

  const cancelled = await prisma.order.count({
    where: {
      ...dateFilter,
      orderStatus: "CANCELLED",
    },
  });

  const sourceAnalytics = await prisma.order.groupBy({
    by: ["source"],

    where: dateFilter,

    _count: {
      id: true,
    },
  });

  return {
    totalOrders,

    totalRevenue,

    status: {
      pending,

      confirmed,

      processing,

      shipped,

      delivered,

      cancelled,
    },

    sourceAnalytics,
  };
};

// =====================================================
// DAILY SALES TREND
// =====================================================

const getSalesTrend = async (
  from?: string,

  to?: string,
) => {
  const dateFilter = getDateFilter(from, to);

  const orders = await prisma.order.findMany({
    where: {
      ...dateFilter,

      orderStatus: {
        not: "CANCELLED",
      },
    },

    select: {
      createdAt: true,

      totalAmount: true,
    },
  });

  const result: any = {};

  orders.forEach((order) => {
    const date = order.createdAt.toISOString().split("T")[0];

    if (!result[date]) {
      result[date] = {
        date,

        orders: 0,

        sales: 0,
      };
    }

    result[date].orders += 1;

    result[date].sales += Number(order.totalAmount);
  });

  return Object.values(result);
};

// =====================================================
// MONTHLY SALES
// =====================================================

const getMonthlySales = async () => {
  const orders = await prisma.order.findMany({
    where: {
      orderStatus: {
        not: "CANCELLED",
      },
    },

    select: {
      createdAt: true,

      totalAmount: true,
    },
  });

  const months: any = {};

  orders.forEach((order) => {
    const month = order.createdAt.toLocaleString("default", {
      month: "long",
    });

    if (!months[month]) {
      months[month] = {
        month,

        orders: 0,

        sales: 0,
      };
    }

    months[month].orders += 1;

    months[month].sales += Number(order.totalAmount);
  });

  return Object.values(months);
};

// =====================================================
// CATEGORY SALES
// =====================================================

const getCategorySales = async () => {
  const items = await prisma.orderItem.findMany({
    include: {
      product: {
        include: {
          category: true,
        },
      },
    },
  });

  const categories: any = {};

  items.forEach((item) => {
    const category = item.product.category.name;

    if (!categories[category]) {
      categories[category] = {
        category,

        quantity: 0,

        sales: 0,
      };
    }

    categories[category].quantity += item.quantity;

    categories[category].sales += Number(item.subtotal);
  });

  return Object.values(categories);
};

// =====================================================
// TOP PRODUCTS
// =====================================================

const getProductPerformance = async () => {
  const products = await prisma.orderItem.groupBy({
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

  return products.map((item) => ({
    productId: item.productId,

    productName: item.productName,

    sold: item._sum.quantity ?? 0,

    revenue: Number(item._sum.subtotal ?? 0),
  }));
};

// =====================================================
// TOP CUSTOMERS
// =====================================================

const getTopCustomers = async () => {
  const customers = await prisma.order.groupBy({
    by: ["customerPhone", "customerName"],

    _count: {
      id: true,
    },

    _sum: {
      totalAmount: true,
    },

    orderBy: {
      _sum: {
        totalAmount: "desc",
      },
    },

    take: 10,
  });

  return customers.map((customer) => ({
    name: customer.customerName,

    phone: customer.customerPhone,

    orders: customer._count.id,

    spent: Number(customer._sum.totalAmount ?? 0),
  }));
};

export const analyticsService = {
  getOrderAnalytics,

  getSalesTrend,

  getMonthlySales,

  getCategorySales,

  getProductPerformance,

  getTopCustomers,
};
