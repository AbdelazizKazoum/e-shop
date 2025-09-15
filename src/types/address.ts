import { User } from "next-auth";

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  phone: string;
  email?: string;
  zipCode: string;
  country: string;
  addressType: "Home" | "Work" | "Other";
  user?: User;
}
