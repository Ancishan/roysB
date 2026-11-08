import { Request, Response } from "express";

import { tagService } from "./tag.service";

import {
  createTagSchema,
  updateTagSchema,
} from "./tag.validation";


// --------------------------------------------------
// CREATE TAG
// --------------------------------------------------

const createTag = async (
  req: Request,
  res: Response
) => {
  try {
    const data =
      createTagSchema.parse(req.body);

    const tag =
      await tagService.createTag(data);

    res.status(201).json({
      success: true,
      message: "Tag created successfully",
      data: tag,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to create tag",
    });
  }
};


// --------------------------------------------------
// GET ALL TAGS
// --------------------------------------------------

const getTags = async (
  _req: Request,
  res: Response
) => {
  try {
    const tags =
      await tagService.getTags();

    res.status(200).json({
      success: true,
      message: "Tags retrieved successfully",
      data: tags,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to retrieve tags",
    });
  }
};


// --------------------------------------------------
// GET TAG BY ID
// --------------------------------------------------

const getTagById = async (
  req: Request,
  res: Response
) => {
  try {
    const tag =
      await tagService.getTagById(
        req.params.id
      );

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tag retrieved successfully",
      data: tag,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to retrieve tag",
    });
  }
};


// --------------------------------------------------
// UPDATE TAG
// --------------------------------------------------

const updateTag = async (
  req: Request,
  res: Response
) => {
  try {
    const data =
      updateTagSchema.parse(req.body);

    const tag =
      await tagService.updateTag(
        req.params.id,
        data
      );

    res.status(200).json({
      success: true,
      message: "Tag updated successfully",
      data: tag,
    });
  } catch (error: any) {
    const message =
      error.message ||
      "Failed to update tag";

    if (message === "Tag not found") {
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


// --------------------------------------------------
// DELETE TAG
// --------------------------------------------------

const deleteTag = async (
  req: Request,
  res: Response
) => {
  try {
    await tagService.deleteTag(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Tag deleted successfully",
    });
  } catch (error: any) {
    const message =
      error.message ||
      "Failed to delete tag";

    if (message === "Tag not found") {
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


export const tagController = {
  createTag,
  getTags,
  getTagById,
  updateTag,
  deleteTag,
};