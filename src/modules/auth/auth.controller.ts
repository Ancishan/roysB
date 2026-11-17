
import { Request, Response } from "express";
import { loginValidation } from "./auth.validation";
import { loginAdmin } from "./auth.service";
import { ZodError } from "zod";

export async function login(req: Request, res: Response) {
  try {
    const data = loginValidation.parse(req.body);

    const result = await loginAdmin(data);

    res.cookie("admin_token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      admin: result.admin,
    });

  } catch (error: any) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid login information",
        errors: error.issues,
      });
    }

    if (
      error.message === "Invalid email or password" ||
      error.message === "Admin account inactive"
    ) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Admin login error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
