import { Request, Response } from "express";

import { dashboardService } from "./dashboard.service";

const getDashboardData = async (req: Request, res: Response) => {
  try {
    const data = await dashboardService.getDashboardData();

    return res.status(200).json({
      success: true,

      message: "Dashboard data retrieved successfully",

      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,

      message: error.message || "Dashboard error",
    });
  }
};

export const dashboardController = {
  getDashboardData,
};
