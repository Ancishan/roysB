import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),

  slug: z.string().min(2, "Slug must be at least 2 characters"),

  description: z.string().optional(),

  image: z.string().url("Image must be a valid URL").optional(),

  isActive: z.boolean().optional(),

  parentId: z.string().optional(),
});

export const updateCategorySchema =
  createCategorySchema.partial();