import React, { useMemo, useState, useMemo as _useMemo } from "react";
import { useComparison } from "@/contexts/ComparisonContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeftRight, EyeOff, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Vehicle } from "@/types";

const toNumber = (val: any, fallback = 0) => {
  if (val === null || val === undefined) return fallback;
  if (typeof val === "number" && isFinite(val)) return val;
  const n = Number(String(val).replace(/[\s,₹]/g, ""));
  return isFinite(n) ? n : fallback;
};

export const formatINR = (value: any): string => {
  if (value === null || value === undefined || value === "") return "—";
  const n = toNumber(value, NaN);
  if (!isFinite(n)) return String(value);
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `₹${Math.round(n).toLocaleString("en-IN")}`;
  }
};

const getMileageUnit = (fuelType?: string) =>
  fuelType?.toLowerCase() === "electric" ? "km" : "km/l";

// determine if a spec row has identical values across all vehicles
const computeDiffMap = (rows: Array<Array<string | number | undefined>>) => {
  // returns boolean[] sameAsFirst for each column: if all equal => true, else false
  if (!rows.length) return [] as boolean[];
  const cols = rows[0].length;
  const allSame: boolean[] = new Array(cols).fill(true);
  // We want to know: is this *row* uniform across all columns?
  const rowUniform = rows.every((row) => row.every((v) => `${v}`.trim() === `${row[0]}`.trim()));
  return rowUniform ? rows[0].map(() => true) : rows[0].map(() => false);
};

const areAllEqual = (vals: any[]) => vals.every((v) => `${v}`.trim() === `${vals[0]}`.trim());

const MAX_ITEMS = 5;

const ComparisonPage: React.FC = () => {
  const { comparisonList, removeFromComparison, clearComparison } = useComparison();
  const navigate = useNavigate();

  // Controls
  const [sortBy, setSortBy] = useState<"none" | "priceLow" | "priceHigh" | "mileage">("none");
  const [showDiffOnly, setShowDiffOnly] = useState(false);

  const vehicles = useMemo(() => (comparisonList || []).slice(0, MAX_ITEMS), [comparisonList]);

  // Sorting (safe)
  const sortedVehicles = useMemo(() => {
    const list = [...vehicles];
    switch (sortBy) {
      case "priceLow":
        return list.sort((a, b) => toNumber(a?.price?.onRoad) - toNumber(b?.price?.onRoad));
      case "priceHigh":
        return list.sort((a, b) => toNumber(b?.price?.onRoad) - toNumber(a?.price?.onRoad));
      case "mileage":
        return list.sort(
          (a, b) => toNumber(b?.specifications?.mileage) - toNumber(a?.specifications?.mileage)
        );
      default:
        return list;
    }
  }, [vehicles, sortBy]);

  if (!comparisonList || comparisonList.length === 0) {
    return (
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
        className="fixed top-0 right-0 h-full w-full sm:w-[70%] lg:w-[50%] bg-background/95 backdrop-blur-lg shadow-2xl z-[99999] flex flex-col items-center justify-center text-center p-6"
      >
        <h2 className="text-2xl font-semibold mb-3 text-foreground">No vehicles in comparison</h2>
        <p className="text-muted-foreground mb-6">Add vehicles from the listing or detail pages to compare their specs.</p>
        <Button onClick={() => navigate("/vehicles")}>Browse Vehicles</Button>
      </motion.div>
    );
  }

  // Spec rows we want to show (Flipkart-like key facts first, then details)
  type Row = {
    key: string;
    label: string;
    formatter?: (v: any, vehicle?: Vehicle) => React.ReactNode;
  };

  const rows: Row[] = [
    { key: "price.onRoad", label: "On-road Price", formatter: (v) => formatINR(v) },
    { key: "specifications.mileage", label: "Mileage", formatter: (v, veh) => `${toNumber(v, 0)} ${getMileageUnit(veh?.specifications?.fuelType)}` },
    { key: "specifications.fuelType", label: "Fuel Type" },
    { key: "specifications.transmission", label: "Transmission" },
    { key: "category", label: "Category" },
    { key: "year", label: "Model Year" },
    { key: "specifications.engine", label: "Engine" },
    { key: "specifications.power", label: "Power" },
    { key: "specifications.torque", label: "Torque" },
    { key: "price.exShowroom", label: "Ex-showroom", formatter: (v) => formatINR(v) },
  ];

  const getVal = (obj: any, path: string) =>
    path.split(".").reduce((acc: any, part) => (acc ? acc[part] : undefined), obj);

  const colCount = Math.max(sortedVehicles.length, 1);
  const placeholdersNeeded = Math.max(0, MAX_ITEMS - sortedVehicles.length);

  // For difference highlighting, compute for each row whether all values are equal.
  const rowEqualityMap = rows.map((row) => {
    const vals = sortedVehicles.map((v) => getVal(v, row.key));
    return areAllEqual(vals);
  });

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[99998]"
        onClick={() => navigate(-1)}
      />

      {/* Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
        className="fixed top-0 right-0 h-full w-full sm:w-[90%] lg:w-[80%] bg-background/95 backdrop-blur-xl shadow-2xl z-[99999] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="sticky top-0 bg-background border-b flex items-center justify-between px-4 py-3 z-10">
          <div className="flex items-center gap-3">
            <h1 className="text-lg sm:text-xl font-bold text-foreground">Compare Vehicles ({sortedVehicles.length}/{MAX_ITEMS})</h1>
            <div className="hidden md:flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border rounded-md px-2 py-1 bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100"
              >
                <option value="none">Sort</option>
                <option value="priceLow">Price: Low → High</option>
                <option value="priceHigh">Price: High → Low</option>
                <option value="mileage">Mileage: High → Low</option>
              </select>
              <Button variant="outline" size="sm" onClick={() => setShowDiffOnly((s) => !s)} className="gap-2">
                {showDiffOnly ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                {showDiffOnly ? "Show all" : "Show differences"}
              </Button>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={clearComparison}>Clear All</Button>
            <Button variant="secondary" onClick={() => navigate(-1)}>Close</Button>
          </div>
        </div>

        {/* Columns header (product cards) */}
        <div className="border-b bg-muted/20 overflow-x-auto">
          <div className="min-w-[720px] grid" style={{ gridTemplateColumns: `220px repeat(${MAX_ITEMS}, minmax(220px, 1fr))` }}>
            {/* Left sticky feature title cell */}
            <div className="sticky left-0 bg-muted/30 border-r px-3 py-3 font-semibold text-sm flex items-center">Products</div>

            {sortedVehicles.map((vehicle) => (
              <div key={vehicle.id} className="px-3 py-3 relative">
                <button
                  onClick={() => removeFromComparison(vehicle.id)}
                  className="absolute top-2 right-2 text-muted-foreground hover:text-red-600"
                  aria-label={`Remove ${vehicle.name}`}
                >
                  <X className="w-4 h-4" />
                </button>
                <Card className="p-3 shadow-sm bg-white/90 dark:bg-gray-900/90">
                  {vehicle?.images?.[0] && (
                    <img
                      src={vehicle.images[0]}
                      alt={vehicle?.name || "Vehicle image"}
                      className="w-full h-28 object-cover rounded-md mb-2"
                    />
                  )}
                  <div className="text-sm font-semibold truncate" title={vehicle?.name}>{vehicle?.name || "Unnamed Vehicle"}</div>
                  <div className="text-xs text-muted-foreground truncate" title={vehicle?.brand}>{vehicle?.brand || "—"}</div>
                  <div className="text-primary font-semibold mt-1 text-sm">{formatINR(vehicle?.price?.onRoad)}</div>
                </Card>
              </div>
            ))}

            {/* Placeholder columns to add more */}
            {Array.from({ length: placeholdersNeeded }).map((_, i) => (
              <div key={`placeholder-${i}`} className="px-3 py-3">
                <Card className="p-4 h-full flex items-center justify-center bg-white/70 dark:bg-gray-900/70">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Add another vehicle</p>
                    <Button size="sm" onClick={() => navigate("/vehicles")}>Browse</Button>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Spec matrix */}
        <div className="flex-1 overflow-auto">
          <div className="min-w-[720px] grid" style={{ gridTemplateColumns: `220px repeat(${MAX_ITEMS}, minmax(220px, 1fr))` }}>
            {rows.map((row, rowIdx) => {
              const vals = sortedVehicles.map((v) => getVal(v, row.key));
              const allEqual = areAllEqual(vals);
              if (showDiffOnly && allEqual) return null;

              return (
                <React.Fragment key={row.key}>
                  {/* Left sticky spec name */}
                  <div className="sticky left-0 bg-background border-t border-r px-3 py-3 text-sm text-muted-foreground flex items-center">
                    {row.label}
                  </div>

                  {/* Columns for this spec */}
                  {sortedVehicles.map((vehicle, colIdx) => {
                    const rawVal = getVal(vehicle, row.key);
                    const display = row.formatter ? row.formatter(rawVal, vehicle) : (rawVal ?? "—");
                    const differs = !allEqual;
                    return (
                      <div
                        key={`${row.key}-${vehicle.id}`}
                        className={`border-t px-3 py-3 text-sm ${
                          differs ? "bg-amber-50/40 dark:bg-amber-900/10" : "text-muted-foreground"
                        }`}
                        title={typeof display === "string" ? display : undefined}
                      >
                        {display}
                      </div>
                    );
                  })}

                  {/* Fill placeholders for spec cells */}
                  {Array.from({ length: placeholdersNeeded }).map((_, i) => (
                    <div key={`${row.key}-ph-${i}`} className="border-t px-3 py-3 text-sm text-muted-foreground/70">—</div>
                  ))}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Bottom action bar (mobile friendly)
        <div className="sticky bottom-0 border-t bg-background px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border rounded-md px-2 py-1 bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100"
            >
              <option value="none">Sort</option>
              <option value="priceLow">Price: Low → High</option>
              <option value="priceHigh">Price: High → Low</option>
              <option value="mileage">Mileage: High → Low</option>
            </select>
            <Button variant="outline" size="sm" onClick={() => setShowDiffOnly((s) => !s)} className="gap-2">
              {showDiffOnly ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              {showDiffOnly ? "Show all" : "Show differences"}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={clearComparison}>Clear All</Button>
            <Button onClick={() => navigate("/vehicles")}>Add Vehicles</Button>
          </div>
        </div> */}
      </motion.div>
    </AnimatePresence>
  );
};

export default ComparisonPage;

// ---------------- Lightweight tests (dev only) ----------------
if (typeof process !== "undefined" && process.env && process.env.NODE_ENV !== "production") {
  try {
    const p0 = formatINR(0);
    const p1 = formatINR(123456);
    const p2 = formatINR(null);
    if (!/^₹\s?0$/.test(p0) && !/^₹0$/.test(p0)) console.warn("formatINR zero failed");
    if (!/₹\s?1,23,456/.test(p1) && !/₹\s?123,456/.test(p1)) console.warn("formatINR lakh grouping env variance");
    if (p2 !== "—") console.warn("formatINR null should be em dash");
  } catch (e) {
    console.warn("dev tests crashed", e);
  }
}