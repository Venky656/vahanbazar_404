// Utility functions for VahanBazar application

export const formatPrice = (price: number): string => {
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(1)} Lakh`;
  }
  if (price >= 1000) {
    return `₹${(price / 1000).toFixed(0)}K`;
  }
  return `₹${price.toLocaleString()}`;
};

export const calculateEMI = (
  principal: number,
  ratePerAnnum: number,
  tenureInMonths: number
): number => {
  const monthlyRate = ratePerAnnum / (12 * 100);
  const emi = 
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureInMonths)) /
    (Math.pow(1 + monthlyRate, tenureInMonths) - 1);
  return Math.round(emi);
};

export const calculateFuelCost = (
  mileage: number,
  monthlyDistance: number,
  fuelPrice: number
): number => {
  const monthlyFuelConsumption = monthlyDistance / mileage;
  return Math.round(monthlyFuelConsumption * fuelPrice);
};

export const formatMileage = (mileage: number): string => {
  return `${mileage} kmpl`;
};

export const formatPower = (power: string): string => {
  return power.includes('hp') ? power : `${power} hp`;
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};