// app/components/ViewingScheduler.tsx
import React, { useState } from 'react';
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ViewingScheduler: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handlePreviousWeek = () => {
    setSelectedDate(addDays(selectedDate, -7));
  };

  const handleNextWeek = () => {
    setSelectedDate(addDays(selectedDate, 7));
  };

  const renderDaySlots = (date: Date) => {
    // Implement logic to render available viewing slots for the given date
    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-200 p-4 rounded">9:00 AM - 10:00 AM</div>
        <div className="bg-gray-200 p-4 rounded">10:30 AM - 11:30 AM</div>
        <div className="bg-gray-200 p-4 rounded">1:00 PM - 2:00 PM</div>
        <div className="bg-gray-200 p-4 rounded">2:30 PM - 3:30 PM</div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePreviousWeek}>
          <ChevronLeft />
        </button>
        <h2 className="text-xl font-bold">
          {format(startOfWeek(selectedDate), 'MMM d')} -{' '}
          {format(endOfWeek(selectedDate), 'MMM d')}
        </h2>
        <button onClick={handleNextWeek}>
          <ChevronRight />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-4">
        {Array.from({ length: 7 }, (_, i) => {
          const date = addDays(startOfWeek(selectedDate), i);
          return (
            <div key={i} className="bg-gray-100 p-4 rounded">
              <div className="font-bold mb-2">{format(date, 'EEE, d')}</div>
              {renderDaySlots(date)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ViewingScheduler;