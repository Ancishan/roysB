import { Router } from "express";

import { reviewController } from "./review.controller";

import {
  authMiddleware,
} from "../../middleware/auth.middleware";

const router = Router();

// PUBLIC: Customer can submit review
router.post(
  "/",
  reviewController.createReview
);

// PUBLIC: Only approved reviews should be exposed
// Ideally use a separate public endpoint

// ADMIN: Get all reviews
router.get(
  "/",
  authMiddleware,
  reviewController.getReviews
);

// ADMIN: Get review details
router.get(
  "/:id",
  authMiddleware,
  reviewController.getReviewById
);

// ADMIN: Approve / Unapprove
router.patch(
  "/:id",
  authMiddleware,
  reviewController.updateReview
);

// ADMIN: Delete review
router.delete(
  "/:id",
  authMiddleware,
  reviewController.deleteReview
);

export default router;