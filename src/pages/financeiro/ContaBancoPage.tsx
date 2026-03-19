import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column, FilterConfig, ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { maskCnpj, maskCpf } from "@/lib/masks";
import { toast } from "sonner";

const initial = [
  { id: "1", banco: "Banco do Brasil", agencia: "1234-5", conta: "1234567-8", tipo: "Corrente", titular: "LideraRH LTDA", doc: "12.345.678/0001-90", active: true },
  { id: "2", banco: "Itaú", agencia: "0001-9", conta: "9876543-2", tipo: "Poupança", titular: "Maria Silva", doc: "123.456.789-00", active: true },
];

export default function ContaBancoPage() {
  const [data, setData] = useState(initial);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [isCnpj, setIsCnpj] = useState(true);
  const [form, setForm] = useState({ banco: "", agencia: "", conta: "", tipo: "Corrente", titular: "", doc: "", active: true });

  const columns: Column[] = [
    { key: "banco", label: "Banco", sortable: true },
    { key: "agencia", label: "Agência" },
    { key: "conta", label: "Conta" },
    { key: "tipo", label: "Tipo" },
    { key: "titular", label: "Titular", sortable: true },
    { key: "active", label: "Ativo", render: (v) => v ? "Sim" : "Não" },
  ];

  const filters: FilterConfig[] = [
    { key: "banco", label: "Banco", type: "text" },
    { key: "titular", label: "Titular", type: "text" },
  ];

  const actions: ActionConfig[] = [
    { label: "Editar", onClick: (r) => { setEditing(r); setForm({ banco: r.banco, agencia: r.agencia, conta: r.conta, tipo: r.tipo, titular: r.titular, doc: r.doc, active: r.active }); setModal(true); } },
  ];

  const handleSave = () => {
    if (!form.banco || !form.agencia || !form.conta || !form.titular) { toast.error("Preencha os campos obrigatórios."); return; }
    if (editing) { setData(data.map(d => d.id === editing.id ? { ...d, ...form } : d)); toast.success("Conta atualizada!"); }
    else { setData([...data, { id: String(Date.now()), ...form }]); toast.success("Conta criada!"); }
    setModal(false); setEditing(null);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Financeiro" }, { label: "Conta Banco Personalizada" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Conta Banco Personalizada</h1><p className="text-sm text-muted-foreground">{data.length} contas.</p></div>
          <button onClick={() => { setEditing(null); setForm({ banco: "", agencia: "", conta: "", tipo: "Corrente", titular: "", doc: "", active: true }); setModal(true); }} className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Nova Conta</button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>
      <FormModal open={modal} onClose={() => { setModal(false); setEditing(null); }} title={editing ? "Editar Conta" : "Nova Conta"} onSave={handleSave}>
        <div className="space-y-4">
          <div><Label>Banco *</Label><Select value={form.banco} onValueChange={v => setForm({ ...form, banco: v })}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="Banco do Brasil">Banco do Brasil</SelectItem><SelectItem value="Bradesco">Bradesco</SelectItem><SelectItem value="Itaú">Itaú</SelectItem><SelectItem value="Caixa">Caixa</SelectItem><SelectItem value="Santander">Santander</SelectItem></SelectContent></Select></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Agência *</Label><Input placeholder="XXXX-X" value={form.agencia} onChange={e => setForm({ ...form, agencia: e.target.value })} /></div>
            <div><Label>Conta *</Label><Input placeholder="XXXXXXX-X" value={form.conta} onChange={e => setForm({ ...form, conta: e.target.value })} /></div>
          </div>
          <div><Label>Tipo de Conta</Label><Select value={form.tipo} onValueChange={v => setForm({ ...form, tipo: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Corrente">Corrente</SelectItem><SelectItem value="Poupança">Poupança</SelectItem></SelectContent></Select></div>
          <div><Label>Titular *</Label><Input value={form.titular} onChange={e => setForm({ ...form, titular: e.target.value })} /></div>
          <div>
            <div className="flex items-center gap-2 mb-2"><Switch checked={isCnpj} onCheckedChange={setIsCnpj} /><Label>{isCnpj ? "CNPJ" : "CPF"}</Label></div>
            <Input value={form.doc} onChange={e => setForm({ ...form, doc: isCnpj ? maskCnpj(e.target.value) : maskCpf(e.target.value) })} />
          </div>
          <div className="flex items-center gap-2"><Switch checked={form.active} onCheckedChange={v => setForm({ ...form, active: v })} /><Label>Ativo</Label></div>
        </div>
      </FormModal>
    </DashboardLayout>
  );
}
