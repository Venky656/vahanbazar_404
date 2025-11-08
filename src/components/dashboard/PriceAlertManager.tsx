import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Bell, BellOff, Trash2, TrendingDown, TrendingUp } from 'lucide-react';
import { mockVehicles } from '@/data/mockData';
import { PriceAlert } from '@/types';

// Mock price alerts
const mockAlerts: PriceAlert[] = [
  {
    id: '1',
    userId: 'user1',
    vehicleId: '6',
    vehicleName: 'Royal Enfield Classic 350',
    targetPrice: 200000,
    currentPrice: 210000,
    active: true,
    createdAt: '2024-01-10'
  },
  {
    id: '2',
    userId: 'user1',
    vehicleId: '10',
    vehicleName: 'TVS iQube Electric',
    targetPrice: 110000,
    currentPrice: 125000,
    active: true,
    createdAt: '2024-01-08'
  },
  {
    id: '3',
    userId: 'user1',
    vehicleId: '4',
    vehicleName: 'Bajaj Pulsar NS200',
    targetPrice: 150000,
    currentPrice: 160000,
    active: false,
    createdAt: '2024-01-05'
  },
];

export default function PriceAlertManager() {
  const [alerts, setAlerts] = useState<PriceAlert[]>(mockAlerts);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    vehicleId: '',
    targetPrice: ''
  });

  const toggleAlert = (alertId: string) => {
    setAlerts(alerts.map(alert =>
      alert.id === alertId
        ? { ...alert, active: !alert.active }
        : alert
    ));
  };

  const deleteAlert = (alertId: string) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const createAlert = () => {
    if (newAlert.vehicleId && newAlert.targetPrice) {
      const vehicle = mockVehicles.find(v => v.id === newAlert.vehicleId);
      if (vehicle) {
        const alert: PriceAlert = {
          id: Date.now().toString(),
          userId: 'user1',
          vehicleId: newAlert.vehicleId,
          vehicleName: `${vehicle.brand} ${vehicle.name}`,
          targetPrice: Number(newAlert.targetPrice),
          currentPrice: vehicle.price.onRoad,
          active: true,
          createdAt: new Date().toISOString()
        };
        setAlerts([alert, ...alerts]);
        setNewAlert({ vehicleId: '', targetPrice: '' });
        setShowCreateForm(false);
      }
    }
  };

  const getPriceStatus = (alert: PriceAlert) => {
    const difference = alert.currentPrice - alert.targetPrice;
    const percentageDiff = (difference / alert.targetPrice) * 100;
    
    if (difference <= 0) {
      return {
        status: 'reached',
        icon: TrendingDown,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        message: `Target reached! ₹${Math.abs(difference).toLocaleString()} below target`
      };
    } else if (percentageDiff <= 5) {
      return {
        status: 'close',
        icon: TrendingDown,
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        message: `Close to target! ₹${difference.toLocaleString()} above`
      };
    } else {
      return {
        status: 'far',
        icon: TrendingUp,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        message: `₹${difference.toLocaleString()} above target`
      };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-inter text-2xl font-bold">Price Alerts</h2>
          <p className="font-open-sans text-muted-foreground">
            Get notified when vehicle prices drop to your target
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Bell className="w-4 h-4 mr-2" />
          Create Alert
        </Button>
      </div>

      {/* Create Alert Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle className="font-inter">Create Price Alert</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Select Vehicle</Label>
                <Select onValueChange={(value) => setNewAlert({ ...newAlert, vehicleId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockVehicles.map(vehicle => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.brand} {vehicle.name} - ₹{vehicle.price.onRoad.toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetPrice">Target Price</Label>
                <Input
                  id="targetPrice"
                  type="number"
                  placeholder="Enter target price"
                  value={newAlert.targetPrice}
                  onChange={(e) => setNewAlert({ ...newAlert, targetPrice: e.target.value })}
                  className="font-open-sans"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={createAlert}>Create Alert</Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="font-inter">Active Alerts ({alerts.filter(a => a.active).length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {alerts.filter(alert => alert.active).map(alert => {
            const priceStatus = getPriceStatus(alert);
            const StatusIcon = priceStatus.icon;
            
            return (
              <div key={alert.id} className={`p-4 rounded-lg border ${priceStatus.bgColor}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <StatusIcon className={`w-5 h-5 ${priceStatus.color}`} />
                      <h3 className="font-inter font-medium">{alert.vehicleName}</h3>
                      <Badge variant={priceStatus.status === 'reached' ? 'default' : 'secondary'}>
                        {priceStatus.status === 'reached' ? 'Target Reached!' : 'Watching'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-2">
                      <div>
                        <p className="font-open-sans text-sm text-muted-foreground">Target Price</p>
                        <p className="font-inter font-medium">₹{alert.targetPrice.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="font-open-sans text-sm text-muted-foreground">Current Price</p>
                        <p className="font-inter font-medium">₹{alert.currentPrice.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="font-open-sans text-sm text-muted-foreground">Created</p>
                        <p className="font-inter font-medium">{new Date(alert.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className={`font-open-sans text-sm ${priceStatus.color}`}>
                      {priceStatus.message}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Switch
                      checked={alert.active}
                      onCheckedChange={() => toggleAlert(alert.id)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteAlert(alert.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
          
          {alerts.filter(a => a.active).length === 0 && (
            <div className="text-center py-8">
              <BellOff className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-inter text-lg font-medium mb-2">No active alerts</h3>
              <p className="font-open-sans text-muted-foreground">
                Create your first price alert to get notified about price drops.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inactive Alerts */}
      {alerts.filter(a => !a.active).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-inter">Inactive Alerts ({alerts.filter(a => !a.active).length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.filter(alert => !alert.active).map(alert => (
              <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg opacity-60">
                <div>
                  <h3 className="font-inter font-medium">{alert.vehicleName}</h3>
                  <p className="font-open-sans text-sm text-muted-foreground">
                    Target: ₹{alert.targetPrice.toLocaleString()} • Current: ₹{alert.currentPrice.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={alert.active}
                    onCheckedChange={() => toggleAlert(alert.id)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteAlert(alert.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}