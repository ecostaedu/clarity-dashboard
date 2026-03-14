import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { Briefcase, ClipboardList, FileCheck } from "lucide-react";

const sections = [
  { title: "Vagas", desc: "Vagas abertas e encerradas", icon: Briefcase, route: "/jobs", count: 5 },
  { title: "Processos Seletivos", desc: "Gerencie processos de seleção", icon: ClipboardList, route: "/processes", count: 3 },
  { title: "Testes", desc: "Banco de testes e avaliações", icon: FileCheck, route: "/tests", count: 3 },
];

export default function RecrutamentoIndex() {
  const navigate = useNavigate();
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Recrutamento" }]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Recrutamento</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie vagas, processos seletivos e testes.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((s) => (
            <button key={s.title} onClick={() => navigate(s.route)} className="p-6 rounded-xl bg-card shadow-card hover:shadow-card-hover transition-all duration-150 text-left group">
              <div className="flex items-center gap-4 mb-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors"><s.icon className="h-5 w-5 text-primary" /></div>
                <div><p className="text-sm font-semibold text-foreground">{s.title}</p><p className="text-xs text-muted-foreground">{s.desc}</p></div>
              </div>
              <p className="text-xs text-muted-foreground">{s.count} registros</p>
            </button>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
