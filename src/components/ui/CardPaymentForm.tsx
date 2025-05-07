import React, { useState } from "react";
import axios from "axios";
import { ArrowLeft, Loader2 } from "lucide-react";

interface CardPaymentProps {
  amount: number;
  currency: string;
  onCancel: () => void;
  onPaymentSuccess: () => void;
  onPaymentError: (error: Error) => void;
}

interface CardPaymentData {
  first_name: string;
  last_name: string;
  email: string;
  method: string;
  amount: number;
  currency: string;
}

const CardPaymentForm = ({
  amount = 5,
  currency = "USD",
  onCancel,
  onPaymentSuccess,
  onPaymentError,
}: CardPaymentProps) => {
  const [formData, setFormData] = useState<CardPaymentData>({
    first_name: "",
    last_name: "",
    email: "",
    method: "CARD-PAYMENT",
    amount: amount,
    currency: currency,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.first_name) newErrors.first_name = "First name is required";
    if (!formData.last_name) newErrors.last_name = "Last name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/payment/card-payment`,
          formData
        );
        if (response.status === 200) {
          onPaymentSuccess();
        } else {
          throw new Error("Payment failed");
        }
      } catch (error) {
        console.log("Payment error:", error);
        onPaymentError(error as Error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-4">
      <div className="flex items-center mb-4">
        <button
          onClick={onCancel}
          className="text-blue-600 hover:text-blue-800 mr-4"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-grow text-center mr-4">
          <h2 className="text-xl font-bold text-gray-800">Card Payment</h2>
          <p className="text-sm text-gray-600">Secure payment processing</p>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label
              htmlFor="first_name"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className={`w-full px-3 py-1.5 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                errors.first_name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="John"
            />
            {errors.first_name && (
              <p className="mt-1 text-xs text-red-600">{errors.first_name}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="last_name"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className={`w-full px-3 py-1.5 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                errors.last_name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Doe"
            />
            {errors.last_name && (
              <p className="mt-1 text-xs text-red-600">{errors.last_name}</p>
            )}
          </div>
        </div>

        <div className="mb-3">
          {" "}
          <label
            htmlFor="email"
            className="block text-xs font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-1.5 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email}</p>
          )}
        </div>

        {/* <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
          {" "}
          <div className="flex items-center mb-2">
            {" "}
            <CreditCard className="text-gray-500 mr-1.5" size={16} />{" "}
            <span className="text-xs font-medium text-gray-700">
              {" "}
              Card details
            </span>
          </div>
          <div className="space-y-2">
            {" "}
            <div className="p-2 bg-white rounded border border-gray-300">
              {" "}
              <span className="text-xs text-gray-500">Card number</span>{" "}
              <div className="flex items-center mt-1">
                <div className="h-5 w-7 bg-gray-200 rounded mr-1.5"></div>{" "}
                <span className="text-xs text-gray-400">
                  •••• •••• •••• ••••
                </span>{" "}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {" "}
              <div className="p-2 bg-white rounded border border-gray-300">
                {" "}
                <span className="text-xs text-gray-500">Expiry</span>{" "}
                <span className="text-xs text-gray-400 block mt-1">MM/YY</span>{" "}
              </div>
              <div className="p-2 bg-white rounded border border-gray-300">
                {" "}
                <span className="text-xs text-gray-500">CVV</span>{" "}
                <span className="text-xs text-gray-400 block mt-1">•••</span>{" "}
              </div>
            </div>
          </div>
          <p className="mt-2 text-[0.65rem] text-gray-500">
            {" "}
            Payment processing is secure and encrypted
          </p>
        </div> */}

        <div className="flex justify-between items-center mb-4 p-3 bg-blue-50 rounded-md">
          {" "}
          <span className="text-sm font-medium text-gray-700">
            Total Amount:
          </span>{" "}
          <span className="text-xl font-bold text-blue-600">
            {" "}
            {currency} {amount.toFixed(2)}
          </span>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center text-sm" /* Reduced padding and rounded size, added text-sm */
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin mr-2" size={16} /> Processing...
            </>
          ) : (
            "Pay with Card"
          )}
        </button>
      </form>
    </div>
  );
};

export default CardPaymentForm;
