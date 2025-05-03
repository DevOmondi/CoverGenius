
import React from "react";

interface JobDescriptionInputProps {
  value: string;
  onChange: (text: string) => void;
}

const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({
  value,
  onChange,
}) => {
  const MAX_CHARACTERS = 10000;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= MAX_CHARACTERS) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor="jobDescription"
        className="block text-sm font-medium text-gray-700"
      >
        Paste the job description here
      </label>
      <textarea
        id="jobDescription"
        rows={10}
        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Copy and paste the job description here..."
        value={value}
        onChange={handleChange}
        maxLength={MAX_CHARACTERS}
      ></textarea>
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          For best results, include the complete job description with all
          requirements and responsibilities.
        </p>
        <span
          className={`text-xs ${
            value.length >= MAX_CHARACTERS ? "text-red-500" : "text-gray-500"
          }`}
        >
          {value.length}/{MAX_CHARACTERS}
        </span>
      </div>
      {value.length >= MAX_CHARACTERS && (
        <p className="text-xs text-red-500">Maximum character limit reached</p>
      )}
    </div>
  );
};

export default JobDescriptionInput;
