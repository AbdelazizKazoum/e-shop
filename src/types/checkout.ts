export interface ContactInfo {
  phone: string;
  email: string;
  newsAndOffers: boolean;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  country: string;
  state: string;
  zipCode: string;
  addressType: "Home" | "Office";
}

export interface PaymentMethod {
  cardNumber: string;
  cardHolder: string;
  expirationDate: string;
  cvc: string;
  method: "Credit-Card" | "Internet-banking" | "Wallet" | "Cash-on-Delivery";
}

export interface CheckoutState {
  contactInfo: Partial<ContactInfo>;
  shippingAddress: Partial<ShippingAddress>;
  paymentMethod: Partial<PaymentMethod>;
  setContactInfo: (data: Partial<ContactInfo>) => void;
  setShippingAddress: (data: Partial<ShippingAddress>) => void;
  setPaymentMethod: (data: Partial<PaymentMethod>) => void;
  submitOrder: (
    cartItems: any[],
    userSession: any,
    total: number
  ) => Promise<void>;
}
