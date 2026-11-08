import { Request, Response } from "express";

import { reviewService } from "./review.service";

import {
  createReviewSchema,
  updateReviewSchema,
} from "./review.validation";

// CREATE REVIEW
const createReview = async (
  req: Request,
  res: Response
) => {
  try {
    const data =
      createReviewSchema.parse(req.body);

    const review =
      await reviewService.createReview(data);

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  } catch (error: any) {
    const message =
      error.message ||
      "Failed to create review";

    if (message === "Product not found") {
      return res.status(404).json({
        success: false,
        message,
      });
    }

    res.status(400).json({
      success: false,
      message,
    });
  }
};

// GET ALL REVIEWS
const getReviews = async (
  _req: Request,
  res: Response
) => {
  try {
    const reviews =
      await reviewService.getReviews();

    res.status(200).json({
      success: true,
      message: "Reviews retrieved successfully",
      data: reviews,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to retrieve reviews",
    });
  }
};

// GET REVIEW BY ID
const getReviewById = async (
  req: Request,
  res: Response
) => {
  try {
    const review =
      await reviewService.getReviewById(
        req.params.id
      );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review retrieved successfully",
      data: review,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to retrieve review",
    });
  }
};

// UPDATE REVIEW
const updateReview = async (
  req: Request,
  res: Response
) => {
  try {
    const data =
      updateReviewSchema.parse(req.body);

    const review =
      await reviewService.updateReview(
        req.params.id,
        data
      );

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });
  } catch (error: any) {
    const message =
      error.message ||
      "Failed to update review";

    if (message === "Review not found") {
      return res.status(404).json({
        success: false,
        message,
      });
    }

    res.status(400).json({
      success: false,
      message,
    });
  }
};

// DELETE REVIEW
const deleteReview = async (
  req: Request,
  res: Response
) => {
  try {
    await reviewService.deleteReview(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error: any) {
    const message =
      error.message ||
      "Failed to delete review";

    if (message === "Review not found") {
      return res.status(404).json({
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

export const reviewController = {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
};