import mongoose from "mongoose";
import dotenv from "dotenv";
import MenuItem from "./models/MenuItem.js";

dotenv.config();

const menuItems = [
  {
    name: "Grilled Chicken",
    category: "Main",
    description: "Juicy grilled chicken with herbs",
    imageUrl: "https://example.com/images/grilled-chicken.jpg",
    inStock: 1,
    isVeg: 0,
    variants: [
      { type: "Regular", size: "Medium", price: 12.99 },
      { type: "Spicy", size: "Large", price: 14.99 },
    ],
    isTopItem: true,
  },
  {
    name: "Vegetable Stir Fry",
    category: "Main",
    description: "Fresh veggies stir-fried in soy sauce",
    imageUrl: "https://example.com/images/veg-stir-fry.jpg",
    inStock: 1,
    isVeg: 1,
    variants: [
      { type: "Regular", size: "Small", price: 9.99 },
      { type: "Extra Veggies", size: "Medium", price: 11.99 },
    ],
    isTopItem: false,
  },
  {
    name: "Chocolate Cake",
    category: "Dessert",
    description: "Rich chocolate layered cake",
    imageUrl: "https://example.com/images/choco-cake.jpg",
    inStock: 1,
    isVeg: 1,
    variants: [
      { type: "Slice", size: "Single", price: 4.99 },
      { type: "Whole", size: "Large", price: 24.99 },
    ],
    isTopItem: true,
  },
  {
    name: "Beef Burger",
    category: "Main",
    description: "Classic beef patty with cheese",
    imageUrl: "https://example.com/images/beef-burger.jpg",
    inStock: 0,
    isVeg: 0,
    variants: [
      { type: "Regular", size: "Medium", price: 8.99 },
      { type: "Double Patty", size: "Large", price: 11.99 },
    ],
    isTopItem: false,
  },
  {
    name: "Margherita Pizza",
    category: "Main",
    description: "Tomato, mozzarella, and basil",
    imageUrl: "https://example.com/images/margherita-pizza.jpg",
    inStock: 1,
    isVeg: 1,
    variants: [
      { type: "Regular", size: "Medium", price: 10.99 },
      { type: "Large", size: "Large", price: 14.99 },
    ],
    isTopItem: true,
  },
  {
    name: "Lemonade",
    category: "Drinks",
    description: "Freshly squeezed lemonade",
    imageUrl: "https://example.com/images/lemonade.jpg",
    inStock: 1,
    isVeg: 1,
    variants: [
      { type: "Regular", size: "Small", price: 2.99 },
      { type: "Large", size: "Large", price: 4.99 },
    ],
    isTopItem: false,
  },
  {
    name: "BBQ Ribs",
    category: "Main",
    description: "Slow-cooked ribs with BBQ sauce",
    imageUrl: "https://example.com/images/bbq-ribs.jpg",
    inStock: 1,
    isVeg: 0,
    variants: [
      { type: "Half Rack", size: "Medium", price: 15.99 },
      { type: "Full Rack", size: "Large", price: 24.99 },
    ],
    isTopItem: false,
  },
  {
    name: "Caesar Salad",
    category: "Main",
    description: "Crisp romaine with Caesar dressing",
    imageUrl: "https://example.com/images/caesar-salad.jpg",
    inStock: 1,
    isVeg: 1,
    variants: [
      { type: "Regular", size: "Small", price: 7.99 },
      { type: "With Chicken", size: "Medium", price: 10.99 },
    ],
    isTopItem: false,
  },
  {
    name: "Ice Cream Sundae",
    category: "Dessert",
    description: "Vanilla ice cream with toppings",
    imageUrl: "https://example.com/images/ice-cream-sundae.jpg",
    inStock: 1,
    isVeg: 1,
    variants: [
      { type: "Regular", size: "Small", price: 5.99 },
      { type: "Deluxe", size: "Large", price: 8.99 },
    ],
    isTopItem: false,
  },
  {
    name: "Fish and Chips",
    category: "Main",
    description: "Crispy fried fish with fries",
    imageUrl: "https://example.com/images/fish-chips.jpg",
    inStock: 1,
    isVeg: 0,
    variants: [
      { type: "Regular", size: "Medium", price: 13.99 },
      { type: "Large", size: "Large", price: 16.99 },
    ],
    isTopItem: false,
  },
  {
    name: "Pasta Primavera",
    category: "Main",
    description: "Pasta with spring vegetables",
    imageUrl: "https://example.com/images/pasta-primavera.jpg",
    inStock: 1,
    isVeg: 1,
    variants: [
      { type: "Regular", size: "Medium", price: 11.99 },
      { type: "Large", size: "Large", price: 14.99 },
    ],
    isTopItem: false,
  },
  {
    name: "Apple Pie",
    category: "Dessert",
    description: "Warm apple pie with cinnamon",
    imageUrl: "https://example.com/images/apple-pie.jpg",
    inStock: 0,
    isVeg: 1,
    variants: [
      { type: "Slice", size: "Single", price: 3.99 },
      { type: "Whole", size: "Large", price: 19.99 },
    ],
    isTopItem: false,
  },
  {
    name: "Steak",
    category: "Main",
    description: "Grilled ribeye steak",
    imageUrl: "https://example.com/images/steak.jpg",
    inStock: 1,
    isVeg: 0,
    variants: [
      { type: "Medium Rare", size: "Medium", price: 19.99 },
      { type: "Well Done", size: "Large", price: 22.99 },
    ],
    isTopItem: true,
  },
  {
    name: "Mango Smoothie",
    category: "Drinks",
    description: "Blended mango and yogurt",
    imageUrl: "https://example.com/images/mango-smoothie.jpg",
    inStock: 1,
    isVeg: 1,
    variants: [
      { type: "Regular", size: "Small", price: 4.99 },
      { type: "Large", size: "Large", price: 6.99 },
    ],
    isTopItem: false,
  },
  {
    name: "Chicken Wings",
    category: "Main",
    description: "Spicy buffalo wings",
    imageUrl: "https://example.com/images/chicken-wings.jpg",
    inStock: 1,
    isVeg: 0,
    variants: [
      { type: "6 Pieces", size: "Small", price: 8.99 },
      { type: "12 Pieces", size: "Large", price: 15.99 },
    ],
    isTopItem: false,
  },
  {
    name: "Tiramisu",
    category: "Dessert",
    description: "Coffee-flavored Italian dessert",
    imageUrl: "https://example.com/images/tiramisu.jpg",
    inStock: 1,
    isVeg: 1,
    variants: [
      { type: "Slice", size: "Single", price: 6.99 },
      { type: "Whole", size: "Large", price: 29.99 },
    ],
    isTopItem: false,
  },
  {
    name: "Shrimp Scampi",
    category: "Main",
    description: "Shrimp in garlic butter sauce",
    imageUrl: "https://example.com/images/shrimp-scampi.jpg",
    inStock: 1,
    isVeg: 0,
    variants: [
      { type: "Regular", size: "Medium", price: 16.99 },
      { type: "Large", size: "Large", price: 19.99 },
    ],
    isTopItem: false,
  },
  {
    name: "Cola",
    category: "Drinks",
    description: "Classic carbonated drink",
    imageUrl: "https://example.com/images/cola.jpg",
    inStock: 1,
    isVeg: 1,
    variants: [
      { type: "Can", size: "Small", price: 1.99 },
      { type: "Bottle", size: "Large", price: 3.99 },
    ],
    isTopItem: false,
  },
  {
    name: "Lamb Curry",
    category: "Main",
    description: "Spicy lamb in curry sauce",
    imageUrl: "https://example.com/images/lamb-curry.jpg",
    inStock: 0,
    isVeg: 0,
    variants: [
      { type: "Regular", size: "Medium", price: 14.99 },
      { type: "Large", size: "Large", price: 17.99 },
    ],
    isTopItem: false,
  },
  {
    name: "Cheesecake",
    category: "Dessert",
    description: "Creamy cheesecake with graham crust",
    imageUrl: "https://example.com/images/cheesecake.jpg",
    inStock: 1,
    isVeg: 1,
    variants: [
      { type: "Slice", size: "Single", price: 5.99 },
      { type: "Whole", size: "Large", price: 27.99 },
    ],
    isTopItem: true,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    await MenuItem.deleteMany({});
    console.log("Cleared existing menu items");

    await MenuItem.insertMany(menuItems);
    console.log("Inserted 20 dummy menu items");

    mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error seeding database:", error);
    mongoose.connection.close();
  }
};

seedDatabase();
