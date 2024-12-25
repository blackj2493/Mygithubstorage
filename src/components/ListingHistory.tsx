import { useState } from 'react';

interface ListingHistoryItem {
  dateStart: string;
  dateEnd?: string;
  price: number;
  event: string;
  listingId: string;
}

interface ListingHistoryProps {
  history: ListingHistoryItem[];
  address: string;
  propertyType: string;
}

export default function ListingHistory({ history, address, propertyType }: ListingHistoryProps) {
  const [showAll, setShowAll] = useState(false);

  const displayedHistory = showAll ? history : history.slice(0, 3);

  return (
    <section className="mt-8 bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Listing History</h2>
        <div className="text-sm text-gray-500">
          Buy/sell history for {address} ({propertyType})
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date Start</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date End</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Price</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Event</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Listing ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {displayedHistory.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {new Date(item.dateStart).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {item.dateEnd ? new Date(item.dateEnd).toLocaleDateString() : '-'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  ${item.price.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.event === 'For Sale' ? 'bg-blue-100 text-blue-800' :
                    item.event === 'Expired' ? 'bg-yellow-100 text-yellow-800' :
                    item.event === 'Terminated' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.event}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-blue-600 hover:text-blue-800">
                  <a href={`/listings/${item.listingId}`}>{item.listingId}</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {history.length > 3 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {showAll ? 'Show Less' : 'Show More'}
          </button>
        </div>
      )}
    </section>
  );
} 