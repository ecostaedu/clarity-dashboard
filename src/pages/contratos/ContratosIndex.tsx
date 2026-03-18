import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { FileText, PenTool, LayoutTemplate, Handshake, ClipboardCheck, CalendarClock } from "lucide-react";

const sections = [
  { title: "Contrato Estágio", desc: "Contratos de estágio", icon: FileText, route: "/contratos/estagio" },
  { title: "Assinaturas Digitais", desc: "Acompanhar assinaturas", icon: PenTool, route: "/contratos/assinaturas" },
  { title: "Modelos", desc: "Templates de contrato", icon: LayoutTemplate, route: "/contratos/modelos" },
  { title: "Parceria / Convênio", desc: "Contratos de parceria", icon: Handshake, route: "/contratos/parceria" },
  { title: "Documentos Obrigatórios", desc: "Documentação necessária", icon: ClipboardCheck, route: "/contratos/documentos-obrigatorios" },
  { title: "Follow Up", desc: "Acompanhamento de ações", icon: CalendarClock, route: "/contratos/follow-up" },
];

export default function ContratosIndex() {
  const navigate = useNavigate();
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Contratos" }]}>
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-foreground tracking-tight">Contratos</h1><p className="text-sm text-muted-foreground mt-1">Gerencie contratos, assinaturas e modelos.</p></div>
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
