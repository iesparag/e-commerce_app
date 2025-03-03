export interface Order {
  _id: string;
  user: string;
  items: {
    product: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  deliveryAddress: string;
  paymentDetails: {
    transactionId: string;
    amount: number;
    currency: string;
    status: string;
  };
  orderStatus: string;
  invoiceUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  selectedOrder: Order | null;
}

export const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
  selectedOrder: null,
};

