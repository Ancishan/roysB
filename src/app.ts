import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import categoryRoutes from "./modules/category/category.route";
import brandRoutes from "./modules/brand/brand.route";
import productRoutes from "./modules/product/product.route";
import tagRoutes from "./modules/tag/tag.route";
import reviewRoutes from "./modules/review/review.route";
import orderRoutes from "./modules/order/order.route";
import authRoutes from "./modules/auth/auth.routes"
import adminRoutes from "./modules/admin/admin.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";
import analyticsRoutes from "./modules/analytics/analytics.routes";
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "ROYS Backend API is running 🚀",
  });
});

app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/products", productRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/dashboard",dashboardRoutes);
app.use("/api/analytics",analyticsRoutes);

export default app;


