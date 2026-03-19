import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column, FilterConfig, ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const initial = [
  { id: "1", competencia: "03/2024", tipo: "Mensal", data_calculo: "28/03/2024", status: "Processado" },
  { id: "2", competencia: "02/2024", tipo: "Mensal", data_calculo: "28/02/2024", status: "Processado" },
  { id: "3", competencia: "01/2024", tipo: "Rescisão", data_calculo: "15/01/2024", status: "Em Aberto" },
];

const statusBadge = (v: string) => <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${v === "Processado" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}`}>{v}</span>;

export default function CalculoFolhaPage() {
  const [data, setData] = useState(initial);
  const [modal, setModal] = useState(false);
  const [confirm, setConfirm] = useState<{ row: any; action: string } | null>(null);
  const [form, setForm] = useState({ competencia: "", tipo: "Mensal" });
  const [processing, setProcessing] = useState(false);

  const columns: Column[] = [
    { key: "competencia", label: "Competência", sortable: true },
    { key: "tipo", label: "Tipo" },
    { key: "data_calculo", label: "Data Cálculo" },
    { key: "status", label: "Status", render: statusBadge },
  ];

  const filters: FilterConfig[] = [{ key: "competencia", label: "Competência", type: "text" }];

  const actions: ActionConfig[] = [
    { label: "Exportar PDF", onClick: () => toast.success("PDF exportado!") },
    { label: "Reabrir", onClick: (r) => setConfirm({ row: r, action: "reabrir" }) },
    { label: "Estornar", variant: "destructive", onClick: (r) => setConfirm({ row: r, action: "estornar" }) },
  ];

  const handleProcess = () => {
    if (!form.competencia) { toast.error("Informe a competência."); return; }
    setProcessing(true);
    setTimeout(() => {
      setData([{ id: String(Date.now()), competencia: form.competencia, tipo: form.tipo, data_calculo: new Date().toLocaleDateString("pt-BR"), status: "Processado" }, ...data]);
      toast.success("Folha processada com sucesso!");
      setProcessing(false); setModal(false);
    }, 1500);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Financeiro" }, { label: "Cálculo da Folha" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Cálculo da Folha</h1><p className="text-sm text-muted-foreground">{data.length} folhas.</p></div>
          <button onClick={() => { setForm({ competencia: "", tipo: "Mensal" }); setModal(true); }} className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Nova Folha</button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>
      <FormModal open={modal} onClose={() => setModal(false)} title="Processar Folha" onSave={handleProcess} saving={processing}>
        <div className="space-y-4">
          <div><Label>Competência (MM/AAAA) *</Label><Input placeholder="03/2024" value={form.competencia} onChange={e => setForm({ ...form, competencia: e.target.value })} /></div>
          <div><Label>Tipo</Label><Select value={form.tipo} onValueChange={v => setForm({ ...form, tipo: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Mensal">Mensal</SelectItem><SelectItem value="Rescisão">Rescisão</SelectItem><SelectItem value="Férias">Férias</SelectItem></SelectContent></Select></div>
        </div>
      </FormModal>
      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => {
        if (confirm?.action === "reabrir") { setData(data.map(d => d.id === confirm.row.id ? { ...d, status: "Em Aberto" } : d)); toast.success("Folha reaberta."); }
        else { setData(data.filter(d => d.id !== confirm?.row.id)); toast.success("Folha estornada."); }
        setConfirm(null);
      }} title={confirm?.action === "reabrir" ? "Reabrir Folha" : "Estornar Cálculo"} description={`Confirma ${confirm?.action === "reabrir" ? "reabertura" : "estorno"} da folha ${confirm?.row?.competencia}?`} />
    </DashboardLayout>
  );
}
