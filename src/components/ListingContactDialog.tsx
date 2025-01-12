import React, { useState } from 'react';
import { Property } from '@/types/property';

interface ListingContactDialogProps {
  property: Property;
}

const ListingContactDialog = ({ property }: ListingContactDialogProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: `I would like more information regarding the home at ${property.UnparsedAddress}`
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          propertyId: property.ListingKey,
          propertyAddress: property.UnparsedAddress,
          propertyPrice: property.ListPrice,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit inquiry');
      }

      setSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        message: '',
      });
    } catch (err) {
      setError('Failed to submit your inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">I want to schedule a tour of this Home!</h2>
      <p className="text-sm text-gray-600 mb-6">
        Learn more by viewing our{' '}
        <a href="/privacy-policy" className="text-blue-600 hover:underline">
          privacy policy
        </a>{' '}
        or{' '}
        <a href="/contact" className="text-blue-600 hover:underline">
          contact us
        </a>
        .
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Full Name"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
        </div>

        <div>
          <input
            type="email"
            placeholder="Email Address"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div>
          <input
            type="tel"
            placeholder="Phone Number (Mobile)"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <div>
          <textarea
            placeholder="Your message"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        {success && (
          <div className="text-green-500 text-sm">
            Thank you for your inquiry! We'll get back to you soon.
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition-colors duration-300 disabled:bg-gray-400"
        >
          {isSubmitting ? 'Sending...' : 'Go Tour This Home'}
        </button>
      </form>
    </div>
  );
};

export default ListingContactDialog; 