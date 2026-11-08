import { Router } from "express";

import { tagController } from "./tag.controller";

const router = Router();

router.post(
  "/",
  tagController.createTag
);

router.get(
  "/",
  tagController.getTags
);

router.get(
  "/:id",
  tagController.getTagById
);

router.patch(
  "/:id",
  tagController.updateTag
);

router.delete(
  "/:id",
  tagController.deleteTag
);

export default router;