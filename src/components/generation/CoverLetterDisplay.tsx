import React, { useState, useEffect, useRef } from "react";
import { Copy, Check, Lock, CreditCard } from "lucide-react";
import { usePayment } from "../../contexts/PaymentContext";
import PayPalButton from "../ui/PayPalButton";
import MpesaPaymentForm from "../ui/MpesaPaymentForm";
import CardPaymentForm from "../ui/CardPaymentForm";

interface CoverLetterDisplayProps {
  content: string;
  onPaymentInitiated: () => void;
  onContentChange?: (content: string) => void;
}

const CoverLetterDisplay: React.FC<CoverLetterDisplayProps> = ({
  content,
  onPaymentInitiated,
  onContentChange,
}) => {
  const [copied, setCopied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    "none" | "paypal" | "mpesa" | "card"
  >("none");
  const [editableContent, setEditableContent] = useState(content);
  const { hasPaid, setHasPaid } = usePayment();
  const contentEditableRef = useRef<HTMLDivElement>(null);
  const lastSelection = useRef<{ start: number; end: number } | null>(null);

  // Save selection when content changes
  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && contentEditableRef.current) {
      const range = selection.getRangeAt(0);
      const preSelectionRange = range.cloneRange();
      preSelectionRange.selectNodeContents(contentEditableRef.current);
      preSelectionRange.setEnd(range.startContainer, range.startOffset);
      const start = preSelectionRange.toString().length;
      const end = start + range.toString().length;
      lastSelection.current = { start, end };
    }
  };

  // Restore selection after content update
  const restoreSelection = () => {
    if (!lastSelection.current || !contentEditableRef.current) return;

    const { start, end } = lastSelection.current;
    let charIndex = 0;
    const range = document.createRange();
    range.setStart(contentEditableRef.current, 0);
    range.collapse(true);

    const nodeStack = [contentEditableRef.current];
    let node;
    let foundStart = false;
    let stop = false;

    while (!stop && (node = nodeStack.pop())) {
      if (node.nodeType === Node.TEXT_NODE) {
        const nextCharIndex =
          charIndex +
          (node.nodeType === Node.TEXT_NODE
            ? node.textContent?.length || 0
            : 0);
        if (!foundStart && start >= charIndex && start <= nextCharIndex) {
          range.setStart(node, start - charIndex);
          foundStart = true;
        }
        if (foundStart && end >= charIndex && end <= nextCharIndex) {
          range.setEnd(node, end - charIndex);
          stop = true;
        }
        charIndex = nextCharIndex;
      } else {
        let i = node.childNodes.length;
        while (i--) {
          nodeStack.push(node.childNodes[i]);
        }
      }
    }

    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  // Update content when prop changes
  useEffect(() => {
    setEditableContent(content);
  }, [content]);

  const handleCopy = async () => {
    if (!hasPaid) return;

    try {
      await navigator.clipboard.writeText(editableContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    saveSelection();
    const newContent = e.currentTarget.innerHTML || "";
    setEditableContent(newContent);
    if (onContentChange) {
      onContentChange(e.currentTarget.textContent || "");
    }
    setTimeout(restoreSelection, 0);
  };

  const handlePaymentSuccess = () => {
    setHasPaid(true);
    setPaymentMethod("none");
    onPaymentInitiated();
  };

  const handlePaymentError = (error: Error) => {
    console.error("Payment error:", error);
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
        {hasPaid ? (
          <div
            ref={contentEditableRef}
            className="p-4 whitespace-pre-line text-gray-700 h-full overflow-y-auto outline-none"
            contentEditable
            onInput={handleContentChange}
            onBlur={handleContentChange}
            suppressContentEditableWarning={true}
            dangerouslySetInnerHTML={{ __html: editableContent }}
          />
        ) : (
          <>
            <div
              className="p-4 whitespace-pre-line text-gray-700 h-full overflow-y-auto select-none"
              style={{
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none",
              }}
            >
              <div>{previewLines}</div>
              <div
                className="blur-sm"
                style={{
                  pointerEvents: "none",
                  userSelect: "none",
                  WebkitUserSelect: "none",
                  MozUserSelect: "none",
                  msUserSelect: "none",
                }}
              >
                {content.split("\n").slice(10).join("\n")}
              </div>
            </div>

            {/* Payment overlay */}
            <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg text-center max-w-md w-full pointer-events-auto">
                <Lock className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Unlock Full Cover Letter
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Complete your payment to view and edit the entire document
                </p>

                {paymentMethod === "none" ? (
                  <div className="space-y-3">
                    <button
                      onClick={() => setPaymentMethod("paypal")}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                    >
                      <img
                        className="h-5 w-5 mr-2"
                        src="/icons/paypal-logo.svg"
                        alt="PayPal"
                      />
                      <span>Pay with PayPal - $5</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod("mpesa")}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                    >
                      <img
                        className="h-5 w-5 mr-2"
                        src="/icons/mpesa-logo.svg"
                        alt="M-Pesa"
                      />
                      <span>Pay with M-Pesa - KES 1</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod("card")}
                      className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                    >
                      <CreditCard className="h-5 w-5 mr-2" />
                      <span>Pay with Card - $5</span>
                    </button>
                  </div>
                ) : paymentMethod === "paypal" ? (
                  <div className="mt-4">
                    <PayPalButton
                      amount={5}
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentError={handlePaymentError}
                    />
                    <button
                      onClick={() => setPaymentMethod("none")}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                    >
                      ← Back to payment options
                    </button>
                  </div>
                ) : paymentMethod === "mpesa" ? (
                  <div className="mt-4">
                    <MpesaPaymentForm
                      amount={1}
                      onCancel={() => setPaymentMethod("none")}
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentError={handlePaymentError}
                    />
                    <button
                      onClick={() => setPaymentMethod("none")}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                    >
                      ← Back to payment options
                    </button>
                  </div>
                ) : (
                  <div className="mt-4">
                    <CardPaymentForm
                      amount={5}
                      currency="USD"
                      onCancel={() => setPaymentMethod("none")}
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentError={handlePaymentError}
                    />
                    <button
                      onClick={() => setPaymentMethod("none")}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                    >
                      ← Back to payment options
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CoverLetterDisplay;
