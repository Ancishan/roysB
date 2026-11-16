
import "dotenv/config";

import http from "http";
import app from "./app";
import { initializeSocket } from "./socket";
import { prisma } from "./prisma/prisma";

const PORT = Number(process.env.PORT) || 5000;

const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);

// PostgreSQL Database Health Check
app.get("/api/health/db", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return res.status(200).json({
      success: true,
      message: "PostgreSQL Database Connected Successfully!",
      database: "Connected",
    });
  } catch (error) {
    console.error("Database connection failed:", error);

    return res.status(500).json({
      success: false,
      message: "PostgreSQL Database Connection Failed!",
      database: "Disconnected",
    });
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 ROYS Backend running on port ${PORT}`);
  console.log("🔌 Socket.IO is ready");
});
