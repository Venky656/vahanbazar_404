import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import VehicleCard from '@/components/common/VehicleCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useFeaturedVehicles } from '@/hooks/useVehicles';

const FeaturedVehicles: React.FC = () => {
  const { vehicles, loading } = useFeaturedVehicles();
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(vehicles.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const currentVehicles = vehicles.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  if (loading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-inter font-bold text-3xl text-foreground mb-4">
              Featured Vehicles
            </h2>
            <p className="font-open-sans text-muted-foreground">
              Discover our most popular two-wheelers
            </p>
          </div>
          <div className="flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-inter font-bold text-3xl text-foreground mb-4">
            Featured Vehicles
          </h2>
          <p className="font-open-sans text-muted-foreground">
            Discover our most popular two-wheelers
          </p>
        </div>

        <div className="relative">
          {/* Carousel Controls */}
          {totalPages > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-background shadow-lg"
                onClick={prevSlide}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-background shadow-lg"
                onClick={nextSlide}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}

          {/* Vehicle Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onAddToWishlist={(id) => console.log('Add to wishlist:', id)}
                onAddToCompare={(id) => console.log('Add to compare:', id)}
              />
            ))}
          </div>

          {/* Pagination Dots */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex
                      ? 'bg-primary'
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedVehicles;