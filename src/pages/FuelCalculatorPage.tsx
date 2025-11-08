import React from 'react';
import Layout from '@/components/layout/Layout';
import FuelCostCalculator from '@/components/calculators/FuelCostCalculator';

const FuelCalculatorPage = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-inter font-bold text-3xl text-foreground mb-2">
            Fuel Cost Calculator
          </h1>
          <p className="font-open-sans text-muted-foreground">
            Estimate your monthly fuel expenses based on usage
          </p>
        </div>

        <FuelCostCalculator />
      </div>
    </Layout>
  );
};

export default FuelCalculatorPage;