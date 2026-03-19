import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column, FilterConfig, ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { maskCurrency } from "@/lib/masks";
import { toast } from "sonner";

const initial = [
  { id: "1", cliente: "TechSol", description: "Serviço mensal", valor: 4500, vencimento: "15/03/2024", status: "Aberto" },
  { id: "2", cliente: "RH Global", description: "Consultoria", valor: 8900, vencimento: "10/03/2024", status: "Recebido" },
  { id: "3", cliente: "Apex Build", description: "Licença", valor: 3200, vencimento: "01/02/2024", status: "Atrasado" },
];

const statusBadge = (v: string) => {
  const c = v === "Recebido" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : v === "Atrasado" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${c}`}>{v}</span>;
};

export default function ContasReceberPage() {
  const [data, setData] = useState(initial);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ cliente: "", description: "", valor: 0, vencimento: "", status: "Aberto" });

  const columns: Column[] = [
    { key: "cliente", label: "Cliente", sortable: true },
    { key: "description", label: "Descrição" },
    { key: "valor", label: "Valor", render: (v) => `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` },
    { key: "vencimento", label: "Vencimento" },
    { key: "status", label: "Status", render: statusBadge },
  ];

  const filters: FilterConfig[] = [
    { key: "cliente", label: "Cliente", type: "text" },
    { key: "status", label: "Status", type: "select", options: [{ label: "Aberto", value: "Aberto" }, { label: "Recebido", value: "Recebido" }, { label: "Atrasado", value: "Atrasado" }] },
  ];

  const actions: ActionConfig[] = [
    { label: "Editar", onClick: (r) => { setEditing(r); setForm(r); setModal(true); } },
    { label: "Marcar como Recebido", onClick: (r) => { setData(data.map(d => d.id === r.id ? { ...d, status: "Recebido" } : d)); toast.success("Marcado como recebido!"); } },
    { label: "Gerar Boleto", onClick: () => toast.success("Boleto gerado com sucesso!") },
  ];

  const handleSave = () => {
    if (!form.cliente) { toast.error("Preencha os campos obrigatórios."); return; }
    if (editing) { setData(data.map(d => d.id === editing.id ? { ...d, ...form } : d)); toast.success("Atualizado!"); }
    else { setData([...data, { id: String(Date.now()), ...form }]); toast.success("Criado!"); }
    setModal(false); setEditing(null);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Financeiro" }, { label: "Contas a Receber" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Contas a Receber</h1><p className="text-sm text-muted-foreground">{data.length} registros.</p></div>
          <button onClick={() => { setEditing(null); setForm({ cliente: "", description: "", valor: 0, vencimento: "", status: "Aberto" }); setModal(true); }} className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Novo</button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>
      <FormModal open={modal} onClose={() => { setModal(false); setEditing(null); }} title={editing ? "Editar" : "Nova Conta a Receber"} onSave={handleSave}>
        <div className="space-y-4">
          <div><Label>Cliente *</Label><Select value={form.cliente} onValueChange={v => setForm({ ...form, cliente: v })}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="TechSol">TechSol</SelectItem><SelectItem value="RH Global">RH Global</SelectItem><SelectItem value="Apex Build">Apex Build</SelectItem></SelectContent></Select></div>
          <div><Label>Descrição</Label><Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
          <div><Label>Valor (R$)</Label><Input type="number" value={form.valor} onChange={e => setForm({ ...form, valor: Number(e.target.value) })} /></div>
          <div><Label>Vencimento</Label><Input type="date" value={form.vencimento} onChange={e => setForm({ ...form, vencimento: e.target.value })} /></div>
        </div>
      </FormModal>
    </DashboardLayout>
  );
}
