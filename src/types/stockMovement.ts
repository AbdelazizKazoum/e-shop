import { User } from "next-auth";

export interface StockMovement {
  id: string;
  // Add other stock movement properties here
  user: User;
}
