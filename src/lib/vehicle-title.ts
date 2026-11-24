export function vehicleTitle(vehicle: {
  year: number;
  make: string;
  model: string;
  trim?: string | null;
}) {
  return [vehicle.year, vehicle.make, vehicle.model, vehicle.trim].filter(Boolean).join(" ");
}
