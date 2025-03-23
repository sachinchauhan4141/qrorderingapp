import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  tableNumber: { type: String, required: true },
  items: [{ itemId: mongoose.Schema.Types.ObjectId, quantity: Number }],
  status: { type: String, default: "Pending" },
  notes: { type: String },
  paymentMethod: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
