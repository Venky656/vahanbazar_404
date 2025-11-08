import React from 'react';
import Layout from '@/components/layout/Layout';
import UsedVehiclesList from '@/components/marketplace/UsedVehiclesList';

const UsedVehiclesPage = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-inter font-bold text-3xl text-foreground mb-2">
            Used Vehicles
          </h1>
          <p className="font-open-sans text-muted-foreground">
            Browse verified used motorcycles, scooters, and electric vehicles
          </p>
        </div>

        <UsedVehiclesList />
      </div>
    </Layout>
  );
};

export default UsedVehiclesPage;