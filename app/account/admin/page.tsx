"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Package, CircleDollarSign } from "lucide-react";

// Stat Card Component
const StatCard = ({ title, value, icon: Icon }: { title: string, value: string | number, icon: React.ElementType }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

export default function DashboardPage() {
    // Mock data for demonstration
    const totalSales = "₹1,25,430";
    const totalUsers = 134;
    const totalOrders = 215;

    return (
        <div>
            <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <StatCard title="Total Sales" value={totalSales} icon={CircleDollarSign} />
                <StatCard title="Total Users" value={totalUsers} icon={Users} />
                <StatCard title="Total Orders" value={totalOrders} icon={Package} />
            </div>
            {/* You can add charts or recent activity lists here */}
        </div>
    );
}