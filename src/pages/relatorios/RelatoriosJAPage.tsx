import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { FileText, Download } from "lucide-react";

const reports = [
  { id: "1", name: "Frequência por Turma", desc: "Relatório de presença e faltas por turma e período", params: ["turma", "periodo"] },
  { id: "2", name: "Contratos por Empresa", desc: "Lista de contratos ativos agrupados por empresa parceira", params: ["empresa", "periodo"] },
  { id: "3", name: "Ocorrências por Aprendiz", desc: "Histórico de ocorrências por jovem aprendiz", params: ["aprendiz", "tipo"] },
  { id: "4", name: "Folha de Pagamento Consolidada", desc: "Resumo consolidado da folha de pagamento", params: ["competencia"] },
  { id: "5", name: "Aprendizes por Status", desc: "Distribuição de aprendizes por status atual", params: ["status"] },
];

export default function RelatoriosJAPage() {
  const [selected, setSelected] = useState<typeof reports[0] | null>(null);

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Relatórios Jovem Aprendiz" }]}>
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-foreground">Relatórios Jovem Aprendiz</h1><p className="text-sm text-muted-foreground">{reports.length} relatórios disponíveis.</p></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map(r => (
            <button key={r.id} onClick={() => setSelected(r)} className="p-5 rounded-xl bg-card shadow-card hover:shadow-card-hover transition-all text-left group">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><FileText className="h-5 w-5 text-primary" /></div>
                <div><p className="text-sm font-semibold text-foreground">{r.name}</p><p className="text-xs text-muted-foreground mt-1">{r.desc}</p></div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{selected?.name}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            {selected?.params.includes("turma") && <div><Label>Turma</Label><Select><SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger><SelectContent><SelectItem value="all">Todas</SelectItem><SelectItem value="T1">Turma 1</SelectItem><SelectItem value="T2">Turma 2</SelectItem></SelectContent></Select></div>}
            {selected?.params.includes("empresa") && <div><Label>Empresa</Label><Select><SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger><SelectContent><SelectItem value="all">Todas</SelectItem><SelectItem value="TechSol">TechSol</SelectItem></SelectContent></Select></div>}
            {selected?.params.includes("aprendiz") && <div><Label>Aprendiz</Label><Select><SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger><SelectContent><SelectItem value="all">Todos</SelectItem><SelectItem value="João">João Silva</SelectItem></SelectContent></Select></div>}
            {selected?.params.includes("periodo") && <div className="grid grid-cols-2 gap-2"><div><Label>Data Início</Label><Input type="date" /></div><div><Label>Data Fim</Label><Input type="date" /></div></div>}
            {selected?.params.includes("competencia") && <div><Label>Competência</Label><Input placeholder="MM/AAAA" /></div>}
            {selected?.params.includes("status") && <div><Label>Status</Label><Select><SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger><SelectContent><SelectItem value="all">Todos</SelectItem><SelectItem value="active">Ativo</SelectItem><SelectItem value="inactive">Inativo</SelectItem></SelectContent></Select></div>}
            {selected?.params.includes("tipo") && <div><Label>Tipo</Label><Select><SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger><SelectContent><SelectItem value="all">Todos</SelectItem><SelectItem value="Falta">Falta</SelectItem><SelectItem value="Advertência">Advertência</SelectItem></SelectContent></Select></div>}
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => toast.success("Excel exportado!")}><Download className="h-4 w-4 mr-1" />Exportar Excel</Button>
            <Button onClick={() => toast.success("PDF exportado!")}><Download className="h-4 w-4 mr-1" />Exportar PDF</Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
