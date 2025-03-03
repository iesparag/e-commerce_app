// payment.state.ts
export interface PaymentState {
  sessionId: string | null; 
  isLoading: boolean;
  error: string | null;
}

export const initialPaymentState: PaymentState = {
 sessionId: null,
  isLoading: false,
  error: null,
};
