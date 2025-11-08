import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import WishlistManager from '@/components/dashboard/WishlistManager';
import PriceAlertManager from '@/components/dashboard/PriceAlertManager';
import TestRideHistory from '@/components/dashboard/TestRideHistory';

const UserDashboardPage = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-inter font-bold text-3xl text-foreground mb-2">
            My Dashboard
          </h1>
          <p className="font-open-sans text-muted-foreground">
            Manage your account, wishlist, and activities
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
            <TabsTrigger value="alerts">Price Alerts</TabsTrigger>
            <TabsTrigger value="rides">Test Rides</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium font-inter">Saved Vehicles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-inter">12</div>
                  <p className="text-xs text-muted-foreground font-open-sans">
                    in your wishlist
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium font-inter">Active Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-inter">3</div>
                  <p className="text-xs text-muted-foreground font-open-sans">
                    price tracking
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium font-inter">Test Rides</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-inter">8</div>
                  <p className="text-xs text-muted-foreground font-open-sans">
                    total bookings
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="font-inter">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-open-sans text-sm">Added Honda CBR 650R to wishlist</p>
                      <p className="font-open-sans text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-open-sans text-sm">Price alert triggered for Royal Enfield</p>
                      <p className="font-open-sans text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-open-sans text-sm">Test ride booked for TVS iQube</p>
                      <p className="font-open-sans text-xs text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wishlist">
            <WishlistManager />
          </TabsContent>

          <TabsContent value="alerts">
            <PriceAlertManager />
          </TabsContent>

          <TabsContent value="rides">
            <TestRideHistory />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-inter">Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" className="font-open-sans" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" className="font-open-sans" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" className="font-open-sans" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" placeholder="+91 98765 43210" className="font-open-sans" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Mumbai" className="font-open-sans" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" placeholder="Maharashtra" className="font-open-sans" />
                  </div>
                </div>
                <Button className="font-inter">Update Profile</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-inter">Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-open-sans">Price Alerts</Label>
                    <p className="font-open-sans text-sm text-muted-foreground">
                      Get notified when vehicle prices drop
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-open-sans">Newsletter</Label>
                    <p className="font-open-sans text-sm text-muted-foreground">
                      Weekly updates on new launches and offers
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-open-sans">Test Ride Reminders</Label>
                    <p className="font-open-sans text-sm text-muted-foreground">
                      Reminders for upcoming test rides
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default UserDashboardPage;