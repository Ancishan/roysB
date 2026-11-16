
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import categoryRoutes from "./modules/category/category.route";
import brandRoutes from "./modules/brand/brand.route";
import productRoutes from "./modules/product/product.route";
import tagRoutes from "./modules/tag/tag.route";
import reviewRoutes from "./modules/review/review.route";
import orderRoutes from "./modules/order/order.route";
import authRoutes from "./modules/auth/auth.routes";
import adminRoutes from "./modules/admin/admin.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";
import analyticsRoutes from "./modules/analytics/analytics.routes";
import notificationRoutes from "./modules/notification/notification.route";
import settingsRoutes from "./modules/settings/settings.route";
import aboutRoutes from "./modules/about/about.routes";

const app = express();

// Allowed frontend origins
const allowedOrigins = new Set(
  [
    "https://roys-self.vercel.app",
    "http://localhost:3000",
   
    process.env.FRONTEND_URL,
  ].filter((value): value is string => Boolean(value))
);

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked for origin: ${origin}`)
      );
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Backend health check
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "ROYS Backend API is running 🚀",
  });
});

// API routes
app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/products", productRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/orders", orderRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/about", aboutRoutes);

// Uploaded files
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

export default app;
