import { useState } from "react";
import { useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard,
  Home,
  Users,
  Briefcase,
  Search,
  FileText,
  GraduationCap,
  BookOpen,
  DollarSign,
  BarChart3,
  Headphones,
  Settings,
  ChevronLeft,
  ChevronRight,
  FileBarChart,
  Receipt,
  Heart,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuSections = [
  {
    label: "Início",
    items: [
      { title: "Home", url: "/home", icon: Home },
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Gestão",
    items: [
      { title: "Cadastros", url: "/cadastros", icon: Users },
      { title: "Vagas", url: "/vagas", icon: Briefcase },
      { title: "Recrutamento", url: "/recrutamento", icon: Search },
      { title: "Contratos", url: "/contratos", icon: FileText },
      { title: "Gestão de Estágio", url: "/gestao-estagio", icon: GraduationCap },
      { title: "Jovem Aprendiz", url: "/jovem-aprendiz", icon: BookOpen },
    ],
  },
  {
    label: "Financeiro",
    items: [
      { title: "Financeiro", url: "/financeiro", icon: DollarSign },
      { title: "Rel. Financeiros", url: "/relatorios-financeiros", icon: BarChart3 },
      { title: "NFS-e", url: "/nfse", icon: Receipt },
    ],
  },
  {
    label: "Relatórios",
    items: [
      { title: "Rel. Jovem Aprendiz", url: "/relatorios-jovem-aprendiz", icon: FileBarChart },
      { title: "Social / Psicóloga", url: "/social-psicologa", icon: Heart },
    ],
  },
  {
    label: "Sistema",
    items: [
      { title: "Configurações", url: "/configuracoes", icon: Settings },
      { title: "Outros", url: "/outros", icon: MoreHorizontal },
    ],
  },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/home") return location.pathname === "/home" || location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const NavItem = ({ item }: { item: { title: string; url: string; icon: any } }) => (
    <NavLink
      to={item.url}
      end={item.url === "/home"}
      className={cn(
        "flex items-center gap-3 h-9 px-3 rounded-lg text-sm font-medium transition-all duration-150 ease-smooth relative group",
        "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
        collapsed && "justify-center px-0"
      )}
      activeClassName="bg-sidebar-accent text-sidebar-foreground font-semibold"
    >
      {isActive(item.url) && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-sidebar-foreground rounded-r-full" />
      )}
      <item.icon className={cn("h-4 w-4 shrink-0", collapsed ? "ml-0" : "ml-1")} />
      {!collapsed && <span>{item.title}</span>}
    </NavLink>
  );

  return (
    <aside
      className={cn(
        "h-screen flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-250 ease-smooth shrink-0 relative",
        collapsed ? "w-16" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className={cn("h-16 flex items-center px-4 gap-3 border-b border-sidebar-border", collapsed && "justify-center px-2")}>
        <div className="h-9 w-9 rounded-xl bg-sidebar-foreground/20 flex items-center justify-center shrink-0">
          <span className="text-sidebar-foreground font-heading font-bold text-sm">LR</span>
        </div>
        {!collapsed && <span className="font-heading font-bold text-sidebar-foreground tracking-tight text-lg">LideraRH</span>}
      </div>

      {/* Nav sections */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
        {menuSections.map((section) => (
          <div key={section.label} className="space-y-1">
            {!collapsed && (
              <p className="text-[10px] uppercase tracking-widest font-semibold text-sidebar-foreground/50 px-3 mb-1">
                {section.label}
              </p>
            )}
            {section.items.map((item) => (
              <NavItem key={item.url} item={item} />
            ))}
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-border bg-card shadow-card flex items-center justify-center hover:shadow-card-hover transition-shadow duration-150"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </aside>
  );
}
