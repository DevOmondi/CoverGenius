import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CoverLetterDisplayProps {
  content: string;
}

const CoverLetterDisplay: React.FC<CoverLetterDisplayProps> = ({ content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h3 className="font-medium text-gray-900">Generated Cover Letter</h3>
        <button
          onClick={handleCopy}
          className="inline-flex items-center text-sm text-gray-700 hover:text-blue-600"
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
      <div className="p-4 whitespace-pre-line text-gray-700 bg-gray-50 rounded-b-lg min-h-[200px] max-h-[400px] overflow-y-auto">
        {content}
      </div>
    </div>
  );
};

export default CoverLetterDisplay;