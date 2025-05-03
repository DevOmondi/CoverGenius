import React, { useState } from 'react';
import { FileText, Download, Copy, Check, FileSpreadsheet } from 'lucide-react';

interface DownloadOptionsProps {
  content: string;
}

const DownloadOptions: React.FC<DownloadOptionsProps> = ({ content }) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownload = (format: string) => {
    setDownloading(format);
    
    // Simulate download processing and delay
    setTimeout(() => {
      if (format === 'pdf' || format === 'docx') {
        // Create text for download
        const element = document.createElement('a');
        const file = new Blob([content], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `cover-letter.${format === 'pdf' ? 'txt' : 'txt'}`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      } else if (format === 'google') {
        // Open Google Docs in a new tab
        window.open('https://docs.google.com/document/create', '_blank');
      }
      
      setDownloading(null);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6 flex items-start">
        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
        <div>
          <p className="text-green-800 font-medium">Payment successful!</p>
          <p className="text-green-700 text-sm mt-1">
            You can now download your cover letter in multiple formats or copy the content.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => handleDownload('pdf')}
          disabled={downloading === 'pdf'}
          className="border border-gray-200 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors"
        >
          <div className="flex flex-col items-center">
            <FileText className="h-8 w-8 text-red-500 mb-2" />
            <span className="font-medium text-gray-800">PDF Format</span>
            <span className="text-sm text-gray-500 mt-1">Best for printing</span>
            
            <div className="mt-3">
              {downloading === 'pdf' ? (
                <div className="inline-flex items-center justify-center">
                  <svg className="animate-spin h-4 w-4 text-gray-600 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Downloading...
                </div>
              ) : (
                <div className="inline-flex items-center justify-center text-blue-600">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </div>
              )}
            </div>
          </div>
        </button>
        
        <button
          onClick={() => handleDownload('docx')}
          disabled={downloading === 'docx'}
          className="border border-gray-200 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors"
        >
          <div className="flex flex-col items-center">
            <FileText className="h-8 w-8 text-blue-500 mb-2" />
            <span className="font-medium text-gray-800">Word Document</span>
            <span className="text-sm text-gray-500 mt-1">Editable format</span>
            
            <div className="mt-3">
              {downloading === 'docx' ? (
                <div className="inline-flex items-center justify-center">
                  <svg className="animate-spin h-4 w-4 text-gray-600 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Downloading...
                </div>
              ) : (
                <div className="inline-flex items-center justify-center text-blue-600">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </div>
              )}
            </div>
          </div>
        </button>
        
        <button
          onClick={() => handleDownload('google')}
          disabled={downloading === 'google'}
          className="border border-gray-200 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors"
        >
          <div className="flex flex-col items-center">
            <FileSpreadsheet className="h-8 w-8 text-green-500 mb-2" />
            <span className="font-medium text-gray-800">Google Docs</span>
            <span className="text-sm text-gray-500 mt-1">Cloud access</span>
            
            <div className="mt-3">
              {downloading === 'google' ? (
                <div className="inline-flex items-center justify-center">
                  <svg className="animate-spin h-4 w-4 text-gray-600 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Opening...
                </div>
              ) : (
                <div className="inline-flex items-center justify-center text-blue-600">
                  <Download className="h-4 w-4 mr-1" />
                  Open
                </div>
              )}
            </div>
          </div>
        </button>
      </div>
      
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleCopy}
          className="inline-flex items-center text-gray-700 hover:text-blue-600 py-2 px-4 border border-gray-200 rounded-md transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              <span>Copied to clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              <span>Copy text to clipboard</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DownloadOptions;