import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Missouri City Motor Cars | Quality Pre-Owned Vehicles",
    template: "%s | Missouri City Motor Cars",
  },
  description:
    "Explore the current selection of pre-owned cars, trucks, and SUVs at Missouri City Motor Cars. Browse vehicle details and contact the dealership directly.",
  applicationName: "Missouri City Motor Cars",
  openGraph: {
    title: "Missouri City Motor Cars | Quality Pre-Owned Vehicles",
    description: "Browse available pre-owned vehicles and contact Missouri City Motor Cars directly.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
