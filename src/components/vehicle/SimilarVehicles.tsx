import React from 'react';
import { Vehicle } from '@/types';
import VehicleCard from '@/components/common/VehicleCard';
import { Sparkles } from 'lucide-react';

interface SimilarVehiclesProps {
  currentVehicle: Vehicle;
  allVehicles: Vehicle[];
  onAddToWishlist?: (vehicleId: string) => void;
  onAddToCompare?: (vehicleId: string) => void;
}

const SimilarVehicles: React.FC<SimilarVehiclesProps> = ({
  currentVehicle,
  allVehicles,
  onAddToWishlist,
  onAddToCompare,
}) => {
  // Find similar vehicles based on category, brand, or price range
  const getSimilarVehicles = () => {
    const priceRange = 50000; // Price range for similarity
    
    return allVehicles
      .filter((vehicle) => {
        if (vehicle.id === currentVehicle.id) return false;
        
        // Same category gets higher priority
        if (vehicle.category === currentVehicle.category) return true;
        
        // Same brand gets higher priority
        if (vehicle.brand === currentVehicle.brand) return true;
        
        // Similar price range
        const priceDiff = Math.abs(vehicle.price.exShowroom - currentVehicle.price.exShowroom);
        if (priceDiff <= priceRange) return true;
        
        return false;
      })
      .sort((a, b) => {
        // Sort by relevance
        let scoreA = 0;
        let scoreB = 0;
        
        // Same category bonus
        if (a.category === currentVehicle.category) scoreA += 3;
        if (b.category === currentVehicle.category) scoreB += 3;
        
        // Same brand bonus
        if (a.brand === currentVehicle.brand) scoreA += 2;
        if (b.brand === currentVehicle.brand) scoreB += 2;
        
        // Price similarity bonus (closer price = higher score)
        const priceDiffA = Math.abs(a.price.exShowroom - currentVehicle.price.exShowroom);
        const priceDiffB = Math.abs(b.price.exShowroom - currentVehicle.price.exShowroom);
        
        if (priceDiffA < priceDiffB) scoreA += 1;
        if (priceDiffB < priceDiffA) scoreB += 1;
        
        return scoreB - scoreA;
      })
      .slice(0, 4); // Show up to 4 similar vehicles
  };

  const similarVehicles = getSimilarVehicles();

  if (similarVehicles.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Sparkles className="w-6 h-6 text-primary" />
        <h3 className="font-inter font-bold text-xl text-foreground">
          Similar Vehicles
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {similarVehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onAddToWishlist={onAddToWishlist}
            onAddToCompare={onAddToCompare}
          />
        ))}
      </div>
    </div>
  );
};

export default SimilarVehicles;