import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

interface PayPalButtonProps {
  amount: number;
  onPaymentSuccess: () => void;
  onPaymentError: (error: Error) => void;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({
  amount,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;
  return (
    <PayPalScriptProvider
      options={{
        clientId: PAYPAL_CLIENT_ID || "default-client-id",
        currency: "USD",
      }}
    >
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: amount.toString(),
                  breakdown: {
                    item_total: {
                      currency_code: "USD",
                      value: amount.toString(),
                    },
                  },
                },
                items: [
                  {
                    name: "Cover Letter Unlock",
                    description: "One-time payment to unlock full cover letter",
                    quantity: "1",
                    unit_amount: {
                      currency_code: "USD",
                      value: amount.toString(),
                    },
                    category: "DIGITAL_GOODS",
                  },
                ],
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order!.capture().then(() => {
            onPaymentSuccess();
          });
        }}
        onError={(err) => {
          const error = new Error(
            (err as { message?: string }).message || "An unknown error occurred"
          );
          onPaymentError(error);
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
