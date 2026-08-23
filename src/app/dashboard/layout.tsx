import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { AuthProvider } from "../context/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50/50 flex">
      <AuthProvider>
        {/* Sidebar Desktop */}
        <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50">
          <Sidebar />
        </div>

        {/* Main Content Wrapper */}
        <div className="md:pl-64 flex flex-col flex-1 min-h-screen">
          <Topbar />
          <main className="flex-1 p-6 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>
      </AuthProvider>
    </div>
  );
}
