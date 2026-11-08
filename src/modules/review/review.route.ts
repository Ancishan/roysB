import { Router } from "express";

import { reviewController } from "./review.controller";

const router = Router();

// CREATE REVIEW
router.post(
  "/",
  reviewController.createReview
);

// GET ALL REVIEWS
router.get(
  "/",
  reviewController.getReviews
);

// GET REVIEW BY ID
router.get(
  "/:id",
  reviewController.getReviewById
);

// UPDATE REVIEW
router.patch(
  "/:id",
  reviewController.updateReview
);

// DELETE REVIEW
router.delete(
  "/:id",
  reviewController.deleteReview
);

export default router;