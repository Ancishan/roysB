import { Router } from "express";

import { categoryController } from "./category.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();
router.post(
  "/",
  authMiddleware,
  categoryController.createCategory
);

router.patch(
  "/:id",
  authMiddleware,
  categoryController.updateCategory
);

router.delete(
  "/:id",
  authMiddleware,
  categoryController.deleteCategory
);
router.get(
  "/",
  categoryController.getCategories
);


router.get(
  "/:id",
  categoryController.getCategoryById
);

export default router;