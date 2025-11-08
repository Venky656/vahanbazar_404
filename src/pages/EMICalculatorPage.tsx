import React from 'react';
import Layout from '@/components/layout/Layout';
import AdvancedEMICalculator from '@/components/calculators/AdvancedEMICalculator';

const EMICalculatorPage = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-inter font-bold text-3xl text-foreground mb-2">
            EMI Calculator
          </h1>
          <p className="font-open-sans text-muted-foreground">
            Calculate your monthly installments and plan your purchase
          </p>
        </div>

        <AdvancedEMICalculator />
      </div>
    </Layout>
  );
};

export default EMICalculatorPage;