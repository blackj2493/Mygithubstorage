// Preferences
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface UserPreferences {
  id: string;
  notifications: boolean;
  emailUpdates: boolean;
  privacySettings: {
    shareProfile: boolean;
    shareActivity: boolean;
  };
}

const Preferences: React.FC = () => {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [updatedPreferences, setUpdatedPreferences] = useState<UserPreferences | null>(null);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await axios.get<UserPreferences>('/api/users/me/preferences');
        setPreferences(response.data);
        setUpdatedPreferences({ ...response.data }); // Create a copy to avoid modifying the original
      } catch (error) {
        console.error('Error fetching user preferences:', error);
      }
    };
    fetchPreferences();
  }, []);

  const handleSave = async () => {
    try {
      await axios.put<UserPreferences>('/api/users/me/preferences', updatedPreferences);
      setPreferences(updatedPreferences);
    } catch (error) {
      console.error('Error updating user preferences:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedPreferences({
      ...updatedPreferences!,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Preferences</h1>
      {preferences ? (
        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label htmlFor="notifications" className="flex items-center">
              <input
                type="checkbox"
                id="notifications"
                name="notifications"
                checked={updatedPreferences?.notifications || false}
                onChange={handleInputChange}
                className="mr-2 focus:ring-blue-500 focus:ring-1"
              />
              Receive notifications
            </label>
          </div>
          {/* ... */}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Save Preferences
          </button>
        </form>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Preferences;