import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { mockVehicles } from '@/data/mockData';
import { EMICalculation } from '@/types';

interface Bank {
  name: string;
  interestRate: number;
  processingFee: number;
}

const banks: Bank[] = [
  { name: 'HDFC Bank', interestRate: 10.5, processingFee: 2000 },
  { name: 'ICICI Bank', interestRate: 10.75, processingFee: 2500 },
  { name: 'SBI', interestRate: 9.95, processingFee: 1500 },
  { name: 'Axis Bank', interestRate: 11.0, processingFee: 2200 },
  { name: 'Kotak Bank', interestRate: 10.25, processingFee: 1800 },
];

export default function AdvancedEMICalculator() {
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [loanAmount, setLoanAmount] = useState(100000);
  const [downPayment, setDownPayment] = useState(20000);
  const [tenure, setTenure] = useState([36]);
  const [selectedBank, setSelectedBank] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState(50000);
  const [calculations, setCalculations] = useState<EMICalculation[]>([]);

  const selectedVehicleData = mockVehicles.find(v => v.id === selectedVehicle);
  const vehiclePrice = selectedVehicleData?.price.onRoad || 0;

  const calculateEMI = (principal: number, rate: number, time: number): EMICalculation => {
    const monthlyRate = rate / (12 * 100);
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, time)) / 
                (Math.pow(1 + monthlyRate, time) - 1);
    const totalAmount = emi * time;
    const totalInterest = totalAmount - principal;

    return {
      loanAmount: principal,
      interestRate: rate,
      tenure: time,
      emi: Math.round(emi),
      totalAmount: Math.round(totalAmount),
      totalInterest: Math.round(totalInterest)
    };
  };

  useEffect(() => {
    if (selectedVehicle && selectedBank) {
      const bank = banks.find(b => b.name === selectedBank);
      if (bank) {
        const calc = calculateEMI(loanAmount, bank.interestRate, tenure[0]);
        setCalculations([calc]);
      }
    } else {
      // Calculate for all banks
      const allCalcs = banks.map(bank => 
        calculateEMI(loanAmount, bank.interestRate, tenure[0])
      );
      setCalculations(allCalcs);
    }
  }, [selectedVehicle, loanAmount, tenure, selectedBank]);

  const emiToIncomeRatio = calculations.length > 0 ? 
    (calculations[0].emi / monthlyIncome) * 100 : 0;

  const isEligible = emiToIncomeRatio <= 40; // 40% is generally considered safe

  return (
    <div className="space-y-6">
      {/* Vehicle Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="font-inter">Vehicle Selection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicle">Select Vehicle</Label>
              <Select onValueChange={setSelectedVehicle}>
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
              <Label htmlFor="bank">Select Bank (Optional)</Label>
              <Select onValueChange={setSelectedBank}>
                <SelectTrigger>
                  <SelectValue placeholder="Compare all banks" />
                </SelectTrigger>
                <SelectContent>
                  {banks.map(bank => (
                    <SelectItem key={bank.name} value={bank.name}>
                      {bank.name} - {bank.interestRate}%
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loan Parameters */}
      <Card>
        <CardHeader>
          <CardTitle className="font-inter">Loan Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Vehicle Price: ₹{vehiclePrice.toLocaleString()}</Label>
              <div className="space-y-2">
                <Label htmlFor="downPayment">Down Payment</Label>
                <Input
                  id="downPayment"
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="font-open-sans"
                />
              </div>
              <div className="space-y-2">
                <Label>Loan Amount: ₹{(vehiclePrice - downPayment).toLocaleString()}</Label>
                <Input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="font-open-sans"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tenure: {tenure[0]} months</Label>
                <Slider
                  value={tenure}
                  onValueChange={setTenure}
                  max={84}
                  min={12}
                  step={6}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>12 months</span>
                  <span>84 months</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="income">Monthly Income</Label>
                <Input
                  id="income"
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  className="font-open-sans"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Eligibility Check */}
      <Card>
        <CardHeader>
          <CardTitle className="font-inter">Loan Eligibility</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-open-sans text-sm text-muted-foreground">
                EMI to Income Ratio: {emiToIncomeRatio.toFixed(1)}%
              </p>
              <p className="font-open-sans text-sm text-muted-foreground">
                Recommended: Below 40%
              </p>
            </div>
            <Badge variant={isEligible ? "default" : "destructive"}>
              {isEligible ? "Eligible" : "High Risk"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {calculations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-inter">
              {selectedBank ? `${selectedBank} - EMI Details` : 'Bank Comparison'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedBank ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="font-open-sans text-2xl font-bold text-primary">
                      ₹{calculations[0].emi.toLocaleString()}
                    </p>
                    <p className="font-open-sans text-sm text-muted-foreground">Monthly EMI</p>
                  </div>
                  <div className="text-center">
                    <p className="font-open-sans text-2xl font-bold text-accent">
                      ₹{calculations[0].totalAmount.toLocaleString()}
                    </p>
                    <p className="font-open-sans text-sm text-muted-foreground">Total Amount</p>
                  </div>
                  <div className="text-center">
                    <p className="font-open-sans text-2xl font-bold text-secondary">
                      ₹{calculations[0].totalInterest.toLocaleString()}
                    </p>
                    <p className="font-open-sans text-sm text-muted-foreground">Total Interest</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {banks.map((bank, index) => (
                    <div key={bank.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-inter font-medium">{bank.name}</h4>
                        <p className="font-open-sans text-sm text-muted-foreground">
                          {bank.interestRate}% • Processing Fee: ₹{bank.processingFee.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-open-sans font-bold text-lg">
                          ₹{calculations[index].emi.toLocaleString()}
                        </p>
                        <p className="font-open-sans text-sm text-muted-foreground">per month</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Separator />
              <div className="flex justify-center">
                <Button className="font-inter">
                  Apply for Loan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}