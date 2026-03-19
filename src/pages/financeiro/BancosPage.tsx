import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column, FilterConfig, ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const initial = [
  { id: "1", name: "Banco do Brasil", code: "001", active: true },
  { id: "2", name: "Bradesco", code: "237", active: true },
  { id: "3", name: "Itaú Unibanco", code: "341", active: true },
  { id: "4", name: "Caixa Econômica Federal", code: "104", active: true },
  { id: "5", name: "Santander", code: "033", active: false },
];

export default function BancosPage() {
  const [data, setData] = useState(initial);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [confirm, setConfirm] = useState<any>(null);
  const [form, setForm] = useState({ name: "", code: "", active: true });

  const columns: Column[] = [
    { key: "name", label: "Nome do Banco", sortable: true },
    { key: "code", label: "Código", sortable: true },
    { key: "active", label: "Ativo", render: (v) => <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${v ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>{v ? "Sim" : "Não"}</span> },
  ];

  const filters: FilterConfig[] = [
    { key: "name", label: "Nome", type: "text" },
    { key: "code", label: "Código", type: "text" },
  ];

  const actions: ActionConfig[] = [
    { label: "Editar", onClick: (r) => { setEditing(r); setForm({ name: r.name, code: r.code, active: r.active }); setModal(true); } },
    { label: "Inativar", variant: "destructive", onClick: (r) => setConfirm(r) },
  ];

  const handleSave = () => {
    if (!form.name || !form.code) { toast.error("Preencha todos os campos obrigatórios."); return; }
    if (editing) {
      setData(data.map(d => d.id === editing.id ? { ...d, ...form } : d));
      toast.success("Banco atualizado com sucesso!");
    } else {
      setData([...data, { id: String(Date.now()), ...form }]);
      toast.success("Banco criado com sucesso!");
    }
    setModal(false); setEditing(null); setForm({ name: "", code: "", active: true });
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Financeiro" }, { label: "Bancos" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Bancos</h1><p className="text-sm text-muted-foreground">{data.length} bancos cadastrados.</p></div>
          <button onClick={() => { setEditing(null); setForm({ name: "", code: "", active: true }); setModal(true); }} className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Novo Banco</button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>
      <FormModal open={modal} onClose={() => { setModal(false); setEditing(null); }} title={editing ? "Editar Banco" : "Novo Banco"} onSave={handleSave}>
        <div className="space-y-4">
          <div><Label>Nome do Banco *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
          <div><Label>Código *</Label><Input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} /></div>
          <div className="flex items-center gap-2"><Switch checked={form.active} onCheckedChange={v => setForm({ ...form, active: v })} /><Label>Ativo</Label></div>
        </div>
      </FormModal>
      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => { setData(data.map(d => d.id === confirm.id ? { ...d, active: false } : d)); toast.success("Banco inativado."); setConfirm(null); }} title="Inativar Banco" description={`Deseja inativar "${confirm?.name}"?`} />
    </DashboardLayout>
  );
}
