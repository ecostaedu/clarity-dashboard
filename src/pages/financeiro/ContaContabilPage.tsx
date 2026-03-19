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
  { id: "1", code: "1.1.01", description: "Receita de Serviços", type: "Receita", active: true },
  { id: "2", code: "2.1.01", description: "Despesa com Pessoal", type: "Despesa", active: true },
  { id: "3", code: "1.2.01", description: "Receita Financeira", type: "Receita", active: true },
];

export default function ContaContabilPage() {
  const [data, setData] = useState(initial);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ code: "", description: "", type: "Receita", active: true });

  const columns: Column[] = [
    { key: "code", label: "Código", sortable: true },
    { key: "description", label: "Descrição", sortable: true },
    { key: "type", label: "Tipo", render: (v) => <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${v === "Receita" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>{v}</span> },
    { key: "active", label: "Ativo", render: (v) => v ? "Sim" : "Não" },
  ];

  const actions: ActionConfig[] = [
    { label: "Editar", onClick: (r) => { setEditing(r); setForm({ code: r.code, description: r.description, type: r.type, active: r.active }); setModal(true); } },
  ];

  const handleSave = () => {
    if (!form.code || !form.description) { toast.error("Preencha os campos obrigatórios."); return; }
    if (editing) { setData(data.map(d => d.id === editing.id ? { ...d, ...form } : d)); toast.success("Conta atualizada!"); }
    else { setData([...data, { id: String(Date.now()), ...form }]); toast.success("Conta criada!"); }
    setModal(false); setEditing(null);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Financeiro" }, { label: "Conta Contábil" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Conta Contábil</h1><p className="text-sm text-muted-foreground">{data.length} contas.</p></div>
          <button onClick={() => { setEditing(null); setForm({ code: "", description: "", type: "Receita", active: true }); setModal(true); }} className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Nova Conta</button>
        </div>
        <DataTable columns={columns} data={data} actions={actions} />
      </div>
      <FormModal open={modal} onClose={() => { setModal(false); setEditing(null); }} title={editing ? "Editar Conta" : "Nova Conta"} onSave={handleSave}>
        <div className="space-y-4">
          <div><Label>Código *</Label><Input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} /></div>
          <div><Label>Descrição *</Label><Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
          <div><Label>Tipo</Label><Select value={form.type} onValueChange={v => setForm({ ...form, type: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Receita">Receita</SelectItem><SelectItem value="Despesa">Despesa</SelectItem></SelectContent></Select></div>
          <div className="flex items-center gap-2"><Switch checked={form.active} onCheckedChange={v => setForm({ ...form, active: v })} /><Label>Ativo</Label></div>
        </div>
      </FormModal>
    </DashboardLayout>
  );
}
