import React from 'react';
import { Vehicle } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, GitCompare } from 'lucide-react';
import { formatPrice } from '@/utils';
import { Link } from 'react-router-dom';

interface VehicleComparisonProps {
  vehicles: Vehicle[];
  onRemoveVehicle: (vehicleId: string) => void;
  onAddVehicle: () => void;
  maxVehicles: number;
}

const VehicleComparison: React.FC<VehicleComparisonProps> = ({
  vehicles,
  onRemoveVehicle,
  onAddVehicle,
  maxVehicles,
}) => {
  const comparisonFields = [
    { key: 'price.exShowroom', label: 'Ex-Showroom Price', format: formatPrice },
    { key: 'price.onRoad', label: 'On-Road Price', format: formatPrice },
    { key: 'specifications.engine', label: 'Engine', format: (value: string) => value },
    { key: 'specifications.power', label: 'Power', format: (value: string) => value },
    { key: 'specifications.torque', label: 'Torque', format: (value: string) => value },
    { key: 'specifications.mileage', label: 'Mileage/Range', format: (value: number, fuelType: string) => `${value} ${fuelType === 'Electric' ? 'km' : 'kmpl'}` },
    { key: 'specifications.fuelType', label: 'Fuel Type', format: (value: string) => value },
    { key: 'specifications.transmission', label: 'Transmission', format: (value: string) => value },
    { key: 'year', label: 'Model Year', format: (value: number) => value.toString() },
    { key: 'category', label: 'Category', format: (value: string) => value.charAt(0).toUpperCase() + value.slice(1) },
  ];

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const getComparisonValue = (vehicle: Vehicle, field: any) => {
    const value = getNestedValue(vehicle, field.key);
    if (field.key === 'specifications.mileage' && field.format.length > 1) {
      return field.format(value, vehicle.specifications.fuelType);
    }
    return field.format(value);
  };

  // Determine better/worse for numerical comparisons
  const getComparisonStyle = (vehicles: Vehicle[], currentIndex: number, field: any) => {
    if (vehicles.length < 2) return '';
    
    const numericalFields = ['price.exShowroom', 'price.onRoad', 'specifications.mileage'];
    if (!numericalFields.includes(field.key)) return '';

    const values = vehicles.map(v => getNestedValue(v, field.key));
    const currentValue = values[currentIndex];
    
    if (field.key.includes('price')) {
      // Lower price is better
      const minValue = Math.min(...values);
      return currentValue === minValue && values.filter(v => v === minValue).length === 1 
        ? 'text-green-600 font-semibold' : '';
    } else if (field.key === 'specifications.mileage') {
      // Higher mileage is better
      const maxValue = Math.max(...values);
      return currentValue === maxValue && values.filter(v => v === maxValue).length === 1 
        ? 'text-green-600 font-semibold' : '';
    }
    
    return '';
  };

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <GitCompare className="w-16 h-16 text-muted-foreground mx-auto" />
        <div className="space-y-2">
          <h3 className="font-inter font-bold text-xl text-foreground">
            No vehicles to compare
          </h3>
          <p className="font-open-sans text-muted-foreground">
            Add vehicles from the listing page to start comparing
          </p>
        </div>
        <Link to="/vehicles">
          <Button className="font-inter">
            Browse Vehicles
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Vehicle Cards Row */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(vehicles.length + (vehicles.length < maxVehicles ? 1 : 0), maxVehicles)}, 1fr)` }}>
        {vehicles.map((vehicle, index) => (
          <Card key={vehicle.id} className="relative">
            <Button
              variant="secondary"
              size="icon"
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full z-10"
              onClick={() => onRemoveVehicle(vehicle.id)}
            >
              <X className="w-3 h-3" />
            </Button>
            
            <CardHeader className="pb-2">
              <div className="aspect-[4/3] overflow-hidden rounded-md bg-muted">
                <img
                  src={vehicle.images[0] || '/placeholder.svg'}
                  alt={`${vehicle.brand} ${vehicle.name}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </CardHeader>
            
            <CardContent className="space-y-2">
              <Badge variant="secondary" className="text-xs capitalize">
                {vehicle.category}
              </Badge>
              <div>
                <p className="text-sm font-open-sans text-muted-foreground">
                  {vehicle.brand}
                </p>
                <h3 className="font-inter font-semibold text-lg text-foreground line-clamp-2">
                  {vehicle.name}
                </h3>
              </div>
              <div className="pt-2">
                <Link 
                  to={`/vehicle/${vehicle.id}/${vehicle.brand.toLowerCase()}-${vehicle.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-sm text-primary hover:underline font-open-sans"
                >
                  View Details →
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Add Vehicle Card */}
        {vehicles.length < maxVehicles && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center h-full min-h-[300px] space-y-4">
              <Button
                variant="ghost"
                size="lg"
                onClick={onAddVehicle}
                className="h-auto flex-col space-y-2 p-6"
              >
                <Plus className="w-8 h-8 text-muted-foreground" />
                <span className="font-open-sans text-muted-foreground">
                  Add Vehicle
                </span>
              </Button>
              <p className="text-xs text-center text-muted-foreground font-open-sans">
                Compare up to {maxVehicles} vehicles
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Comparison Table */}
      {vehicles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-inter">Detailed Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 pr-4 font-inter font-semibold text-foreground">
                      Specification
                    </th>
                    {vehicles.map((vehicle) => (
                      <th key={vehicle.id} className="text-center py-3 px-4 font-inter font-semibold text-foreground min-w-[150px]">
                        {vehicle.brand} {vehicle.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonFields.map((field, fieldIndex) => (
                    <tr key={fieldIndex} className="border-b last:border-b-0">
                      <td className="py-3 pr-4 font-open-sans font-medium text-muted-foreground">
                        {field.label}
                      </td>
                      {vehicles.map((vehicle, vehicleIndex) => (
                        <td key={vehicle.id} className={`text-center py-3 px-4 font-open-sans ${getComparisonStyle(vehicles, vehicleIndex, field)}`}>
                          {getComparisonValue(vehicle, field)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VehicleComparison;