// Common types for VahanBazar application

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: {
    exShowroom: number;
    onRoad: number;
  };
  specifications: {
    engine: string;
    mileage: number;
    power: string;
    torque: string;
    fuelType: 'Petrol' | 'Electric' | 'Hybrid';
    transmission: string;
  };
  images: string[];
  category: 'bike' | 'scooter' | 'ev';
  availability: boolean;
  launchDate?: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  country: string;
}

export interface Dealer {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  location: {
    lat: number;
    lng: number;
  };
  brands: string[];
  services: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  preferences: {
    notifications: boolean;
    newsletter: boolean;
  };
}

export interface TestRideBooking {
  id: string;
  userId: string;
  vehicleId: string;
  dealerId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

export interface UsedVehicle {
  id: string;
  sellerId: string;
  vehicleDetails: Omit<Vehicle, 'id' | 'availability'>;
  condition: 'excellent' | 'good' | 'fair' | 'needs-work';
  mileage: number;
  yearOfPurchase: number;
  askingPrice: number;
  location: string;
  images: string[];
  description: string;
  verified: boolean;
}

export interface SearchFilters {
  brands?: string[];
  priceRange?: [number, number];
  fuelType?: string[];
  category?: string[];
  mileageRange?: [number, number];
  yearRange?: [number, number];
}

export interface PriceAlert {
  id: string;
  userId: string;
  vehicleId: string;
  vehicleName: string;
  targetPrice: number;
  currentPrice: number;
  active: boolean;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  city?: string;
  state?: string;
  preferences: {
    notifications: boolean;
    newsletter: boolean;
    priceAlerts: boolean;
  };
}

export interface WishlistItem {
  id: string;
  userId: string;
  vehicleId: string;
  addedAt: string;
}

export interface EMICalculation {
  loanAmount: number;
  interestRate: number;
  tenure: number;
  emi: number;
  totalAmount: number;
  totalInterest: number;
}

export interface FuelCostCalculation {
  vehicleId: string;
  monthlyDistance: number;
  fuelPrice: number;
  mileage: number;
  monthlyCost: number;
  yearlyCost: number;
}

export interface UpcomingVehicle {
  id: string;
  name: string;
  brand: string;
  expectedPrice: number;
  launchDate: string;
  category: 'bike' | 'scooter' | 'ev';
  image: string;
  description?: string;
  keyFeatures?: string[];
}