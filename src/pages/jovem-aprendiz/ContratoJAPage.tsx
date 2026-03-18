import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column, FilterConfig, ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { RichTextEditor } from "@/components/RichTextEditor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, Pencil, XCircle, FilePlus, Send, FileDown, Plus } from "lucide-react";
import { maskCurrency } from "@/lib/masks";

const statusColor: Record<string, string> = { Ativo: "bg-emerald-100 text-emerald-700", Inativo: "bg-muted text-muted-foreground", Rescindido: "bg-destructive/10 text-destructive" };
const mockData = [
  { id: "1", aprendiz: "Lucas Lima", empresa: "TechSol", programa: "Aprendiz em Administração", data_inicio: "01/03/2024", data_termino: "01/03/2025", salario: "R$ 800,00", status: "Ativo" },
  { id: "2", aprendiz: "Ana Costa", empresa: "RH Global", programa: "Aprendiz em TI", data_inicio: "15/02/2024", data_termino: "15/02/2025", salario: "R$ 900,00", status: "Ativo" },
];
const emptyForm = { aprendiz: "", empresa: "", programa: "", data_inicio: "", data_termino: "", carga: "", salario: "", supervisor: "", plano: "", status: "Ativo" };

export default function ContratoJAPage() {
  const [data, setData] = useState(mockData);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [rescindItem, setRescindItem] = useState<any>(null);
  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  const columns: Column[] = [
    { key: "id", label: "ID" }, { key: "aprendiz", label: "Aprendiz", sortable: true }, { key: "empresa", label: "Empresa", sortable: true },
    { key: "programa", label: "Programa" }, { key: "data_inicio", label: "Início" }, { key: "data_termino", label: "Término" },
    { key: "status", label: "Status", render: (v) => <Badge className={statusColor[v] || ""}>{v}</Badge> },
  ];
  const filters: FilterConfig[] = [{ key: "aprendiz", label: "Aprendiz", type: "text" }, { key: "empresa", label: "Empresa", type: "text" }, { key: "status", label: "Status", type: "select", options: [{ label: "Ativo", value: "Ativo" }, { label: "Inativo", value: "Inativo" }, { label: "Rescindido", value: "Rescindido" }] }];
  const actions: ActionConfig[] = [
    { label: "Visualizar", icon: <Eye className="h-4 w-4" />, onClick: (r) => { setForm({ ...emptyForm, ...r }); setEditId(null); setModalOpen(true); } },
    { label: "Editar", icon: <Pencil className="h-4 w-4" />, onClick: (r) => { setForm({ ...emptyForm, ...r }); setEditId(r.id); setModalOpen(true); } },
    { label: "Rescindir", icon: <XCircle className="h-4 w-4" />, onClick: (r) => setRescindItem(r), variant: "destructive" },
    { label: "Gerar Aditivo", icon: <FilePlus className="h-4 w-4" />, onClick: () => toast.success("Aditivo gerado") },
    { label: "Enviar p/ Assinatura", icon: <Send className="h-4 w-4" />, onClick: () => toast.success("Enviado para assinatura") },
    { label: "Gerar PDF", icon: <FileDown className="h-4 w-4" />, onClick: () => toast.success("PDF gerado com sucesso") },
  ];

  const handleSave = () => {
    if (!form.aprendiz || !form.empresa) { toast.error("Preencha campos obrigatórios"); return; }
    if (editId) { setData(data.map(d => d.id === editId ? { ...d, ...form } : d)); toast.success("Contrato atualizado"); }
    else { setData([...data, { ...form, id: String(data.length + 1) } as any]); toast.success("Contrato criado"); }
    setModalOpen(false); setEditId(null); setForm(emptyForm);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Jovem Aprendiz" }, { label: "Contrato JA" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Contrato Jovem Aprendiz</h1><p className="text-sm text-muted-foreground mt-1">{data.length} contratos.</p></div>
          <button onClick={() => { setForm(emptyForm); setEditId(null); setModalOpen(true); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"><Plus className="h-4 w-4" />Novo Contrato</button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>
      <FormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditId(null); }} title={editId ? "Editar Contrato JA" : "Novo Contrato JA"} onSave={handleSave} wide>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Aprendiz *</Label><Select value={form.aprendiz} onValueChange={(v) => set("aprendiz", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{["Lucas Lima","Ana Costa","Pedro Santos"].map(e=><SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Empresa *</Label><Select value={form.empresa} onValueChange={(v) => set("empresa", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{["TechSol","RH Global","Apex Build"].map(e=><SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Programa</Label><Select value={form.programa} onValueChange={(v) => set("programa", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{["Aprendiz em Administração","Aprendiz em TI","Aprendiz em Logística"].map(e=><SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Supervisor</Label><Select value={form.supervisor} onValueChange={(v) => set("supervisor", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{["Carlos Silva","Ana Maria"].map(e=><SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Data Início</Label><Input type="date" value={form.data_inicio} onChange={(e) => set("data_inicio", e.target.value)} /></div>
          <div><Label>Data Término</Label><Input type="date" value={form.data_termino} onChange={(e) => set("data_termino", e.target.value)} /></div>
          <div><Label>Carga Horária Diária</Label><Input value={form.carga} onChange={(e) => set("carga", e.target.value)} placeholder="4h" /></div>
          <div><Label>Salário (R$)</Label><Input value={form.salario} onChange={(e) => set("salario", maskCurrency(e.target.value))} /></div>
          <div><Label>Status</Label><Select value={form.status} onValueChange={(v) => set("status", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Ativo">Ativo</SelectItem><SelectItem value="Inativo">Inativo</SelectItem><SelectItem value="Rescindido">Rescindido</SelectItem></SelectContent></Select></div>
        </div>
        <div className="mt-4"><Label>Plano de Desenvolvimento</Label><RichTextEditor value={form.plano} onChange={(v) => set("plano", v)} /></div>
      </FormModal>
      <ConfirmDialog open={!!rescindItem} onClose={() => setRescindItem(null)} title="Rescindir Contrato" description={`Rescindir contrato de "${rescindItem?.aprendiz}"?`} onConfirm={() => { setData(data.map(d => d.id === rescindItem?.id ? { ...d, status: "Rescindido" } : d)); toast.success("Contrato rescindido"); setRescindItem(null); }} />
    </DashboardLayout>
  );
}
