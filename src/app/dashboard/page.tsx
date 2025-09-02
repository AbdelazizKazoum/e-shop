"use client";

import React, { useState, useEffect } from "react";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Zap,
  MoreVertical,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// --- TYPE DEFINITIONS ---
export interface Order {
  id: string;
  customerName: string;
  total: number;
  status: "Completed" | "Pending" | "Cancelled";
  avatarUrl: string;
}

export interface TopProduct {
  id: string;
  name: string;
  imageUrl: string;
  sales: number;
}

// --- MOCK DATA ---
const mockRecentOrders: Order[] = [
  {
    id: "ORD-001",
    customerName: "Alex Johnson",
    total: 150.75,
    status: "Completed",
    avatarUrl: "https://placehold.co/40x40/E2E8F0/475569?text=AJ",
  },
  {
    id: "ORD-002",
    customerName: "Maria Garcia",
    total: 89.99,
    status: "Pending",
    avatarUrl: "https://placehold.co/40x40/E2E8F0/475569?text=MG",
  },
  {
    id: "ORD-003",
    customerName: "Chen Wei",
    total: 240.0,
    status: "Completed",
    avatarUrl: "https://placehold.co/40x40/E2E8F0/475569?text=CW",
  },
  {
    id: "ORD-004",
    customerName: "Fatima Al-Fassi",
    total: 45.5,
    status: "Cancelled",
    avatarUrl: "https://placehold.co/40x40/E2E8F0/475569?text=FA",
  },
];

const mockTopProducts: TopProduct[] = [
  {
    id: "PROD-123",
    name: "Classic Cotton Tee",
    imageUrl: "https://placehold.co/64x64/F3F4F6/9CA3AF?text=Tee",
    sales: 1240,
  },
  {
    id: "PROD-456",
    name: "Pro Gamer Headset",
    imageUrl: "https://placehold.co/64x64/F3F4F6/9CA3AF?text=Set",
    sales: 891,
  },
  {
    id: "PROD-789",
    name: "Modern Desk Lamp",
    imageUrl: "https://placehold.co/64x64/F3F4F6/9CA3AF?text=Lamp",
    sales: 672,
  },
];

const salesData = [
  { name: "Wk 1", sales: 1200 },
  { name: "Wk 2", sales: 2100 },
  { name: "Wk 3", sales: 1800 },
  { name: "Wk 4", sales: 2780 },
  { name: "Wk 5", sales: 1890 },
  { name: "Wk 6", sales: 2390 },
  { name: "Wk 7", sales: 3490 },
];

// --- UI COMPONENTS ---

const PageTitle = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => (
  <div>
    <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 md:text-3xl">
      {title}
    </h1>
    {subtitle && <p className="text-neutral-500">{subtitle}</p>}
  </div>
);

const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  changeType,
  color,
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  changeType: "increase" | "decrease";
  color: "primary" | "green" | "orange" | "red";
}) => {
  const iconColorClasses = {
    primary:
      "bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400",
    green:
      "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400",
    orange:
      "bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400",
    red: "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400",
  };

  const bgColorClasses = {
    primary: "bg-primary-50 dark:bg-neutral-800",
    green: "bg-green-50 dark:bg-neutral-800",
    orange: "bg-orange-50 dark:bg-neutral-800",
    red: "bg-red-50 dark:bg-neutral-800",
  };

  return (
    <div
      className={`${bgColorClasses[color]} p-5 rounded-lg border border-neutral-200/70 dark:border-neutral-700/50`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">{title}</p>
          <p className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
            {value}
          </p>
        </div>
        <div className={`rounded-full p-3 ${iconColorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div className="mt-2 flex items-center text-sm">
        <span
          className={`flex items-center font-semibold ${
            changeType === "increase" ? "text-green-500" : "text-red-500"
          }`}
        >
          {changeType === "increase" ? (
            <ArrowUp size={14} className="mr-1" />
          ) : (
            <ArrowDown size={14} className="mr-1" />
          )}
          {change}
        </span>
        <span className="ml-1 text-neutral-400">from last month</span>
      </div>
    </div>
  );
};

const SalesChart = () => (
  <div className="bg-white dark:bg-neutral-800/50 p-6 rounded-lg border border-neutral-200/70 dark:border-neutral-700/50">
    <h3 className="text-lg font-semibold mb-1">Sales Overview</h3>
    <p className="text-sm text-neutral-500 mb-4">Last 7 Weeks</p>
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={salesData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              {/* The color is correctly pulled from the CSS variable */}
              <stop
                offset="5%"
                stopColor="rgb(var(--c-primary-500))"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="rgb(var(--c-primary-500))"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" />
          <XAxis
            dataKey="name"
            tick={{ fill: "rgb(var(--c-neutral-500))" }}
            fontSize={12}
          />
          <YAxis tick={{ fill: "rgb(var(--c-neutral-500))" }} fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgb(var(--c-neutral-800))",
              border: "1px solid rgb(var(--c-neutral-700))",
              color: "rgb(var(--c-neutral-100))",
            }}
          />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="rgb(var(--c-primary-500))"
            fill="url(#colorSales)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const RecentOrders = ({ orders }: { orders: Order[] }) => {
  const statusColor = (status: Order["status"]) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300";
      case "Cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
    }
  };
  return (
    <div className="bg-white dark:bg-neutral-800/50 p-6 rounded-lg border border-neutral-200/70 dark:border-neutral-700/50">
      <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="flex items-center gap-4">
            <img
              src={order.avatarUrl}
              alt={order.customerName}
              className="h-10 w-10 rounded-full"
            />
            <div className="flex-1">
              <p className="font-medium text-sm">{order.customerName}</p>
              <p className="text-xs text-neutral-500">{order.id}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-sm">${order.total.toFixed(2)}</p>
              <span
                className={`text-xs font-medium rounded-full px-2 py-0.5 ${statusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TopProducts = ({ products }: { products: TopProduct[] }) => (
  <div className="bg-white dark:bg-neutral-800/50 p-6 rounded-lg border border-neutral-200/70 dark:border-neutral-700/50">
    <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
    <div className="space-y-4">
      {products.map((product) => (
        <div key={product.id} className="flex items-center gap-4">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-12 w-12 rounded-md bg-neutral-100"
          />
          <div className="flex-1">
            <p className="font-medium text-sm truncate">{product.name}</p>
            <p className="text-xs text-neutral-500">{product.sales} sales</p>
          </div>
          <button className="p-2 text-neutral-400 hover:text-neutral-600">
            <MoreVertical size={18} />
          </button>
        </div>
      ))}
    </div>
  </div>
);

const DashboardSkeleton = () => (
  <div className="animate-pulse">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-lg"
        ></div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 h-96 bg-neutral-200 dark:bg-neutral-800 rounded-lg"></div>
      <div className="space-y-6">
        <div className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded-lg"></div>
        <div className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded-lg"></div>
      </div>
    </div>
  </div>
);

// --- MAIN PAGE COMPONENT ---
export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <>
      <PageTitle
        title="Dashboard"
        subtitle="Welcome back! Here's a snapshot of your store today."
      />

      <motion.div
        className="mt-8"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
      >
        {/* Statistics Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <StatCard
              title="Total Revenue"
              value="$48,329"
              change="+5.2%"
              icon={DollarSign}
              changeType="increase"
              color="primary"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard
              title="Total Orders"
              value="2,145"
              change="-1.8%"
              icon={ShoppingCart}
              changeType="decrease"
              color="orange"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard
              title="New Customers"
              value="89"
              change="+12%"
              icon={Users}
              changeType="increase"
              color="green"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard
              title="Conversion Rate"
              value="3.4%"
              change="+0.5%"
              icon={Zap}
              changeType="increase"
              color="red"
            />
          </motion.div>
        </motion.div>

        {/* Main Content Grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          <motion.div className="lg:col-span-2" variants={itemVariants}>
            <SalesChart />
          </motion.div>
          <motion.div className="space-y-6" variants={itemVariants}>
            <RecentOrders orders={mockRecentOrders} />
            <TopProducts products={mockTopProducts} />
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
}
