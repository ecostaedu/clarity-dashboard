import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Save } from "lucide-react";

const initialAlerts = [
  { id: "1", nome: "Vencimento de Contrato", tipo: "Estágio", dias: 30, ativo: true },
  { id: "2", nome: "Renovação Pendente", tipo: "Estágio", dias: 15, ativo: true },
  { id: "3", nome: "Fim do Período de Experiência", tipo: "Estágio", dias: 7, ativo: false },
  { id: "4", nome: "Relatório de Atividades Pendente", tipo: "Estágio", dias: 5, ativo: true },
  { id: "5", nome: "Vencimento Contrato JA", tipo: "JA", dias: 30, ativo: true },
  { id: "6", nome: "Avaliação Semestral JA", tipo: "JA", dias: 15, ativo: true },
];

export default function AlertasEstagioPage() {
  const [alerts, setAlerts] = useState(initialAlerts);

  const update = (id: string, field: string, value: any) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Gestão de Estágio" }, { label: "Alertas" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Parametrização de Alertas</h1><p className="text-sm text-muted-foreground mt-1">Configure os alertas do sistema.</p></div>
          <Button onClick={() => toast.success("Alterações salvas com sucesso")}><Save className="h-4 w-4 mr-2" />Salvar Alterações</Button>
        </div>
        <div className="rounded-xl bg-card shadow-card overflow-hidden">
          <table className="w-full">
            <thead><tr className="bg-muted/40">
              <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Nome do Alerta</th>
              <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Tipo</th>
              <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Dias Antes</th>
              <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Ativo</th>
            </tr></thead>
            <tbody>
              {alerts.map((a) => (
                <tr key={a.id} className="h-12 border-t border-border/50">
                  <td className="px-4 text-sm text-foreground">{a.nome}</td>
                  <td className="px-4"><Badge variant="outline">{a.tipo}</Badge></td>
                  <td className="px-4"><Input type="number" className="h-8 w-20" value={a.dias} onChange={(e) => update(a.id, "dias", Number(e.target.value))} /></td>
                  <td className="px-4"><Switch checked={a.ativo} onCheckedChange={(v) => update(a.id, "ativo", v)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
