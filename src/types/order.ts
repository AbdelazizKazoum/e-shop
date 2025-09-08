import { User } from "next-auth/core/types";
import { Variant } from "./product";

export interface createOrderType {
  user?: { name: string };
  contactInfo: {
    phone: string;
    email: string;
    newsAndOffers?: boolean;
  };
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    country: string;
    state: string;
    zipCode: string;
    addressType: "Home" | "Work" | "Other";
  };
  paymentInfo: {
    method: "credit_card" | "paypal" | "bank_transfer" | "cash_on_delivery";
  };
  items: {
    productId: string;
    variantId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  orderDate: Date;
}

export type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled";

export type PaymentStatus = "paid" | "unpaid" | "refunded";

export interface OrderFilters {
  customer?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  minTotal?: number;
  maxTotal?: number;
  startDate?: string;
  endDate?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface OrderItem {
  id: string;
  variant: Variant;
  prix_unitaire: number;
  quantite: number;
  sous_total: number;
}

// --- MAIN ORDER TYPE ---
// This is the primary type that matches your Order entity

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  address: string; // Renamed from 'street'
  city: string;
  phone: string;
  email?: string; // Optional, matches nullable
  zipCode: string;
  country: string;
  addressType: "Home" | "Work" | "Other";
  user?: User; // Optional, as it can be nullable
}

export interface Payment {
  id: string;
  methode: "credit_card" | "paypal" | "bank_transfer" | "Cash-on-Delivery";
  status: "pending" | "fulfilled" | "rejected";
  date: string; // TypeORM Date becomes string in JSON
}

export interface Order {
  id: string; // Changed from number to string for UUID
  user: User;
  createdAt: string; // TypeORM Date becomes string in JSON
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  total: number;
  details: OrderItem[]; // This represents the order items
  shippingAddress: Address;
  payment: Payment | null; // Payment can be nullable
}
