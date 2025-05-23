
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  badge?: string;
  stockLevel: number;
  sku: string;
  featured: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderDetails {
  products: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  orderDate: string;
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "canceled";
}
