import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";
import type { CreateOrderDto, OrderResponseDto } from "../../types/order";

export interface CartItem {
    productId: number;
    sku: string;
    name: string;
    price: number;
    quantity: number;
    availableStock: number;
}

interface CartState {
    items: CartItem[];
    checkoutStatus: "idle" | "loading" | "failed";
    checkoutError: string | null;
    lastOrder: OrderResponseDto | null;
}

const initialState: CartState = {
    items: [],
    checkoutStatus: "idle",
    checkoutError: null,
    lastOrder: null,
};

export const checkout = createAsyncThunk(
    "cart/checkout",
    async (dto: CreateOrderDto, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post<OrderResponseDto>("/orders/checkout", dto);
            return response.data;
        } catch {
            return rejectWithValue("Checkout failed — check stock availability.");
        }
    }
);

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<CartItem>) => {
            const existing = state.items.find((i) => i.productId === action.payload.productId);
            if (existing) {
                if (existing.quantity < existing.availableStock) {
                    existing.quantity += 1;
                }
            } else {
                state.items.push({ ...action.payload, quantity: 1 });
            }
        },
        removeItem: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter((i) => i.productId !== action.payload);
        },
        updateQuantity: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
            const item = state.items.find((i) => i.productId === action.payload.productId);
            if (item && action.payload.quantity > 0 && action.payload.quantity <= item.availableStock) {
                item.quantity = action.payload.quantity;
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.lastOrder = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkout.pending, (state) => {
                state.checkoutStatus = "loading";
                state.checkoutError = null;
            })
            .addCase(checkout.fulfilled, (state, action) => {
                state.checkoutStatus = "idle";
                state.lastOrder = action.payload;
                state.items = [];
            })
            .addCase(checkout.rejected, (state, action) => {
                state.checkoutStatus = "failed";
                state.checkoutError = action.payload as string;
            });
    },
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;