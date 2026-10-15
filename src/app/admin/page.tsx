import type { Metadata } from "next";
import AdminPanel from "@/components/admin/AdminPanel";

export const metadata: Metadata = {
  title: "Owner Console",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminPanel />;
}
