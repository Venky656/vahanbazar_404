import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Calendar, Clock, Search } from 'lucide-react';
import { UpcomingVehicle } from '@/types';

// Extended mock data for upcoming vehicles
const upcomingVehicles: UpcomingVehicle[] = [
  {
    id: 'upcoming-1',
    name: 'Pulsar N250',
    brand: 'Bajaj',
    expectedPrice: 150000,
    launchDate: '2024-03-15',
    category: 'bike',
    image: '/placeholder.svg',
    description: 'Next-generation naked sports bike with advanced features',
    keyFeatures: ['LED Headlamp', 'Digital Console', 'ABS', 'USB Charging']
  },
  {
    id: 'upcoming-2',
    name: 'Activa Electric',
    brand: 'Honda',
    expectedPrice: 120000,
    launchDate: '2024-04-20',
    category: 'ev',
    image: '/placeholder.svg',
    description: 'Electric version of India\'s most popular scooter',
    keyFeatures: ['100km Range', 'Fast Charging', 'Smart Connect', 'Swappable Battery']
  },
  {
    id: 'upcoming-3',
    name: 'Hunter 350',
    brand: 'Royal Enfield',
    expectedPrice: 160000,
    launchDate: '2024-05-10',
    category: 'bike',
    image: '/placeholder.svg',
    description: 'Roadster styled motorcycle for urban adventures',
    keyFeatures: ['J-Series Engine', 'Dual Channel ABS', 'Tripper Navigation', 'LED Lighting']
  },
  {
    id: 'upcoming-4',
    name: 'X-Blade Electric',
    brand: 'Hero',
    expectedPrice: 95000,
    launchDate: '2024-06-05',
    category: 'ev',
    image: '/placeholder.svg',
    description: 'Stylish electric motorcycle for young riders',
    keyFeatures: ['80km Range', 'App Connectivity', 'Find My Vehicle', 'Eco Mode']
  },
  {
    id: 'upcoming-5',
    name: 'Apachi RR 200',
    brand: 'TVS',
    expectedPrice: 140000,
    launchDate: '2024-07-15',
    category: 'bike',
    image: '/placeholder.svg',
    description: 'Track-focused supersport with racing DNA',
    keyFeatures: ['Race Tuned Engine', 'Lap Timer', 'Quick Shifter', 'Slipper Clutch']
  },
  {
    id: 'upcoming-6',
    name: 'Chetak Electric Pro',
    brand: 'Bajaj',
    expectedPrice: 130000,
    launchDate: '2024-08-20',
    category: 'ev',
    image: '/placeholder.svg',
    description: 'Premium electric scooter with luxury features',
    keyFeatures: ['120km Range', 'Reverse Mode', 'Hill Hold', 'Premium Interior']
  }
];

export default function UpcomingLaunches() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [notifyList, setNotifyList] = useState<string[]>([]);

  const filteredVehicles = upcomingVehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || vehicle.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDaysUntilLaunch = (launchDate: string) => {
    const today = new Date();
    const launch = new Date(launchDate);
    const diffTime = launch.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const toggleNotify = (vehicleId: string) => {
    setNotifyList(prev =>
      prev.includes(vehicleId)
        ? prev.filter(id => id !== vehicleId)
        : [...prev, vehicleId]
    );
  };

  const sortedVehicles = [...filteredVehicles].sort((a, b) => 
    new Date(a.launchDate).getTime() - new Date(b.launchDate).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="font-inter font-bold text-3xl text-foreground mb-2">
            Upcoming Launches
          </h1>
          <p className="font-open-sans text-muted-foreground">
            Stay updated with the latest motorcycle and scooter launches
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search upcoming vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 font-open-sans"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="bike">Motorcycles</SelectItem>
              <SelectItem value="scooter">Scooters</SelectItem>
              <SelectItem value="ev">Electric Vehicles</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Timeline View */}
      <div className="grid gap-6">
        {sortedVehicles.map(vehicle => {
          const daysUntilLaunch = getDaysUntilLaunch(vehicle.launchDate);
          const isNotifying = notifyList.includes(vehicle.id);
          
          return (
            <Card key={vehicle.id} className="transition-colors hover:bg-muted/30">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Vehicle Image */}
                  <div className="w-full md:w-48 h-32 bg-muted rounded-lg overflow-hidden">
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Vehicle Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-inter font-bold text-xl">
                            {vehicle.brand} {vehicle.name}
                          </h3>
                          <Badge variant="outline">{vehicle.category}</Badge>
                        </div>
                        <p className="font-open-sans text-muted-foreground mb-2">
                          {vehicle.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="font-open-sans">
                              {new Date(vehicle.launchDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="font-open-sans">
                              {daysUntilLaunch > 0 ? `${daysUntilLaunch} days to go` : 'Launched!'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-inter font-bold text-2xl">
                          ₹{vehicle.expectedPrice.toLocaleString()}
                        </p>
                        <p className="font-open-sans text-sm text-muted-foreground">
                          Expected price
                        </p>
                      </div>
                    </div>

                    {/* Key Features */}
                    {vehicle.keyFeatures && (
                      <div>
                        <h4 className="font-inter font-medium text-sm mb-2">Key Features</h4>
                        <div className="flex flex-wrap gap-2">
                          {vehicle.keyFeatures.map(feature => (
                            <Badge key={feature} variant="secondary" className="font-open-sans text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant={isNotifying ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleNotify(vehicle.id)}
                        className="font-inter"
                      >
                        <Bell className="w-4 h-4 mr-2" />
                        {isNotifying ? 'Notifying' : 'Notify Me'}
                      </Button>
                      <Button variant="outline" size="sm" className="font-inter">
                        Learn More
                      </Button>
                      <Button variant="outline" size="sm" className="font-inter">
                        Find Dealers
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Launch Countdown */}
                {daysUntilLaunch > 0 && (
                  <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-open-sans text-sm">Launch Countdown</span>
                      <Badge variant="outline">
                        {daysUntilLaunch} days remaining
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {sortedVehicles.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-inter text-lg font-medium mb-2">No upcoming launches found</h3>
              <p className="font-open-sans text-muted-foreground">
                Try adjusting your search filters or check back later for new announcements.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Notification Summary */}
      {notifyList.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-inter">Notification Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-open-sans text-sm mb-4">
              You'll be notified about {notifyList.length} upcoming vehicle{notifyList.length !== 1 ? 's' : ''}:
            </p>
            <div className="flex flex-wrap gap-2">
              {notifyList.map(vehicleId => {
                const vehicle = upcomingVehicles.find(v => v.id === vehicleId);
                return vehicle ? (
                  <Badge key={vehicleId} variant="secondary" className="font-open-sans">
                    {vehicle.brand} {vehicle.name}
                  </Badge>
                ) : null;
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}