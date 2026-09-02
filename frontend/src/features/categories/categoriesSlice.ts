import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";
import type { CategoryDto, CreateCategoryDto } from "../../types/category";

interface CategoriesState {
    items: CategoryDto[];
    status: "idle" | "loading" | "failed";
    error: string | null;
}

const initialState: CategoriesState = {
    items: [],
    status: "idle",
    error: null,
};

export const fetchCategories = createAsyncThunk(
    "categories/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get<CategoryDto[]>("/categories");
            return response.data;
        } catch {
            return rejectWithValue("Failed to load categories.");
        }
    }
);

export const createCategory = createAsyncThunk(
    "categories/create",
    async (dto: CreateCategoryDto, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post<CategoryDto>("/categories", dto);
            return response.data;
        } catch {
            return rejectWithValue("Category name already exists.");
        }
    }
);

export const deleteCategory = createAsyncThunk(
    "categories/delete",
    async (id: number, { rejectWithValue }) => {
        try {
            await axiosClient.delete(`/categories/${id}`);
            return id;
        } catch {
            return rejectWithValue("Cannot delete — category still has active products.");
        }
    }
);

const categoriesSlice = createSlice({
    name: "categories",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.status = "idle";
                state.items = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.items = state.items.filter((c) => c.id !== action.payload);
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export default categoriesSlice.reducer;