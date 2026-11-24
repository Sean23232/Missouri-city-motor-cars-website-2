"use client";

import { useMemo, useState } from "react";
import { VehicleCard } from "@/components/VehicleCard";
import { vehicleTitle } from "@/lib/vehicle-title";
import type { getInventory } from "@/lib/inventory";

type VehicleListing = Awaited<ReturnType<typeof getInventory>>[number];

export function InventoryBrowser({ vehicles }: { vehicles: VehicleListing[] }) {
  const [query, setQuery] = useState("");
  const [makeFilter, setMakeFilter] = useState("All makes");
  const makes = useMemo(() => Array.from(new Set(vehicles.map((vehicle) => vehicle.make))).sort(), [vehicles]);
  const filteredVehicles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return vehicles.filter((vehicle) => {
      const matchesMake = makeFilter === "All makes" || vehicle.make === makeFilter;
      const searchText = [vehicleTitle(vehicle), vehicle.body, vehicle.configuration, vehicle.engine, vehicle.vin]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return matchesMake && (!normalizedQuery || searchText.includes(normalizedQuery));
    });
  }, [makeFilter, query, vehicles]);

  return (
    <>
      <div className="inventory-controls">
        <div className="inventory-filter-row" aria-label="Filter inventory by make">
          {["All makes", ...makes].map((make) => (
            <button
              key={make}
              type="button"
              className={`filter-chip${makeFilter === make ? " filter-chip-active" : ""}`}
              onClick={() => setMakeFilter(make)}
              aria-pressed={makeFilter === make}
            >
              {make}
            </button>
          ))}
        </div>
        <label className="inventory-search">
          <span className="search-icon" aria-hidden="true">⌕</span>
          <span className="sr-only">Search inventory</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="search"
            placeholder="Search by vehicle or VIN"
          />
          <span className="search-shortcut" aria-hidden="true">⌕</span>
        </label>
      </div>
      {filteredVehicles.length > 0 ? (
        <div className="vehicle-grid">
          {filteredVehicles.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}
        </div>
      ) : (
        <div className="inventory-empty-state">
          <span className="empty-state-mark" aria-hidden="true">⌕</span>
          <h3>No vehicles match that search</h3>
          <p>Try another make, model, or VIN.</p>
          <button type="button" className="text-button" onClick={() => { setQuery(""); setMakeFilter("All makes"); }}>Clear filters</button>
        </div>
      )}
      <p className="inventory-results-note">Showing {filteredVehicles.length} of {vehicles.length} available {vehicles.length === 1 ? "vehicle" : "vehicles"}</p>
    </>
  );
}
