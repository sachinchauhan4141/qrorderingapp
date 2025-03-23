import express from "express";
import {
  getOrders,
  updateOrderStatus,
  createOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.get("/", getOrders);
router.put("/:id", updateOrderStatus);
router.post("/", createOrder);

export default router;
