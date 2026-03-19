import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column, FilterConfig, ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { maskCurrency } from "@/lib/masks";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

type Item = { desc: string; qty: number; unit: number };

const initial = [
  { id: "1", cliente: "TechSol", competencia: "03/2024", emissao: "01/03/2024", vencimento: "15/03/2024", total: 4500, status: "Pendente" },
  { id: "2", cliente: "RH Global", competencia: "03/2024", emissao: "01/03/2024", vencimento: "10/03/2024", total: 8900, status: "Pago" },
];

const statusBadge = (v: string) => {
  const c = v === "Pago" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : v === "Cancelado" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${c}`}>{v}</span>;
};

export default function FaturasFinPage() {
  const [data, setData] = useState(initial);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [confirm, setConfirm] = useState<any>(null);
  const [form, setForm] = useState({ cliente: "", competencia: "", emissao: "", vencimento: "", obs: "" });
  const [items, setItems] = useState<Item[]>([{ desc: "", qty: 1, unit: 0 }]);

  const total = useMemo(() => items.reduce((s, i) => s + i.qty * i.unit, 0), [items]);

  const columns: Column[] = [
    { key: "cliente", label: "Cliente", sortable: true },
    { key: "competencia", label: "Competência" },
    { key: "vencimento", label: "Vencimento" },
    { key: "total", label: "Valor", render: (v) => `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` },
    { key: "status", label: "Status", render: statusBadge },
  ];

  const filters: FilterConfig[] = [
    { key: "cliente", label: "Cliente", type: "text" },
    { key: "status", label: "Status", type: "select", options: [{ label: "Pendente", value: "Pendente" }, { label: "Pago", value: "Pago" }, { label: "Cancelado", value: "Cancelado" }] },
  ];

  const actions: ActionConfig[] = [
    { label: "Editar", onClick: (r) => { setEditing(r); setForm({ cliente: r.cliente, competencia: r.competencia, emissao: r.emissao, vencimento: r.vencimento, obs: "" }); setItems([{ desc: "Serviço", qty: 1, unit: r.total }]); setModal(true); } },
    { label: "Marcar como Paga", onClick: (r) => { setData(data.map(d => d.id === r.id ? { ...d, status: "Pago" } : d)); toast.success("Fatura marcada como paga!"); } },
    { label: "Gerar PDF", onClick: () => toast.success("PDF gerado!") },
    { label: "Enviar por Email", onClick: () => toast.success("Email enviado!") },
    { label: "Cancelar", variant: "destructive", onClick: (r) => setConfirm(r) },
  ];

  const handleSave = () => {
    if (!form.cliente || !form.competencia) { toast.error("Preencha os campos obrigatórios."); return; }
    if (editing) { setData(data.map(d => d.id === editing.id ? { ...d, ...form, total } : d)); toast.success("Fatura atualizada!"); }
    else { setData([...data, { id: String(Date.now()), ...form, total, status: "Pendente" }]); toast.success("Fatura criada!"); }
    setModal(false); setEditing(null);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Financeiro" }, { label: "Faturas" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Faturas</h1><p className="text-sm text-muted-foreground">{data.length} faturas.</p></div>
          <button onClick={() => { setEditing(null); setForm({ cliente: "", competencia: "", emissao: "", vencimento: "", obs: "" }); setItems([{ desc: "", qty: 1, unit: 0 }]); setModal(true); }} className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Nova Fatura</button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>
      <FormModal open={modal} onClose={() => { setModal(false); setEditing(null); }} title={editing ? "Editar Fatura" : "Nova Fatura"} onSave={handleSave} wide>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Cliente *</Label><Select value={form.cliente} onValueChange={v => setForm({ ...form, cliente: v })}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="TechSol">TechSol</SelectItem><SelectItem value="RH Global">RH Global</SelectItem><SelectItem value="EduPlus">EduPlus</SelectItem></SelectContent></Select></div>
          <div><Label>Competência *</Label><Input placeholder="MM/AAAA" value={form.competencia} onChange={e => setForm({ ...form, competencia: e.target.value })} /></div>
          <div><Label>Emissão</Label><Input type="date" value={form.emissao} onChange={e => setForm({ ...form, emissao: e.target.value })} /></div>
          <div><Label>Vencimento</Label><Input type="date" value={form.vencimento} onChange={e => setForm({ ...form, vencimento: e.target.value })} /></div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2"><Label>Itens da Fatura</Label><Button type="button" variant="outline" size="sm" onClick={() => setItems([...items, { desc: "", qty: 1, unit: 0 }])}><Plus className="h-3 w-3 mr-1" />Adicionar</Button></div>
          {items.map((it, i) => (
            <div key={i} className="grid grid-cols-4 gap-2 mb-2 items-end">
              <Input placeholder="Descrição" value={it.desc} onChange={e => { const u = [...items]; u[i].desc = e.target.value; setItems(u); }} />
              <Input type="number" placeholder="Qtd" value={it.qty} onChange={e => { const u = [...items]; u[i].qty = Number(e.target.value); setItems(u); }} />
              <Input type="number" placeholder="Valor Unit." value={it.unit} onChange={e => { const u = [...items]; u[i].unit = Number(e.target.value); setItems(u); }} />
              <Button type="button" variant="ghost" size="icon" onClick={() => setItems(items.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
          <p className="text-sm font-semibold text-right mt-2">Total: R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="mt-4"><Label>Observações</Label><Textarea value={form.obs} onChange={e => setForm({ ...form, obs: e.target.value })} /></div>
      </FormModal>
      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => { setData(data.map(d => d.id === confirm.id ? { ...d, status: "Cancelado" } : d)); toast.success("Fatura cancelada."); setConfirm(null); }} title="Cancelar Fatura" description="Deseja cancelar esta fatura?" />
    </DashboardLayout>
  );
}
