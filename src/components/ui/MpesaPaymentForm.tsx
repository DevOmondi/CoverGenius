import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { ArrowLeft, Loader2, XCircle, CheckCircle2 } from "lucide-react";

interface MpesaPaymentProps {
  amount: number;
  onCancel: () => void;
  onPaymentSuccess: () => void;
  onPaymentError: (error: Error) => void;
}

interface MpesaPaymentData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  amount: number;
}

const MpesaPaymentForm = ({
  amount,
  onCancel,
  onPaymentSuccess,
  onPaymentError,
}: MpesaPaymentProps) => {
  const [formData, setFormData] = useState<MpesaPaymentData>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    amount: amount, // Default amount in KES
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentState, setPaymentState] = useState<{
    status: "idle" | "pending" | "complete" | "failed";
    invoiceId?: string;
    message?: string;
    mpesaReference?: string;
  }>({ status: "idle" });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.first_name) newErrors.first_name = "First name is required";
    if (!formData.last_name) newErrors.last_name = "Last name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phone_number) {
      newErrors.phone_number = "Phone number is required";
    } else if (!/^(?:254|\+254|0)?(7|1)\d{8}$/.test(formData.phone_number)) {
      newErrors.phone_number = "Enter a valid Kenyan phone number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/payment/mpesa-payment`,
          formData
        );

        const { status, data } = response.data;

        if (status === "pending") {
          setPaymentState({
            status: "pending",
            invoiceId: data.invoiceId,
            message: "Payment request sent to your phone",
          });
        } else if (status === "complete") {
          setPaymentState({
            status: "complete",
            message: "Payment completed successfully",
            mpesaReference: data.mpesaReference,
          });
          onPaymentSuccess();
        } else {
          throw new Error(response.data.message || "Unexpected response");
        }
      } catch (error: any) {
        console.log("Payment error:", error);
        setPaymentState({
          status: "failed",
          message:
            error.response?.data?.message || error.message || "Payment failed",
        });
        onPaymentError(error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone_number") {
      // Remove all non-digit characters
      const digitsOnly = value.replace(/\D/g, "");

      // Convert to 254 format
      let formattedNumber = digitsOnly;
      if (digitsOnly.startsWith("0")) {
        formattedNumber = "254" + digitsOnly.substring(1);
      } else if (digitsOnly.startsWith("7") || digitsOnly.startsWith("1")) {
        formattedNumber = "254" + digitsOnly;
      }

      // Limit to 12 digits (254 + 9 digits)
      formattedNumber = formattedNumber.substring(0, 12);

      setFormData((prev) => ({ ...prev, [name]: formattedNumber }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Polling function
  const checkPaymentStatus = useCallback(
    async (invoiceId: string) => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/payment/status/${invoiceId}`
        );

        const { status, data } = response.data;

        if (status === "complete") {
          setPaymentState({
            status: "complete",
            message: "Payment completed successfully",
            mpesaReference: data.mpesaReference,
          });
          onPaymentSuccess();
        } else if (status === "failed") {
          setPaymentState({
            status: "failed",
            message: data.failedReason || "Payment failed",
          });
          onPaymentError(new Error(data.failedReason || "Payment failed"));
        }
        // If still pending, do nothing
      } catch (error) {
        console.error("Status check error:", error);
        // Don't stop polling on temporary errors
      }
    },
    [API_BASE_URL, onPaymentSuccess, onPaymentError]
  );

  // Polling effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (paymentState.status === "pending" && paymentState.invoiceId) {
      // Initial check immediately Form is loaded
      checkPaymentStatus(paymentState.invoiceId);
      // Then check every 5 seconds
      intervalId = setInterval(() => {
        checkPaymentStatus(paymentState.invoiceId!);
      }, 3000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [paymentState.status, paymentState.invoiceId, checkPaymentStatus]);

  const renderPaymentStatus = () => {
    switch (paymentState.status) {
      case "pending":
        return (
          <div className="mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center">
              <Loader2
                className="animate-spin mr-2 text-yellow-600"
                size={20}
              />
              <span className="text-yellow-800">{paymentState.message}</span>
            </div>
            <p className="mt-2 text-sm text-yellow-700">
              A payment request has been sent to {formData.phone_number}. Please
              enter your M-PESA PIN to complete the payment.
            </p>
          </div>
        );

      case "complete":
        return (
          <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center">
              <CheckCircle2 className="mr-2 text-green-600" size={20} />
              <span className="text-green-800">{paymentState.message}</span>
            </div>
            {paymentState.mpesaReference && (
              <p className="mt-2 text-sm text-green-700">
                M-PESA Reference: {paymentState.mpesaReference}
              </p>
            )}
          </div>
        );

      case "failed":
        return (
          <div className="mb-4 p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center">
              <XCircle className="mr-2 text-red-600" size={20} />
              <span className="text-red-800">{paymentState.message}</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={onCancel}
          className="text-blue-600 hover:text-blue-800 mr-4"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-grow text-center mr-4">
          <h2 className="text-2xl font-bold text-gray-800">M-Pesa Payment</h2>
          <p className="text-gray-600">Complete your payment of KES {amount}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="first_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                errors.first_name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="John"
            />
            {errors.first_name && (
              <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="last_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                errors.last_name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Doe"
            />
            {errors.last_name && (
              <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="phone_number"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            M-Pesa Phone Number
          </label>
          <input
            type="tel"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
              errors.phone_number ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="712345678"
            maxLength={12}
          />
          {errors.phone_number && (
            <p className="mt-1 text-sm text-red-600">{errors.phone_number}</p>
          )}
          <p className="mt-2 text-sm text-gray-500">
            Enter your Safaricom number (e.g., 712345678)
          </p>
        </div>

        {renderPaymentStatus()}

        <div className="flex justify-between items-center mb-6 p-4 bg-blue-50 rounded-lg">
          <span className="font-medium text-gray-700">Total Amount:</span>
          <span className="text-2xl font-bold text-blue-600">KES {amount}</span>
        </div>

        {paymentState.status === "idle" && (
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Processing...
              </>
            ) : (
              "Pay with M-Pesa"
            )}
          </button>
        )}

        {paymentState.status !== "idle" && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            Close
          </button>
        )}
      </form>
    </div>
  );
};

export default MpesaPaymentForm;
