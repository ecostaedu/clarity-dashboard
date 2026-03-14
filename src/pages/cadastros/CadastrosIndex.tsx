import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { Building2, Users, GraduationCap, UserCog, BookOpen } from "lucide-react";

const sections = [
  { title: "Empresas", desc: "Gerencie empresas clientes", icon: Building2, route: "/companies", count: 5 },
  { title: "Candidatos", desc: "Base de candidatos", icon: Users, route: "/candidates", count: 5 },
  { title: "Instituições de Ensino", desc: "Instituições parceiras", icon: GraduationCap, route: "/institutions", count: 3 },
  { title: "Usuários", desc: "Usuários do sistema", icon: UserCog, route: "/users", count: 4 },
  { title: "Educadores", desc: "Educadores e instrutores", icon: BookOpen, route: "/educators", count: 3 },
];

export default function CadastrosIndex() {
  const navigate = useNavigate();
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Cadastros" }]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Cadastros</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie todos os cadastros do sistema.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((s) => (
            <button
              key={s.title}
              onClick={() => navigate(s.route)}
              className="p-6 rounded-xl bg-card shadow-card hover:shadow-card-hover transition-all duration-150 text-left group"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{s.count} registros</p>
            </button>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
