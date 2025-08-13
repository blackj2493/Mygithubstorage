import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui/AllCard';

const VerificationForm: React.FC = () => {
  const [documents, setDocuments] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    documents.forEach((doc) => formData.append('documents', doc));
    try {
      await axios.post('/api/users/me/verification', formData);
      setSuccess(true);
      setError(null);
      setDocuments([]);
    } catch (error) {
      setError('Error submitting verification. Please try again.');
      setSuccess(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader className="bg-blue-600 text-white">
        <CardTitle>Professional Verification</CardTitle>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="mb-4 text-green-500 font-medium">
            Your verification request has been submitted successfully.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="documents" className="block font-medium mb-2">
                Upload your professional documents
              </label>
              <input
                type="file"
                id="documents"
                multiple
                onChange={handleDocumentUpload}
                className="border rounded p-2 w-full focus:border-blue-500 focus:ring-blue-500 focus:ring-1"
              />
            </div>
            {error && (
              <div className="mb-4 text-red-500 font-medium">{error}</div>
            )}
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              Submit for Verification
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default VerificationForm;