import { configureStore } from "@reduxjs/toolkit";
import menuReducer from "./menuSlice";
import orderReducer from "./orderSlice";
import cartReducer from "./cartSlice";

export const store = configureStore({
  reducer: {
    menu: menuReducer,
    orders: orderReducer,
    cart: cartReducer,
  },
});
