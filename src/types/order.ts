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
