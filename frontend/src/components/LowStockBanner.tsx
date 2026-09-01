import { useAppDispatch, useAppSelector } from "../app/hooks";
import { dismissAlert } from "../features/notifications/notificationsSlice";

export default function LowStockBanner() {
    const dispatch = useAppDispatch();
    const alerts = useAppSelector((state) => state.notifications.alerts);

    if (alerts.length === 0) return null;

    return (
        <div style={{ position: "fixed", top: 70, right: 12, zIndex: 1000, width: 280 }}>
            {alerts.map((alert, index) => (
                <div
                    key={`${alert.productId}-${alert.timestamp}`}
                    style={{
                        background: "#7a1f1f",
                        color: "#fff",
                        padding: "10px 14px",
                        borderRadius: 6,
                        marginBottom: 8,
                        fontSize: 14,
                    }}
                >
                    <strong>Low stock:</strong> {alert.productName} — {alert.currentStock} left
                    <button
                        onClick={() => dispatch(dismissAlert(index))}
                        style={{ float: "right", background: "none", border: "none", color: "#fff", cursor: "pointer" }}
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
}