import { Search, Bell, Moon, Sun, ChevronRight, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopNavbarProps {
  breadcrumbs?: { label: string; href?: string }[];
}

export function TopNavbar({ breadcrumbs = [{ label: "Home" }, { label: "Dashboard" }] }: TopNavbarProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const { profile, signOut, roles } = useAuth();

  const initials = profile?.name
    ? profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-8 shrink-0">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1 text-sm">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
            <span className={i === breadcrumbs.length - 1 ? "text-foreground font-medium" : "text-muted-foreground"}>
              {crumb.label}
            </span>
          </span>
        ))}
      </nav>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Pesquisar..."
            className="h-9 w-64 pl-9 pr-4 rounded-lg bg-background border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-150"
          />
        </div>

        {/* Theme toggle */}
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
          {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="h-9 w-9 relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
        </Button>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center ml-1 cursor-pointer hover:bg-primary/20 transition-colors">
              <span className="text-xs font-semibold text-primary">{initials}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-foreground">{profile?.name ?? "Usuário"}</p>
              <p className="text-xs text-muted-foreground">{profile?.email}</p>
              {roles.length > 0 && (
                <p className="text-xs text-primary mt-1 capitalize">{roles.join(", ").replace(/_/g, " ")}</p>
              )}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4 mr-2" /> Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
