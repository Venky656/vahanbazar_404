import React from 'react';
import { Vehicle } from '@/types';
import { formatPrice } from '@/utils';
import { Fuel, Zap, Gauge, Settings, IndianRupee } from 'lucide-react';

interface SpecificationsTableProps {
  vehicle: Vehicle;
}

const SpecificationsTable: React.FC<SpecificationsTableProps> = ({ vehicle }) => {
  const specificationSections = [
    {
      title: 'Engine & Performance',
      icon: <Settings className="w-5 h-5" />,
      specs: [
        { label: 'Engine Displacement', value: vehicle.specifications.engine },
        { label: 'Max Power', value: vehicle.specifications.power },
        { label: 'Max Torque', value: vehicle.specifications.torque },
        { label: 'Transmission', value: vehicle.specifications.transmission },
      ],
    },
    {
      title: 'Fuel & Efficiency',
      icon: vehicle.specifications.fuelType === 'Electric' ? <Zap className="w-5 h-5" /> : <Fuel className="w-5 h-5" />,
      specs: [
        { label: 'Fuel Type', value: vehicle.specifications.fuelType },
        { 
          label: vehicle.specifications.fuelType === 'Electric' ? 'Range' : 'Mileage', 
          value: `${vehicle.specifications.mileage} ${vehicle.specifications.fuelType === 'Electric' ? 'km' : 'kmpl'}` 
        },
      ],
    },
    {
      title: 'Pricing',
      icon: <IndianRupee className="w-5 h-5" />,
      specs: [
        { label: 'Ex-Showroom Price', value: formatPrice(vehicle.price.exShowroom) },
        { label: 'On-Road Price', value: formatPrice(vehicle.price.onRoad) },
        { label: 'Model Year', value: vehicle.year.toString() },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Gauge className="w-6 h-6 text-primary" />
        <h3 className="font-inter font-bold text-xl text-foreground">Specifications</h3>
      </div>

      {specificationSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <div className="text-primary">{section.icon}</div>
            <h4 className="font-inter font-semibold text-lg text-foreground">
              {section.title}
            </h4>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {section.specs.map((spec, specIndex) => (
              <div
                key={specIndex}
                className="flex justify-between items-center py-2 border-b border-border last:border-b-0"
              >
                <span className="font-open-sans text-muted-foreground">
                  {spec.label}
                </span>
                <span className="font-open-sans font-medium text-foreground">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SpecificationsTable;