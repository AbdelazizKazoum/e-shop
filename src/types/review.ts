import { User } from "./user";

export interface Review {
  id: string;
  // Add other review properties here
  user: User;
}
