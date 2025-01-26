// app/BookingForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const BookingForm: React.FC = () => {
  const { register, handleSubmit, reset } = useForm();
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      await axios.post('/api/bookings', data);
      setSuccess(true);
      reset();
    } catch (error) {
      console.error('Error booking viewing:', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Book a Viewing</h2>
      {success ? (
        <div className="bg-green-100 text-green-800 p-4 rounded mb-4">
          Your viewing request has been submitted successfully.
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="property" className="block font-medium mb-2">
              Property
            </label>
            <input
              type="text"
              id="property"
              {...register('property', { required: true })}
              className="border rounded p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="date" className="block font-medium mb-2">
              Date
            </label>
            <input
              type="date"
              id="date"
              {...register('date', { required: true })}
              className="border rounded p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="time" className="block font-medium mb-2">
              Time
            </label>
            <input
              type="time"
              id="time"
              {...register('time', { required: true })}
              className="border rounded p-2 w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Request Viewing
          </button>
        </form>
      )}
    </div>
  );
};

export default BookingForm;