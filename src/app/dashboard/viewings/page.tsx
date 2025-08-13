'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

type Viewing = {
  id: string;
  date: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';
  property: {
    id: string;
    title: string;
    address: {
      street: string;
      city: string;
      province: string;
    };
    images: { url: string }[];
  };
  user: {
    name: string;
    email: string;
    phoneNumber?: string;
  };
};

export default function ViewingsPage() {
  const { user, isLoading: userLoading } = useUser();
  const [viewings, setViewings] = useState<Viewing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    if (!userLoading && user) {
      fetchViewings();
    }
  }, [user, userLoading]);

  const fetchViewings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/viewings');
      if (!response.ok) throw new Error('Failed to fetch viewings');
      const data = await response.json();
      setViewings(data);
    } catch (err) {
      setError('Failed to load viewings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (viewingId: string, newStatus: Viewing['status']) => {
    try {
      const response = await fetch(`/api/viewings/${viewingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update viewing');
      
      // Refresh viewings list
      fetchViewings();
    } catch (err) {
      console.error('Error updating viewing:', err);
      alert('Failed to update viewing status');
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-CA', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const getStatusBadgeColor = (status: Viewing['status']) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const now = new Date();
  const filterViewings = (viewing: Viewing) => {
    const viewingDate = new Date(viewing.date);
    if (activeTab === 'upcoming') {
      return viewingDate >= now;
    }
    return viewingDate < now;
  };

  if (userLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 text-yellow-800 p-4 rounded-md">
          Please log in to view your scheduled viewings.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Property Viewings</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded-md ${
            activeTab === 'upcoming'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Upcoming Viewings
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 rounded-md ${
            activeTab === 'past'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Past Viewings
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {viewings.filter(filterViewings).map((viewing) => (
          <div
            key={viewing.id}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="grid md:grid-cols-4 gap-6">
              {/* Property Image */}
              <div className="md:col-span-1">
                {viewing.property.images && viewing.property.images[0] ? (
                  <img
                    src={viewing.property.images[0].url}
                    alt={viewing.property.title}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
              </div>

              {/* Viewing Details */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold mb-2">
                  {viewing.property.title}
                </h3>
                <p className="text-gray-600 mb-2">
                  {viewing.property.address.street}, {viewing.property.address.city}
                </p>
                <p className="text-gray-600 mb-2">
                  Scheduled for: {formatDateTime(viewing.date)}
                </p>
                <div className="flex items-center">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(
                      viewing.status
                    )}`}
                  >
                    {viewing.status}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="md:col-span-1 flex flex-col justify-center space-y-2">
                {viewing.status === 'PENDING' && activeTab === 'upcoming' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(viewing.id, 'APPROVED')}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(viewing.id, 'REJECTED')}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}
                {viewing.status === 'APPROVED' && activeTab === 'upcoming' && (
                  <button
                    onClick={() => handleStatusUpdate(viewing.id, 'CANCELLED')}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
                  >
                    Cancel
                  </button>
                )}
                {viewing.status === 'APPROVED' && new Date(viewing.date) < now && (
                  <button
                    onClick={() => handleStatusUpdate(viewing.id, 'COMPLETED')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Mark Complete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {viewings.filter(filterViewings).length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              No {activeTab} viewings found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}