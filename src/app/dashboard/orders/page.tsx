"use client";

import React, { useState, useEffect, FormEvent, useCallback } from "react";
import {
  ChevronDown,
  Search,
  Eye,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  UserCircle2,
  Mail,
  Phone,
  Truck,
} from "lucide-react";
import {
  Order,
  OrderFilters,
  OrderItem,
  OrderStatus,
  PaymentStatus,
} from "@/types/order";
import { useOrderStore } from "@/stores/orderStore";
import Image from "next/image";

// A simple debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// --- UI COMPONENTS (some are simplified for brevity) ---

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

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { label?: string }
>(({ label, id, ...props }, ref) => (
  <div>
    {label && (
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
      >
        {label}
      </label>
    )}
    <input
      id={id}
      ref={ref}
      {...props}
      className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
    />
  </div>
));
Input.displayName = "Input";

const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }
>(({ label, id, children, ...props }, ref) => (
  <div>
    <label
      htmlFor={id}
      className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
    >
      {label}
    </label>
    <select
      id={id}
      ref={ref}
      {...props}
      className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
    >
      {children}
    </select>
  </div>
));
Select.displayName = "Select";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center mt-6 space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-50"
      >
        <ChevronLeft size={20} />
      </button>
      {getPageNumbers().map((page, index) =>
        typeof page === "number" ? (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              currentPage === page
                ? "bg-primary-500 text-white"
                : "hover:bg-neutral-100 dark:hover:bg-neutral-700"
            }`}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="px-4 py-2 text-sm">
            ...
          </span>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-50"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

const FilterHeader = ({
  onFilter,
  onSearch,
}: {
  onFilter: (filters: OrderFilters) => void;
  onSearch: (term: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleFilterSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const filters: OrderFilters = {};
    formData.forEach((value, key) => {
      if (value) {
        (filters as any)[key] = value;
      }
    });
    onFilter(filters);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by customer..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full rounded-md border border-neutral-200 bg-white py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          <Filter size={16} />
          <span>Filters</span>
          <ChevronDown
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
            size={16}
          />
        </button>
      </div>
      {isOpen && (
        <form
          onSubmit={handleFilterSubmit}
          className="mt-4 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border dark:border-neutral-700/50"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select name="status" label="Order Status">
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </Select>
            <Select name="paymentStatus" label="Payment Status">
              <option value="">All</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="refunded">Refunded</option>
            </Select>
            <Input
              name="minTotal"
              label="Min Total ($)"
              type="number"
              step="0.01"
            />
            <Input
              name="maxTotal"
              label="Max Total ($)"
              type="number"
              step="0.01"
            />
            <Input name="startDate" label="Start Date" type="date" />
            <Input name="endDate" label="End Date" type="date" />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="reset"
              className="rounded-md bg-neutral-200 px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-200"
            >
              Reset
            </button>
            <button
              type="submit"
              className="rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-600"
            >
              Apply
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

const OrderDetailsModal = ({
  order,
  onClose,
  onUpdate,
}: {
  order: Order;
  onClose: () => void;
  onUpdate: (
    id: string,
    data: { status?: OrderStatus; paymentStatus?: PaymentStatus }
  ) => void;
}) => {
  const [orderStatus, setOrderStatus] = useState(order.status);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);

  const handleSaveChanges = () => {
    onUpdate(order.id, { status: orderStatus, paymentStatus: paymentStatus });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b dark:border-neutral-700 shrink-0">
          <div>
            <h2 className="text-lg font-semibold">Order Details</h2>
            <p className="text-sm text-neutral-500 font-mono">ID: {order.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Customer and Shipping */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-4 rounded-lg border bg-neutral-50 dark:bg-neutral-800/50 dark:border-neutral-700">
              <h3 className="flex items-center gap-2 font-semibold mb-3 text-neutral-800 dark:text-neutral-200">
                <UserCircle2 size={20} />
                Customer
              </h3>
              <div className="space-y-2 text-sm">
                <p className="font-medium text-neutral-900 dark:text-neutral-100">
                  {order.shippingAddress.firstName}{" "}
                  {order.shippingAddress.lastName}
                </p>
                <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
                  <Mail size={14} />
                  <span>{order.shippingAddress.email}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
                  <Phone size={14} />
                  <span>{order.shippingAddress.phone}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-neutral-50 dark:bg-neutral-800/50 dark:border-neutral-700">
              <h3 className="flex items-center gap-2 font-semibold mb-3 text-neutral-800 dark:text-neutral-200">
                <Truck size={20} />
                Shipping Address
              </h3>
              <div className="space-y-1 text-sm text-neutral-600 dark:text-neutral-300">
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-neutral-50 dark:bg-neutral-800/50 dark:border-neutral-700">
              <h3 className="font-semibold mb-3 text-neutral-800 dark:text-neutral-200">
                Order Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Order Date:</span>
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Total Items:</span>
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">
                    {order.details.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Items and Summary */}
          <div className="lg:col-span-2">
            <div className="p-4 rounded-lg border dark:border-neutral-200 h-full flex flex-col">
              <h3 className="font-medium text-neutral-800 dark:text-neutral-200 mb-4">
                Items Ordered
              </h3>
              <div className="space-y-4 flex-grow">
                {order.details.map((item: any) => (
                  <div key={item.id} className="flex items-start gap-4">
                    <Image
                      src={item.variant.product.image}
                      alt={item.variant.product.name}
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded-md object-cover bg-neutral-100"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {item.variant.product.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                        <span>Size: {item.variant.size}</span>
                        <span className="flex items-center gap-1.5">
                          <span>/ Color:</span>
                          <span
                            className="h-3 w-3 rounded-full border border-neutral-300 dark:border-neutral-600"
                            style={{ backgroundColor: item.variant.color }}
                            title={item.variant.color}
                          ></span>
                        </span>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-medium text-neutral-800 dark:text-neutral-200">
                        ${item.prix_unitaire.toFixed(2)}
                      </p>
                      <p className="text-neutral-500">Qty: {item.quantite}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t dark:border-neutral-700 mt-6 pt-4 text-right">
                <p className="text-lg font-semibold">
                  Total: ${order.total.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-neutral-50 dark:bg-neutral-800/50 border-t dark:border-neutral-700 shrink-0">
          <div className="flex gap-4 w-full md:w-auto mb-4 md:mb-0">
            <Select
              label="Order Status"
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value as OrderStatus)}
            >
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </Select>
            <Select
              label="Payment Status"
              value={paymentStatus}
              onChange={(e) =>
                setPaymentStatus(e.target.value as PaymentStatus)
              }
            >
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="refunded">Refunded</option>
            </Select>
          </div>
          <button
            onClick={handleSaveChanges}
            className="w-full md:w-auto rounded-md bg-primary-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-600"
          >
            Update Order
          </button>
        </div>
      </div>
    </div>
  );
};

const OrderListSkeleton = () => (
  <div className="animate-pulse">
    <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 mb-2">
      <div className="col-span-3 h-4 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
      <div className="col-span-2 h-4 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
      <div className="col-span-2 h-4 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
      <div className="col-span-2 h-4 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
      <div className="col-span-2 h-4 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
    </div>
    <div className="space-y-4 md:space-y-0">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="p-4 bg-neutral-100 dark:bg-neutral-800/50 rounded-lg md:grid md:grid-cols-12 items-center gap-4"
        >
          <div className="col-span-12 md:col-span-3 space-y-2">
            <div className="h-5 w-3/4 bg-neutral-300 dark:bg-neutral-600 rounded"></div>
            <div className="h-4 w-1/2 bg-neutral-300 dark:bg-neutral-600 rounded"></div>
          </div>
          <div className="col-span-6 md:col-span-2 h-4 bg-neutral-300 dark:bg-neutral-600 rounded mt-2 md:mt-0"></div>
          <div className="col-span-6 md:col-span-2">
            <div className="w-20 h-6 bg-neutral-300 dark:bg-neutral-600 rounded-full mt-2 md:mt-0"></div>
          </div>
          <div className="col-span-6 md:col-span-2">
            <div className="w-20 h-6 bg-neutral-300 dark:bg-neutral-600 rounded-full mt-2 md:mt-0"></div>
          </div>
          <div className="col-span-6 md:col-span-1 h-5 w-12 bg-neutral-300 dark:bg-neutral-600 rounded ml-auto mt-2 md:mt-0"></div>
          <div className="col-span-6 md:col-span-2 flex justify-end items-center gap-2 mt-2 md:mt-0">
            <div className="w-8 h-8 bg-neutral-300 dark:bg-neutral-600 rounded-md"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const OrderList = ({
  orders,
  onViewOrder,
}: {
  orders: Order[];
  onViewOrder: (order: Order) => void;
}) => {
  const statusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300";
      case "shipped":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300";
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
    }
  };
  const paymentStatusColor = (status: Order["paymentStatus"]) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
      case "unpaid":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300";
      case "refunded":
        return "bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300";
    }
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500">No orders found.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 text-sm font-medium text-neutral-500 dark:text-neutral-400 border-b dark:border-neutral-700">
        <div className="col-span-3">Customer</div>
        <div className="col-span-2">Date</div>
        <div className="col-span-2">Order Status</div>
        <div className="col-span-2">Payment</div>
        <div className="col-span-1 text-right">Total</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>
      <div className="space-y-4 md:space-y-0">
        {orders.map((order) => (
          <div
            key={order.id}
            className="p-4 bg-white dark:bg-neutral-800/50 rounded-lg md:rounded-none md:grid md:grid-cols-12 md:gap-4 md:items-center border-b dark:border-neutral-700/50 last:border-b-0 md:border-b"
          >
            <div className="md:col-span-3">
              <p className="font-medium text-neutral-800 dark:text-neutral-100">
                {order.shippingAddress.firstName}{" "}
                {order.shippingAddress.lastName}
              </p>
              <p className="text-sm text-neutral-500">
                {order.shippingAddress.email}
              </p>
            </div>
            <div className="mt-2 md:mt-0 md:col-span-2 text-sm text-neutral-500">
              <span className="md:hidden font-medium text-neutral-400">
                Date:{" "}
              </span>
              {new Date(order.createdAt).toLocaleDateString()}
            </div>
            <div className="mt-2 md:mt-0 md:col-span-2">
              <span
                className={`capitalize text-xs font-medium rounded-full px-2.5 py-1 ${statusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>
            <div className="mt-2 md:mt-0 md:col-span-2">
              <span
                className={`capitalize text-xs font-medium rounded-full px-2.5 py-1 ${paymentStatusColor(
                  order.paymentStatus
                )}`}
              >
                {order.paymentStatus}
              </span>
            </div>
            <div className="mt-2 md:mt-0 md:col-span-1 md:text-right font-semibold text-neutral-800 dark:text-neutral-100">
              <span className="md:hidden font-medium text-neutral-400">
                Total:{" "}
              </span>
              ${order.total.toFixed(2)}
            </div>
            <div className="mt-4 md:mt-0 md:col-span-2 flex justify-end items-center gap-2">
              <button
                onClick={() => onViewOrder(order)}
                className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                <Eye size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function OrdersPage() {
  const {
    orders,
    loading,
    currentPage,
    totalPages,
    totalOrders,
    fetchAllOrders,
    setPage,
    updateOrder,
  } = useOrderStore();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filters, setFilters] = useState<OrderFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    fetchAllOrders({
      page: currentPage,
      ...filters,
      customer: debouncedSearchTerm,
    });
  }, [currentPage, filters, debouncedSearchTerm, fetchAllOrders]);

  const handleFilter = (newFilters: OrderFilters) => {
    setPage(1); // Reset page to 1 when filters change
    setFilters(newFilters);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPage(1);
  };

  const handleUpdateOrder = async (
    id: string,
    data: { status?: OrderStatus; paymentStatus?: PaymentStatus }
  ) => {
    try {
      await updateOrder(id, data);
      // Optionally show a success toast message here
    } catch (error) {
      // Optionally show an error toast message here
      console.error("Failed to update order:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        <PageTitle
          title="Orders"
          subtitle={`Manage all orders for your store (${totalOrders} total)`}
        />
      </div>
      <div className="mt-8">
        <FilterHeader onFilter={handleFilter} onSearch={handleSearch} />
        <div className="border rounded-lg nc-dark-box-bg-has-hover p-0 md:p-6">
          {loading && orders.length === 0 ? (
            <OrderListSkeleton />
          ) : (
            <OrderList orders={orders} onViewOrder={setSelectedOrder} />
          )}
          {!loading && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdate={handleUpdateOrder}
        />
      )}
    </>
  );
}
