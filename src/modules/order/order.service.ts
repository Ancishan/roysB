import { prisma } from "../../prisma/prisma";

import type { CreateOrderData } from "./order.validation";

const DELIVERY_CHARGE = 110;

// =====================================================
// CREATE ORDER
// =====================================================

const createOrder = async (data: CreateOrderData) => {
  return prisma.$transaction(async (tx) => {
    let subtotal = 0;

    const orderItems: any[] = [];

    // Check product

    for (const item of data.items) {
      const product = await tx.product.findUnique({
        where: {
          id: item.productId,
        },
      });

      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      if (!product.isActive) {
        throw new Error(`Product is inactive: ${product.name}`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      const price = Number(product.discountPrice ?? product.price);

      const itemSubtotal = price * item.quantity;

      subtotal += itemSubtotal;

      orderItems.push({
        productId: product.id,

        productName: product.name,

        quantity: item.quantity,

        price,

        subtotal: itemSubtotal,
      });
    }

    const totalAmount = subtotal + DELIVERY_CHARGE;

    const order = await tx.order.create({
      data: {
        orderNumber: `ROYS-${Date.now()}`,

        customerName: data.customerName,

        customerPhone: data.customerPhone,

        customerEmail: data.customerEmail,

        shippingAddress: data.shippingAddress,

        city: data.city,

        area: data.area,

        subtotal,

        deliveryCharge: DELIVERY_CHARGE,

        totalAmount,

        paymentMethod: "C.O.D",

        paymentStatus: "PENDING",

        orderStatus: "PENDING",

        // NEW FIELDS

        source: data.source ?? "DIRECT",

        campaignName: data.campaignName,

        items: {
          create: orderItems,
        },
      },

      include: {
        items: true,
      },
    });

    // Reduce stock

    for (const item of data.items) {
      await tx.product.update({
        where: {
          id: item.productId,
        },

        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    return order;
  });
};

// =====================================================
// GET ALL ORDERS
// =====================================================

// const getOrders = async (
//   page: number = 1,

//   limit: number = 20,
// ) => {
//   const skip = (page - 1) * limit;

//   const orders = await prisma.order.findMany({
//     skip,

//     take: limit,

//     orderBy: {
//       createdAt: "desc",
//     },

//     include: {
//       items: true,
//     },
//   });

//   const total = await prisma.order.count();

//   return {
//     orders,

//     pagination: {
//       page,

//       limit,

//       total,

//       totalPages: Math.ceil(total / limit),
//     },
//   };
// };
const STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const getOrders = async (
  page: number = 1,
  limit: number = 20,
  search: string = "",
  status: string = "ALL",
) => {
  // Validate pagination values
  const safePage = Math.max(1, Math.floor(page));
  const safeLimit = Math.min(100, Math.max(1, Math.floor(limit)));

  const skip = (safePage - 1) * safeLimit;

  // Build database filters
  const where = {
    ...(status !== "ALL" && STATUSES.includes(status as any)
      ? { orderStatus: status }
      : {}),

    ...(search.trim()
      ? {
          OR: [
            {
              orderNumber: {
                contains: search.trim(),
                mode: "insensitive" as const,
              },
            },
            {
              customerName: {
                contains: search.trim(),
                mode: "insensitive" as const,
              },
            },
            {
              customerPhone: {
                contains: search.trim(),
              },
            },
          ],
        }
      : {}),
  };

  // Fetch page data, filtered count and global status statistics
  const [
    orders,
    total,
    allOrdersCount,
    pending,
    confirmed,
    processing,
    shipped,
    delivered,
    cancelled,
  ] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      skip,
      take: safeLimit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        items: true,
      },
    }),

    prisma.order.count({ where }),

    prisma.order.count(),

    prisma.order.count({ where: { orderStatus: "PENDING" } }),
    prisma.order.count({ where: { orderStatus: "CONFIRMED" } }),
    prisma.order.count({ where: { orderStatus: "PROCESSING" } }),
    prisma.order.count({ where: { orderStatus: "SHIPPED" } }),
    prisma.order.count({ where: { orderStatus: "DELIVERED" } }),
    prisma.order.count({ where: { orderStatus: "CANCELLED" } }),
  ]);

  return {
    orders,

    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit),
    },

    stats: {
      all: allOrdersCount,
      pending,
      confirmed,
      processing,
      shipped,
      delivered,
      cancelled,
    },
  };
};


// =====================================================
// GET ORDER BY ID
// =====================================================

const getOrderById = async (id: string) => {
  const order = await prisma.order.findUnique({
    where: {
      id,
    },

    include: {
      items: true,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};

// =====================================================
// CUSTOMER ORDER HISTORY
// =====================================================

const getCustomerOrders = async (phone: string) => {
  const orders = await prisma.order.findMany({
    where: {
      customerPhone: phone,
    },

    orderBy: {
      createdAt: "desc",
    },

    include: {
      items: true,
    },
  });

  const totalOrders = orders.length;

  const totalSpent = orders.reduce(
    (sum, order) => sum + Number(order.totalAmount),

    0,
  );

  return {
    customerPhone: phone,

    totalOrders,

    totalSpent,

    orders,
  };
};

// =====================================================
// UPDATE ORDER STATUS
// =====================================================

const updateOrderStatus = async (
  id: string,

  orderStatus: string,
) => {
  const order = await prisma.order.findUnique({
    where: {
      id,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  const flow: any = {
    PENDING: ["CONFIRMED", "CANCELLED"],

    CONFIRMED: ["PROCESSING", "CANCELLED"],

    PROCESSING: ["SHIPPED", "CANCELLED"],

    SHIPPED: ["DELIVERED"],

    DELIVERED: [],

    CANCELLED: [],
  };

  if (!flow[order.orderStatus].includes(orderStatus)) {
    throw new Error(
      `Cannot change status from ${order.orderStatus} to ${orderStatus}`,
    );
  }

  return prisma.order.update({
    where: {
      id,
    },

    data: {
      orderStatus,
    },
  });
};

// =====================================================
// UPDATE PAYMENT STATUS
// =====================================================

const updatePaymentStatus = async (
  id: string,

  paymentStatus: string,
) => {
  const order = await prisma.order.findUnique({
    where: {
      id,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  return prisma.order.update({
    where: {
      id,
    },

    data: {
      paymentStatus,
    },
  });
};

// =====================================================
// UPDATE ADMIN NOTE
// =====================================================

const updateOrderNote = async (
  id: string,

  adminNote: string | undefined,
) => {
  const order = await prisma.order.findUnique({
    where: {
      id,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  return prisma.order.update({
    where: {
      id,
    },

    data: {
      adminNote,
    },
  });
};

const updateOrderSource = async (
  id: string,
  source: string,
  campaignName?: string,
) => {
  const order = await prisma.order.findUnique({
    where: {
      id,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  return prisma.order.update({
    where: {
      id,
    },

    data: {
      source,
      campaignName,
    },
  });
};

const getCustomerOrderHistory = async (phone: string) => {
  const orders = await prisma.order.findMany({
    where: {
      customerPhone: phone,
    },

    orderBy: {
      createdAt: "desc",
    },

    include: {
      items: true,
    },
  });

  const totalOrders = orders.length;

  const totalPurchase = orders.reduce(
    (sum, order) => sum + Number(order.totalAmount),

    0,
  );

  return {
    phone,

    totalOrders,

    totalPurchase,

    orders,
  };
};
// =====================================================
// DELETE ORDER
// =====================================================

const deleteOrder = async (id: string) => {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: {
        id,
      },

      include: {
        items: true,
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    for (const item of order.items) {
      await tx.product.update({
        where: {
          id: item.productId,
        },

        data: {
          stock: {
            increment: item.quantity,
          },
        },
      });
    }

    await tx.order.delete({
      where: {
        id,
      },
    });

    return {
      message: "Order deleted successfully",

      orderId: id,

      orderNumber: order.orderNumber,
    };
  });
};

export const orderService = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrder,

  updateOrderNote,
  updateOrderSource,
  getCustomerOrderHistory,
};
