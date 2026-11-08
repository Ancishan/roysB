import { Request, Response } from "express";

import { productService } from "./product.service";

import { createProductSchema, updateProductSchema } from "./product.validation";

// --------------------------------------------------
// CREATE PRODUCT
// --------------------------------------------------

const createProduct = async (req: Request, res: Response) => {
  try {
    const data = createProductSchema.parse(req.body);

    const product = await productService.createProduct(data);

    return res.status(201).json({
      success: true,

      message: "Product created successfully",

      data: product,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,

      message: error.message || "Failed to create product",
    });
  }
};

// --------------------------------------------------
// GET ALL PRODUCTS
// --------------------------------------------------

const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await productService.getProducts();

    return res.status(200).json({
      success: true,

      message: "Products retrieved successfully",

      data: products,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,

      message: error.message || "Failed to retrieve products",
    });
  }
};

// --------------------------------------------------
// GET PRODUCT BY ID
// --------------------------------------------------

const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await productService.getProductById(
      req.params.id as string,
    );

    if (!product) {
      return res.status(404).json({
        success: false,

        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,

      message: "Product retrieved successfully",

      data: product,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,

      message: error.message || "Failed to retrieve product",
    });
  }
};

// --------------------------------------------------
// UPDATE PRODUCT
// --------------------------------------------------

const updateProduct = async (req: Request, res: Response) => {
  try {
    const data = updateProductSchema.parse(req.body);

    const product = await productService.updateProduct(
      req.params.id as string,

      data,
    );

    return res.status(200).json({
      success: true,

      message: "Product updated successfully",

      data: product,
    });
  } catch (error: any) {
    const message = error.message || "Failed to update product";

    if (message === "Product not found") {
      return res.status(404).json({
        success: false,

        message,
      });
    }

    return res.status(400).json({
      success: false,

      message,
    });
  }
};

// --------------------------------------------------
// DELETE PRODUCT
// --------------------------------------------------

const deleteProduct = async (req: Request, res: Response) => {
  try {
    await productService.deleteProduct(req.params.id as string);

    return res.status(200).json({
      success: true,

      message: "Product deleted successfully",
    });
  } catch (error: any) {
    const message = error.message || "Failed to delete product";

    if (message === "Product not found") {
      return res.status(404).json({
        success: false,

        message,
      });
    }

    return res.status(500).json({
      success: false,

      message: "Internal server error",
    });
  }
};

export const productController = {
  createProduct,

  getProducts,

  getProductById,

  updateProduct,

  deleteProduct,
};
