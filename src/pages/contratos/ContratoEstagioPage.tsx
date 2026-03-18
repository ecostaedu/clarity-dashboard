import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column, FilterConfig, ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { RichTextEditor } from "@/components/RichTextEditor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, Pencil, XCircle, FilePlus, Send, FileDown, Plus } from "lucide-react";
import { maskCurrency } from "@/lib/masks";

const mockData = [
  { id: "1", empresa: "TechSol", estagiario: "João Silva", instituicao: "USP", data_inicio: "01/03/2024", data_termino: "01/03/2025", status: "Ativo", bolsa: "R$ 1.500,00", carga: "6h" },
  { id: "2", empresa: "RH Global", estagiario: "Maria Oliveira", instituicao: "UNICAMP", data_inicio: "15/02/2024", data_termino: "15/08/2024", status: "Ativo", bolsa: "R$ 1.200,00", carga: "4h" },
  { id: "3", empresa: "Apex Build", estagiario: "Pedro Santos", instituicao: "PUC-SP", data_inicio: "01/06/2023", data_termino: "01/12/2023", status: "Rescindido", bolsa: "R$ 1.000,00", carga: "6h" },
  { id: "4", empresa: "SaúdeTotal", estagiario: "Ana Costa", instituicao: "UNESP", data_inicio: "10/04/2024", data_termino: "10/04/2025", status: "Inativo", bolsa: "R$ 1.800,00", carga: "4h" },
];

const statusColor: Record<string, string> = { Ativo: "bg-emerald-100 text-emerald-700", Inativo: "bg-muted text-muted-foreground", Rescindido: "bg-destructive/10 text-destructive" };

const emptyForm = { empresa: "", estagiario: "", instituicao: "", data_inicio: "", data_termino: "", carga: "", bolsa: "", auxilio_transporte: true, seguro: true, supervisor: "", plano_atividades: "", status: "Ativo" };

export default function ContratoEstagioPage() {
  const [data, setData] = useState(mockData);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [viewItem, setViewItem] = useState<any>(null);
  const [rescindItem, setRescindItem] = useState<any>(null);
  const [rescindMotivo, setRescindMotivo] = useState("");

  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  const columns: Column[] = [
    { key: "id", label: "ID", sortable: true },
    { key: "empresa", label: "Empresa", sortable: true },
    { key: "estagiario", label: "Estagiário", sortable: true },
    { key: "instituicao", label: "Instituição", sortable: true },
    { key: "data_inicio", label: "Início" },
    { key: "data_termino", label: "Término" },
    { key: "status", label: "Status", render: (v) => <Badge className={statusColor[v] || ""}>{v}</Badge> },
  ];

  const filters: FilterConfig[] = [
    { key: "empresa", label: "Empresa", type: "text" },
    { key: "estagiario", label: "Estagiário", type: "text" },
    { key: "status", label: "Status", type: "select", options: [{ label: "Ativo", value: "Ativo" }, { label: "Inativo", value: "Inativo" }, { label: "Rescindido", value: "Rescindido" }] },
  ];

  const actions: ActionConfig[] = [
    { label: "Visualizar", icon: <Eye className="h-4 w-4" />, onClick: (r) => setViewItem(r) },
    { label: "Editar", icon: <Pencil className="h-4 w-4" />, onClick: (r) => { setForm({ ...emptyForm, ...r }); setEditId(r.id); setModalOpen(true); } },
    { label: "Rescindir", icon: <XCircle className="h-4 w-4" />, onClick: (r) => setRescindItem(r), variant: "destructive" },
    { label: "Gerar Aditivo", icon: <FilePlus className="h-4 w-4" />, onClick: () => toast.success("Aditivo gerado com sucesso") },
    { label: "Enviar p/ Assinatura", icon: <Send className="h-4 w-4" />, onClick: () => toast.success("Enviado para assinatura") },
  ];

  const handleSave = () => {
    if (!form.empresa || !form.estagiario) { toast.error("Preencha os campos obrigatórios"); return; }
    if (editId) {
      setData(data.map((d) => (d.id === editId ? { ...d, ...form } : d)));
      toast.success("Contrato atualizado");
    } else {
      setData([...data, { ...form, id: String(data.length + 1) } as any]);
      toast.success("Contrato criado");
    }
    setModalOpen(false); setEditId(null); setForm(emptyForm);
  };

  const handleRescind = () => {
    if (rescindItem) {
      setData(data.map((d) => (d.id === rescindItem.id ? { ...d, status: "Rescindido" } : d)));
      toast.success("Contrato rescindido");
    }
    setRescindItem(null); setRescindMotivo("");
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Contratos" }, { label: "Estágio" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Contratos de Estágio</h1><p className="text-sm text-muted-foreground mt-1">{data.length} contratos cadastrados.</p></div>
          <Button onClick={() => { setForm(emptyForm); setEditId(null); setModalOpen(true); }}><Plus className="h-4 w-4 mr-2" />Novo Contrato</Button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>

      <FormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditId(null); }} title={editId ? "Editar Contrato de Estágio" : "Novo Contrato de Estágio"} onSave={handleSave} wide>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><Label>Empresa *</Label><Select value={form.empresa} onValueChange={(v) => set("empresa", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{["TechSol","RH Global","Apex Build","SaúdeTotal"].map(e=><SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Estagiário *</Label><Select value={form.estagiario} onValueChange={(v) => set("estagiario", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{["João Silva","Maria Oliveira","Pedro Santos","Ana Costa"].map(e=><SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Instituição de Ensino</Label><Select value={form.instituicao} onValueChange={(v) => set("instituicao", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{["USP","UNICAMP","PUC-SP","UNESP"].map(e=><SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Supervisor</Label><Select value={form.supervisor} onValueChange={(v) => set("supervisor", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{["Carlos Silva","Ana Maria","Roberto Lima"].map(e=><SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Data de Início</Label><Input type="date" value={form.data_inicio} onChange={(e) => set("data_inicio", e.target.value)} /></div>
          <div><Label>Data de Término</Label><Input type="date" value={form.data_termino} onChange={(e) => set("data_termino", e.target.value)} /></div>
          <div><Label>Carga Horária Diária</Label><Input placeholder="6h" value={form.carga} onChange={(e) => set("carga", e.target.value)} /></div>
          <div><Label>Valor da Bolsa (R$)</Label><Input placeholder="0,00" value={form.bolsa} onChange={(e) => set("bolsa", maskCurrency(e.target.value))} /></div>
          <div className="flex items-center gap-3"><Switch checked={form.auxilio_transporte} onCheckedChange={(v) => set("auxilio_transporte", v)} /><Label>Auxílio Transporte</Label></div>
          <div className="flex items-center gap-3"><Switch checked={form.seguro} onCheckedChange={(v) => set("seguro", v)} /><Label>Seguro</Label></div>
          <div><Label>Status</Label><Select value={form.status} onValueChange={(v) => set("status", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Ativo">Ativo</SelectItem><SelectItem value="Inativo">Inativo</SelectItem><SelectItem value="Rescindido">Rescindido</SelectItem></SelectContent></Select></div>
        </div>
        <div className="mt-4"><Label>Plano de Atividades</Label><RichTextEditor value={form.plano_atividades} onChange={(v) => set("plano_atividades", v)} placeholder="Descreva o plano de atividades..." /></div>
        <div className="mt-3"><Button variant="outline" onClick={() => toast.success("PDF gerado com sucesso")}><FileDown className="h-4 w-4 mr-2" />Gerar PDF do Contrato</Button></div>
      </FormModal>

      {viewItem && <FormModal open={!!viewItem} onClose={() => setViewItem(null)} title="Detalhes do Contrato" onSave={() => setViewItem(null)}>
        <div className="grid grid-cols-2 gap-3 text-sm">{Object.entries(viewItem).filter(([k]) => k !== "id").map(([k, v]) => <div key={k}><span className="text-muted-foreground capitalize">{k.replace(/_/g, " ")}</span><p className="font-medium">{String(v)}</p></div>)}</div>
      </FormModal>}

      <ConfirmDialog open={!!rescindItem} onClose={() => setRescindItem(null)} title="Rescindir Contrato" description="Informe o motivo da rescisão:" onConfirm={handleRescind}>
        <Input placeholder="Motivo da rescisão" value={rescindMotivo} onChange={(e) => setRescindMotivo(e.target.value)} className="mt-2" />
      </ConfirmDialog>
    </DashboardLayout>
  );
}
