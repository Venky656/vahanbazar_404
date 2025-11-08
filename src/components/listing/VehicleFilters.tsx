import React, { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SearchFilters } from '@/types';
import { mockBrands } from '@/data/mockData';
import { formatPrice } from '@/utils';

interface VehicleFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onClearFilters: () => void;
  className?: string;
}

const VehicleFilters: React.FC<VehicleFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  className = '',
}) => {
  const [expandedSections, setExpandedSections] = useState({
    brands: true,
    category: true,
    price: true,
    fuelType: true,
    mileage: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    const brands = filters.brands || [];
    const newBrands = checked
      ? [...brands, brand]
      : brands.filter(b => b !== brand);
    
    onFiltersChange({ ...filters, brands: newBrands });
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const categories = filters.category || [];
    const newCategories = checked
      ? [...categories, category]
      : categories.filter(c => c !== category);
    
    onFiltersChange({ ...filters, category: newCategories });
  };

  const handleFuelTypeChange = (fuelType: string, checked: boolean) => {
    const fuelTypes = filters.fuelType || [];
    const newFuelTypes = checked
      ? [...fuelTypes, fuelType]
      : fuelTypes.filter(f => f !== fuelType);
    
    onFiltersChange({ ...filters, fuelType: newFuelTypes });
  };

  const handlePriceRangeChange = (range: number[]) => {
    onFiltersChange({ ...filters, priceRange: [range[0], range[1]] });
  };

  const handleMileageRangeChange = (range: number[]) => {
    onFiltersChange({ ...filters, mileageRange: [range[0], range[1]] });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.brands?.length) count += filters.brands.length;
    if (filters.category?.length) count += filters.category.length;
    if (filters.fuelType?.length) count += filters.fuelType.length;
    if (filters.priceRange) count += 1;
    if (filters.mileageRange) count += 1;
    return count;
  };

  const categories = [
    { value: 'bike', label: 'Motorcycles' },
    { value: 'scooter', label: 'Scooters' },
    { value: 'ev', label: 'Electric Vehicles' },
  ];

  const fuelTypes = [
    { value: 'Petrol', label: 'Petrol' },
    { value: 'Electric', label: 'Electric' },
    { value: 'Hybrid', label: 'Hybrid' },
  ];

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-xs h-7"
            >
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Category Filter */}
        <Collapsible
          open={expandedSections.category}
          onOpenChange={() => toggleSection('category')}
        >
          <CollapsibleTrigger className="flex w-full items-center justify-between text-left">
            <h3 className="font-inter font-medium">Category</h3>
            {expandedSections.category ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-3">
            {categories.map((category) => (
              <div key={category.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.value}`}
                  checked={filters.category?.includes(category.value) || false}
                  onCheckedChange={(checked) =>
                    handleCategoryChange(category.value, checked as boolean)
                  }
                />
                <label
                  htmlFor={`category-${category.value}`}
                  className="font-open-sans text-sm cursor-pointer"
                >
                  {category.label}
                </label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Brand Filter */}
        <Collapsible
          open={expandedSections.brands}
          onOpenChange={() => toggleSection('brands')}
        >
          <CollapsibleTrigger className="flex w-full items-center justify-between text-left">
            <h3 className="font-inter font-medium">Brand</h3>
            {expandedSections.brands ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-3">
            {mockBrands.slice(0, 8).map((brand) => (
              <div key={brand.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand.id}`}
                  checked={filters.brands?.includes(brand.name) || false}
                  onCheckedChange={(checked) =>
                    handleBrandChange(brand.name, checked as boolean)
                  }
                />
                <label
                  htmlFor={`brand-${brand.id}`}
                  className="font-open-sans text-sm cursor-pointer"
                >
                  {brand.name}
                </label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Price Range Filter */}
        <Collapsible
          open={expandedSections.price}
          onOpenChange={() => toggleSection('price')}
        >
          <CollapsibleTrigger className="flex w-full items-center justify-between text-left">
            <h3 className="font-inter font-medium">Price Range</h3>
            {expandedSections.price ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-4">
            <div className="px-2">
              <Slider
                value={filters.priceRange || [50000, 1000000]}
                onValueChange={handlePriceRangeChange}
                max={1000000}
                min={50000}
                step={10000}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground font-open-sans">
                <span>{formatPrice((filters.priceRange || [50000, 1000000])[0])}</span>
                <span>{formatPrice((filters.priceRange || [50000, 1000000])[1])}</span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Fuel Type Filter */}
        <Collapsible
          open={expandedSections.fuelType}
          onOpenChange={() => toggleSection('fuelType')}
        >
          <CollapsibleTrigger className="flex w-full items-center justify-between text-left">
            <h3 className="font-inter font-medium">Fuel Type</h3>
            {expandedSections.fuelType ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-3">
            {fuelTypes.map((fuel) => (
              <div key={fuel.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`fuel-${fuel.value}`}
                  checked={filters.fuelType?.includes(fuel.value) || false}
                  onCheckedChange={(checked) =>
                    handleFuelTypeChange(fuel.value, checked as boolean)
                  }
                />
                <label
                  htmlFor={`fuel-${fuel.value}`}
                  className="font-open-sans text-sm cursor-pointer"
                >
                  {fuel.label}
                </label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Mileage Range Filter */}
        <Collapsible
          open={expandedSections.mileage}
          onOpenChange={() => toggleSection('mileage')}
        >
          <CollapsibleTrigger className="flex w-full items-center justify-between text-left">
            <h3 className="font-inter font-medium">Mileage Range</h3>
            {expandedSections.mileage ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-4">
            <div className="px-2">
              <Slider
                value={filters.mileageRange || [20, 80]}
                onValueChange={handleMileageRangeChange}
                max={80}
                min={20}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground font-open-sans">
                <span>{(filters.mileageRange || [20, 80])[0]} kmpl</span>
                <span>{(filters.mileageRange || [20, 80])[1]} kmpl</span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default VehicleFilters;