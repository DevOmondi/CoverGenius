import React, { useState } from "react";
import { Upload, FileText, Image, AlertCircle } from "lucide-react";

interface FileUploaderProps {
  onTextExtracted: (text: string) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onTextExtracted }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length) {
      processFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = async (file: File) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    setIsProcessing(true);
    setError(null);
    setFileName(file.name);

    // Check file type
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ];

    if (!validTypes.includes(file.type)) {
      setError("Please upload a PDF, DOCX, or image file");
      setIsProcessing(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${API_BASE_URL}/api/documents/extract-text`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const { extractedText } = await response.json();
      onTextExtracted(extractedText);
    } catch (err) {
      console.error("Error extracting text:", err);
      setError("Failed to extract text from file");
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset the form
  const handleReset = () => {
    setFileName(null);
    setError(null);
  };

  const getFileIcon = () => {
    if (!fileName) return <Upload className="h-12 w-12 text-gray-400" />;

    if (fileName.endsWith(".pdf")) {
      return <FileText className="h-12 w-12 text-red-500" />;
    } else if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) {
      return <FileText className="h-12 w-12 text-blue-500" />;
    } else {
      return <Image className="h-12 w-12 text-green-500" />;
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center ${
        isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
      } transition-colors`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="space-y-4">
        <div className="flex justify-center">{getFileIcon()}</div>

        {isProcessing ? (
          <div className="animate-pulse">
            <p className="text-gray-600">Processing file...</p>
            <p className="text-gray-500 text-sm">This may take a moment</p>
          </div>
        ) : (
          <>
            {fileName ? (
              <div>
                <p className="text-gray-700 font-medium">{fileName}</p>
                <button
                  onClick={handleReset}
                  className="text-blue-600 hover:text-blue-800 text-sm mt-2"
                >
                  Upload a different file
                </button>
              </div>
            ) : (
              <>
                <div>
                  <p className="text-gray-700 font-medium">
                    Drag and drop your file here
                  </p>
                  <p className="text-gray-500 text-sm">or</p>
                </div>

                <label className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md cursor-pointer transition-colors">
                  Browse Files
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>

                <p className="text-gray-500 text-sm">
                  Supports PDF, DOCX, JPG, PNG
                </p>
              </>
            )}

            {error && (
              <div className="text-red-500 flex items-center justify-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>{error}</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
