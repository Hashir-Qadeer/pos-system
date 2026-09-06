import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import productsReducer from "../features/products/productsSlice";
import cartReducer from "../features/cart/cartSlice";
import categoriesReducer from "../features/categories/categoriesSlice";
import notificationsReducer from "../features/notifications/notificationsSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productsReducer,
        cart: cartReducer,
        categories: categoriesReducer,
        notifications: notificationsReducer,
        dashboard: dashboardReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;