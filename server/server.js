import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

// Create Express app using HTTP server
const app = express();
const server = http.createServer(app);

// Initialize socket.io server
export const io = new Server(server, {
  cors: { origin: "*" },
});

// Store Online Users
export const userSocketMap = {}; // { userId: socketId }

// Socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("🔗 New Socket Connected:");
  console.log("   → socket.id:", socket.id);
  console.log("   → userId:", userId);

  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(" Added user:", userId);
  } else {
    console.log(" No userId received in handshake!");
  }

  // Emit online users to all connected clients
  const onlineUsers = Object.keys(userSocketMap);
  console.log(" Emitting Online Users:", onlineUsers);
  io.emit("getOnlineUsers", onlineUsers);

  socket.on("disconnect", () => {
    console.log(" User Disconnected:", userId);
    delete userSocketMap[userId];
    const updatedUsers = Object.keys(userSocketMap);
    console.log(" Updated Online Users after disconnect:", updatedUsers);
    io.emit("getOnlineUsers", updatedUsers);
  });
});

// Middleware setup
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// Routes Setup
app.use("/api/status", (req, res) => {
  res.send("Server is live");
});
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Connect to MongoDB
await connectDB();

const PORT = process.env.PORT || 5000; // fallback for local dev

server.listen(PORT, () => {
  console.log(` Server is running on port: ${PORT}`);
});


export default server;