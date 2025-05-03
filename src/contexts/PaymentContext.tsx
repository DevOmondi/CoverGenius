import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface PaymentContextType {
  hasPaid: boolean;
  setHasPaid: (value: boolean) => void;
  paymentDetails: PaymentDetails | null;
  setPaymentDetails: (details: PaymentDetails | null) => void;
}

interface PaymentDetails {
  amount: number;
  currency: string;
  transactionId: string;
  timestamp: Date;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePayment = (): PaymentContextType => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }
  return context;
};

interface PaymentProviderProps {
  children: ReactNode;
}

export const PaymentProvider: React.FC<PaymentProviderProps> = ({
  children,
}) => {
  // Initialize with false and set localStorage
  const [hasPaid, setHasPaid] = useState<boolean>(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );

  // Set initial localStorage value to false on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("hasPaid", "false");
    }
  }, []);

  // Sync state to localStorage when hasPaid changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("hasPaid", String(hasPaid));
    }
  }, [hasPaid]);

  // Handle paymentDetails persistence
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (paymentDetails) {
        localStorage.setItem("paymentDetails", JSON.stringify(paymentDetails));
      } else {
        localStorage.removeItem("paymentDetails");
      }
    }
  }, [paymentDetails]);

  const value = {
    hasPaid,
    setHasPaid,
    paymentDetails,
    setPaymentDetails,
  };

  return (
    <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>
  );
};
