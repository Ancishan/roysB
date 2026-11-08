import { Request, Response } from "express";

import { categoryService } from "./category.service";

import {
  createCategorySchema,
  updateCategorySchema,
} from "./category.validation";

const createCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const data = createCategorySchema.parse(req.body);

    const category =
      await categoryService.createCategory(data);

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message:
        error.message || "Failed to create category",
    });
  }
};

const getCategories = async (
  _req: Request,
  res: Response
) => {
  try {
    const categories =
      await categoryService.getCategories();

    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message:
        error.message || "Failed to retrieve categories",
    });
  }
};

const getCategoryById = async (
  req: Request,
  res: Response
) => {
  try {
    const category =
      await categoryService.getCategoryById(
        req.params.id
      );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category retrieved successfully",
      data: category,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message:
        error.message || "Failed to retrieve category",
    });
  }
};

const updateCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const data =
      updateCategorySchema.parse(req.body);

    const category =
      await categoryService.updateCategory(
        req.params.id,
        data
      );

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message:
        error.message || "Failed to update category",
    });
  }
};

const deleteCategory = async (
  req: Request,
  res: Response
) => {
  try {
    await categoryService.deleteCategory(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error: any) {
    const message =
      error.message || "Failed to delete category";

    if (message === "Category not found") {
      return res.status(404).json({
        success: false,
        message,
      });
    }

    if (
      message ===
        "Cannot delete category because it has subcategories" ||
      message ===
        "Cannot delete category because it has products"
    ) {
      return res.status(409).json({
        success: false,
        message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const categoryController = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};