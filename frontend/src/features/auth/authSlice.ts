import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";
import type { LoginDto, AuthResponseDto } from "../../types/auth";

interface AuthState {
    userId: number | null;
    token: string | null;
    name: string | null;
    role: string | null;
    status: "idle" | "loading" | "failed";
    error: string | null;
}

const initialState: AuthState = {
    userId: localStorage.getItem("userId") ? Number(localStorage.getItem("userId")) : null,
    token: localStorage.getItem("token"),
    name: localStorage.getItem("name"),
    role: localStorage.getItem("role"),
    status: "idle",
    error: null,
};

export const login = createAsyncThunk(
    "auth/login",
    async (credentials: LoginDto, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post<AuthResponseDto>("/auth/login", credentials);
            return response.data;
        } catch {
            return rejectWithValue("Invalid email or password.");
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.token = null;
            state.name = null;
            state.role = null;
            state.userId = null;
            localStorage.removeItem("userId");
            localStorage.removeItem("token");
            localStorage.removeItem("name");
            localStorage.removeItem("role");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponseDto>) => {
                state.status = "idle";
                state.token = action.payload.token;
                state.name = action.payload.name;
                state.role = action.payload.role;
                state.userId = action.payload.userId;
                localStorage.setItem("userId", action.payload.userId.toString());
                localStorage.setItem("token", action.payload.token);
                localStorage.setItem("name", action.payload.name);
                localStorage.setItem("role", action.payload.role);
            })
            .addCase(login.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;