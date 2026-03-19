import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column, ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const initial = [
  { id: "1", name: "Salário Base", type: "Provento", fixed: true, percent: 0, active: true },
  { id: "2", name: "Vale Transporte", type: "Desconto", fixed: false, percent: 6, active: true },
  { id: "3", name: "INSS", type: "Desconto", fixed: false, percent: 8, active: true },
  { id: "4", name: "Hora Extra", type: "Provento", fixed: false, percent: 50, active: true },
];

export default function EventosFolhaPage() {
  const [data, setData] = useState(initial);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", type: "Provento", fixed: true, percent: 0, active: true });

  const columns: Column[] = [
    { key: "name", label: "Nome", sortable: true },
    { key: "type", label: "Tipo", render: (v) => <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${v === "Provento" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>{v}</span> },
    { key: "fixed", label: "Valor Fixo", render: (v) => v ? "Sim" : "Não" },
    { key: "percent", label: "Percentual", render: (v, r) => r.fixed ? "—" : `${v}%` },
    { key: "active", label: "Ativo", render: (v) => v ? "Sim" : "Não" },
  ];

  const actions: ActionConfig[] = [
    { label: "Editar", onClick: (r) => { setEditing(r); setForm(r); setModal(true); } },
  ];

  const handleSave = () => {
    if (!form.name) { toast.error("Preencha o nome."); return; }
    if (editing) { setData(data.map(d => d.id === editing.id ? { ...d, ...form } : d)); toast.success("Evento atualizado!"); }
    else { setData([...data, { id: String(Date.now()), ...form }]); toast.success("Evento criado!"); }
    setModal(false); setEditing(null);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Financeiro" }, { label: "Eventos da Folha" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Eventos da Folha</h1><p className="text-sm text-muted-foreground">{data.length} eventos.</p></div>
          <button onClick={() => { setEditing(null); setForm({ name: "", type: "Provento", fixed: true, percent: 0, active: true }); setModal(true); }} className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Novo Evento</button>
        </div>
        <DataTable columns={columns} data={data} actions={actions} />
      </div>
      <FormModal open={modal} onClose={() => { setModal(false); setEditing(null); }} title={editing ? "Editar Evento" : "Novo Evento"} onSave={handleSave}>
        <div className="space-y-4">
          <div><Label>Nome *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
          <div><Label>Tipo</Label><Select value={form.type} onValueChange={v => setForm({ ...form, type: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Provento">Provento</SelectItem><SelectItem value="Desconto">Desconto</SelectItem></SelectContent></Select></div>
          <div className="flex items-center gap-2"><Switch checked={form.fixed} onCheckedChange={v => setForm({ ...form, fixed: v })} /><Label>Valor Fixo</Label></div>
          {!form.fixed && <div><Label>Percentual (%)</Label><Input type="number" value={form.percent} onChange={e => setForm({ ...form, percent: Number(e.target.value) })} /></div>}
          <div className="flex items-center gap-2"><Switch checked={form.active} onCheckedChange={v => setForm({ ...form, active: v })} /><Label>Ativo</Label></div>
        </div>
      </FormModal>
    </DashboardLayout>
  );
}
