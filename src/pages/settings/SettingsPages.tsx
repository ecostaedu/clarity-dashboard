import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { CrudListPage, ColumnDef } from "@/components/crud/CrudListPage";
import { Save, Bell, Shield, Palette } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// === ALERT SETTINGS ===
export function AlertSettingsPage() {
  const [alerts, setAlerts] = useState({
    contracts_expiring: true,
    payroll_generated: true,
    vacancies_opened: false,
  });

  const toggleAlert = (key: string) => {
    setAlerts((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const items = [
    { key: "contracts_expiring", label: "Contratos vencendo", desc: "Notificar quando contratos estiverem próximos do vencimento" },
    { key: "payroll_generated", label: "Folha de pagamento gerada", desc: "Notificar quando a folha for processada" },
    { key: "vacancies_opened", label: "Vagas abertas", desc: "Notificar quando novas vagas forem publicadas" },
  ];

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Configurações" }, { label: "Alertas" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Configuração de Alertas</h1>
            <p className="text-sm text-muted-foreground mt-1">Gerencie suas notificações.</p>
          </div>
          <Button className="gap-2" onClick={() => toast.success("Alertas salvos")}><Save className="h-4 w-4" /> Salvar</Button>
        </div>

        <div className="rounded-xl bg-card shadow-card divide-y divide-border">
          {items.map((item) => (
            <div key={item.key} className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
              <div
                className={cn("relative h-6 w-11 rounded-full transition-colors duration-150 cursor-pointer", alerts[item.key as keyof typeof alerts] ? "bg-primary" : "bg-border")}
                onClick={() => toggleAlert(item.key)}
              >
                <span className={cn("absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-card shadow-soft transition-transform duration-150", alerts[item.key as keyof typeof alerts] && "translate-x-5")} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

// === ROLES AND PERMISSIONS ===
const roleColumns: ColumnDef[] = [
  { key: "role", label: "Perfil", sortable: true },
  { key: "permissions", label: "Permissões" },
];

const roleData = [
  { id: "1", role: "Admin", permissions: "Acesso total ao sistema" },
  { id: "2", role: "Gestor RH", permissions: "Cadastros, Recrutamento, Contratos, Relatórios" },
  { id: "3", role: "Usuário Empresa", permissions: "Visualizar processos, Candidatos" },
  { id: "4", role: "Educador", permissions: "Frequência, Relatórios de atividades" },
];

export function RolesSettingsPage() {
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Configurações" }, { label: "Perfis e Permissões" }]}>
      <CrudListPage title="Perfis e Permissões" subtitle="Gerencie os perfis de acesso do sistema." columns={roleColumns} data={roleData} baseRoute="/settings/roles" />
    </DashboardLayout>
  );
}

// === SYSTEM PERSONALIZATION ===
export function SystemSettingsPage() {
  const [settings, setSettings] = useState({
    system_name: "ConnectRH",
    primary_color: "#6B46C1",
    logo: "",
  });

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Configurações" }, { label: "Sistema" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Personalização do Sistema</h1>
            <p className="text-sm text-muted-foreground mt-1">Configure a identidade visual do sistema.</p>
          </div>
          <Button className="gap-2" onClick={() => toast.success("Configurações salvas")}><Save className="h-4 w-4" /> Salvar</Button>
        </div>

        <div className="rounded-xl bg-card shadow-card p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Nome do Sistema</label>
              <input
                type="text"
                value={settings.system_name}
                onChange={(e) => setSettings((s) => ({ ...s, system_name: e.target.value }))}
                className="h-10 w-full px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-150"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Cor Primária</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={settings.primary_color}
                  onChange={(e) => setSettings((s) => ({ ...s, primary_color: e.target.value }))}
                  className="h-10 w-10 rounded-lg border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.primary_color}
                  onChange={(e) => setSettings((s) => ({ ...s, primary_color: e.target.value }))}
                  className="h-10 flex-1 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-150"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-1.5">Logo</label>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Palette className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Arraste uma imagem ou clique para selecionar</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, SVG até 2MB</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
