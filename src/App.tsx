// src/App.tsx
import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { ComparisonProvider } from "@/contexts/ComparisonContext";
import ComparisonButton from "@/components/ComparisonButton";
import AlertPopup from "@/components/Alertpopup/Alertpopup";
import ChatbotWidget from "@/components/chatbox/ChatbotWidget";

// 📄 Pages
import Index from "@/pages/Index";
import VehicleListingPage from "@/pages/VehicleListingPage";
import VehicleDetailPage from "@/pages/VehicleDetailPage";
import ComparisonPage from "@/pages/ComparisonPage";
import EMICalculatorPage from "@/pages/EMICalculatorPage";
import FuelCalculatorPage from "@/pages/FuelCalculatorPage";
import UpcomingLaunchesPage from "@/pages/UpcomingLaunchesPage";
import DealerLocatorPage from "@/pages/DealerLocatorPage";
import TestRideBookingPage from "@/pages/TestRideBookingPage";
import UsedVehiclesPage from "@/pages/UsedVehiclesPage";
import SellVehiclePage from "@/pages/SellVehiclePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import UserDashboardPage from "@/pages/UserDashboardPage";
import SearchResultsPage from "@/pages/SearchResultsPage";
import NotFound from "@/pages/NotFound";

// ⚙️ Initialize Query Client
const queryClient = new QueryClient();

// ---- NEW: inner routes component so we can use useLocation ----
function AppRoutes() {
  const location = useLocation();
  const state = location.state as { background?: Location };

  return (
    <>
      {/* Base routes render using the background location when present */}
      <Routes location={state?.background || location}>
        <Route path="/" element={<Index />} />
        <Route path="/vehicles" element={<VehicleListingPage />} />
        <Route path="/vehicle/:id/:slug?" element={<VehicleDetailPage />} />
        <Route path="/emi-calculator" element={<EMICalculatorPage />} />
        <Route path="/fuel-calculator" element={<FuelCalculatorPage />} />
        <Route path="/upcoming" element={<UpcomingLaunchesPage />} />
        <Route path="/dealers" element={<DealerLocatorPage />} />
        <Route path="/test-ride" element={<TestRideBookingPage />} />
        <Route path="/used" element={<UsedVehiclesPage />} />
        <Route path="/sell" element={<SellVehiclePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<UserDashboardPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        {/* Keep /compare here so direct URL works as a full page */}
        <Route path="/compare" element={<ComparisonPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Overlay route: only renders when opened with background state */}
      {state?.background && (
        <Routes>
          <Route path="/compare" element={<ComparisonPage />} />
        </Routes>
      )}
    </>
  );
}

const App = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ComparisonProvider>
          <BrowserRouter>
            {/* 🔔 Global alert handler */}
            <AlertPopup />

            {/* 🌐 Main App Container */}
            <div className="relative min-h-screen bg-background text-foreground">
              {/* Render the new inner routes */}
              <AppRoutes />

              {/* 🔄 Floating Action Buttons */}
              <ComparisonButton />

              <ChatbotWidget /> 
              
            </div>
            

            {/* ⚙️ Global UI utilities */}
            <Toaster />
            <Sonner
              position="top-right"
              offset={80}     // pushes it below navbar
              richColors
              closeButton
            />

          </BrowserRouter>
        </ComparisonProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
