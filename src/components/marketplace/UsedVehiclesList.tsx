import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { MapPin, Phone, MessageCircle, Heart, Share2, Verified, Gauge, Calendar } from 'lucide-react';
import { UsedVehicle } from '@/types';

// Mock used vehicles data (images now point to public/used/*)
const mockUsedVehicles: UsedVehicle[] = [
  {
    id: 'used-1',
    sellerId: 'seller1',
    vehicleDetails: {
      name: 'Classic 350',
      brand: 'Royal Enfield',
      model: 'Classic 350',
      year: 2022,
      price: { exShowroom: 185000, onRoad: 210000 },
      specifications: {
        engine: '349cc',
        mileage: 41,
        power: '20.2 hp',
        torque: '27 Nm',
        fuelType: 'Petrol',
        transmission: 'Manual'
      },
      images: ['images/used/royal.jpg'],
      category: 'bike'
    },
    condition: 'excellent',
    mileage: 8500,
    yearOfPurchase: 2022,
    askingPrice: 165000,
    location: 'Mumbai, Maharashtra',
    images: ['images/used/royal.jpg'],
    description: 'Well maintained Royal Enfield Classic 350. Single owner, all papers clear. Recently serviced.',
    verified: true
  },
  {
    id: 'used-2',
    sellerId: 'seller2',
    vehicleDetails: {
      name: 'Activa 6G',
      brand: 'Honda',
      model: 'Activa 6G',
      year: 2021,
      price: { exShowroom: 75000, onRoad: 85000 },
      specifications: {
        engine: '109.51cc',
        mileage: 60,
        power: '7.68 hp',
        torque: '8.79 Nm',
        fuelType: 'Petrol',
        transmission: 'Automatic'
      },
      images: ['images/used/honda.jpg'],
      category: 'scooter'
    },
    condition: 'good',
    mileage: 12000,
    yearOfPurchase: 2021,
    askingPrice: 62000,
    location: 'Delhi, NCR',
    images: ['images/used/honda.jpg'],
    description: 'Honda Activa 6G in good condition. Perfect for daily commute. Insurance valid till 2024.',
    verified: true
  },
  {
    id: 'used-3',
    sellerId: 'seller3',
    vehicleDetails: {
      name: 'Duke 200',
      brand: 'KTM',
      model: 'Duke 200',
      year: 2020,
      price: { exShowroom: 180000, onRoad: 205000 },
      specifications: {
        engine: '199.5cc',
        mileage: 35,
        power: '24.6 hp',
        torque: '19.3 Nm',
        fuelType: 'Petrol',
        transmission: 'Manual'
      },
      images: ['images/used/ktm.jpg'],
      category: 'bike'
    },
    condition: 'good',
    mileage: 18000,
    yearOfPurchase: 2020,
    askingPrice: 125000,
    location: 'Bangalore, Karnataka',
    images: ['images/used/ktm.jpg'],
    description: 'KTM Duke 200 in excellent running condition. Minor scratches but mechanically perfect.',
    verified: false
  }
];

export default function UsedVehiclesList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [yearRange, setYearRange] = useState([2018, 2024]);
  const [sortBy, setSortBy] = useState('newest');

  const getConditionColor = (condition: UsedVehicle['condition']) => {
    switch (condition) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-blue-100 text-blue-800';
      case 'fair':
        return 'bg-yellow-100 text-yellow-800';
      case 'needs-work':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredVehicles = mockUsedVehicles.filter(vehicle => {
    const matchesSearch =
      vehicle.vehicleDetails.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.vehicleDetails.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = selectedBrand === 'all' || vehicle.vehicleDetails.brand === selectedBrand;
    const matchesCategory = selectedCategory === 'all' || vehicle.vehicleDetails.category === selectedCategory;
    const matchesPrice = vehicle.askingPrice >= priceRange[0] && vehicle.askingPrice <= priceRange[1];
    const matchesYear = vehicle.yearOfPurchase >= yearRange[0] && vehicle.yearOfPurchase <= yearRange[1];

    return matchesSearch && matchesBrand && matchesCategory && matchesPrice && matchesYear;
  });

  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.askingPrice - b.askingPrice;
      case 'price-high':
        return b.askingPrice - a.askingPrice;
      case 'year-new':
        return b.yearOfPurchase - a.yearOfPurchase;
      case 'year-old':
        return a.yearOfPurchase - b.yearOfPurchase;
      case 'mileage-low':
        return a.mileage - b.mileage;
      default:
        return 0;
    }
  });

  const brands = Array.from(new Set(mockUsedVehicles.map(v => v.vehicleDetails.brand)));

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="font-inter">Search & Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search vehicles or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="font-open-sans"
            />

            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger>
                <SelectValue placeholder="All Brands" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {brands.map(brand => (
                  <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="bike">Motorcycles</SelectItem>
                <SelectItem value="scooter">Scooters</SelectItem>
                <SelectItem value="ev">Electric</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="year-new">Year: Newest</SelectItem>
                <SelectItem value="year-old">Year: Oldest</SelectItem>
                <SelectItem value="mileage-low">Mileage: Lowest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Price Range: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}</Label>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={500000}
                min={0}
                step={10000}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Year: {yearRange[0]} - {yearRange[1]}</Label>
              <Slider
                value={yearRange}
                onValueChange={setYearRange}
                max={2024}
                min={2018}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="font-open-sans text-muted-foreground">
          {sortedVehicles.length} vehicle{sortedVehicles.length !== 1 ? 's' : ''} found
        </p>
        <Button variant="outline">
          <Heart className="w-4 h-4 mr-2" />
          View Saved
        </Button>
      </div>

      {/* Vehicle Listings */}
      <div className="grid gap-6">
        {sortedVehicles.map(vehicle => (
          <Card key={vehicle.id} className="transition-colors hover:bg-muted/30">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Vehicle Image */}
                <div className="w-full lg:w-80 h-48 bg-muted rounded-lg overflow-hidden">
                  <img
                    src={vehicle.images[0]}
                    alt={vehicle.vehicleDetails.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/used/royal.jpg'; }} // simple fallback
                  />
                </div>

                {/* Vehicle Details */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-inter font-bold text-xl">
                          {vehicle.vehicleDetails.brand} {vehicle.vehicleDetails.name}
                        </h3>
                        {vehicle.verified && (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <Verified className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4 mb-2">
                        <Badge className={getConditionColor(vehicle.condition)}>
                          {vehicle.condition.charAt(0).toUpperCase() + vehicle.condition.slice(1)}
                        </Badge>
                        <Badge variant="outline">{vehicle.vehicleDetails.category}</Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {vehicle.location}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="font-open-sans">{vehicle.yearOfPurchase}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Gauge className="w-4 h-4 text-muted-foreground" />
                          <span className="font-open-sans">{vehicle.mileage.toLocaleString()} km</span>
                        </div>
                        <div className="font-open-sans">
                          {vehicle.vehicleDetails.specifications.engine}
                        </div>
                        <div className="font-open-sans">
                          {vehicle.vehicleDetails.specifications.mileage} kmpl
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-inter font-bold text-2xl text-primary">
                        ₹{vehicle.askingPrice.toLocaleString()}
                      </p>
                      <p className="font-open-sans text-sm text-muted-foreground line-through">
                        ₹{vehicle.vehicleDetails.price.onRoad.toLocaleString()} (New)
                      </p>
                      <p className="font-open-sans text-sm text-green-600">
                        Save ₹{(vehicle.vehicleDetails.price.onRoad - vehicle.askingPrice).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="font-open-sans text-sm text-muted-foreground">
                    {vehicle.description}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button className="font-inter">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Seller
                    </Button>
                    <Button variant="outline" className="font-inter">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat
                    </Button>
                    <Button variant="outline" size="sm">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {sortedVehicles.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="font-inter text-lg font-medium mb-2">No vehicles found</h3>
              <p className="font-open-sans text-muted-foreground">
                Try adjusting your search filters to find more vehicles.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
