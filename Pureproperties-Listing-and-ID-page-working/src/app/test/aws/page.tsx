'use client';
import { useState } from 'react';

export default function TestAWS() {
  const [status, setStatus] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Test basic connection
  const testConnection = async () => {
    try {
      setStatus('Testing connection...');
      const response = await fetch('/api/test-aws');
      const data = await response.json();
      setStatus(`Connection test: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setStatus(`Error: ${error}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">AWS S3 Test Page</h1>
      
      {/* Connection Test */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Test AWS Connection</h2>
        <button
          onClick={testConnection}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Test Connection
        </button>
      </div>

      {/* Status Display */}
      {status && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Status</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {status}
          </pre>
        </div>
      )}
    </div>
  );
}