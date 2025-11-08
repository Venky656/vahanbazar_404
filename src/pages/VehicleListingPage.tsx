import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import VehicleCard from '@/components/common/VehicleCard';
import VehicleFilters from '@/components/listing/VehicleFilters';
import VehicleSort from '@/components/listing/VehicleSort';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorState from '@/components/common/ErrorState';
import { Button } from '@/components/ui/button';
import { useVehicles } from '@/hooks/useVehicles';
import { SearchFilters, Vehicle } from '@/types';

const VehicleListingPage = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<SearchFilters>({
    brands: searchParams.get('brand') ? [searchParams.get('brand')!] : undefined,
    category: searchParams.get('category') ? [searchParams.get('category')!] : undefined,
  });
  const [sortBy, setSortBy] = useState('relevance');
  
  const { vehicles, loading, error } = useVehicles(filters);

  // Sort vehicles based on selected option
  const sortedVehicles = useMemo(() => {
    const sorted = [...vehicles];
    
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price.exShowroom - b.price.exShowroom);
      case 'price-high':
        return sorted.sort((a, b) => b.price.exShowroom - a.price.exShowroom);
      case 'mileage-high':
        return sorted.sort((a, b) => b.specifications.mileage - a.specifications.mileage);
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'newest':
        return sorted.sort((a, b) => b.year - a.year);
      default:
        return sorted;
    }
  }, [vehicles, sortBy]);

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const getCategoryTitle = () => {
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    
    if (category && brand) {
      return `${brand} ${category === 'bike' ? 'Motorcycles' : category === 'scooter' ? 'Scooters' : 'Electric Vehicles'}`;
    }
    if (category) {
      return category === 'bike' ? 'Motorcycles' : category === 'scooter' ? 'Scooters' : 'Electric Vehicles';
    }
    if (brand) {
      return `${brand} Vehicles`;
    }
    return 'Browse Vehicles';
  };

  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorState 
            title="Failed to load vehicles"
            message={error}
            onRetry={() => window.location.reload()}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-inter font-bold text-3xl text-foreground mb-2">
            {getCategoryTitle()}
          </h1>
          <p className="font-open-sans text-muted-foreground">
            Discover motorcycles, scooters, and electric vehicles
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <VehicleFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              className="sticky top-4"
            />
          </div>

          {/* Vehicle Grid */}
          <div className="lg:col-span-3 space-y-6">
            {/* Sort and Results Count */}
            <VehicleSort
              sortBy={sortBy}
              onSortChange={setSortBy}
              resultsCount={sortedVehicles.length}
            />

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            )}

            {/* Vehicle Grid */}
            {!loading && sortedVehicles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedVehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    onAddToWishlist={(id) => console.log('Add to wishlist:', id)}
                    onAddToCompare={(id) => console.log('Add to compare:', id)}
                  />
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && sortedVehicles.length === 0 && (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <h3 className="font-inter font-semibold text-lg text-foreground mb-2">
                    No vehicles found
                  </h3>
                  <p className="font-open-sans text-muted-foreground mb-4">
                    Try adjusting your filters or search criteria to find more results.
                  </p>
                  <Button onClick={handleClearFilters} variant="outline">
                    Clear All Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VehicleListingPage;