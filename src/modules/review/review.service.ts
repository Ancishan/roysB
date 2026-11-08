import { prisma } from "../../prisma/prisma";

interface CreateReviewData {
  productId: string;
  name: string;
  email?: string;
  rating: number;
  comment?: string;
}

interface UpdateReviewData {
  name?: string;
  email?: string;
  rating?: number;
  comment?: string;
  isApproved?: boolean;
}

// CREATE REVIEW
const createReview = async (
  data: CreateReviewData
) => {
  // Check whether product exists
  const product = await prisma.product.findUnique({
    where: {
      id: data.productId,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  return prisma.review.create({
    data: {
      productId: data.productId,
      name: data.name,
      email: data.email,
      rating: data.rating,
      comment: data.comment,
    },
  });
};

// GET ALL REVIEWS
const getReviews = async () => {
  return prisma.review.findMany({
    orderBy: {
      createdAt: "desc",
    },

    include: {
      product: true,
    },
  });
};

// GET REVIEW BY ID
const getReviewById = async (
  id: string
) => {
  return prisma.review.findUnique({
    where: {
      id,
    },

    include: {
      product: true,
    },
  });
};

// UPDATE REVIEW
const updateReview = async (
  id: string,
  data: UpdateReviewData
) => {
  const existingReview =
    await prisma.review.findUnique({
      where: {
        id,
      },
    });

  if (!existingReview) {
    throw new Error("Review not found");
  }

  return prisma.review.update({
    where: {
      id,
    },

    data,
  });
};

// DELETE REVIEW
const deleteReview = async (
  id: string
) => {
  const existingReview =
    await prisma.review.findUnique({
      where: {
        id,
      },
    });

  if (!existingReview) {
    throw new Error("Review not found");
  }

  return prisma.review.delete({
    where: {
      id,
    },
  });
};

export const reviewService = {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
};