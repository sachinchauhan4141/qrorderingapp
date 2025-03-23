import MenuItem from "../models/MenuItem.js";
import cloudinary from "cloudinary";
import fs from "fs";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addMenuItem = async (req, res) => {
  try {
    let imageUrl = "";
    if (req.files && req.files.image) {
      const result = await cloudinary.uploader.upload(req.files.image[0].path);
      imageUrl = result.secure_url;
      fs.unlinkSync(req.files.image[0].path); // Clean up temp file
    }
    const newItem = new MenuItem({
      ...req.body,
      variants: JSON.parse(req.body.variants),
      imageUrl,
    });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    let imageUrl = item.imageUrl;
    if (req.files && req.files.image) {
      const result = await cloudinary.uploader.upload(req.files.image[0].path);
      imageUrl = result.secure_url;
      fs.unlinkSync(req.files.image[0].path);
    }

    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { ...req.body, variants: JSON.parse(req.body.variants), imageUrl },
      { new: true }
    );
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (item.imageUrl) {
      const publicId = item.imageUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
