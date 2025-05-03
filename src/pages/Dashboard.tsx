import React, { useState } from 'react';
import FileUploader from '../components/upload/FileUploader';
import JobDescriptionInput from '../components/upload/JobDescriptionInput';
import CoverLetterDisplay from '../components/generation/CoverLetterDisplay';
import PaymentForm from '../components/payment/PaymentForm';
import DownloadOptions from '../components/download/DownloadOptions';
import { usePayment } from '../contexts/PaymentContext';
import { Lock } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const { hasPaid } = usePayment();
  const [activeTab, setActiveTab] = useState('paste');

  const handleTextInput = (text: string) => {
    setJobDescription(text);
  };

  const handleFileUpload = (text: string) => {
    setJobDescription(text);
    setActiveTab('paste'); // Switch to paste tab to show the extracted text
  };

  const generateCoverLetter = () => {
    if (!jobDescription.trim()) {
      alert('Please enter a job description');
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call to AI service
    setTimeout(() => {
      const generatedLetter = simulateAIGeneration(jobDescription);
      setCoverLetter(generatedLetter);
      setIsGenerating(false);
    }, 2000);
  };

  // This is a placeholder for the actual AI generation
  const simulateAIGeneration = (jobDesc: string) => {
    return `Dear Hiring Manager,

I am writing to express my strong interest in the position you have advertised. After carefully reviewing the job description, I believe my skills and experience make me an excellent candidate.

The role requires expertise in ${jobDesc.includes('React') ? 'React development' : 'software development'}, which aligns perfectly with my background. I have spent the last ${Math.floor(Math.random() * 5) + 3} years honing my skills in this area and have successfully delivered multiple projects.

I am particularly drawn to this opportunity because it offers the chance to work on ${jobDesc.includes('team') ? 'collaborative team projects' : 'innovative solutions'} while continuing to grow professionally.

I look forward to discussing how my background, skills, and experiences would be an ideal fit for this position. Thank you for considering my application.

Sincerely,
[Your Name]`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Generate Your Cover Letter</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Step 1: Job Description Input */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Step 1: Input Job Description</h2>
          <div className="mb-4">
            <div className="flex border-b border-gray-200">
              <button
                className={`px-4 py-2 font-medium ${activeTab === 'paste' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('paste')}
              >
                Paste Text
              </button>
              <button
                className={`px-4 py-2 font-medium ${activeTab === 'upload' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('upload')}
              >
                Upload File
              </button>
            </div>
            
            <div className="mt-4">
              {activeTab === 'paste' ? (
                <JobDescriptionInput value={jobDescription} onChange={handleTextInput} />
              ) : (
                <FileUploader onTextExtracted={handleFileUpload} />
              )}
            </div>
          </div>
          <button
            onClick={generateCoverLetter}
            disabled={isGenerating || !jobDescription.trim()}
            className={`w-full py-3 px-4 rounded-md font-medium ${
              isGenerating || !jobDescription.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } transition-colors`}
          >
            {isGenerating ? 'Generating...' : 'Generate Cover Letter'}
          </button>
        </div>
        
        {/* Step 2: Generated Cover Letter */}
        {coverLetter && (
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Step 2: Review Your Cover Letter</h2>
            <CoverLetterDisplay content={coverLetter} />
          </div>
        )}
        
        {/* Step 3: Payment & Download */}
        {coverLetter && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Step 3: Download Options</h2>
            
            {!hasPaid ? (
              <div className="mb-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
                  <div className="flex">
                    <Lock className="h-5 w-5 text-yellow-500 mr-2" />
                    <p className="text-yellow-700">
                      To download your cover letter, please make a one-time payment.
                    </p>
                  </div>
                </div>
                <PaymentForm />
              </div>
            ) : (
              <DownloadOptions content={coverLetter} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;