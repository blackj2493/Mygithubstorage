// src/components/listing/ImageUpload.tsx
import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/AllCard';
import { Camera, XCircle, Upload } from 'lucide-react';

interface ImageUploadProps {
  selectedImages: string[];
  onImagesChange: (images: string[]) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  selectedImages,
  onImagesChange,
  onContinue,
  onBack,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  }, []);

  const handleFiles = async (files: File[]) => {
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024
    );

    if (validFiles.length !== files.length) {
      setUploadError('Some files were skipped. Only images under 10MB are allowed.');
    }

    try {
      const uploadedUrls = await Promise.all(
        validFiles.map(async (file) => {
          // In a real implementation, this would upload to your server/cloud storage
          // For now, we'll create local URLs
          return URL.createObjectURL(file);
        })
      );

      onImagesChange([...selectedImages, ...uploadedUrls]);
      setUploadError(null);
    } catch (error) {
      setUploadError('Failed to upload some images. Please try again.');
    }
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const reorderImages = (dragIndex: number, dropIndex: number) => {
    const newImages = [...selectedImages];
    const [draggedImage] = newImages.splice(dragIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);
    onImagesChange(newImages);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-6 w-6" />
            Property Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Upload Area */}
          <div 
            className={`relative border-2 border-dashed rounded-lg p-8 text-center
              ${dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
              }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="image-upload"
            />
            <label 
              htmlFor="image-upload"
              className="flex flex-col items-center cursor-pointer"
            >
              <Upload className="h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Drag and drop images here, or click to select files
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Supported formats: JPG, PNG, GIF (up to 10MB each)
              </p>
            </label>
          </div>

          {/* Error Display */}
          {uploadError && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
              {uploadError}
            </div>
          )}

          {/* Image Preview Grid */}
          {selectedImages.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">
                Uploaded Images ({selectedImages.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {selectedImages.map((url, index) => (
                  <div
                    key={url}
                    className="relative group"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', index.toString());
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.add('border-blue-500');
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.classList.remove('border-blue-500');
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('border-blue-500');
                      const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
                      reorderImages(dragIndex, index);
                    }}
                  >
                    <img
                      src={url}
                      alt={`Property image ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100
                               transition-opacity duration-200"
                    >
                      <XCircle className="h-6 w-6 text-red-500 hover:text-red-600" />
                    </button>
                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-blue-600 text-white
                                    text-xs px-2 py-1 rounded">
                        Main Photo
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Photo Requirements */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Photo Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Required Photos:</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Front exterior view
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  All bedrooms
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Kitchen
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Living room
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Photo Tips:</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Use landscape orientation
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Ensure good lighting
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Keep rooms tidy
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Highlight special features
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-2 text-gray-600 hover:text-gray-800"
        >
          Back
        </button>
        
        <div className="space-x-4">
          {selectedImages.length === 0 && (
            <button
              onClick={onContinue}
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Skip Photos
            </button>
          )}
          
          <button
            onClick={onContinue}
            disabled={selectedImages.length === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                     disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {selectedImages.length > 0 ? 'Continue' : 'Add Photos to Continue'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ImageUpload;