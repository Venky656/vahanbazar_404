import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, Phone } from 'lucide-react';
import { TestRideBooking } from '@/types';

// Mock test ride history
const mockTestRides: TestRideBooking[] = [
  {
    id: '1',
    userId: 'user1',
    vehicleId: '6',
    dealerId: 'dealer1',
    date: '2024-01-20',
    time: '10:00 AM',
    status: 'confirmed',
    notes: 'Looking for a weekend touring bike'
  },
  {
    id: '2',
    userId: 'user1',
    vehicleId: '4',
    dealerId: 'dealer2',
    date: '2024-01-15',
    time: '2:00 PM',
    status: 'completed',
    notes: 'Interested in daily commute bike'
  },
  {
    id: '3',
    userId: 'user1',
    vehicleId: '10',
    dealerId: 'dealer3',
    date: '2024-01-25',
    time: '11:00 AM',
    status: 'pending',
    notes: 'First electric vehicle test ride'
  },
  {
    id: '4',
    userId: 'user1',
    vehicleId: '8',
    dealerId: 'dealer4',
    date: '2024-01-10',
    time: '3:00 PM',
    status: 'cancelled',
    notes: 'Schedule conflict'
  },
];

// Mock vehicle names for display
const vehicleNames: Record<string, string> = {
  '4': 'Bajaj Pulsar NS200',
  '6': 'Royal Enfield Classic 350',
  '8': 'KTM Duke 200',
  '10': 'TVS iQube Electric',
};

// Mock dealer names and info
const dealerInfo: Record<string, { name: string; location: string; phone: string }> = {
  dealer1: { name: 'Royal Enfield Mumbai', location: 'Andheri West, Mumbai', phone: '+91 98765 43210' },
  dealer2: { name: 'Bajaj Showroom', location: 'Pune Central', phone: '+91 98765 43211' },
  dealer3: { name: 'TVS Electric Hub', location: 'Koramangala, Bangalore', phone: '+91 98765 43212' },
  dealer4: { name: 'KTM Center', location: 'Gurgaon', phone: '+91 98765 43213' },
};

export default function TestRideHistory() {
  const getStatusColor = (status: TestRideBooking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: TestRideBooking['status']) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const sortedRides = [...mockTestRides].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-inter text-2xl font-bold">Test Ride History</h2>
          <p className="font-open-sans text-muted-foreground">
            Track your test ride bookings and experiences
          </p>
        </div>
        <Button>
          Book New Test Ride
        </Button>
      </div>

      <div className="grid gap-4">
        {sortedRides.map(booking => {
          const dealer = dealerInfo[booking.dealerId];
          const vehicleName = vehicleNames[booking.vehicleId];
          const bookingDate = new Date(booking.date);
          const isUpcoming = bookingDate > new Date();

          return (
            <Card key={booking.id} className="transition-colors hover:bg-muted/30">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-inter font-medium text-lg mb-1">
                      {vehicleName}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground font-open-sans">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {bookingDate.toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {booking.time}
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(booking.status)}>
                    {getStatusText(booking.status)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <h4 className="font-inter font-medium text-sm">Dealer Information</h4>
                    <div className="space-y-1">
                      <p className="font-open-sans text-sm font-medium">{dealer.name}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {dealer.location}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        {dealer.phone}
                      </div>
                    </div>
                  </div>
                  
                  {booking.notes && (
                    <div className="space-y-2">
                      <h4 className="font-inter font-medium text-sm">Notes</h4>
                      <p className="font-open-sans text-sm text-muted-foreground">
                        {booking.notes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {booking.status === 'confirmed' && isUpcoming && (
                    <>
                      <Button size="sm" variant="outline">
                        Reschedule
                      </Button>
                      <Button size="sm" variant="outline">
                        Cancel
                      </Button>
                      <Button size="sm" variant="outline">
                        Get Directions
                      </Button>
                    </>
                  )}
                  
                  {booking.status === 'completed' && (
                    <>
                      <Button size="sm" variant="outline">
                        Write Review
                      </Button>
                      <Button size="sm" variant="outline">
                        Book Again
                      </Button>
                      <Button size="sm">
                        Contact Dealer
                      </Button>
                    </>
                  )}
                  
                  {booking.status === 'pending' && (
                    <>
                      <Button size="sm" variant="outline">
                        Cancel Request
                      </Button>
                      <Button size="sm" variant="outline">
                        Contact Dealer
                      </Button>
                    </>
                  )}
                  
                  {booking.status === 'cancelled' && (
                    <Button size="sm" variant="outline">
                      Book Again
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {sortedRides.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-inter text-lg font-medium mb-2">No test rides yet</h3>
              <p className="font-open-sans text-muted-foreground mb-4">
                Book your first test ride to experience vehicles before buying.
              </p>
              <Button>Book Test Ride</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}