import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface LowStockAlert {
    productId: number;
    productName: string;
    currentStock: number;
    reorderLevel: number;
    timestamp: string;
}

interface NotificationsState {
    alerts: LowStockAlert[];
}

const initialState: NotificationsState = { alerts: [] };

const notificationsSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        addAlert: (state, action: PayloadAction<LowStockAlert>) => {
            state.alerts.unshift(action.payload);
            state.alerts = state.alerts.slice(0, 10); // keep last 10, avoid unbounded growth
        },
        dismissAlert: (state, action: PayloadAction<number>) => {
            state.alerts.splice(action.payload, 1);
        },
    },
});

export const { addAlert, dismissAlert } = notificationsSlice.actions;
export default notificationsSlice.reducer;