import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';

const steps = [
  { id: 1, title: 'Vehicle Details', description: 'Basic information about your vehicle' },
  { id: 2, title: 'Specifications', description: 'Technical details and features' },
  { id: 3, title: 'Condition & Pricing', description: 'Vehicle condition and asking price' },
  { id: 4, title: 'Photos & Description', description: 'Upload images and write description' },
  { id: 5, title: 'Contact & Verification', description: 'Your contact details and documents' }
];

const brands = ['Honda', 'TVS', 'Bajaj', 'Hero', 'Royal Enfield', 'Yamaha', 'KTM', 'Suzuki'];
const conditions = [
  { value: 'excellent', label: 'Excellent', description: 'Like new, no visible wear' },
  { value: 'good', label: 'Good', description: 'Minor wear, well maintained' },
  { value: 'fair', label: 'Fair', description: 'Some wear, runs well' },
  { value: 'needs-work', label: 'Needs Work', description: 'Requires repair or maintenance' }
];

export default function SellVehicleForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Vehicle Details
    brand: '',
    model: '',
    year: '',
    category: '',
    
    // Specifications
    engine: '',
    mileage: '',
    fuelType: '',
    transmission: '',
    
    // Condition & Pricing
    condition: '',
    odometer: '',
    askingPrice: '',
    
    // Photos & Description
    images: [] as File[],
    description: '',
    
    // Contact & Verification
    name: '',
    phone: '',
    email: '',
    location: '',
    registrationNumber: ''
  });

  const [priceEstimate, setPriceEstimate] = useState<{ min: number; max: number } | null>(null);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    updateFormData('images', [...formData.images, ...files].slice(0, 10));
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    updateFormData('images', newImages);
  };

  const estimatePrice = () => {
    // Mock price estimation logic
    if (formData.brand && formData.year && formData.odometer) {
      const basePrice = 150000; // Mock base price
      const yearDepreciation = (2024 - parseInt(formData.year)) * 0.15;
      const mileageDepreciation = (parseInt(formData.odometer) / 10000) * 0.1;
      const conditionMultiplier = formData.condition === 'excellent' ? 0.9 : 
                                  formData.condition === 'good' ? 0.8 :
                                  formData.condition === 'fair' ? 0.7 : 0.6;
      
      const estimatedPrice = basePrice * (1 - yearDepreciation - mileageDepreciation) * conditionMultiplier;
      
      setPriceEstimate({
        min: Math.round(estimatedPrice * 0.9),
        max: Math.round(estimatedPrice * 1.1)
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand *</Label>
                <Select onValueChange={(value) => updateFormData('brand', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map(brand => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  placeholder="e.g., Classic 350"
                  value={formData.model}
                  onChange={(e) => updateFormData('model', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="year">Year *</Label>
                <Select onValueChange={(value) => updateFormData('year', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 15 }, (_, i) => 2024 - i).map(year => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select onValueChange={(value) => updateFormData('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bike">Motorcycle</SelectItem>
                    <SelectItem value="scooter">Scooter</SelectItem>
                    <SelectItem value="ev">Electric Vehicle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="engine">Engine Capacity</Label>
                <Input
                  id="engine"
                  placeholder="e.g., 349cc"
                  value={formData.engine}
                  onChange={(e) => updateFormData('engine', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mileage">Mileage (kmpl)</Label>
                <Input
                  id="mileage"
                  type="number"
                  placeholder="e.g., 40"
                  value={formData.mileage}
                  onChange={(e) => updateFormData('mileage', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fuelType">Fuel Type *</Label>
                <Select onValueChange={(value) => updateFormData('fuelType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Petrol">Petrol</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="transmission">Transmission *</Label>
                <Select onValueChange={(value) => updateFormData('transmission', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manual">Manual</SelectItem>
                    <SelectItem value="Automatic">Automatic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Vehicle Condition *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {conditions.map(condition => (
                  <Card 
                    key={condition.value}
                    className={`cursor-pointer transition-colors ${
                      formData.condition === condition.value ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => updateFormData('condition', condition.value)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-inter font-medium">{condition.label}</h4>
                        {formData.condition === condition.value && (
                          <CheckCircle className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <p className="font-open-sans text-sm text-muted-foreground">
                        {condition.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="odometer">Odometer Reading (km) *</Label>
                <Input
                  id="odometer"
                  type="number"
                  placeholder="e.g., 15000"
                  value={formData.odometer}
                  onChange={(e) => updateFormData('odometer', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="askingPrice">Asking Price (₹) *</Label>
                <Input
                  id="askingPrice"
                  type="number"
                  placeholder="e.g., 165000"
                  value={formData.askingPrice}
                  onChange={(e) => updateFormData('askingPrice', e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={estimatePrice}>
                Get Price Estimate
              </Button>
              
              {priceEstimate && (
                <div className="text-right">
                  <p className="font-inter font-medium">
                    Estimated Value: ₹{priceEstimate.min.toLocaleString()} - ₹{priceEstimate.max.toLocaleString()}
                  </p>
                  <p className="font-open-sans text-sm text-muted-foreground">
                    Based on market data
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Vehicle Photos * (Maximum 10 photos)</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="font-open-sans text-muted-foreground mb-4">
                  Drag and drop photos here or click to browse
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Button variant="outline" onClick={() => document.getElementById('image-upload')?.click()}>
                  Choose Photos
                </Button>
              </div>
              
              {formData.images.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                  {formData.images.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 w-6 h-6 p-0"
                        onClick={() => removeImage(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your vehicle's condition, maintenance history, and any special features..."
                rows={6}
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                className="font-open-sans"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="City, State"
                  value={formData.location}
                  onChange={(e) => updateFormData('location', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Registration Number *</Label>
                <Input
                  id="registrationNumber"
                  placeholder="MH01AB1234"
                  value={formData.registrationNumber}
                  onChange={(e) => updateFormData('registrationNumber', e.target.value)}
                />
              </div>
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-inter font-medium text-blue-900 mb-1">Verification Required</h4>
                    <p className="font-open-sans text-sm text-blue-800">
                      You'll need to provide RC copy and valid ID proof for verification after listing submission.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.brand && formData.model && formData.year && formData.category;
      case 2:
        return formData.fuelType && formData.transmission;
      case 3:
        return formData.condition && formData.odometer && formData.askingPrice;
      case 4:
        return formData.images.length > 0 && formData.description;
      case 5:
        return formData.name && formData.phone && formData.email && formData.location && formData.registrationNumber;
      default:
        return false;
    }
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-inter text-xl font-bold">
              Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
            </h2>
            <Badge variant="outline">{Math.round(progress)}% Complete</Badge>
          </div>
          <Progress value={progress} className="mb-4" />
          <p className="font-open-sans text-sm text-muted-foreground">
            {steps[currentStep - 1].description}
          </p>
        </CardContent>
      </Card>

      {/* Form Content */}
      <Card>
        <CardContent className="p-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        
        <div className="flex gap-2">
          {currentStep < steps.length ? (
            <Button
              onClick={nextStep}
              disabled={!isStepValid()}
            >
              Next Step
            </Button>
          ) : (
            <Button
              onClick={() => console.log('Submit listing', formData)}
              disabled={!isStepValid()}
            >
              Submit Listing
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}