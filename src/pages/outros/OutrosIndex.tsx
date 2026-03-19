import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { Shield, Upload, Headphones, Users } from "lucide-react";

const sections = [
  { title: "Seguro", desc: "Gestão de seguros", icon: Shield, route: "/outros/seguro" },
  { title: "Importações", desc: "Importar dados CSV/XLSX", icon: Upload, route: "/outros/importacoes" },
  { title: "Chamados", desc: "Suporte e solicitações", icon: Headphones, route: "/outros/chamados" },
  { title: "CRM", desc: "Pipeline de vendas", icon: Users, route: "/outros/crm" },
];

export default function OutrosIndex() {
  const navigate = useNavigate();
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Outros" }]}>
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-foreground tracking-tight">Outros</h1><p className="text-sm text-muted-foreground mt-1">Módulos complementares do sistema.</p></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sections.map((s) => (
            <button key={s.title} onClick={() => navigate(s.route)} className="p-6 rounded-xl bg-card shadow-card hover:shadow-card-hover transition-all duration-150 text-left group">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors"><s.icon className="h-5 w-5 text-primary" /></div>
                <div><p className="text-sm font-semibold text-foreground">{s.title}</p><p className="text-xs text-muted-foreground">{s.desc}</p></div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
