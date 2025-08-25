// src/app/(admin)/dashboard/page.tsx
import StatCard from "@/components/dashboard/Card";
import PageTitle from "@/components/ui/PageTitle";
import { DollarSign, Users, Package, ShoppingCart } from "lucide-react";

export default function DashboardPage() {
  return (
    <>
      <PageTitle
        title="Dashboard"
        subtitle="An overview of your store's performance."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7">
        <StatCard
          title="Total Revenue"
          value="$34,545"
          icon={<DollarSign />}
          change="+2.5%"
          changeType="increase"
        />
        <StatCard
          title="New Orders"
          value="1,289"
          icon={<ShoppingCart />}
          change="-0.8%"
          changeType="decrease"
        />
        <StatCard
          title="Total Products"
          value="450"
          icon={<Package />}
          change="+5.2%"
          changeType="increase"
        />
        <StatCard
          title="New Customers"
          value="89"
          icon={<Users />}
          change="+1.5%"
          changeType="increase"
        />
      </div>

      {/* Recent Orders Table */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-neutral-700 dark:text-neutral-200 mb-4">
          Recent Orders
        </h2>
        <div className="nc-box-has-hover nc-dark-box-bg-has-hover overflow-x-auto p-4">
          <table className="w-full text-left">
            <thead className="border-b dark:border-neutral-700">
              <tr>
                <th className="p-3 text-sm font-semibold">Order ID</th>
                <th className="p-3 text-sm font-semibold">Customer</th>
                <th className="p-3 text-sm font-semibold">Total</th>
                <th className="p-3 text-sm font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {/* Dummy data rows */}
              <tr className="border-b dark:border-neutral-700">
                <td className="p-3">#12345</td>
                <td className="p-3">John Doe</td>
                <td className="p-3">$150.00</td>
                <td className="p-3">
                  <span className="rounded-full bg-green-200 px-2 py-1 text-xs text-green-800">
                    Completed
                  </span>
                </td>
              </tr>
              <tr className="border-b dark:border-neutral-700">
                <td className="p-3">#12346</td>
                <td className="p-3">Jane Smith</td>
                <td className="p-3">$89.50</td>
                <td className="p-3">
                  <span className="rounded-full bg-yellow-200 px-2 py-1 text-xs text-yellow-800">
                    Pending
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
