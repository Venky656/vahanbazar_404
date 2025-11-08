import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, alt }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const selectImage = (index: number) => {
    setCurrentImage(index);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
        <img
          src={images[currentImage] || '/placeholder.svg'}
          alt={alt}
          className="w-full h-full object-cover"
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
              onClick={prevImage}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
              onClick={nextImage}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}

        {/* Fullscreen Button */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-2 right-2 opacity-80 hover:opacity-100"
          onClick={() => setIsFullScreen(true)}
        >
          <Maximize2 className="w-4 h-4" />
        </Button>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-sm font-open-sans">
            {currentImage + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => selectImage(index)}
              className={`relative flex-shrink-0 w-20 h-16 rounded-md overflow-hidden border-2 transition-all ${
                index === currentImage
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <img
                src={image || '/placeholder.svg'}
                alt={`${alt} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      <Dialog open={isFullScreen} onOpenChange={setIsFullScreen}>
        <DialogContent className="max-w-5xl w-full h-[90vh] p-0">
          <div className="relative w-full h-full flex items-center justify-center bg-background">
            <img
              src={images[currentImage] || '/placeholder.svg'}
              alt={alt}
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Navigation in fullscreen */}
            {images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageGallery;