import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column, FilterConfig, ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Eye, ClipboardList, Plus } from "lucide-react";

const statusColor: Record<string, string> = { Pendente: "bg-amber-100 text-amber-700", Concluído: "bg-emerald-100 text-emerald-700", Atrasado: "bg-destructive/10 text-destructive" };

const mockData = [
  { id: "1", contrato: "EST-001 (Estágio)", proxima_acao: "Renovar contrato", data_acao: "15/04/2024", responsavel: "Carlos Silva", status: "Pendente" },
  { id: "2", contrato: "JA-003 (Jovem Aprendiz)", proxima_acao: "Avaliar desempenho", data_acao: "01/03/2024", responsavel: "Ana Maria", status: "Atrasado" },
  { id: "3", contrato: "EST-002 (Estágio)", proxima_acao: "Colher assinatura", data_acao: "20/03/2024", responsavel: "Roberto Lima", status: "Concluído" },
  { id: "4", contrato: "PARC-001 (Parceria)", proxima_acao: "Enviar relatório", data_acao: "30/04/2024", responsavel: "Carlos Silva", status: "Pendente" },
];

const emptyForm = { contrato: "", proxima_acao: "", data_acao: "", responsavel: "", status: "Pendente" };

export default function FollowUpPage() {
  const [data, setData] = useState(mockData);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [viewItem, setViewItem] = useState<any>(null);

  const set = (k: string, v: string) => setForm({ ...form, [k]: v });

  const columns: Column[] = [
    { key: "contrato", label: "Contrato", sortable: true },
    { key: "proxima_acao", label: "Próxima Ação" },
    { key: "data_acao", label: "Data", sortable: true },
    { key: "responsavel", label: "Responsável", sortable: true },
    { key: "status", label: "Status", render: (v) => <Badge className={statusColor[v] || ""}>{v}</Badge> },
  ];

  const filters: FilterConfig[] = [
    { key: "contrato", label: "Contrato", type: "text" },
    { key: "responsavel", label: "Responsável", type: "text" },
    { key: "status", label: "Status", type: "select", options: [{ label: "Pendente", value: "Pendente" }, { label: "Concluído", value: "Concluído" }, { label: "Atrasado", value: "Atrasado" }] },
  ];

  const actions: ActionConfig[] = [
    { label: "Ver Contrato", icon: <Eye className="h-4 w-4" />, onClick: (r) => setViewItem(r) },
    { label: "Registrar Ação", icon: <ClipboardList className="h-4 w-4" />, onClick: (r) => { setForm({ ...emptyForm, contrato: r.contrato }); setModalOpen(true); } },
  ];

  const handleSave = () => {
    if (!form.proxima_acao) { toast.error("Informe a próxima ação"); return; }
    setData([...data, { ...form, id: String(data.length + 1) }]);
    toast.success("Ação registrada");
    setModalOpen(false); setForm(emptyForm);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Contratos" }, { label: "Follow Up" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Follow Up de Contratos</h1><p className="text-sm text-muted-foreground mt-1">{data.length} ações.</p></div>
          <button onClick={() => { setForm(emptyForm); setModalOpen(true); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"><Plus className="h-4 w-4" />Registrar Ação</button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title="Registrar Ação" onSave={handleSave}>
        <div className="space-y-4">
          <div><Label>Contrato</Label><Input value={form.contrato} onChange={(e) => set("contrato", e.target.value)} /></div>
          <div><Label>Próxima Ação *</Label><Input value={form.proxima_acao} onChange={(e) => set("proxima_acao", e.target.value)} /></div>
          <div><Label>Data</Label><Input type="date" value={form.data_acao} onChange={(e) => set("data_acao", e.target.value)} /></div>
          <div><Label>Responsável</Label><Select value={form.responsavel} onValueChange={(v) => set("responsavel", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{["Carlos Silva","Ana Maria","Roberto Lima"].map(e=><SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Status</Label><Select value={form.status} onValueChange={(v) => set("status", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Pendente">Pendente</SelectItem><SelectItem value="Concluído">Concluído</SelectItem><SelectItem value="Atrasado">Atrasado</SelectItem></SelectContent></Select></div>
        </div>
      </FormModal>

      {viewItem && <FormModal open title="Detalhes" onClose={() => setViewItem(null)} onSave={() => setViewItem(null)}>
        <div className="grid grid-cols-2 gap-3 text-sm">{Object.entries(viewItem).filter(([k]) => k !== "id").map(([k, v]) => <div key={k}><span className="text-muted-foreground capitalize">{k.replace(/_/g, " ")}</span><p className="font-medium">{String(v)}</p></div>)}</div>
      </FormModal>}
    </DashboardLayout>
  );
}
