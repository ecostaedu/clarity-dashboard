import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { Clock, Umbrella, FileText, Bell } from "lucide-react";

const sections = [
  { title: "Ateste de Frequência", desc: "Controle de presença", icon: Clock, route: "/gestao-estagio/frequencia" },
  { title: "Relatório de Recesso", desc: "Períodos de recesso", icon: Umbrella, route: "/gestao-estagio/recesso" },
  { title: "Relatório de Atividades", desc: "Atividades do estágio", icon: FileText, route: "/gestao-estagio/atividades" },
  { title: "Alertas", desc: "Parametrização de alertas", icon: Bell, route: "/gestao-estagio/alertas" },
];

export default function GestaoEstagioIndex() {
  const navigate = useNavigate();
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Gestão de Estágio" }]}>
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-foreground tracking-tight">Gestão de Estágio</h1><p className="text-sm text-muted-foreground mt-1">Controle frequência, recesso e atividades.</p></div>
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
