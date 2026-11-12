
import type { Request, Response } from "express";
import { aboutService } from "./about.service";

const handleError = (res: Response, error: unknown) => {
  const message =
    error instanceof Error
      ? error.message
      : "Something went wrong.";

  const isValidationError =
    message.includes("required");

  return res.status(isValidationError ? 400 : 500).json({
    success: false,
    message,
  });
};

export const aboutController = {
  // GET PUBLIC ABOUT PAGE
  async getPublicAbout(_req: Request, res: Response) {
    try {
      const data = await aboutService.getPublicAbout();

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      return handleError(res, error);
    }
  },

  // GET ADMIN ABOUT PAGE
  async getAdminAbout(_req: Request, res: Response) {
    try {
      const data = await aboutService.getAdminAbout();

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      return handleError(res, error);
    }
  },

  // UPDATE ABOUT PAGE
  async updateAboutPage(req: Request, res: Response) {
    try {
      const data = await aboutService.updateAboutPage(
        req.body ?? {},
      );

      return res.status(200).json({
        success: true,
        message: "About page updated successfully.",
        data,
      });
    } catch (error) {
      return handleError(res, error);
    }
  },

  // CREATE TEAM MEMBER
createTeamMember: async (req: Request, res: Response) => {
  try {
    const imageUrl = req.file
      ? `/uploads/team/${req.file.filename}`
      : "";

    const result = await aboutService.createTeamMember({
      ...req.body,
      imageUrl,
      displayOrder: Number(req.body.displayOrder || 0),
    });

    return res.status(201).json({
      success: true,
      message: "Team member added successfully.",
      data: result,
    });
  } catch (error) {
    return handleError(res, error);
  }
},

  // UPDATE TEAM MEMBER
  async updateTeamMember(req: Request, res: Response) {
    try {
      const data = await aboutService.updateTeamMember(
        req.params.id,
        req.body ?? {},
      );

      return res.status(200).json({
        success: true,
        message: "Team member updated successfully.",
        data,
      });
    } catch (error) {
      return handleError(res, error);
    }
  },

  // DELETE TEAM MEMBER
  async deleteTeamMember(req: Request, res: Response) {
    try {
      await aboutService.deleteTeamMember(req.params.id);

      return res.status(200).json({
        success: true,
        message: "Team member deleted successfully.",
      });
    } catch (error) {
      return handleError(res, error);
    }
  },

  // CREATE FEATURE
  async createFeature(req: Request, res: Response) {
    try {
      const data = await aboutService.createFeature(
        req.body ?? {},
      );

      return res.status(201).json({
        success: true,
        message: "Feature added successfully.",
        data,
      });
    } catch (error) {
      return handleError(res, error);
    }
  },

  // UPDATE FEATURE
  async updateFeature(req: Request, res: Response) {
    try {
      const data = await aboutService.updateFeature(
        req.params.id,
        req.body ?? {},
      );

      return res.status(200).json({
        success: true,
        message: "Feature updated successfully.",
        data,
      });
    } catch (error) {
      return handleError(res, error);
    }
  },

  // DELETE FEATURE
  async deleteFeature(req: Request, res: Response) {
    try {
      await aboutService.deleteFeature(req.params.id);

      return res.status(200).json({
        success: true,
        message: "Feature deleted successfully.",
      });
    } catch (error) {
      return handleError(res, error);
    }
  },
};
