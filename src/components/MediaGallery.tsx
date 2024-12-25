'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Close } from '@mui/icons-material';

interface MediaItem {
  MediaURL: string;
  ShortDescription?: string;
  Order?: number;
  MediaKey?: string;
}

interface MediaGalleryProps {
  media: MediaItem[];
}

export default function MediaGallery({ media }: MediaGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  // Enhanced deduplication logic
  const uniqueMedia = useMemo(() => {
    const uniqueUrls = new Map();
    
    return media.filter(item => {
      // Clean the URL by removing any query parameters or trailing spaces
      const cleanUrl = item.MediaURL.split('?')[0].trim();
      
      if (!uniqueUrls.has(cleanUrl)) {
        uniqueUrls.set(cleanUrl, true);
        return true;
      }
      return false;
    });
  }, [media]);

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? uniqueMedia.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === uniqueMedia.length - 1 ? 0 : prev + 1));
  };

  // If no media or all duplicates, show placeholder
  if (!uniqueMedia.length) {
    return (
      <div className="h-[600px] bg-gray-100 flex items-center justify-center">
        <p>No images available</p>
      </div>
    );
  }

  return (
    <>
      {/* Main Gallery Grid */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[600px] mb-8">
        {/* Main Large Image */}
        <div className="col-span-2 row-span-2 relative">
          <img
            src={uniqueMedia[0]?.MediaURL}
            alt={uniqueMedia[0]?.ShortDescription || 'Main property photo'}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => {
              setSelectedIndex(0);
              setShowLightbox(true);
            }}
          />
        </div>

        {/* Smaller Images Grid */}
        {uniqueMedia.slice(1, 5).map((item, index) => (
          <div
            key={item.MediaKey || item.MediaURL}
            className="relative h-full"
          >
            <img
              src={item.MediaURL}
              alt={item.ShortDescription || `Property photo ${index + 2}`}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => {
                setSelectedIndex(index + 1);
                setShowLightbox(true);
              }}
            />
          </div>
        ))}

        {/* Remaining Photos Counter */}
        {uniqueMedia.length > 5 && (
          <div 
            className="absolute right-4 bottom-4 bg-black/70 text-white px-3 py-1 rounded-full cursor-pointer"
            onClick={() => {
              setSelectedIndex(5);
              setShowLightbox(true);
            }}
          >
            +{uniqueMedia.length - 5} photos
          </div>
        )}
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black z-50 flex">
          {/* Close Button */}
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 text-white z-10"
          >
            <Close className="w-8 h-8" />
          </button>

          {/* Sidebar with Thumbnails */}
          <div className="w-[200px] h-full overflow-y-auto bg-black/50 p-2 flex flex-col">
            <div className="grid grid-cols-2 gap-2 auto-rows-[100px]">
              {uniqueMedia.map((item, index) => (
                <div
                  key={item.MediaKey || item.MediaURL}
                  className={`cursor-pointer transition-opacity ${
                    index === selectedIndex ? 'ring-2 ring-white' : 'opacity-50 hover:opacity-75'
                  }`}
                  onClick={() => setSelectedIndex(index)}
                >
                  <img
                    src={item.MediaURL}
                    alt={item.ShortDescription || `Property photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Main Image */}
          <div className="flex-1 relative flex items-center justify-center p-4">
            <img
              src={uniqueMedia[selectedIndex]?.MediaURL}
              alt={uniqueMedia[selectedIndex]?.ShortDescription || 'Property photo'}
              className="max-h-full max-w-full object-contain"
            />

            {/* Navigation Buttons */}
            <button
              onClick={handlePrevious}
              className="absolute left-4 text-white p-2 rounded-full hover:bg-black/30"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 text-white p-2 rounded-full hover:bg-black/30"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded-full">
              {selectedIndex + 1} / {uniqueMedia.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
} 