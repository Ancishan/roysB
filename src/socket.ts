
import { Server } from "socket.io";
import type { Server as HttpServer } from "http";

import { verifyToken } from "./utils/jwt";

// ==========================================
// ADMIN TOKEN PAYLOAD
// ==========================================

interface AdminTokenPayload {
  id: string;
  role: string;
}

// ==========================================
// SOCKET INSTANCE
// ==========================================

let io: Server;

// ==========================================
// INITIALIZE SOCKET.IO
// ==========================================

export const initializeSocket = (
  server: HttpServer
) => {

  io = new Server(server, {
    cors: {
      origin:
        process.env.FRONTEND_URL ||
        "http://localhost:3000",

      methods: ["GET", "POST", "PATCH"],

      credentials: true,
    },
  });

  // ==========================================
  // SOCKET ADMIN AUTHENTICATION
  // ==========================================

  io.use((socket, next) => {

    try {

      // Get cookies from browser request
      const cookieHeader =
        socket.handshake.headers.cookie || "";

      // Find admin_token cookie
      const tokenCookie = cookieHeader
        .split(";")
        .find((cookie) =>
          cookie.trim().startsWith("admin_token=")
        );

      // Extract JWT token
      const token = tokenCookie
        ? decodeURIComponent(
            tokenCookie
              .trim()
              .substring("admin_token=".length)
          )
        : null;

      if (!token) {
        return next(
          new Error("Please login first")
        );
      }

      // Verify JWT
      const decoded = verifyToken(
        token
      ) as AdminTokenPayload;

      // ==========================================
      // DEBUG LOGS
      // ==========================================

      console.log(
        "Socket Admin ID:",
        decoded.id
      );

      console.log(
        "Socket Admin Role:",
        decoded.role
      );

      // ==========================================
      // ALLOWED ADMIN ROLES
      // ==========================================

      const allowedRoles = [
        "ADMIN",
        "SUPER_ADMIN",
      ];

      const userRole = decoded.role
        ?.trim()
        .toUpperCase();

      if (
        !decoded.id ||
        !userRole ||
        !allowedRoles.includes(userRole)
      ) {
        return next(
          new Error("Admin access only")
        );
      }

      // Save authenticated Admin data
      socket.data.admin = {
        id: decoded.id,
        role: userRole,
      };

      next();

    } catch (error) {

      console.error(
        "Socket Authentication Error:",
        error
      );

      return next(
        new Error("Invalid or expired token")
      );
    }

  });

  // ==========================================
  // SOCKET CONNECTION
  // ==========================================

  io.on("connection", (socket) => {

    console.log(
      "Admin socket connected:",
      socket.id
    );

    console.log(
      "Connected Admin:",
      socket.data.admin
    );

    // Join Admin notification room
    socket.join("admins");

    // ==========================================
    // DISCONNECT
    // ==========================================

    socket.on("disconnect", () => {

      console.log(
        "Admin socket disconnected:",
        socket.id
      );

    });

  });

  return io;
};

// ==========================================
// GET SOCKET INSTANCE
// ==========================================

export const getIO = () => {

  if (!io) {
    throw new Error(
      "Socket.IO is not initialized"
    );
  }

  return io;
};
