import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column, FilterConfig, ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const initial = [
  { id: "NFS-001", cliente: "TechSol", servico: "Consultoria RH", valor: 4500, status: "Emitida", data_emissao: "15/03/2024" },
  { id: "NFS-002", cliente: "RH Global", servico: "Gestão de Estágio", valor: 8900, status: "Emitida", data_emissao: "10/03/2024" },
  { id: "NFS-003", cliente: "Apex Build", servico: "Recrutamento", valor: 3200, status: "Cancelada", data_emissao: "05/03/2024" },
];

const statusBadge = (v: string) => {
  const c = v === "Emitida" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${c}`}>{v}</span>;
};

export default function NfseEmissaoPage() {
  const [data, setData] = useState(initial);
  const [modal, setModal] = useState(false);
  const [confirm, setConfirm] = useState<any>(null);
  const [form, setForm] = useState({ cliente: "", servico: "", valor: 0, data_emissao: "", obs: "" });

  const columns: Column[] = [
    { key: "id", label: "ID" },
    { key: "cliente", label: "Cliente", sortable: true },
    { key: "servico", label: "Serviço" },
    { key: "valor", label: "Valor", render: (v) => `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` },
    { key: "status", label: "Status", render: statusBadge },
    { key: "data_emissao", label: "Data Emissão" },
  ];

  const filters: FilterConfig[] = [
    { key: "cliente", label: "Cliente", type: "text" },
    { key: "status", label: "Status", type: "select", options: [{ label: "Emitida", value: "Emitida" }, { label: "Cancelada", value: "Cancelada" }] },
  ];

  const actions: ActionConfig[] = [
    { label: "Visualizar NFS-e", onClick: () => toast.success("PDF gerado!") },
    { label: "Cancelar", variant: "destructive", onClick: (r) => setConfirm(r) },
    { label: "Enviar por Email", onClick: () => toast.success("Email enviado!") },
  ];

  const handleSave = () => {
    if (!form.cliente || !form.servico) { toast.error("Preencha os campos obrigatórios."); return; }
    setData([...data, { id: `NFS-${String(data.length + 1).padStart(3, "0")}`, ...form, status: "Emitida", data_emissao: form.data_emissao || new Date().toLocaleDateString("pt-BR") }]);
    toast.success("NFS-e emitida!"); setModal(false);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "NFS-e" }, { label: "Emissão" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">NFS-e — Emissão de Notas</h1><p className="text-sm text-muted-foreground">{data.length} notas.</p></div>
          <button onClick={() => { setForm({ cliente: "", servico: "", valor: 0, data_emissao: "", obs: "" }); setModal(true); }} className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Nova NFS-e</button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>
      <FormModal open={modal} onClose={() => setModal(false)} title="Emitir NFS-e" onSave={handleSave}>
        <div className="space-y-4">
          <div><Label>Cliente *</Label><Select value={form.cliente} onValueChange={v => setForm({ ...form, cliente: v })}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="TechSol">TechSol</SelectItem><SelectItem value="RH Global">RH Global</SelectItem><SelectItem value="Apex Build">Apex Build</SelectItem></SelectContent></Select></div>
          <div><Label>Serviço *</Label><Select value={form.servico} onValueChange={v => setForm({ ...form, servico: v })}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="Consultoria RH">Consultoria RH</SelectItem><SelectItem value="Gestão de Estágio">Gestão de Estágio</SelectItem><SelectItem value="Recrutamento">Recrutamento</SelectItem></SelectContent></Select></div>
          <div><Label>Valor (R$)</Label><Input type="number" value={form.valor} onChange={e => setForm({ ...form, valor: Number(e.target.value) })} /></div>
          <div><Label>Data Emissão</Label><Input type="date" value={form.data_emissao} onChange={e => setForm({ ...form, data_emissao: e.target.value })} /></div>
          <div><Label>Observações</Label><Textarea value={form.obs} onChange={e => setForm({ ...form, obs: e.target.value })} /></div>
        </div>
      </FormModal>
      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => { setData(data.map(d => d.id === confirm.id ? { ...d, status: "Cancelada" } : d)); toast.success("NFS-e cancelada."); setConfirm(null); }} title="Cancelar NFS-e" description="Deseja cancelar esta nota fiscal?" />
    </DashboardLayout>
  );
}
