export interface TopProductDto {
    name: string;
    unitsSold: number;
}

export interface RecentOrderDto {
    id: number;
    totalAmount: number;
    createdAt: string;
}

export interface DashboardSummaryDto {
    todaysSales: number;
    todaysOrderCount: number;
    lowStockCount: number;
    topProducts: TopProductDto[];
    recentOrders: RecentOrderDto[];
}