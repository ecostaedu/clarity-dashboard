import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { Clock, FileText, BookOpen, CalendarDays, Umbrella, AlertTriangle } from "lucide-react";

const sections = [
  { title: "Programas", desc: "Programas de aprendizagem", icon: BookOpen, route: "/programs" },
  { title: "Turmas", desc: "Turmas e horários", icon: CalendarDays, route: "/classes" },
  { title: "Ocorrências", desc: "Registros de ocorrências", icon: AlertTriangle, route: "/occurrences" },
  { title: "Feriados", desc: "Calendário de feriados", icon: CalendarDays, route: "/holidays" },
  { title: "Férias", desc: "Períodos de férias", icon: Umbrella, route: "/vacations" },
];

export default function JovemAprendizIndex() {
  const navigate = useNavigate();
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Jovem Aprendiz" }]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Jovem Aprendiz</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie programas de jovem aprendiz.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
