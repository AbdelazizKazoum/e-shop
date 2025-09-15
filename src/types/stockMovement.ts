import { User } from "./user";

export interface StockMovement {
  id: string;
  // Add other stock movement properties here
  user: User;
}
