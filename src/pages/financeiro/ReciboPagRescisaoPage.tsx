import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column, ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RichTextEditor } from "@/components/RichTextEditor";
import { toast } from "sonner";

const initial = [
  { id: "1", funcionario: "João Silva", tipo: "Pagamento", competencia: "03/2024", valor: 1800, data: "28/03/2024" },
  { id: "2", funcionario: "Maria Santos", tipo: "Rescisão", competencia: "02/2024", valor: 5400, data: "15/02/2024" },
];

export default function ReciboPagRescisaoPage() {
  const [data, setData] = useState(initial);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ funcionario: "", tipo: "Pagamento", competencia: "", valor: 0, detalhes: "" });

  const columns: Column[] = [
    { key: "funcionario", label: "Funcionário", sortable: true },
    { key: "tipo", label: "Tipo" },
    { key: "competencia", label: "Competência" },
    { key: "valor", label: "Valor", render: (v) => `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` },
    { key: "data", label: "Data" },
  ];

  const actions: ActionConfig[] = [
    { label: "Visualizar Recibo", onClick: () => toast.success("PDF gerado!") },
    { label: "Enviar por Email", onClick: () => toast.success("Email enviado!") },
  ];

  const handleSave = () => {
    if (!form.funcionario || !form.competencia) { toast.error("Preencha os campos obrigatórios."); return; }
    setData([...data, { id: String(Date.now()), ...form, data: new Date().toLocaleDateString("pt-BR") }]);
    toast.success("Recibo gerado!"); setModal(false);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Financeiro" }, { label: "Recibo de Pagamento / Rescisão" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Recibo de Pagamento / Rescisão</h1><p className="text-sm text-muted-foreground">{data.length} recibos.</p></div>
          <button onClick={() => { setForm({ funcionario: "", tipo: "Pagamento", competencia: "", valor: 0, detalhes: "" }); setModal(true); }} className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Novo Recibo</button>
        </div>
        <DataTable columns={columns} data={data} actions={actions} />
      </div>
      <FormModal open={modal} onClose={() => setModal(false)} title="Novo Recibo" onSave={handleSave}>
        <div className="space-y-4">
          <div><Label>Funcionário *</Label><Select value={form.funcionario} onValueChange={v => setForm({ ...form, funcionario: v })}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="João Silva">João Silva</SelectItem><SelectItem value="Maria Santos">Maria Santos</SelectItem></SelectContent></Select></div>
          <div><Label>Tipo</Label><Select value={form.tipo} onValueChange={v => setForm({ ...form, tipo: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Pagamento">Pagamento</SelectItem><SelectItem value="Rescisão">Rescisão</SelectItem></SelectContent></Select></div>
          <div><Label>Competência *</Label><Input placeholder="MM/AAAA" value={form.competencia} onChange={e => setForm({ ...form, competencia: e.target.value })} /></div>
          <div><Label>Valor Total (R$)</Label><Input type="number" value={form.valor} onChange={e => setForm({ ...form, valor: Number(e.target.value) })} /></div>
          <div><Label>Detalhes</Label><RichTextEditor value={form.detalhes} onChange={v => setForm({ ...form, detalhes: v })} /></div>
        </div>
      </FormModal>
    </DashboardLayout>
  );
}
