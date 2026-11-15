
import "dotenv/config";

import http from "http";
import app from "./app";
import { initializeSocket } from "./socket";

const PORT = Number(process.env.PORT) || 5000;

const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 ROYS Backend running on port ${PORT}`);
  console.log("🔌 Socket.IO is ready");
});
