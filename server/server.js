import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";
import stripeLib from "stripe";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import menuRoutes from "./routes/menu.js";
import orderRoutes from "./routes/order.js";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const stripe = stripeLib(process.env.STRIPE_SECRET_KEY);

const upload = multer({ dest: "uploads/" });

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(
  "/api/menu",
  upload.fields([{ name: "image", maxCount: 1 }]),
  menuRoutes
);
app.use("/api/orders", orderRoutes);

app.post("/api/orders/payment", async (req, res) => {
  const { amount, orderId } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      metadata: { orderId },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/feedback", (req, res) => {
  console.log("Feedback received:", req.body);
  res.status(201).json({ message: "Feedback submitted" });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("joinOrder", (orderId) => {
    socket.join(orderId);
  });
  socket.on("disconnect", () => console.log("Client disconnected"));
});

const broadcastOrderUpdate = (order) => {
  io.to(order._id).emit("orderUpdate", order);
};

app.set("broadcastOrderUpdate", broadcastOrderUpdate);

// Serve Vite React build
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));