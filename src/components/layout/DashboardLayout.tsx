import { ReactNode } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { TopNavbar } from "@/components/TopNavbar";
import { ThemeProvider } from "@/components/ThemeProvider";

interface DashboardLayoutProps {
  children: ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

export function DashboardLayout({ children, breadcrumbs }: DashboardLayoutProps) {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <TopNavbar breadcrumbs={breadcrumbs} />
          <main className="flex-1 overflow-y-auto p-8">
            <div className="max-w-[1440px] mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
