import React, { useState, useEffect } from 'react';
import { Vehicle } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Calculator, IndianRupee } from 'lucide-react';
import { formatPrice } from '@/utils';
import { Link } from 'react-router-dom';

interface EMICalculatorWidgetProps {
  vehicle: Vehicle;
}

const EMICalculatorWidget: React.FC<EMICalculatorWidgetProps> = ({ vehicle }) => {
  const [loanAmount, setLoanAmount] = useState(vehicle.price.onRoad);
  const [downPayment, setDownPayment] = useState(Math.round(vehicle.price.onRoad * 0.2)); // 20% default
  const [tenure, setTenure] = useState([36]); // 3 years default
  const [interestRate, setInterestRate] = useState([9.5]); // 9.5% default
  const [emi, setEmi] = useState(0);

  // Calculate EMI whenever inputs change
  useEffect(() => {
    const principal = loanAmount - downPayment;
    const monthlyRate = interestRate[0] / 100 / 12;
    const months = tenure[0];

    if (principal > 0 && monthlyRate > 0 && months > 0) {
      const emiAmount = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                       (Math.pow(1 + monthlyRate, months) - 1);
      setEmi(Math.round(emiAmount));
    } else {
      setEmi(0);
    }
  }, [loanAmount, downPayment, tenure, interestRate]);

  // Update loan amount when down payment changes
  useEffect(() => {
    const maxLoan = vehicle.price.onRoad - downPayment;
    if (maxLoan > 0) {
      setLoanAmount(maxLoan);
    }
  }, [downPayment, vehicle.price.onRoad]);

  const totalPayment = emi * tenure[0];
  const totalInterest = totalPayment - (loanAmount - downPayment);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="w-5 h-5 text-primary" />
          <span className="font-inter">EMI Calculator</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Vehicle Price */}
        <div className="p-4 bg-primary/5 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-open-sans text-sm text-muted-foreground">On-Road Price</span>
            <span className="font-inter font-bold text-lg text-foreground">
              {formatPrice(vehicle.price.onRoad)}
            </span>
          </div>
        </div>

        {/* Down Payment */}
        <div className="space-y-2">
          <Label className="font-open-sans">Down Payment</Label>
          <Input
            type="number"
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            min={0}
            max={vehicle.price.onRoad}
            className="font-open-sans"
          />
          <div className="text-xs text-muted-foreground font-open-sans">
            Loan Amount: {formatPrice(loanAmount - downPayment)}
          </div>
        </div>

        {/* Tenure Slider */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label className="font-open-sans">Loan Tenure</Label>
            <span className="font-open-sans text-sm text-muted-foreground">
              {tenure[0]} months ({Math.round(tenure[0] / 12)} years)
            </span>
          </div>
          <Slider
            value={tenure}
            onValueChange={setTenure}
            min={12}
            max={84}
            step={6}
            className="w-full"
          />
        </div>

        {/* Interest Rate Slider */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label className="font-open-sans">Interest Rate</Label>
            <span className="font-open-sans text-sm text-muted-foreground">
              {interestRate[0]}% per annum
            </span>
          </div>
          <Slider
            value={interestRate}
            onValueChange={setInterestRate}
            min={7}
            max={15}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* EMI Result */}
        <div className="p-4 bg-accent/10 rounded-lg space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-open-sans text-sm text-muted-foreground">Monthly EMI</span>
            <span className="font-inter font-bold text-2xl text-accent flex items-center">
              <IndianRupee className="w-5 h-5 mr-1" />
              {emi.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground font-open-sans">
            <div>Total Interest: {formatPrice(totalInterest)}</div>
            <div>Total Payment: {formatPrice(totalPayment)}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Link to="/emi-calculator" className="w-full">
            <Button variant="outline" className="w-full font-inter">
              Advanced Calculator
            </Button>
          </Link>
          <Button className="w-full font-inter" disabled>
            Apply for Loan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EMICalculatorWidget;