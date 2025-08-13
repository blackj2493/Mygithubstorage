import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const ImageUpload = ({ onImagesSelected, onError, maxImages = 30 }) => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    
    if (uploadedImages.length + files.length > maxImages) {
      onError(new Error(`Maximum ${maxImages} images allowed`));
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      
      const newImages = data.results.map((result, index) => ({
        id: `image-${Date.now()}-${index}`,
        url: result.url,
        filename: result.filename
      }));

      const updatedImages = [...uploadedImages, ...newImages];
      setUploadedImages(updatedImages);
      onImagesSelected(updatedImages.map(img => img.url));

    } catch (error) {
      onError(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(uploadedImages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setUploadedImages(items);
    onImagesSelected(items.map(img => img.url));
  };

  const removeImage = (index) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    onImagesSelected(newImages.map(img => img.url));
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="flex items-center justify-center w-full">
        <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-lg tracking-wide border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="mt-2 text-sm text-gray-600">
            {isUploading ? 'Uploading...' : `Select up to ${maxImages} images`}
          </span>
          <input
            type="file"
            className="hidden"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      </div>

      {/* Image Preview Grid with Drag and Drop */}
      {uploadedImages.length > 0 && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable 
            droppableId="image-list" 
            direction="horizontal"
            isDropDisabled={false}
            isCombineEnabled={false}
            ignoreContainerClipping={false}
            type="image"
          >
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                style={{
                  display: 'grid',
                  minHeight: '100px'
                }}
              >
                {uploadedImages.map((image, index) => (
                  <Draggable 
                    key={image.id} 
                    draggableId={image.id.toString()} 
                    index={index}
                    isDragDisabled={false}
                  >
                    {(dragProvided, dragSnapshot) => (
                      <div
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        {...dragProvided.dragHandleProps}
                        className={`relative group ${
                          dragSnapshot.isDragging ? 'z-50' : ''
                        }`}
                        style={{
                          ...dragProvided.draggableProps.style,
                          gridColumn: dragSnapshot.isDragging ? 'span 1' : undefined,
                          height: dragSnapshot.isDragging ? 'auto' : undefined
                        }}
                      >
                        <div className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden">
                          <img
                            src={image.url}
                            alt={`Property image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(index);
                            }}
                            className="p-2 bg-red-600 rounded-full text-white hover:bg-red-700"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          <div className="bg-white text-gray-800 px-2 py-1 rounded text-sm">
                            {index + 1} of {uploadedImages.length}
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* Upload Progress and Status */}
      {isUploading && (
        <div className="w-full bg-blue-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-blue-600">Uploading images...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;