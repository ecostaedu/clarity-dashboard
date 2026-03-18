import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { BookOpen, CalendarDays, Umbrella, AlertTriangle, LayoutTemplate, DoorOpen, Users, FileText, PenTool, Clock, Calendar, Receipt, CreditCard, HelpCircle, ClipboardList, BarChart3, Layers, GraduationCap } from "lucide-react";

const sections = [
  { title: "Modelos JA", desc: "Templates de documentos JA", icon: LayoutTemplate, route: "/jovem-aprendiz/modelos" },
  { title: "Salas", desc: "Cadastro de salas", icon: DoorOpen, route: "/jovem-aprendiz/salas" },
  { title: "Programas", desc: "Programas de aprendizagem", icon: BookOpen, route: "/jovem-aprendiz/programas" },
  { title: "Planejamento de Turmas", desc: "Turmas e horários", icon: CalendarDays, route: "/jovem-aprendiz/planejamento-turmas" },
  { title: "Contrato JA", desc: "Contratos Jovem Aprendiz", icon: FileText, route: "/jovem-aprendiz/contrato-ja" },
  { title: "Contrato Pré-Aprendizagem", desc: "Contratos pré-aprendizagem", icon: FileText, route: "/jovem-aprendiz/contrato-pre-ja" },
  { title: "Assinaturas Digitais", desc: "Assinaturas de documentos JA", icon: PenTool, route: "/jovem-aprendiz/assinaturas" },
  { title: "Ocorrências", desc: "Registros de ocorrências", icon: AlertTriangle, route: "/jovem-aprendiz/ocorrencias" },
  { title: "Frequência", desc: "Lista de frequência", icon: Clock, route: "/jovem-aprendiz/frequencia" },
  { title: "Feriados", desc: "Calendário de feriados", icon: Calendar, route: "/jovem-aprendiz/feriados" },
  { title: "Férias", desc: "Períodos de férias", icon: Umbrella, route: "/jovem-aprendiz/ferias" },
  { title: "Gerar Folha", desc: "Processamento de folha", icon: Receipt, route: "/jovem-aprendiz/gerar-folha" },
  { title: "Faturas", desc: "Faturas JA", icon: CreditCard, route: "/jovem-aprendiz/faturas" },
  { title: "Recibo de Pagamento", desc: "Recibos de pagamento", icon: CreditCard, route: "/jovem-aprendiz/recibo-pagamento" },
  { title: "Perguntas Sócio Econômicas", desc: "Questionário socioeconômico", icon: HelpCircle, route: "/jovem-aprendiz/perguntas-socio-economicas" },
  { title: "Registro Social", desc: "Acompanhamento social", icon: ClipboardList, route: "/jovem-aprendiz/registro-social" },
  { title: "Cronogramas", desc: "Cronogramas de programas", icon: BarChart3, route: "/jovem-aprendiz/cronogramas" },
  { title: "Tipos de Módulos", desc: "Configuração de módulos", icon: Layers, route: "/jovem-aprendiz/tipos-modulos" },
  { title: "Tipos de Curso", desc: "Configuração de cursos", icon: GraduationCap, route: "/jovem-aprendiz/tipos-curso" },
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
