import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column, ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const initial = [
  { id: "1", name: "Transferência Bancária", description: "TED/DOC/PIX", active: true },
  { id: "2", name: "Boleto", description: "Boleto bancário", active: true },
  { id: "3", name: "Cartão de Crédito", description: "Visa/Master", active: false },
];

export default function TipoPagamentoPage() {
  const [data, setData] = useState(initial);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", description: "", active: true });

  const columns: Column[] = [
    { key: "name", label: "Nome", sortable: true },
    { key: "description", label: "Descrição" },
    { key: "active", label: "Ativo", render: (v) => v ? "Sim" : "Não" },
  ];

  const actions: ActionConfig[] = [
    { label: "Editar", onClick: (r) => { setEditing(r); setForm(r); setModal(true); } },
  ];

  const handleSave = () => {
    if (!form.name) { toast.error("Preencha o nome."); return; }
    if (editing) { setData(data.map(d => d.id === editing.id ? { ...d, ...form } : d)); toast.success("Tipo atualizado!"); }
    else { setData([...data, { id: String(Date.now()), ...form }]); toast.success("Tipo criado!"); }
    setModal(false); setEditing(null);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Financeiro" }, { label: "Tipo de Pagamento" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Tipo de Pagamento</h1><p className="text-sm text-muted-foreground">{data.length} tipos.</p></div>
          <button onClick={() => { setEditing(null); setForm({ name: "", description: "", active: true }); setModal(true); }} className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Novo Tipo</button>
        </div>
        <DataTable columns={columns} data={data} actions={actions} />
      </div>
      <FormModal open={modal} onClose={() => { setModal(false); setEditing(null); }} title={editing ? "Editar Tipo" : "Novo Tipo"} onSave={handleSave}>
        <div className="space-y-4">
          <div><Label>Nome *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
          <div><Label>Descrição</Label><Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
          <div className="flex items-center gap-2"><Switch checked={form.active} onCheckedChange={v => setForm({ ...form, active: v })} /><Label>Ativo</Label></div>
        </div>
      </FormModal>
    </DashboardLayout>
  );
}
