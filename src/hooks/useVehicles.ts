import { useState, useEffect, useMemo } from 'react';
import { Vehicle, SearchFilters } from '@/types';
import { mockVehicles } from '@/data/mockData';
import { debounce } from '@/utils';

export const useVehicles = (filters?: SearchFilters, searchQuery?: string) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate API call delay
  useEffect(() => {
    const loadVehicles = async () => {
      setLoading(true);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setVehicles(mockVehicles);
        setError(null);
      } catch (err) {
        setError('Failed to load vehicles');
      } finally {
        setLoading(false);
      }
    };

    loadVehicles();
  }, []);

  // Filter vehicles based on search query and filters
  const filteredVehicles = useMemo(() => {
    let filtered = [...vehicles];

    // Apply search query
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(vehicle =>
        vehicle.name.toLowerCase().includes(query) ||
        vehicle.brand.toLowerCase().includes(query) ||
        vehicle.category.toLowerCase().includes(query) ||
        vehicle.specifications.fuelType.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters) {
      if (filters.brands && filters.brands.length > 0) {
        filtered = filtered.filter(vehicle =>
          filters.brands!.includes(vehicle.brand)
        );
      }

      if (filters.category && filters.category.length > 0) {
        filtered = filtered.filter(vehicle =>
          filters.category!.includes(vehicle.category)
        );
      }

      if (filters.fuelType && filters.fuelType.length > 0) {
        filtered = filtered.filter(vehicle =>
          filters.fuelType!.includes(vehicle.specifications.fuelType)
        );
      }

      if (filters.priceRange) {
        const [min, max] = filters.priceRange;
        filtered = filtered.filter(vehicle =>
          vehicle.price.exShowroom >= min && vehicle.price.exShowroom <= max
        );
      }

      if (filters.mileageRange) {
        const [min, max] = filters.mileageRange;
        filtered = filtered.filter(vehicle =>
          vehicle.specifications.mileage >= min && vehicle.specifications.mileage <= max
        );
      }

      if (filters.yearRange) {
        const [min, max] = filters.yearRange;
        filtered = filtered.filter(vehicle =>
          vehicle.year >= min && vehicle.year <= max
        );
      }
    }

    return filtered;
  }, [vehicles, searchQuery, filters]);

  return {
    vehicles: filteredVehicles,
    loading,
    error,
    totalCount: filteredVehicles.length
  };
};

export const useVehicleById = (id: string) => {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVehicle = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        const foundVehicle = mockVehicles.find(v => v.id === id);
        if (foundVehicle) {
          setVehicle(foundVehicle);
          setError(null);
        } else {
          setError('Vehicle not found');
        }
      } catch (err) {
        setError('Failed to load vehicle details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadVehicle();
    }
  }, [id]);

  return { vehicle, loading, error };
};

export const useFeaturedVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeatured = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setVehicles(mockVehicles.slice(0, 6));
      setLoading(false);
    };

    loadFeatured();
  }, []);

  return { vehicles, loading };
};