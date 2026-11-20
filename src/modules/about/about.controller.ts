
import type { Request, Response } from "express";
import { aboutService } from "./about.service";
import { getParamId } from "../../utils/getParamId";

const handleError = (res: Response, error: unknown) => {
  const message =
    error instanceof Error
      ? error.message
      : "Something went wrong.";

  const isValidationError =
    message.toLowerCase().includes("required");

  return res.status(isValidationError ? 400 : 500).json({
    success: false,
    message,
  });
};

export const aboutController = {
  // PUBLIC ABOUT
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

  // ADMIN ABOUT
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

  // UPDATE COMPANY INFORMATION
  async updateAboutPage(req: Request, res: Response) {
    try {
      const data = await aboutService.updateAboutPage(
        req.body ?? {}
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
  async createTeamMember(req: Request, res: Response) {
    try {
      // imageUrl will contain the Cloudinary secure URL.
      const data = await aboutService.createTeamMember(
        req.body ?? {}
      );

      return res.status(201).json({
        success: true,
        message: "Team member added successfully.",
        data,
      });
    } catch (error) {
      return handleError(res, error);
    }
  },

  // UPDATE TEAM MEMBER
  async updateTeamMember(req: Request, res: Response) {
    try {
      const data = await aboutService.updateTeamMember(
        getParamId(req.params.id),
        req.body ?? {}
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
      await aboutService.deleteTeamMember(
        getParamId(req.params.id)
      );

      return res.status(200).json({
        success: true,
        message: "Team member deleted successfully.",
      });
    } catch (error) {
      return handleError(res, error);
    }
  },

  // CREATE GOAL / FEATURE
  async createFeature(req: Request, res: Response) {
    try {
      const data = await aboutService.createFeature(
        req.body ?? {}
      );

      return res.status(201).json({
        success: true,
        message: "Goal added successfully.",
        data,
      });
    } catch (error) {
      return handleError(res, error);
    }
  },

  // UPDATE GOAL / FEATURE
  async updateFeature(req: Request, res: Response) {
    try {
      const data = await aboutService.updateFeature(
        getParamId(req.params.id),
        req.body ?? {}
      );

      return res.status(200).json({
        success: true,
        message: "Goal updated successfully.",
        data,
      });
    } catch (error) {
      return handleError(res, error);
    }
  },

  // DELETE GOAL / FEATURE
  async deleteFeature(req: Request, res: Response) {
    try {
      await aboutService.deleteFeature(
        getParamId(req.params.id)
      );

      return res.status(200).json({
        success: true,
        message: "Goal deleted successfully.",
      });
    } catch (error) {
      return handleError(res, error);
    }
  },
};
