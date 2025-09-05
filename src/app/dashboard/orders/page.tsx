"use client";

import React, { useState, useEffect, FormEvent, useMemo } from "react";
import {
  ChevronDown,
  Search,
  Eye,
  Filter,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  Package,
} from "lucide-react";

// --- TYPE DEFINITIONS ---
export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
}

export interface OrderVariant {
  id: string;
  color: string;
  size: string;
  product: {
    name: string;
    image: string;
  };
}

export interface OrderDetail {
  id: string;
  quantite: number;
  prix_unitaire: number; // Added unit price
  variant: OrderVariant;
}

export interface Order {
  id: string;
  createdAt: string;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "paid" | "unpaid" | "refunded";
  total: number;
  shippingAddress: ShippingAddress;
  details: OrderDetail[];
}

// --- MOCK DATA (EXPANDED) ---
const mockOrders: Order[] = [
  {
    id: "7e3b5456-fa41-4bb4-968d-9b7a1aae2c60",
    createdAt: "2025-09-05T22:16:18.000Z",
    status: "pending",
    paymentStatus: "unpaid",
    total: 460,
    shippingAddress: {
      firstName: "Abdelaziz",
      lastName: "Kazoum",
      email: "akaka0303@gmail.com",
    },
    details: [
      {
        id: "7b9579cb-8243-422f-9b69-bf0746a70e0d",
        quantite: 1,
        prix_unitaire: 450,
        variant: {
          id: "187e523c-3fbc-4e85-82f6-6ab640bd9341",
          color: "#604040",
          size: "M",
          product: {
            name: "G-class Glass",
            image:
              "https://pub-c1f95dd9de0040bca80754b566c4d7d1.r2.dev/products/main/1756334426130-66c352df5da406397bf6d118.webp",
          },
        },
      },
      {
        id: "b26985aa-d13e-4475-899a-4f2d43cef468",
        quantite: 1,
        prix_unitaire: 10,
        variant: {
          id: "a37d6e54-0607-4284-a390-a334e8877b51",
          color: "red",
          size: "XXL",
          product: {
            name: "Rban -lates glass",
            image:
              "https://pub-c1f95dd9de0040bca80754b566c4d7d1.r2.dev/products/main/1756414184824-shutterstock_2198640151-1698217926.webp",
          },
        },
      },
    ],
  },
  {
    id: "8f9c1234-fa41-4bb4-968d-abcdef12345",
    createdAt: "2025-09-04T10:30:00.000Z",
    status: "shipped",
    paymentStatus: "paid",
    total: 125.5,
    shippingAddress: {
      firstName: "Jane",
      lastName: "Doe",
      email: "jane.doe@example.com",
    },
    details: [
      {
        id: "12345678-8243-422f-9b69-bf0746a70e0d",
        quantite: 2,
        prix_unitaire: 62.75,
        variant: {
          id: "abcdefgh-3fbc-4e85-82f6-6ab640bd9341",
          color: "blue",
          size: "L",
          product: {
            name: "Modern Hoodie",
            image: "https://placehold.co/100x100/3B82F6/FFFFFF?text=MH",
          },
        },
      },
    ],
  },
  {
    id: "9a0b1234-fa41-4bb4-968d-bcdef123456",
    createdAt: "2025-09-03T14:00:00.000Z",
    status: "delivered",
    paymentStatus: "paid",
    total: 89.99,
    shippingAddress: {
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@example.com",
    },
    details: [],
  },
  {
    id: "1b2c3456-fa41-4bb4-968d-cdef1234567",
    createdAt: "2025-09-02T09:45:00.000Z",
    status: "cancelled",
    paymentStatus: "refunded",
    total: 299.0,
    shippingAddress: {
      firstName: "Emily",
      lastName: "Jones",
      email: "emily.jones@example.com",
    },
    details: [],
  },
  {
    id: "2c3d4567-fa41-4bb4-968d-def12345678",
    createdAt: "2025-09-01T18:20:00.000Z",
    status: "pending",
    paymentStatus: "unpaid",
    total: 75.0,
    shippingAddress: {
      firstName: "Michael",
      lastName: "Brown",
      email: "michael.brown@example.com",
    },
    details: [],
  },
  {
    id: "3d4e5678-fa41-4bb4-968d-ef123456789",
    createdAt: "2025-08-31T11:00:00.000Z",
    status: "shipped",
    paymentStatus: "paid",
    total: 512.2,
    shippingAddress: {
      firstName: "Sarah",
      lastName: "Davis",
      email: "sarah.davis@example.com",
    },
    details: [],
  },
  {
    id: "4e5f6789-fa41-4bb4-968d-f1234567890",
    createdAt: "2025-08-30T16:55:00.000Z",
    status: "delivered",
    paymentStatus: "paid",
    total: 320.0,
    shippingAddress: {
      firstName: "David",
      lastName: "Miller",
      email: "david.miller@example.com",
    },
    details: [],
  },
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
  onFilter: (filters: any) => void;
  onSearch: (term: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const filters = Object.fromEntries(formData.entries());
    onFilter(filters);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by name..."
            onChange={(e) => onSearch(e.target.value)}
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
}: {
  order: Order;
  onClose: () => void;
}) => {
  const [orderStatus, setOrderStatus] = useState(order.status);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);

  const handleSaveChanges = () => {
    console.log("Saving changes for order:", order.id);
    console.log("New Order Status:", orderStatus);
    console.log("New Payment Status:", paymentStatus);
    alert("Changes saved! (Check console)");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b dark:border-neutral-700">
          <div>
            <h2 className="text-lg font-semibold">Order Details</h2>
            <p className="text-sm text-neutral-500 font-mono">{order.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium mb-2 text-neutral-700 dark:text-neutral-300">
                Customer
              </h3>
              <p>
                {order.shippingAddress.firstName}{" "}
                {order.shippingAddress.lastName}
              </p>
              <p className="text-sm text-neutral-500">
                {order.shippingAddress.email}
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2 text-neutral-700 dark:text-neutral-300">
                Order Info
              </h3>
              <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
              <p className="text-sm text-neutral-500">
                Total Items: {order.details.length}
              </p>
            </div>
          </div>

          <div className="space-y-3 border-t dark:border-neutral-700 pt-4">
            <h3 className="font-medium text-neutral-700 dark:text-neutral-300">
              Items Ordered
            </h3>
            {order.details.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <img
                  src={item.variant.product.image}
                  alt={item.variant.product.name}
                  className="h-16 w-16 rounded-md object-cover bg-neutral-100"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.variant.product.name}</p>
                  <div className="flex items-center gap-2 text-sm text-neutral-500">
                    <span>Size: {item.variant.size}</span>
                    <span className="flex items-center gap-1.5">
                      <span>/ Color:</span>
                      <span
                        className="h-4 w-4 rounded-full border border-neutral-300 dark:border-neutral-600"
                        style={{ backgroundColor: item.variant.color }}
                        title={item.variant.color}
                      ></span>
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    ${item.prix_unitaire.toFixed(2)}
                  </p>
                  <p className="text-sm text-neutral-500">
                    Qty: {item.quantite}
                  </p>
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

        <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-neutral-50 dark:bg-neutral-800/50 border-t dark:border-neutral-700">
          <div className="flex gap-4 w-full md:w-auto mb-4 md:mb-0">
            <Select
              label="Order Status"
              value={orderStatus}
              onChange={(e) =>
                setOrderStatus(e.target.value as Order["status"])
              }
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
                setPaymentStatus(e.target.value as Order["paymentStatus"])
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
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<any>({});

  const limit = 5;

  // Memoize filtered orders to avoid re-calculation on every render
  const filteredOrders = useMemo(() => {
    return mockOrders.filter((order) => {
      const customerName =
        `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`.toLowerCase();
      const customerEmail = order.shippingAddress.email.toLowerCase();
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        customerName.includes(search) || customerEmail.includes(search);
      const matchesStatus = !filters.status || order.status === filters.status;
      const matchesPayment =
        !filters.paymentStatus || order.paymentStatus === filters.paymentStatus;

      // Add more filter logic here as needed

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [searchTerm, filters]);

  const total = filteredOrders.length;
  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    setLoading(true);
    // Simulate API call with filtering and pagination
    setTimeout(() => {
      const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * limit,
        currentPage * limit
      );
      setOrders(paginatedOrders);
      setLoading(false);
    }, 500); // Shorter delay for better UX
  }, [currentPage, filteredOrders]);

  const handleFilter = (newFilters: any) => {
    setCurrentPage(1); // Reset page to 1 when filters change
    setFilters(newFilters);
    console.log("Applying filters:", newFilters);
    // In a real app, you'd trigger an API call here.
  };

  const handleSearch = (term: string) => {
    setCurrentPage(1); // Reset page to 1 when search term changes
    setSearchTerm(term);
    // In a real app, API call would be triggered by the useEffect
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        <PageTitle
          title="Orders"
          subtitle={`Manage all orders for your store (${total} total)`}
        />
      </div>
      <div className="mt-8">
        <FilterHeader onFilter={handleFilter} onSearch={handleSearch} />
        <div className="nc-box-has-hover nc-dark-box-bg-has-hover p-0 md:p-6">
          {loading ? (
            <OrderListSkeleton />
          ) : (
            <OrderList orders={orders} onViewOrder={setSelectedOrder} />
          )}
          {!loading && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
}
