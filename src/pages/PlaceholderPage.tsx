import { useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Construction } from "lucide-react";

export default function PlaceholderPage() {
  const location = useLocation();
  const title = location.pathname
    .split("/")
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " "))
    .join(" › ") || "Página";

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
          <Construction className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-heading font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground max-w-md">
          Esta página está em construção. Em breve ela estará disponível com todas as funcionalidades.
        </p>
      </div>
    </DashboardLayout>
  );
}
