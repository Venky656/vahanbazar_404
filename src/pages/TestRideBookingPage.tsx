import React from 'react';
import Layout from '@/components/layout/Layout';

const TestRideBookingPage = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-inter font-bold text-3xl text-foreground mb-2">
            Book Test Ride
          </h1>
          <p className="font-open-sans text-muted-foreground">
            Schedule a test ride with your preferred dealer
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <p className="text-muted-foreground font-open-sans">
            Test ride booking system will be implemented in Phase 7
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default TestRideBookingPage;