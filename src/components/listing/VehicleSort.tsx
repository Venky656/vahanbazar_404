import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface VehicleSortProps {
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  resultsCount: number;
  className?: string;
}

const VehicleSort: React.FC<VehicleSortProps> = ({
  sortBy,
  onSortChange,
  resultsCount,
  className = '',
}) => {
  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'mileage-high', label: 'Mileage: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'newest', label: 'Newest First' },
  ];

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center space-x-4">
        <p className="font-open-sans text-sm text-muted-foreground">
          {resultsCount} vehicle{resultsCount !== 1 ? 's' : ''} found
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
        <span className="font-open-sans text-sm text-muted-foreground">Sort by:</span>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-48 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default VehicleSort;