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
import { toast } from "sonner";
import { Eye, Pencil, XCircle, FileDown, Plus } from "lucide-react";
import { maskCurrency } from "@/lib/masks";

const statusColor: Record<string, string> = { Ativo: "bg-emerald-100 text-emerald-700", Inativo: "bg-muted text-muted-foreground", Encerrado: "bg-amber-100 text-amber-700" };
const mockData = [
  { id: "1", pre_aprendiz: "Carlos Junior", empresa: "TechSol", data_inicio: "01/02/2024", data_termino: "01/08/2024", bolsa: "R$ 500,00", status: "Ativo" },
  { id: "2", pre_aprendiz: "Mariana Souza", empresa: "RH Global", data_inicio: "01/03/2024", data_termino: "01/09/2024", bolsa: "R$ 600,00", status: "Ativo" },
];
const emptyForm = { pre_aprendiz: "", empresa: "", data_inicio: "", data_termino: "", carga: "", bolsa: "", supervisor: "", plano: "", status: "Ativo" };

export default function ContratoPreJAPage() {
  const [data, setData] = useState(mockData);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [endItem, setEndItem] = useState<any>(null);
  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  const columns: Column[] = [
    { key: "id", label: "ID" }, { key: "pre_aprendiz", label: "Pré-Aprendiz", sortable: true },
    { key: "empresa", label: "Empresa", sortable: true }, { key: "data_inicio", label: "Início" },
    { key: "data_termino", label: "Término" }, { key: "bolsa", label: "Bolsa" },
    { key: "status", label: "Status", render: (v) => <Badge className={statusColor[v] || ""}>{v}</Badge> },
  ];
  const filters: FilterConfig[] = [{ key: "pre_aprendiz", label: "Pré-Aprendiz", type: "text" }, { key: "empresa", label: "Empresa", type: "text" }];
  const actions: ActionConfig[] = [
    { label: "Visualizar", icon: <Eye className="h-4 w-4" />, onClick: (r) => { setForm({ ...emptyForm, ...r }); setEditId(null); setModalOpen(true); } },
    { label: "Editar", icon: <Pencil className="h-4 w-4" />, onClick: (r) => { setForm({ ...emptyForm, ...r }); setEditId(r.id); setModalOpen(true); } },
    { label: "Encerrar", icon: <XCircle className="h-4 w-4" />, onClick: (r) => setEndItem(r), variant: "destructive" },
    { label: "Gerar PDF", icon: <FileDown className="h-4 w-4" />, onClick: () => toast.success("PDF gerado com sucesso") },
  ];

  const handleSave = () => {
    if (!form.pre_aprendiz || !form.empresa) { toast.error("Preencha campos obrigatórios"); return; }
    if (editId) { setData(data.map(d => d.id === editId ? { ...d, ...form } : d)); toast.success("Contrato atualizado"); }
    else { setData([...data, { ...form, id: String(data.length + 1) } as any]); toast.success("Contrato criado"); }
    setModalOpen(false); setEditId(null); setForm(emptyForm);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Jovem Aprendiz" }, { label: "Contrato Pré-Aprendizagem" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Contrato Pré-Aprendizagem</h1><p className="text-sm text-muted-foreground mt-1">{data.length} contratos.</p></div>
          <button onClick={() => { setForm(emptyForm); setEditId(null); setModalOpen(true); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"><Plus className="h-4 w-4" />Novo Contrato</button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>
      <FormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditId(null); }} title={editId ? "Editar Contrato" : "Novo Contrato Pré-Aprendizagem"} onSave={handleSave} wide>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Pré-Aprendiz *</Label><Select value={form.pre_aprendiz} onValueChange={(v) => set("pre_aprendiz", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{["Carlos Junior","Mariana Souza","Felipe Dias"].map(e=><SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Empresa *</Label><Select value={form.empresa} onValueChange={(v) => set("empresa", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{["TechSol","RH Global","Apex Build"].map(e=><SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Data Início</Label><Input type="date" value={form.data_inicio} onChange={(e) => set("data_inicio", e.target.value)} /></div>
          <div><Label>Data Término</Label><Input type="date" value={form.data_termino} onChange={(e) => set("data_termino", e.target.value)} /></div>
          <div><Label>Carga Horária</Label><Input value={form.carga} onChange={(e) => set("carga", e.target.value)} /></div>
          <div><Label>Bolsa Auxílio (R$)</Label><Input value={form.bolsa} onChange={(e) => set("bolsa", maskCurrency(e.target.value))} /></div>
          <div><Label>Status</Label><Select value={form.status} onValueChange={(v) => set("status", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Ativo">Ativo</SelectItem><SelectItem value="Inativo">Inativo</SelectItem><SelectItem value="Encerrado">Encerrado</SelectItem></SelectContent></Select></div>
        </div>
        <div className="mt-4"><Label>Plano de Atividades</Label><RichTextEditor value={form.plano} onChange={(v) => set("plano", v)} /></div>
      </FormModal>
      <ConfirmDialog open={!!endItem} onClose={() => setEndItem(null)} title="Encerrar Contrato" description={`Encerrar contrato de "${endItem?.pre_aprendiz}"?`} onConfirm={() => { setData(data.map(d => d.id === endItem?.id ? { ...d, status: "Encerrado" } : d)); toast.success("Contrato encerrado"); setEndItem(null); }} />
    </DashboardLayout>
  );
}
