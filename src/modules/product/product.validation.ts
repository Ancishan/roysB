import { z } from "zod";

const variantSchema = z.object({
  sku: z.string().min(2, "Variant SKU must be at least 2 characters"),
  color: z.string().optional(),
  size: z.string().optional(),
  price: z.number().positive().optional(),
  stock: z.number().int().min(0),
  image: z.string().url("Variant image must be a valid URL").optional(),
});

const imageSchema = z.object({
  url: z.string().url("Image URL must be a valid URL"),
  altText: z.string().optional(),
  sortOrder: z.number().int().min(0).optional(),
  isPrimary: z.boolean().optional(),
});

export const createProductSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  sku: z.string().min(2, "SKU must be at least 2 characters"),

  shortDescription: z.string().optional(),
  description: z.string().optional(),

  categoryId: z.string().min(1, "Category is required"),
  brandId: z.string().optional(),

  price: z.number().positive("Price must be greater than 0"),
  discountPrice: z.number().positive().optional(),

  stock: z.number().int().min(0).optional(),
  lowStockAlert: z.number().int().min(0).optional(),

  material: z.string().optional(),
  weight: z.number().positive().optional(),
  warranty: z.string().optional(),

  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),

  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),

  images: z.array(imageSchema).optional(),
  variants: z.array(variantSchema).optional(),

  tagIds: z.array(z.string()).optional(),
});

/*
|--------------------------------------------------------------------------
| Product Update Schema
|--------------------------------------------------------------------------
|
| Product update-এর জন্য সব normal product fields optional।
|
| Nested fields:
| - images
| - variants
| - tagIds
|
| এগুলো পরে Service layer-এ আলাদাভাবে handle করব।
|
*/

export const updateProductSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  sku: z.string().min(2).optional(),

  shortDescription: z.string().optional(),
  description: z.string().optional(),

  categoryId: z.string().min(1).optional(),
  brandId: z.string().optional(),

  price: z.number().positive().optional(),
  discountPrice: z.number().positive().optional(),

  stock: z.number().int().min(0).optional(),
  lowStockAlert: z.number().int().min(0).optional(),

  material: z.string().optional(),
  weight: z.number().positive().optional(),
  warranty: z.string().optional(),

  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),

  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),

  images: z.array(imageSchema).optional(),
  variants: z.array(variantSchema).optional(),

  tagIds: z.array(z.string()).optional(),
});