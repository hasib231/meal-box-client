import ClientDashboardLayout from "@/components/dashboardComponents/ClientDashboardLayout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientDashboardLayout>{children}</ClientDashboardLayout>;
}
