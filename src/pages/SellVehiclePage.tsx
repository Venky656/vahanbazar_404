import React from 'react';
import Layout from '@/components/layout/Layout';
import SellVehicleForm from '@/components/sell/SellVehicleForm';

const SellVehiclePage = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-inter font-bold text-3xl text-foreground mb-2">
            Sell Your Vehicle
          </h1>
          <p className="font-open-sans text-muted-foreground">
            List your motorcycle, scooter, or electric vehicle for sale
          </p>
        </div>

        <SellVehicleForm />
      </div>
    </Layout>
  );
};

export default SellVehiclePage;