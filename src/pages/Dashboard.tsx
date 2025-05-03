import React, { useState, useEffect, useRef } from "react";
import { useToast } from "../hooks/useToast";
import FileUploader from "../components/upload/FileUploader";
import JobDescriptionInput from "../components/upload/JobDescriptionInput";
import CoverLetterDisplay from "../components/generation/CoverLetterDisplay";
import DownloadOptions from "../components/download/DownloadOptions";
import { usePayment } from "../contexts/PaymentContext";

const Dashboard: React.FC = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [activeTab, setActiveTab] = useState("paste");
  const { hasPaid, setHasPaid } = usePayment();
  const { showError, ToastContainer } = useToast();

  // Create a ref for the cover letter section
  const coverLetterRef = useRef<HTMLDivElement>(null);

  const MAX_CHARACTERS = 10000;

  const handleTextInput = (text: string) => {
    setJobDescription(text);
  };

  const handleFileUpload = (text: string) => {
    setJobDescription(text);
    setActiveTab("paste");
  };

  const generateCoverLetter = async () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    if (!jobDescription.trim()) {
      showError("Please enter a job description or upload a file.");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/documents/generate-cover-letter`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ jobDescription }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate cover letter");
      }
      const { coverLetter } = await response.json();
      setCoverLetter(coverLetter);
      setHasPaid(false);
    } catch (error) {
      console.error("Error generating cover letter:", error);
      showError("An error occurred while generating the cover letter.");
      return;
    } finally {
      setIsGenerating(false);
    }
  };

  // Scroll to cover letter when it's generated
  useEffect(() => {
    if (coverLetter && coverLetterRef.current) {
      // Using setTimeout to ensure the DOM has updated with the new content
      setTimeout(() => {
        coverLetterRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [coverLetter]);

  const handlePaymentInitiated = () => {
    console.log("Payment initiated");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Generate Your Cover Letter
      </h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Step 1: Job Description Input */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold mb-4">
            Step 1: Input Job Description
          </h2>
          <div className="mb-4">
            <div className="flex border-b border-gray-200">
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "paste"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("paste")}
              >
                Paste Text
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "upload"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("upload")}
              >
                Upload File
              </button>
            </div>

            <div className="mt-4">
              {activeTab === "paste" ? (
                <JobDescriptionInput
                  value={jobDescription}
                  onChange={handleTextInput}
                />
              ) : (
                <FileUploader onTextExtracted={handleFileUpload} />
              )}
            </div>
          </div>
          <button
            onClick={generateCoverLetter}
            disabled={
              isGenerating ||
              !jobDescription.trim() ||
              jobDescription.length > MAX_CHARACTERS
            }
            className={`w-full py-3 px-4 rounded-md font-medium ${
              isGenerating ||
              !jobDescription.trim() ||
              jobDescription.length > MAX_CHARACTERS
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            } transition-colors`}
          >
            {isGenerating ? "Generating..." : "Generate Cover Letter"}
          </button>
        </div>

        {/* Step 2: Generated Cover Letter */}
        {coverLetter && (
          <div ref={coverLetterRef} className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4">
              Step 2: Review Your Cover Letter
            </h2>
            <CoverLetterDisplay
              content={coverLetter}
              onPaymentInitiated={handlePaymentInitiated}
            />
          </div>
        )}

        {/* Step 3: Download Options (only shown after payment) */}
        {coverLetter && hasPaid && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Step 3: Download Options
            </h2>
            <DownloadOptions content={coverLetter} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
