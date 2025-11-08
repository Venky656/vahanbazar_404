import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, GitCompare, ArrowLeft, Share2, AlertTriangle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ImageGallery from '@/components/vehicle/ImageGallery';
import SpecificationsTable from '@/components/vehicle/SpecificationsTable';
import EMICalculatorWidget from '@/components/vehicle/EMICalculatorWidget';
import SimilarVehicles from '@/components/vehicle/SimilarVehicles';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorState from '@/components/common/ErrorState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useVehicleById } from '@/hooks/useVehicles';
import { useVehicles } from '@/hooks/useVehicles';
import { useComparison } from '@/contexts/ComparisonContext';
import { formatPrice } from '@/utils';
import { toast } from 'sonner';

const VehicleDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { vehicle, loading, error } = useVehicleById(id || '');
  const { vehicles: allVehicles } = useVehicles();
  const { addToComparison, isInComparison } = useComparison();

  const handleAddToWishlist = (vehicleId: string) => {
    // TODO: Implement wishlist functionality
    toast.success('Added to wishlist!');
  };

  const handleAddToComparison = (vehicle: any) => {
    addToComparison(vehicle);
  };

  const handleShare = () => {
    if (navigator.share && vehicle) {
      navigator.share({
        title: `${vehicle.brand} ${vehicle.name}`,
        text: `Check out this ${vehicle.brand} ${vehicle.name} - ${formatPrice(vehicle.price.exShowroom)}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (error || !vehicle) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center space-y-4 p-8">
            <AlertTriangle className="w-12 h-12 text-accent" />
            <div className="text-center space-y-2">
              <h3 className="font-inter font-semibold text-lg text-foreground">
                Vehicle Not Found
              </h3>
              <p className="text-muted-foreground font-open-sans max-w-md">
                {error || "The vehicle you're looking for doesn't exist."}
              </p>
            </div>
            <Link to="/vehicles">
              <Button className="mt-4 font-inter">
                Browse Vehicles
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-6">
          <Link to="/vehicles" className="flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="font-open-sans">Back to Vehicles</span>
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Left Side - Images and Details */}
          <div className="xl:col-span-3 space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="capitalize">
                    {vehicle.category}
                  </Badge>
                  {!vehicle.availability && (
                    <Badge variant="destructive">Out of Stock</Badge>
                  )}
                </div>
                <h1 className="font-inter font-bold text-3xl text-foreground">
                  {vehicle.brand} {vehicle.name}
                </h1>
                <p className="font-open-sans text-muted-foreground">
                  {vehicle.model} • {vehicle.year}
                </p>
                <div className="space-y-1">
                  <p className="font-inter font-bold text-2xl text-primary">
                    {formatPrice(vehicle.price.exShowroom)}
                  </p>
                  <p className="font-open-sans text-sm text-muted-foreground">
                    Ex-showroom price • On-road: {formatPrice(vehicle.price.onRoad)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleAddToWishlist(vehicle.id)}
                  className="font-inter"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleAddToComparison(vehicle)}
                  disabled={isInComparison(vehicle.id)}
                  className="font-inter"
                >
                  <GitCompare className="w-4 h-4 mr-2" />
                  {isInComparison(vehicle.id) ? 'In Comparison' : 'Compare'}
                </Button>
                <Button variant="outline" onClick={handleShare} className="font-inter">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Link to="/test-ride">
                  <Button className="font-inter">
                    Book Test Ride
                  </Button>
                </Link>
              </div>
            </div>

            {/* Image Gallery */}
            <ImageGallery 
              images={vehicle.images} 
              alt={`${vehicle.brand} ${vehicle.name}`} 
            />

            {/* Specifications */}
            <SpecificationsTable vehicle={vehicle} />

            {/* Similar Vehicles */}
            <SimilarVehicles
              currentVehicle={vehicle}
              allVehicles={allVehicles}
              onAddToWishlist={handleAddToWishlist}
              onAddToCompare={handleAddToComparison}
            />
          </div>

          {/* Right Sidebar - EMI Calculator */}
          <div className="xl:col-span-1">
            <div className="sticky top-8">
              <EMICalculatorWidget vehicle={vehicle} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VehicleDetailPage;