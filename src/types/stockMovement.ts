import { User } from "next-auth";

export enum StockMovementType {
  ADD = "add",
  REMOVE = "remove",
  CORRECTION = "correction",
}

export enum StockMovementReason {
  SUPPLIER_DELIVERY = "supplier_delivery",
  INVENTORY_CORRECTION = "inventory_correction",
  CUSTOMER_RETURN = "customer_return",
  MANUAL_ADJUSTMENT = "manual_adjustment",
}

// ...other types and interfaces...

export interface Supplier {
  id: string;
  name: string;
}

export interface SupplyOrder {
  id: string;
  supplier: Supplier;
}

export interface StockProduct {
  id: string;
  name: string;
  image: string;
}

export interface StockVariant {
  id: string;
  color: string;
  size: string;
  product: StockProduct;
}

export interface StockMovement {
  id: string;
  productDetail: StockVariant;
  type: StockMovementType;
  quantity: number;
  reason: StockMovementReason;
  note?: string;
  supplier?: Supplier | null;
  supplierOrder?: SupplyOrder | null;
  createdAt: string;
}
