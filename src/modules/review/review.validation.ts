import { z } from "zod";

export const createReviewSchema = z.object({
  productId: z
    .string()
    .min(1, "Product is required"),

  name: z
    .string()
    .min(2, "Name must be at least 2 characters"),

  email: z
    .string()
    .email("Invalid email")
    .optional(),

  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),

  comment: z
    .string()
    .optional(),
});

export const updateReviewSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .optional(),

  email: z
    .string()
    .email("Invalid email")
    .optional(),

  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5")
    .optional(),

  comment: z
    .string()
    .optional(),

  isApproved: z
    .boolean()
    .optional(),
});