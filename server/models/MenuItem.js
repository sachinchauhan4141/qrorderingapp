import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
  inStock: { type: Number, default: 1 },
  isVeg: { type: Number, default: 0 },
  variants: [{ type: { type: String }, size: String, price: Number }],
  isTopItem: { type: Boolean, default: false },
});

export default mongoose.model("MenuItem", menuItemSchema);
