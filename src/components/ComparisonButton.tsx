import React from "react";
import { useComparison } from "@/contexts/ComparisonContext";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const ComparisonButton: React.FC = () => {
  const { comparisonList } = useComparison();
  const navigate = useNavigate();
  const location = useLocation();

// Conditions to hide the button
const isHome = location.pathname === "/";
const isComparePage = location.pathname === "/compare";
const isVehiclesPage = location.pathname.startsWith("/vehicles");

// If on compare page → hide always
if (isComparePage) return null;

// If on homepage → hide only when no items
if (isHome && comparisonList.length === 0) return null;

// If not on vehicles pages or home → hide
if (!isVehiclesPage && !isHome) return null;




  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="fixed bottom-6 right-6 z-[99999]"
      >
        <Button
          onClick={() => navigate("/compare")}
          className="flex items-center gap-1.5 rounded-full shadow-lg px-3 py-2 bg-primary hover:bg-primary/90 text-white text-sm"
        >
          <ArrowRightLeft className="w-4 h-4" />
          Compare
          {comparisonList.length > 0 && (
            <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
              {comparisonList.length}
            </span>
          )}
        </Button>
      </motion.div>
    </AnimatePresence>
  );
};

export default ComparisonButton;
