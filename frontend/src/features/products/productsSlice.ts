import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";
import type { ProductDto } from "../../types/product";

interface ProductsState {
    items: ProductDto[];
    status: "idle" | "loading" | "failed";
    error: string | null;
}

const initialState: ProductsState = {
    items: [],
    status: "idle",
    error: null,
};

export const fetchProducts = createAsyncThunk(
    "products/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get<ProductDto[]>("/products");
            return response.data;
        } catch {
            return rejectWithValue("Failed to load products.");
        }
    }
);

export interface CreateProductDto {
    sku: string;
    name: string;
    price: number;
    stockQty: number;
    reorderLevel: number;
    categoryId: number;
}

export const createProduct = createAsyncThunk(
    "products/create",
    async (dto: CreateProductDto, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post<ProductDto>("/products", dto);
            return response.data;
        } catch {
            return rejectWithValue("SKU already exists or category is invalid.");
        }
    }
);

export const deleteProduct = createAsyncThunk(
    "products/delete",
    async (id: number, { rejectWithValue }) => {
        try {
            await axiosClient.delete(`/ products / ${ id } `);
            return id;
        } catch {
            return rejectWithValue("Failed to delete product.");
        }
    }
);

const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch products
            .addCase(fetchProducts.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = "idle";
                state.items = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })

            // Create product
            .addCase(createProduct.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.status = "idle";
                state.items.push(action.payload);
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })

            // Delete product
            .addCase(deleteProduct.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.status = "idle";
                state.items = state.items.filter(
                    (product) => product.id !== action.payload
                );
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            });
    },
});

export default productsSlice.reducer;

