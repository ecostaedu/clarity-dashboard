import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { FileText, Users, Clipboard, Stethoscope } from "lucide-react";

const sections = [
  { title: "Modelos de Atendimento", desc: "Templates com variáveis", icon: FileText, route: "/social-psicologa/modelos" },
  { title: "Jovens Aprendizes", desc: "Acompanhamento social", icon: Users, route: "/social-psicologa/jovens-aprendizes" },
  { title: "Tipos de Atendimento", desc: "Configurar tipos", icon: Clipboard, route: "/social-psicologa/tipos-atendimento" },
  { title: "Atendimentos", desc: "Registro de atendimentos", icon: Stethoscope, route: "/social-psicologa/atendimentos" },
];

export default function SocialIndex() {
  const navigate = useNavigate();
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Social / Psicóloga" }]}>
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-foreground tracking-tight">Social / Psicóloga</h1><p className="text-sm text-muted-foreground mt-1">Acompanhamento social e psicológico.</p></div>
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
