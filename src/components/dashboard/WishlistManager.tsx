import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Trash2, GitCompare, Share2 } from 'lucide-react';
import { mockVehicles } from '@/data/mockData';
import { WishlistItem } from '@/types';

// Mock wishlist data
const mockWishlist: WishlistItem[] = [
  { id: '1', userId: 'user1', vehicleId: '1', addedAt: '2024-01-15' },
  { id: '2', userId: 'user1', vehicleId: '6', addedAt: '2024-01-10' },
  { id: '3', userId: 'user1', vehicleId: '10', addedAt: '2024-01-08' },
];

export default function WishlistManager() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>(mockWishlist);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const wishlistVehicles = wishlist.map(item => ({
    ...item,
    vehicle: mockVehicles.find(v => v.id === item.vehicleId)!
  })).filter(item => item.vehicle);

  const removeFromWishlist = (itemId: string) => {
    setWishlist(wishlist.filter(item => item.id !== itemId));
    setSelectedItems(selectedItems.filter(id => id !== itemId));
  };

  const toggleSelection = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleCompareSelected = () => {
    if (selectedItems.length > 1) {
      const vehicleIds = selectedItems.map(id => 
        wishlist.find(item => item.id === id)?.vehicleId
      ).filter(Boolean);
      
      // Navigate to comparison page with selected vehicles
      console.log('Compare vehicles:', vehicleIds);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-inter text-2xl font-bold">My Wishlist</h2>
        <div className="flex gap-2">
          {selectedItems.length > 1 && (
            <Button variant="outline" onClick={handleCompareSelected}>
              <GitCompare className="w-4 h-4 mr-2" />
              Compare ({selectedItems.length})
            </Button>
          )}
          <Badge variant="secondary" className="font-open-sans">
            {wishlist.length} items
          </Badge>
        </div>
      </div>

      {wishlistVehicles.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-inter text-lg font-medium mb-2">Your wishlist is empty</h3>
            <p className="font-open-sans text-muted-foreground mb-4">
              Start adding vehicles you're interested in to keep track of them.
            </p>
            <Button>Browse Vehicles</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {wishlistVehicles.map(({ vehicle, id, addedAt }) => (
            <Card key={id} className="transition-colors hover:bg-muted/30">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(id)}
                    onChange={() => toggleSelection(id)}
                    className="mt-1"
                  />
                  
                  <img
                    src={vehicle.images[0]}
                    alt={vehicle.name}
                    className="w-24 h-16 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-inter font-medium text-lg">
                          {vehicle.brand} {vehicle.name}
                        </h3>
                        <p className="font-open-sans text-sm text-muted-foreground">
                          Added on {new Date(addedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-inter font-bold text-lg">
                          ₹{vehicle.price.onRoad.toLocaleString()}
                        </p>
                        <p className="font-open-sans text-sm text-muted-foreground">
                          On-road price
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <Badge variant="outline">{vehicle.category}</Badge>
                      <Badge variant="outline">{vehicle.specifications.fuelType}</Badge>
                      <span className="font-open-sans text-sm text-muted-foreground">
                        {vehicle.specifications.mileage} kmpl
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                      <Button size="sm" variant="outline">
                        Book Test Ride
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFromWishlist(id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}