import React, { useState } from 'react';
import axios from 'axios';

const AccountSettings: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put('/api/users/me/password', {
        currentPassword,
        newPassword,
      });
      setSuccess(true);
      setError(null);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setError('Error changing password. Please try again.');
      setSuccess(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
      <form onSubmit={handlePasswordChange}>
        <div className="mb-4">
          <label htmlFor="currentPassword" className="block font-medium mb-2">
            Current Password
          </label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="border rounded p-2 w-full focus:border-blue-500 focus:ring-blue-500 focus:ring-1"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="newPassword" className="block font-medium mb-2">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border rounded p-2 w-full focus:border-blue-500 focus:ring-blue-500 focus:ring-1"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block font-medium mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border rounded p-2 w-full focus:border-blue-500 focus:ring-blue-500 focus:ring-1"
          />
        </div>
        {/* ... */}
      </form>
    </div>
  );
};

export default AccountSettings;