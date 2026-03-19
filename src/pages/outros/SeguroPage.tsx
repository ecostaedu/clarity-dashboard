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
  { id: "1", seguradora: "Porto Seguro", tipo: "Vida", inicio: "01/01/2024", termino: "31/12/2024", valor: 350, status: "Vigente" },
  { id: "2", seguradora: "SulAmérica", tipo: "Saúde", inicio: "01/03/2024", termino: "28/02/2025", valor: 890, status: "Vigente" },
  { id: "3", seguradora: "Bradesco Seguros", tipo: "Patrimonial", inicio: "01/01/2023", termino: "31/12/2023", valor: 1200, status: "Vencido" },
];

const statusBadge = (v: string) => {
  const c = v === "Vigente" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : v === "Vencido" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-muted text-muted-foreground";
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${c}`}>{v}</span>;
};

export default function SeguroPage() {
  const [data, setData] = useState(initial);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [confirm, setConfirm] = useState<any>(null);
  const [renewModal, setRenewModal] = useState<any>(null);
  const [form, setForm] = useState({ seguradora: "", tipo: "Vida", inicio: "", termino: "", valor: 0 });
  const [newDate, setNewDate] = useState("");

  const columns: Column[] = [
    { key: "seguradora", label: "Seguradora", sortable: true },
    { key: "tipo", label: "Tipo" },
    { key: "inicio", label: "Início" },
    { key: "termino", label: "Término" },
    { key: "valor", label: "Valor Mensal", render: (v) => `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` },
    { key: "status", label: "Status", render: statusBadge },
  ];

  const filters: FilterConfig[] = [
    { key: "seguradora", label: "Seguradora", type: "text" },
    { key: "tipo", label: "Tipo", type: "select", options: [{ label: "Vida", value: "Vida" }, { label: "Saúde", value: "Saúde" }, { label: "Patrimonial", value: "Patrimonial" }] },
    { key: "status", label: "Status", type: "select", options: [{ label: "Vigente", value: "Vigente" }, { label: "Vencido", value: "Vencido" }, { label: "Encerrado", value: "Encerrado" }] },
  ];

  const actions: ActionConfig[] = [
    { label: "Editar", onClick: (r) => { setEditing(r); setForm({ seguradora: r.seguradora, tipo: r.tipo, inicio: r.inicio, termino: r.termino, valor: r.valor }); setModal(true); } },
    { label: "Renovar", onClick: (r) => { setRenewModal(r); setNewDate(""); } },
    { label: "Encerrar", variant: "destructive", onClick: (r) => setConfirm(r) },
  ];

  const handleSave = () => {
    if (!form.seguradora) { toast.error("Preencha os campos obrigatórios."); return; }
    if (editing) { setData(data.map(d => d.id === editing.id ? { ...d, ...form } : d)); toast.success("Seguro atualizado!"); }
    else { setData([...data, { id: String(Date.now()), ...form, status: "Vigente" }]); toast.success("Seguro criado!"); }
    setModal(false); setEditing(null);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Outros" }, { label: "Seguro" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Seguro</h1><p className="text-sm text-muted-foreground">{data.length} seguros.</p></div>
          <button onClick={() => { setEditing(null); setForm({ seguradora: "", tipo: "Vida", inicio: "", termino: "", valor: 0 }); setModal(true); }} className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Novo Seguro</button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>
      <FormModal open={modal} onClose={() => { setModal(false); setEditing(null); }} title={editing ? "Editar Seguro" : "Novo Seguro"} onSave={handleSave}>
        <div className="space-y-4">
          <div><Label>Seguradora *</Label><Input value={form.seguradora} onChange={e => setForm({ ...form, seguradora: e.target.value })} /></div>
          <div><Label>Tipo</Label><Select value={form.tipo} onValueChange={v => setForm({ ...form, tipo: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Vida">Vida</SelectItem><SelectItem value="Saúde">Saúde</SelectItem><SelectItem value="Patrimonial">Patrimonial</SelectItem></SelectContent></Select></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Data Início</Label><Input type="date" value={form.inicio} onChange={e => setForm({ ...form, inicio: e.target.value })} /></div>
            <div><Label>Data Término</Label><Input type="date" value={form.termino} onChange={e => setForm({ ...form, termino: e.target.value })} /></div>
          </div>
          <div><Label>Valor Mensal (R$)</Label><Input type="number" value={form.valor} onChange={e => setForm({ ...form, valor: Number(e.target.value) })} /></div>
        </div>
      </FormModal>
      <FormModal open={!!renewModal} onClose={() => setRenewModal(null)} title="Renovar Seguro" onSave={() => { setData(data.map(d => d.id === renewModal.id ? { ...d, termino: newDate, status: "Vigente" } : d)); toast.success("Seguro renovado!"); setRenewModal(null); }}>
        <div><Label>Nova Data de Término</Label><Input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} /></div>
      </FormModal>
      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => { setData(data.map(d => d.id === confirm.id ? { ...d, status: "Encerrado" } : d)); toast.success("Seguro encerrado."); setConfirm(null); }} title="Encerrar Seguro" description="Deseja encerrar este seguro?" />
    </DashboardLayout>
  );
}
