"use client";

import React, { useState, useEffect, FormEvent, useMemo } from "react";
import {
  ChevronDown,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Edit,
  RefreshCw,
  Mail,
  User,
  Shield,
  X,
  Camera,
} from "lucide-react";
import { useCustomerStore } from "@/stores/customerStore"; // Assuming this is the correct path
import Image from "next/image";

// --- TYPE DEFINITIONS ---
export interface Customer {
  id: string;
  email: string;
  image: string | null;
  firstName: string | null;
  lastName: string | null;
  role: "client" | "admin";
  status: "Active" | "Inactive" | "Suspended";
  created_at: string;
  provider: "google" | "credentials";
}

// --- HOOK for Debouncing ---
function useDebounce(value: string, delay: number) {
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
}

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

const AvatarUpload = ({
  onFileChange,
  initialPreview,
}: {
  onFileChange: (file: File | null) => void;
  initialPreview?: string | null;
}) => {
  const [preview, setPreview] = useState<string | null>(initialPreview || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
      onFileChange(file);
    } else {
      onFileChange(null);
    }
  };

  return (
    <div className="relative w-24 h-24">
      {preview ? (
        <img
          src={preview}
          alt="Avatar"
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
          <User size={40} className="text-neutral-500" />
        </div>
      )}
      <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 cursor-pointer rounded-full transition-opacity">
        <Camera size={24} className="text-white" />
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};

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

const EditCustomerModal = ({
  customer,
  onClose,
}: {
  customer: Customer;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState(customer);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = () => {
    console.log("Saving changes for customer:", customer.id);
    console.log("Form Data:", formData);
    console.log("New Image File:", newImageFile);
    alert("Changes saved! (Check console)");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b dark:border-neutral-700">
          <h2 className="text-lg font-semibold">Edit Customer</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <div className="p-4 rounded-md bg-neutral-50 dark:bg-neutral-800/50 border dark:border-neutral-700/50">
            <h3 className="font-medium mb-2 text-neutral-600 dark:text-neutral-300 text-sm">
              Profile Information
            </h3>
            <div className="text-sm space-y-1">
              <p>
                <span className="text-neutral-500">Email:</span>{" "}
                <span className="font-mono">{customer.email}</span>
              </p>
              <p>
                <span className="text-neutral-500">Joined:</span>{" "}
                {new Date(customer.created_at).toLocaleDateString()}
              </p>
              <p>
                <span className="text-neutral-500">Auth Provider:</span>{" "}
                <span className="capitalize">{customer.provider}</span>
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4 text-neutral-600 dark:text-neutral-300 text-sm">
              Update Details
            </h3>
            <div className="flex items-center gap-6">
              <AvatarUpload
                onFileChange={setNewImageFile}
                initialPreview={customer.image}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                <Input
                  label="First Name"
                  name="firstName"
                  value={formData.firstName || ""}
                  onChange={handleInputChange}
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Select
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
              >
                <option value="client">Client</option>
                <option value="admin">Admin</option>
              </Select>
              <Select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center p-4 bg-neutral-50 dark:bg-neutral-800/50 border-t dark:border-neutral-700 gap-2">
          <button
            onClick={onClose}
            className="rounded-md bg-neutral-200 px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveChanges}
            className="rounded-md bg-primary-500 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const CustomerList = ({
  customers,
  onEditCustomer,
}: {
  customers: Customer[];
  onEditCustomer: (customer: Customer) => void;
}) => {
  const statusColor = (status: Customer["status"]) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
      case "Inactive":
        return "bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300";
      case "Suspended":
        return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
    }
  };

  return (
    <div>
      <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 text-sm font-medium text-neutral-500 dark:text-neutral-400 border-b dark:border-neutral-700">
        <div className="col-span-4">Customer</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2">Role</div>
        <div className="col-span-2">Joined Date</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>
      <div className="space-y-4 md:space-y-0">
        {customers.map((customer) => (
          <div
            key={customer.id}
            className="p-4 bg-white dark:bg-neutral-800/50 rounded-lg md:rounded-none md:grid md:grid-cols-12 md:gap-4 md:items-center border-b dark:border-neutral-700/50 last:border-b-0 md:border-b"
          >
            <div className="md:col-span-4 flex items-center gap-3">
              {customer.image ? (
                <Image
                  src={customer.image}
                  alt={`${customer.firstName || ""} ${customer.lastName || ""}`}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                  <User size={20} className="text-neutral-500" />
                </div>
              )}
              <div className="min-w-0">
                <p className="font-medium text-neutral-800 dark:text-neutral-100 truncate">
                  {customer.firstName} {customer.lastName}
                </p>
                <p className="text-sm text-neutral-500 truncate">
                  {customer.email}
                </p>
              </div>
            </div>
            <div className="mt-2 md:mt-0 md:col-span-2">
              <span
                className={`capitalize text-xs font-medium rounded-full px-2.5 py-1 ${statusColor(
                  customer.status
                )}`}
              >
                {customer.status}
              </span>
            </div>
            <div className="mt-2 md:mt-0 md:col-span-2 text-sm text-neutral-600 dark:text-neutral-300 capitalize flex items-center gap-2">
              {customer.role === "admin" ? (
                <Shield size={14} className="text-primary-500" />
              ) : (
                <User size={14} />
              )}{" "}
              {customer.role}
            </div>
            <div className="mt-2 md:mt-0 md:col-span-2 text-sm text-neutral-500">
              {new Date(customer.created_at).toLocaleDateString()}
            </div>
            <div className="mt-4 md:mt-0 md:col-span-2 flex justify-end items-center gap-2">
              <button
                onClick={() => onEditCustomer(customer)}
                className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                <Edit size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CustomerListSkeleton = () => (
  <div className="animate-pulse">
    <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 mb-2">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-neutral-200 dark:bg-neutral-700 rounded ${
            i === 0 ? "col-span-4" : "col-span-2"
          }`}
        ></div>
      ))}
    </div>
    <div className="space-y-4 md:space-y-0">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="p-4 bg-neutral-100 dark:bg-neutral-800/50 rounded-lg md:grid md:grid-cols-12 items-center gap-4"
        >
          <div className="col-span-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-neutral-300 dark:bg-neutral-600 rounded-full"></div>
            <div className="space-y-2 flex-1">
              <div className="h-5 w-3/4 bg-neutral-300 dark:bg-neutral-600 rounded"></div>
              <div className="h-4 w-1/2 bg-neutral-300 dark:bg-neutral-600 rounded"></div>
            </div>
          </div>
          <div className="col-span-2">
            <div className="w-20 h-6 bg-neutral-300 dark:bg-neutral-600 rounded-full mt-2 md:mt-0"></div>
          </div>
          <div className="col-span-2 h-5 w-12 bg-neutral-300 dark:bg-neutral-600 rounded mt-2 md:mt-0"></div>
          <div className="col-span-2 h-5 w-24 bg-neutral-300 dark:bg-neutral-600 rounded mt-2 md:mt-0"></div>
          <div className="col-span-2 flex justify-end items-center gap-2 mt-2 md:mt-0">
            <div className="w-8 h-8 bg-neutral-300 dark:bg-neutral-600 rounded-md"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

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
            placeholder="Search by name or email..."
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
            <Select name="status" label="Status">
              <option value="">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </Select>
            <Select name="role" label="Role">
              <option value="">All</option>
              <option value="client">Client</option>
              <option value="admin">Admin</option>
            </Select>
            <Input name="startDate" label="Joined After" type="date" />
            <Input name="endDate" label="Joined Before" type="date" />
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

export default function CustomersPage() {
  // Local state for UI interaction
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<any>({});
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // State from Zustand store
  const {
    customers,
    totalCustomers,
    totalPages,
    currentPage,
    loading,
    fetchAllCustomers,
    setPage,
  } = useCustomerStore();

  // Debounce search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Effect for fetching data based on dependencies
  useEffect(() => {
    const combinedFilters = {
      ...activeFilters,
      customer: debouncedSearchTerm || undefined,
    };
    fetchAllCustomers({ page: currentPage, filters: combinedFilters });
  }, [currentPage, debouncedSearchTerm, activeFilters, fetchAllCustomers]);

  // Initial fetch check (to preserve state if already loaded)
  useEffect(() => {
    if (useCustomerStore.getState().customers.length === 0) {
      fetchAllCustomers({ page: 1 });
    }
  }, [fetchAllCustomers]);

  const handleFilter = (newFilters: any) => {
    const cleanedFilters = Object.fromEntries(
      Object.entries(newFilters).filter(([_, v]) => v !== "")
    );
    setPage(1); // Reset to page 1 on new filter
    setActiveFilters(cleanedFilters);
  };

  const handleSearch = (term: string) => {
    setPage(1); // Reset to page 1 on new search
    setSearchTerm(term);
  };

  const handleReload = () => {
    const { filters } = useCustomerStore.getState();
    fetchAllCustomers({ page: currentPage, filters });
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        <PageTitle
          title="Customers"
          subtitle={`Manage all customers (${totalCustomers} total)`}
        />
        <button
          onClick={handleReload}
          disabled={loading}
          className="flex items-center gap-2 rounded-md border border-neutral-200 dark:border-neutral-700 px-3 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <span>Reload Data</span>
        </button>
      </div>
      <div className="mt-8">
        <FilterHeader onFilter={handleFilter} onSearch={handleSearch} />
        <div className="nc-box-has-hover nc-dark-box-bg-has-hover p-0 md:p-6">
          {loading && customers.length === 0 ? (
            <CustomerListSkeleton />
          ) : (
            <CustomerList
              //@ts-ignore
              customers={customers}
              onEditCustomer={setEditingCustomer}
            />
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
      {editingCustomer && (
        <EditCustomerModal
          customer={editingCustomer}
          onClose={() => setEditingCustomer(null)}
        />
      )}
    </>
  );
}
