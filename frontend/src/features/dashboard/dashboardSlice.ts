import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";
import type { DashboardSummaryDto } from "../../types/dashboard";

interface DashboardState {
    summary: DashboardSummaryDto | null;
    status: "idle" | "loading" | "failed";
    error: string | null;
}

const initialState: DashboardState = {
    summary: null,
    status: "idle",
    error: null,
};

export const fetchDashboardSummary = createAsyncThunk(
    "dashboard/fetchSummary",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get<DashboardSummaryDto>("/dashboard/summary");
            return response.data;
        } catch {
            return rejectWithValue("Failed to load dashboard data.");
        }
    }
);

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardSummary.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
                state.status = "idle";
                state.summary = action.payload;
            })
            .addCase(fetchDashboardSummary.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            });
    },
});

export default dashboardSlice.reducer;