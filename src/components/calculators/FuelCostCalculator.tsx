import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockVehicles } from '@/data/mockData';
import { FuelCostCalculation } from '@/types';

const fuelPrices = {
  petrol: 102.50,
  electric: 8.0, // per kWh
};

const distancePresets = [
  { label: 'City Commute (20 km/day)', value: 600 },
  { label: 'Average Use (30 km/day)', value: 900 },
  { label: 'Heavy Use (50 km/day)', value: 1500 },
  { label: 'Long Distance (80 km/day)', value: 2400 },
];

export default function FuelCostCalculator() {
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [monthlyDistance, setMonthlyDistance] = useState(900);
  const [customFuelPrice, setCustomFuelPrice] = useState(0);
  const [calculation, setCalculation] = useState<FuelCostCalculation | null>(null);
  const [compareVehicles, setCompareVehicles] = useState<string[]>([]);

  const selectedVehicleData = mockVehicles.find(v => v.id === selectedVehicle);

  const calculateFuelCost = (vehicleId: string, distance: number): FuelCostCalculation | null => {
    const vehicle = mockVehicles.find(v => v.id === vehicleId);
    if (!vehicle) return null;

    const isElectric = vehicle.specifications.fuelType === 'Electric';
    const currentFuelPrice = customFuelPrice > 0 ? customFuelPrice : 
                            (isElectric ? fuelPrices.electric : fuelPrices.petrol);
    
    const mileage = vehicle.specifications.mileage;
    const monthlyCost = (distance / mileage) * currentFuelPrice;
    const yearlyCost = monthlyCost * 12;

    return {
      vehicleId,
      monthlyDistance: distance,
      fuelPrice: currentFuelPrice,
      mileage,
      monthlyCost: Math.round(monthlyCost),
      yearlyCost: Math.round(yearlyCost)
    };
  };

  useEffect(() => {
    if (selectedVehicle) {
      const calc = calculateFuelCost(selectedVehicle, monthlyDistance);
      setCalculation(calc);
    }
  }, [selectedVehicle, monthlyDistance, customFuelPrice]);

  const handleCompareAdd = () => {
    if (selectedVehicle && !compareVehicles.includes(selectedVehicle)) {
      setCompareVehicles([...compareVehicles, selectedVehicle]);
    }
  };

  const removeFromCompare = (vehicleId: string) => {
    setCompareVehicles(compareVehicles.filter(id => id !== vehicleId));
  };

  const comparisonData = compareVehicles.map(id => ({
    vehicle: mockVehicles.find(v => v.id === id)!,
    calculation: calculateFuelCost(id, monthlyDistance)!
  }));

  return (
    <div className="space-y-6">
      {/* Vehicle Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="font-inter">Fuel Cost Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicle">Select Vehicle</Label>
              <Select onValueChange={setSelectedVehicle}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {mockVehicles.map(vehicle => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.brand} {vehicle.name} - {vehicle.specifications.mileage} 
                      {vehicle.specifications.fuelType === 'Electric' ? ' km/kWh' : ' kmpl'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="distance">Monthly Distance (km)</Label>
              <Input
                id="distance"
                type="number"
                value={monthlyDistance}
                onChange={(e) => setMonthlyDistance(Number(e.target.value))}
                className="font-open-sans"
              />
            </div>
          </div>

          {/* Quick Presets */}
          <div className="space-y-2">
            <Label>Quick Presets</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {distancePresets.map(preset => (
                <Button
                  key={preset.label}
                  variant="outline"
                  size="sm"
                  onClick={() => setMonthlyDistance(preset.value)}
                  className="font-open-sans text-xs"
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Fuel Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fuelPrice">
                Custom Fuel Price (Optional)
              </Label>
              <Input
                id="fuelPrice"
                type="number"
                step="0.1"
                value={customFuelPrice}
                onChange={(e) => setCustomFuelPrice(Number(e.target.value))}
                placeholder={`Current: ₹${selectedVehicleData?.specifications.fuelType === 'Electric' ? fuelPrices.electric : fuelPrices.petrol}`}
                className="font-open-sans"
              />
            </div>
            {selectedVehicle && (
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={handleCompareAdd}
                  className="font-inter"
                >
                  Add to Compare
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Calculation */}
      {calculation && selectedVehicleData && (
        <Card>
          <CardHeader>
            <CardTitle className="font-inter">
              {selectedVehicleData.brand} {selectedVehicleData.name} - Fuel Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="font-open-sans text-2xl font-bold text-primary">
                  ₹{calculation.monthlyCost.toLocaleString()}
                </p>
                <p className="font-open-sans text-sm text-muted-foreground">Monthly Cost</p>
              </div>
              <div className="text-center">
                <p className="font-open-sans text-2xl font-bold text-accent">
                  ₹{calculation.yearlyCost.toLocaleString()}
                </p>
                <p className="font-open-sans text-sm text-muted-foreground">Yearly Cost</p>
              </div>
              <div className="text-center">
                <p className="font-open-sans text-2xl font-bold text-secondary">
                  {calculation.mileage}
                </p>
                <p className="font-open-sans text-sm text-muted-foreground">
                  {selectedVehicleData.specifications.fuelType === 'Electric' ? 'km/kWh' : 'kmpl'}
                </p>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h4 className="font-inter font-medium mb-2">Calculation Details</h4>
              <div className="font-open-sans text-sm space-y-1">
                <p>Monthly Distance: {monthlyDistance.toLocaleString()} km</p>
                <p>Fuel Efficiency: {calculation.mileage} {selectedVehicleData.specifications.fuelType === 'Electric' ? 'km/kWh' : 'kmpl'}</p>
                <p>Fuel Price: ₹{calculation.fuelPrice} per {selectedVehicleData.specifications.fuelType === 'Electric' ? 'kWh' : 'liter'}</p>
                <p>Monthly Consumption: {(monthlyDistance / calculation.mileage).toFixed(1)} {selectedVehicleData.specifications.fuelType === 'Electric' ? 'kWh' : 'liters'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comparison */}
      {comparisonData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-inter">Vehicle Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {comparisonData.map(({ vehicle, calculation }) => (
                <div key={vehicle.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-inter font-medium">{vehicle.brand} {vehicle.name}</h4>
                      <Badge variant={vehicle.specifications.fuelType === 'Electric' ? 'default' : 'secondary'}>
                        {vehicle.specifications.fuelType}
                      </Badge>
                    </div>
                    <p className="font-open-sans text-sm text-muted-foreground">
                      {calculation.mileage} {vehicle.specifications.fuelType === 'Electric' ? 'km/kWh' : 'kmpl'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-open-sans font-bold">₹{calculation.monthlyCost.toLocaleString()}/month</p>
                    <p className="font-open-sans text-sm text-muted-foreground">₹{calculation.yearlyCost.toLocaleString()}/year</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCompare(vehicle.id)}
                    className="ml-2"
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}