import { useState } from "react";
import { useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  GraduationCap,
  BookOpen,
  DollarSign,
  BarChart3,
  Headphones,
  UserCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  HardDrive,
  Hexagon } from
"lucide-react";
import { cn } from "@/lib/utils";

const mainNav = [
{ title: "Dashboard", url: "/", icon: LayoutDashboard },
{ title: "Cadastros", url: "/cadastros", icon: Users },
{ title: "Recrutamento", url: "/recrutamento", icon: Briefcase },
{ title: "Contratos", url: "/contratos", icon: FileText },
{ title: "Gestão de Estágio", url: "/estagios", icon: GraduationCap },
{ title: "Jovem Aprendiz", url: "/jovem-aprendiz", icon: BookOpen }];


const secondaryNav = [
{ title: "Financeiro", url: "/financeiro", icon: DollarSign },
{ title: "Relatórios", url: "/relatorios", icon: BarChart3 },
{ title: "Chamados", url: "/chamados", icon: Headphones },
{ title: "CRM", url: "/crm", icon: UserCircle }];


const bottomNav = [
{ title: "Configurações", url: "/configuracoes", icon: Settings }];


export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const NavItem = ({ item }: {item: typeof mainNav[0];}) =>
  <NavLink
    to={item.url}
    end={item.url === "/"}
    className={cn(
      "flex items-center gap-3 h-9 px-3 rounded-lg text-sm font-medium transition-all duration-150 ease-smooth relative group",
      "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
      collapsed && "justify-center px-0"
    )}
    activeClassName="bg-sidebar-accent text-sidebar-foreground font-semibold">
    
      {isActive(item.url) &&
    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full" />
    }
      <item.icon className={cn("h-4 w-4 shrink-0", collapsed ? "ml-0" : "ml-1")} />
      {!collapsed && <span>{item.title}</span>}
    </NavLink>;


  return (
    <aside
      className={cn(
        "h-screen flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-250 ease-smooth shrink-0 relative",
        collapsed ? "w-16" : "w-[260px]"
      )}>
      
      {/* Logo */}
      <div className={cn("h-16 flex items-center px-4 gap-3 border-b border-sidebar-border", collapsed && "justify-center px-2")}>
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Hexagon className="h-4 w-4 text-primary-foreground" />
        </div>
        {!collapsed && <span className="font-semibold text-sidebar-foreground tracking-tight">ApexRH</span>}
      </div>

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <div className="space-y-1">
          {!collapsed && <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground px-3 mb-2">Principal</p>}
          {mainNav.map((item) =>
          <NavItem key={item.url} item={item} />
          )}
        </div>

        <div className="pt-4 space-y-1">
          {!collapsed && <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground px-3 mb-2">Operações</p>}
          {secondaryNav.map((item) =>
          <NavItem key={item.url} item={item} />
          )}
        </div>
      </nav>

      {/* Storage indicator */}
      {!collapsed &&
      <div className="px-4 pb-2">
          <div className="p-3 rounded-xl bg-sidebar-accent">
            <div className="flex items-center gap-2 mb-2">
              <HardDrive className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-sidebar-foreground">Armazenamento</span>
            </div>
            <div className="h-1.5 bg-border rounded-full overflow-hidden">
              <div className="h-full w-[65%] bg-primary rounded-full" />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5">6.5 GB de 10 GB</p>
          </div>
        </div>
      }

      {/* Bottom nav */}
      <div className="border-t border-sidebar-border px-3 py-3 space-y-1">
        {bottomNav.map((item) =>
        <NavItem key={item.url} item={item} />
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-border bg-card shadow-card flex items-center justify-center hover:shadow-card-hover transition-shadow duration-150">
        
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </aside>);

}