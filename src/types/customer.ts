import { Address } from "./address";
import { Order } from "./order";
import { Review } from "./review";
import { StockMovement } from "./stockMovement";

export interface Customer {
  id: string;
  email: string;
  username?: string;
  cin?: string;
  image?: string;
  firstName?: string;
  lastName?: string;
  tel?: number;
  role: "admin" | "client";
  primaryAddress?: string;
  status?: string;
  created_at: Date;
  addressList?: Address[];
  orders?: Order[];
  reviews?: Review[];
  stockMovements?: StockMovement[];
  provider?: string;
  providerId?: string;
}
