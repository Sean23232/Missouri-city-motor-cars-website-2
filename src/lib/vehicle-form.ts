import { randomBytes } from "node:crypto";

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const maximumImageBytes = 8 * 1024 * 1024;
const maximumImages = 12;

export type VehicleFormValues = {
  year: number;
  make: string;
  model: string;
  trim: string;
  body: string | null;
  configuration: string | null;
  engine: string | null;
  vin: string;
  price: number | null;
  mileage: number | null;
  status: "available" | "sold";
};

export type UploadedImage = {
  fileName: string;
  mimeType: string;
  data: string;
};

function textField(form: FormData, name: string) {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function optionalInteger(value: string, label: string) {
  if (!value) return null;
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 0) {
    throw new Error(`${label} must be a whole number greater than or equal to zero.`);
  }
  return parsed;
}

export function parseVehicleFields(form: FormData): VehicleFormValues {
  const yearText = textField(form, "year");
  const year = Number(yearText);
  const make = textField(form, "make");
  const model = textField(form, "model");
  const trim = textField(form, "trim");
  const vin = textField(form, "vin");
  const statusValue = textField(form, "status") || "available";

  if (!Number.isSafeInteger(year) || year < 1886 || year > new Date().getFullYear() + 2) {
    throw new Error("Enter a valid vehicle year.");
  }
  if (!make || make.length > 80) throw new Error("Enter a make, such as Toyota.");
  if (!model || model.length > 120) throw new Error("Enter a vehicle model.");
  if (trim.length > 120) throw new Error("Trim must be 120 characters or fewer.");
  if (!vin || vin.length > 32) throw new Error("Enter the VIN exactly as supplied.");
  if (statusValue !== "available" && statusValue !== "sold") {
    throw new Error("Choose whether this vehicle is available or sold.");
  }

  return {
    year,
    make,
    model,
    trim,
    body: textField(form, "body") || null,
    configuration: textField(form, "configuration") || null,
    engine: textField(form, "engine") || null,
    vin,
    price: optionalInteger(textField(form, "price"), "Price"),
    mileage: optionalInteger(textField(form, "mileage"), "Mileage"),
    status: statusValue,
  };
}

export async function parseVehicleImages(form: FormData): Promise<UploadedImage[]> {
  const files = form.getAll("photos").filter((entry): entry is File => entry instanceof File && entry.size > 0);
  if (files.length > maximumImages) throw new Error(`Upload up to ${maximumImages} photos at a time.`);

  const images: UploadedImage[] = [];
  for (const file of files) {
    if (!allowedImageTypes.has(file.type)) {
      throw new Error("Use JPG, PNG, WebP, or AVIF image files.");
    }
    if (file.size > maximumImageBytes) {
      throw new Error("Each photo must be 8 MB or smaller.");
    }
    const fileName = file.name.replace(/[^a-z0-9._-]/gi, "-").slice(0, 120) || "vehicle-photo";
    const bytes = Buffer.from(await file.arrayBuffer());
    images.push({ fileName, mimeType: file.type, data: bytes.toString("base64") });
  }
  return images;
}

export function makeVehicleSlug(values: Pick<VehicleFormValues, "year" | "make" | "model" | "trim">) {
  const base = [values.year, values.make, values.model, values.trim]
    .filter(Boolean)
    .join("-")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${base}-${randomBytes(3).toString("hex")}`;
}
