import React, { createContext, useContext, useState, useCallback } from 'react';
import { Vehicle } from '@/types';
import { toast } from 'sonner';

interface ComparisonContextType {
  comparisonList: Vehicle[];                 // ✅ consistent naming
  addToComparison: (vehicle: Vehicle) => void;
  removeFromComparison: (vehicleId: string) => void;
  clearComparison: () => void;
  isInComparison: (vehicleId: string) => boolean;
  maxComparison: number;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};

interface ComparisonProviderProps {
  children: React.ReactNode;
}

export const ComparisonProvider: React.FC<ComparisonProviderProps> = ({ children }) => {
  const [comparisonList, setComparisonList] = useState<Vehicle[]>([]);
  const maxComparison = 3;

  /** Add a vehicle to comparison */
  const addToComparison = useCallback((vehicle: Vehicle) => {
    setComparisonList(prev => {
      // Prevent duplicates
      if (prev.some(v => v.id === vehicle.id)) {
        toast.info(`${vehicle.name} is already in comparison`);
        return prev;
      }

      // Limit the number of vehicles
      if (prev.length >= maxComparison) {
        toast.error(`You can compare up to ${maxComparison} vehicles only`);
        return prev;
      }

      toast.success(`${vehicle.name} added to comparison`);
      return [...prev, vehicle];
    });
  }, [maxComparison]);

  /** Remove a vehicle from comparison */
  const removeFromComparison = useCallback((vehicleId: string) => {
    setComparisonList(prev => {
      const removedVehicle = prev.find(v => v.id === vehicleId);
      if (removedVehicle) {
        toast.info(`${removedVehicle.name} removed from comparison`);
      }
      return prev.filter(v => v.id !== vehicleId);
    });
  }, []);

  /** Clear the comparison list */
  const clearComparison = useCallback(() => {
    setComparisonList([]);
    toast.info('Comparison cleared');
  }, []);

  /** Check if a vehicle is already in comparison */
  const isInComparison = useCallback((vehicleId: string) => {
    return comparisonList.some(v => v.id === vehicleId);
  }, [comparisonList]);

  const value: ComparisonContextType = {
    comparisonList,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    maxComparison,
  };

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  );
};

export default ComparisonContext;
