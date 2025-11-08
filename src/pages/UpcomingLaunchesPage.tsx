import React from 'react';
import Layout from '@/components/layout/Layout';
import UpcomingLaunches from '@/components/upcoming/UpcomingLaunches';

const UpcomingLaunchesPage = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-inter font-bold text-3xl text-foreground mb-2">
            Upcoming Launches
          </h1>
          <p className="font-open-sans text-muted-foreground">
            Stay updated with the latest two-wheeler launches
          </p>
        </div>

        <UpcomingLaunches />
      </div>
    </Layout>
  );
};

export default UpcomingLaunchesPage;