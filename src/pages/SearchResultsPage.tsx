import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import VehicleCard from '@/components/common/VehicleCard';
import VehicleFilters from '@/components/listing/VehicleFilters';
import VehicleSort from '@/components/listing/VehicleSort';
import SearchBar from '@/components/common/SearchBar';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { useVehicles } from '@/hooks/useVehicles';
import { SearchFilters } from '@/types';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const [filters, setFilters] = useState<SearchFilters>({});
  const [sortBy, setSortBy] = useState('relevance');
  
  const { vehicles, loading, error } = useVehicles(filters, searchQuery);

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

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Button>
            </Link>
          </div>
          
          <div className="mb-6">
            <SearchBar 
              placeholder="Search for bikes, scooters, brands..."
              showRecentSearches={true}
            />
          </div>

          <div className="space-y-2">
            <h1 className="font-inter font-bold text-3xl text-foreground">
              Search Results
            </h1>
            {searchQuery && (
              <p className="font-open-sans text-muted-foreground">
                Results for "{searchQuery}"
              </p>
            )}
          </div>
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

          {/* Results Grid */}
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

            {/* Search Results */}
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
                  <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-inter font-semibold text-lg text-foreground mb-2">
                    No results found
                  </h3>
                  <p className="font-open-sans text-muted-foreground mb-4">
                    {searchQuery 
                      ? `We couldn't find any vehicles matching "${searchQuery}". Try searching with different keywords.`
                      : 'Try adjusting your search criteria or filters.'
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Button onClick={handleClearFilters} variant="outline">
                      Clear Filters
                    </Button>
                    <Link to="/vehicles">
                      <Button>Browse All Vehicles</Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <h3 className="font-inter font-semibold text-lg text-foreground mb-2">
                    Something went wrong
                  </h3>
                  <p className="font-open-sans text-muted-foreground mb-4">
                    {error}
                  </p>
                  <Button onClick={() => window.location.reload()}>
                    Try Again
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

export default SearchResultsPage;