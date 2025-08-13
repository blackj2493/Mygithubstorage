import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get<UserProfile>('/api/users/me');
        setProfile(response.data);
        setUpdatedProfile(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await axios.put<UserProfile>('/api/users/me', updatedProfile);
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  const handleCancel = () => {
    setUpdatedProfile(profile);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedProfile({ ...updatedProfile!, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      {profile ? (
        <div>
          {isEditing ? (
            <form onSubmit={handleSave}>
              <div className="mb-4">
                <label htmlFor="name" className="block font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={updatedProfile?.name || ''}
                  onChange={handleInputChange}
                  className="border rounded p-2 w-full"
                />
              </div>
              {/* Add more profile fields here */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="mr-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="mb-4">
                <div className="font-medium mb-2">Name</div>
                <div>{profile.name}</div>
              </div>
              {/* Add more profile fields here */}
              <button
                onClick={handleEdit}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Profile;