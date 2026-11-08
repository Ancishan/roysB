import { Router } from "express";

import { brandController } from "./brand.controller";

import {
  authMiddleware
} from "../../middleware/auth.middleware";


const router = Router();


// Admin only
router.post(
  "/",
  authMiddleware,
  brandController.createBrand
);


router.get(
  "/",
  brandController.getBrands
);


router.get(
  "/:id",
  brandController.getBrandById
);


// Admin only
router.patch(
  "/:id",
  authMiddleware,
  brandController.updateBrand
);


// Admin only
router.delete(
  "/:id",
  authMiddleware,
  brandController.deleteBrand
);


export default router;