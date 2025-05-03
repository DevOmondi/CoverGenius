import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PaymentContextType {
  hasPaid: boolean;
  setHasPaid: (value: boolean) => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePayment = (): PaymentContextType => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

interface PaymentProviderProps {
  children: ReactNode;
}

export const PaymentProvider: React.FC<PaymentProviderProps> = ({ children }) => {
  const [hasPaid, setHasPaid] = useState(false);

  return (
    <PaymentContext.Provider value={{ hasPaid, setHasPaid }}>
      {children}
    </PaymentContext.Provider>
  );
};