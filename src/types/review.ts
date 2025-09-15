import { User } from "next-auth";

export interface Review {
  id: string;
  // Add other review properties here
  user: User;
}
