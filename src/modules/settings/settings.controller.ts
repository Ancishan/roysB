
import { Request, Response } from "express";

import { settingsService } from "./settings.service";
import { updateSettingsSchema } from "./settings.validation";

// =====================================
// GET ALL SETTINGS (ADMIN)
// =====================================

const getSettings = async (
  req: Request,
  res: Response,
) => {
  try {
    const settings = await settingsService.getSettings();

    return res.status(200).json({
      success: true,
      message: "Settings fetched successfully",
      data: settings,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch settings",
    });
  }
};

// =====================================
// GET PUBLIC SETTINGS (CUSTOMER)
// =====================================

const getPublicSettings = async (
  req: Request,
  res: Response,
) => {
  try {
    const settings = await settingsService.getSettings();

    const publicSettings = {
      storeName: settings.storeName,
      storeEmail: settings.storeEmail,
      storePhone: settings.storePhone,
      storeAddress: settings.storeAddress,
      logoUrl: settings.logoUrl,

      deliveryCharge: settings.deliveryCharge,

      announcementEnabled: settings.announcementEnabled,
      announcementText: settings.announcementText,

      facebookUrl: settings.facebookUrl,
      instagramUrl: settings.instagramUrl,
      youtubeUrl: settings.youtubeUrl,
      tiktokUrl: settings.tiktokUrl,
    };

    return res.status(200).json({
      success: true,
      message: "Public settings fetched successfully",
      data: publicSettings,
    });
  } catch (error: any) {
    console.error("Public settings error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch public settings",
    });
  }
};

// =====================================
// UPDATE SETTINGS (ADMIN)
// =====================================

const updateSettings = async (
  req: Request,
  res: Response,
) => {
  try {
    const validation = updateSettingsSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid settings data",
        errors: validation.error.flatten(),
      });
    }

    const settings = await settingsService.updateSettings(
      validation.data,
    );

    return res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: settings,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update settings",
    });
  }
};

// =====================================
// EXPORT CONTROLLER
// =====================================

export const settingsController = {
  getSettings,
  getPublicSettings,
  updateSettings,
};
