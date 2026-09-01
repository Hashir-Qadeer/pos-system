import { useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addAlert, type LowStockAlert } from "../features/notifications/notificationsSlice";

export function useInventoryHub() {
    const dispatch = useAppDispatch();
    const token = useAppSelector((state) => state.auth.token);

    useEffect(() => {
        if (!token) return;

        const connection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7154/hubs/inventory")
            .withAutomaticReconnect()
            .build();

        connection.on("LowStockAlert", (data: LowStockAlert) => {
            dispatch(addAlert(data));
        });

        connection.start().catch((err) => console.error("SignalR connection failed:", err));

        return () => {
            connection.stop();
        };
    }, [token, dispatch]);
}