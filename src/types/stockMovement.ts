import { User } from "next-auth";

export interface StockMovement {
  id: string;
  // Add other stock movement properties here
  user: User;
}

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
