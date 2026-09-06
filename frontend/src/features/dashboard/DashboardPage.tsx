import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchDashboardSummary } from "./dashboardSlice";
import AppShell from "../../components/AppShell";

function StatCard({ label, value, tone }: { label: string; value: string; tone?: "warning" }) {
    return (
        <div className="card">
            <div className="muted" style={{ fontSize: 13 }}>{label}</div>
            <div
                style={{
                    fontFamily: "Space Grotesk",
                    fontWeight: 700,
                    fontSize: 32,
                    marginTop: 6,
                    color: tone === "warning" ? "var(--warning)" : "var(--text)",
                }}
            >
                {value}
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const dispatch = useAppDispatch();
    const { summary, status, error } = useAppSelector((state) => state.dashboard);

    useEffect(() => {
        dispatch(fetchDashboardSummary());
    }, [dispatch]);

    return (
        <AppShell>
            <h1>Dashboard</h1>
            <p className="muted">Today's performance at a glance.</p>

            {status === "loading" && <p className="muted" style={{ marginTop: 20 }}>Loading...</p>}
            {error && <p className="error-text">{error}</p>}

            {summary && (
                <>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                            gap: 16,
                            marginTop: 24,
                        }}
                    >
                        <StatCard label="Today's sales" value={`Rs. ${summary.todaysSales}`} />
                        <StatCard label="Orders today" value={String(summary.todaysOrderCount)} />
                        <StatCard
                            label="Low stock items"
                            value={String(summary.lowStockCount)}
                            tone={summary.lowStockCount > 0 ? "warning" : undefined}
                        />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 24 }}>
                        <div className="card">
                            <h3>Top products</h3>
                            {summary.topProducts.length === 0 && <p className="muted">No sales yet.</p>}
                            {summary.topProducts.map((p, i) => (
                                <div
                                    key={p.name}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        padding: "10px 0",
                                        borderBottom: i < summary.topProducts.length - 1 ? "1px solid var(--border)" : "none",
                                    }}
                                >
                                    <span>{p.name}</span>
                                    <span style={{ fontWeight: 600 }}>{p.unitsSold} sold</span>
                                </div>
                            ))}
                        </div>

                        <div className="card">
                            <h3>Recent orders</h3>
                            {summary.recentOrders.length === 0 && <p className="muted">No orders yet.</p>}
                            {summary.recentOrders.map((o, i) => (
                                <div
                                    key={o.id}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        padding: "10px 0",
                                        borderBottom: i < summary.recentOrders.length - 1 ? "1px solid var(--border)" : "none",
                                    }}
                                >
                                    <span className="muted">
                                        Order #{o.id} · {new Date(o.createdAt).toLocaleTimeString()}
                                    </span>
                                    <span style={{ fontWeight: 600 }}>Rs. {o.totalAmount}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {summary.lowStockCount > 0 && (
                        <div style={{ marginTop: 16 }}>
                            <Link to="/products" className="badge badge-warning" style={{ padding: "8px 14px" }}>
                                Review low stock items →
                            </Link>
                        </div>
                    )}
                </>
            )}
        </AppShell>
    );
}