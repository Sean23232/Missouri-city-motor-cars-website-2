import { db } from "@/db";
import { vehicles } from "@/db/schema";

const initialVehicles = [
  {
    slug: "2019-toyota-corolla-le",
    year: 2019,
    make: "Toyota",
    model: "Corolla",
    trim: "LE",
    body: "4D Sedan",
    vin: "5YFBURHE5KP882017",
  },
  {
    slug: "2020-toyota-tundra-sr5",
    year: 2020,
    make: "Toyota",
    model: "Tundra",
    trim: "SR5",
    configuration: "4WD V8 Crew Cab",
    engine: "5.7L",
    vin: "5TFDY5F18LX914371",
  },
  {
    slug: "2023-toyota-tacoma-trd-sport",
    year: 2023,
    make: "Toyota",
    model: "Tacoma",
    trim: "TRD Sport",
    configuration: "4WD V6 Double Cab",
    engine: "3.5L",
    vin: "3TMCZ5AN3РM558443",
  },
  {
    slug: "2012-honda-civic-lx",
    year: 2012,
    make: "Honda",
    model: "Civic",
    trim: "LX",
    body: "2D Coupe",
    vin: "2HGFG3B56CH548540",
  },
  {
    slug: "2021-toyota-corolla-le",
    year: 2021,
    make: "Toyota",
    model: "Corolla",
    trim: "LE",
    body: "4D Sedan",
    vin: "5YFEPMAEXMP231664",
  },
  {
    slug: "2022-chevrolet-silverado-1500-ltd-custom",
    year: 2022,
    make: "Chevrolet",
    model: "Silverado 1500 LTD",
    trim: "Custom",
    configuration: "2WD 4C Crew Cab",
    engine: "2.7L",
    vin: "3GCPWBEKXNG166158",
  },
];

export async function seedInitialInventory() {
  await db.insert(vehicles).values(initialVehicles).onConflictDoNothing({ target: vehicles.vin });
}
