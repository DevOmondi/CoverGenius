// import React, { useState } from "react";
// import { Copy, Check, Lock, Download } from "lucide-react";
// import { usePayment } from "../../contexts/PaymentContext";

// interface CoverLetterDisplayProps {
//   content: string;
//   onPaymentInitiated: () => void;
// }

// const CoverLetterDisplay: React.FC<CoverLetterDisplayProps> = ({
//   content,
//   onPaymentInitiated,
// }) => {
//   const [copied, setCopied] = useState(false);
//   const { hasPaid } = usePayment();

//   const handleCopy = async () => {
//     if (!hasPaid) return;

//     try {
//       await navigator.clipboard.writeText(content);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     } catch (err) {
//       console.error("Failed to copy text: ", err);
//     }
//   };

//   // Get first 10 non-empty lines for preview
//   const previewLines = content
//     .split("\n")
//     .filter((line) => line.trim().length > 0)
//     .slice(0, 10)
//     .join("\n");

//   return (
//     <div className="bg-white border border-gray-200 rounded-lg relative h-full">
//       {/* Header */}
//       <div className="flex justify-between items-center p-4 border-b border-gray-200">
//         <h3 className="font-medium text-gray-900">Generated Cover Letter</h3>
//         <button
//           onClick={handleCopy}
//           disabled={!hasPaid}
//           className={`inline-flex items-center text-sm ${
//             hasPaid
//               ? "text-gray-700 hover:text-blue-600"
//               : "text-gray-400 cursor-not-allowed"
//           }`}
//         >
//           {copied ? (
//             <>
//               <Check className="h-4 w-4 mr-1" />
//               <span>Copied!</span>
//             </>
//           ) : (
//             <>
//               <Copy className="h-4 w-4 mr-1" />
//               <span>Copy to clipboard</span>
//             </>
//           )}
//         </button>
//       </div>

//       {/* Content Area with fixed positioning context */}
//       <div className="relative h-[calc(100%-56px)]">
//         {" "}
//         {/* Subtract header height */}
//         {/* Scrollable Content */}
//         <div className="p-4 whitespace-pre-line text-gray-700 h-full overflow-y-auto">
//           <div className={hasPaid ? "" : "blur-none"}>{previewLines}</div>
//           {hasPaid ? (
//             content.split("\n").slice(10).join("\n")
//           ) : (
//             <div className="blur-sm">
//               {content.split("\n").slice(10).join("\n")}
//             </div>
//           )}
//         </div>
//         {/* Fixed Center Modal (only shown when not paid) */}
//         {!hasPaid && (
//           <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
//             <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg text-center max-w-md w-full pointer-events-auto">
//               <Lock className="h-8 w-8 text-blue-500 mx-auto mb-3" />
//               <h3 className="text-lg font-medium text-gray-800 mb-2">
//                 Unlock Full Cover Letter
//               </h3>
//               <p className="text-sm text-gray-600 mb-4">
//                 Complete your payment to view and copy the entire document
//               </p>
//               <button
//                 onClick={onPaymentInitiated}
//                 className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
//               >
//                 <Download className="h-5 w-5 mr-2" />
//                 <span>Unlock for $5</span>
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CoverLetterDisplay;
import React, { useState } from "react";
import { Copy, Check, Lock, Download } from "lucide-react";
import { usePayment } from "../../contexts/PaymentContext";
import PayPalButton from "../ui/PayPalButton";

interface CoverLetterDisplayProps {
  content: string;
  onPaymentInitiated: () => void;
}

const CoverLetterDisplay: React.FC<CoverLetterDisplayProps> = ({
  content,
  onPaymentInitiated,
}) => {
  const [copied, setCopied] = useState(false);
  const [showPayPal, setShowPayPal] = useState(false);
  const { hasPaid, setHasPaid } = usePayment();

  const handleCopy = async () => {
    if (!hasPaid) return;

    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handlePaymentSuccess = () => {
    setHasPaid(true);
    setShowPayPal(false);
    onPaymentInitiated();
  };

  const handlePaymentError = (error: Error) => {
    console.error("Payment error:", error);
    // You might want to show an error message to the user
  };

  const previewLines = content
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .slice(0, 10)
    .join("\n");

  return (
    <div className="bg-white border border-gray-200 rounded-lg relative h-full">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h3 className="font-medium text-gray-900">Generated Cover Letter</h3>
        <button
          onClick={handleCopy}
          disabled={!hasPaid}
          className={`inline-flex items-center text-sm ${
            hasPaid
              ? "text-gray-700 hover:text-blue-600"
              : "text-gray-400 cursor-not-allowed"
          }`}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-1" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-1" />
              <span>Copy to clipboard</span>
            </>
          )}
        </button>
      </div>

      <div className="relative h-[calc(100%-56px)]">
        <div className="p-4 whitespace-pre-line text-gray-700 h-full overflow-y-auto">
          <div className={hasPaid ? "" : "blur-none"}>{previewLines}</div>
          {hasPaid ? (
            content.split("\n").slice(10).join("\n")
          ) : (
            <div className="blur-sm">
              {content.split("\n").slice(10).join("\n")}
            </div>
          )}
        </div>

        {!hasPaid && (
          <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg text-center max-w-md w-full pointer-events-auto">
              <Lock className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Unlock Full Cover Letter
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Complete your payment to view and copy the entire document
              </p>

              {showPayPal ? (
                <div className="mt-4">
                  <PayPalButton
                    amount={5}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                  />
                </div>
              ) : (
                <button
                  onClick={() => setShowPayPal(true)}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                >
                  <Download className="h-5 w-5 mr-2" />
                  <span>Unlock for $5</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoverLetterDisplay;
