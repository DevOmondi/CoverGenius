import React from 'react';

interface JobDescriptionInputProps {
  value: string;
  onChange: (text: string) => void;
}

const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">
        Paste the job description here
      </label>
      <textarea
        id="jobDescription"
        rows={10}
        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Copy and paste the job description here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      ></textarea>
      <p className="text-sm text-gray-500">
        For best results, include the complete job description with all requirements and responsibilities.
      </p>
    </div>
  );
};

export default JobDescriptionInput;