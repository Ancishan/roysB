import { Router } from "express";

import { productController } from "./product.controller";

import {
  authMiddleware
} from "../../middleware/auth.middleware";


const router = Router();


// Admin only
router.post(
  "/",
  authMiddleware,
  productController.createProduct
);


// Public
router.get(
  "/",
  productController.getProducts
);


router.get(
  "/:id",
  productController.getProductById
);


// Admin only
router.patch(
  "/:id",
  authMiddleware,
  productController.updateProduct
);


// Admin only
router.delete(
  "/:id",
  authMiddleware,
  productController.deleteProduct
);


export default router;