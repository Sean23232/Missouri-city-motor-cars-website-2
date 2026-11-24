import type { Metadata } from "next";
import AdminDashboard from "@/app/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Owner Inventory Portal | Missouri City Motor Cars",
  description: "Manage dealership inventory and customer messages.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
