import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column, FilterConfig, ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";

const mockData = [
  { id: "1", nome: "RG ou CNH", tipo: "Estágio", obrigatorio: true, descricao: "Documento de identidade" },
  { id: "2", nome: "Comprovante de Matrícula", tipo: "Estágio", obrigatorio: true, descricao: "Comprovante da instituição de ensino" },
  { id: "3", nome: "CTPS", tipo: "Jovem Aprendiz", obrigatorio: true, descricao: "Carteira de trabalho" },
  { id: "4", nome: "Atestado Médico", tipo: "Jovem Aprendiz", obrigatorio: false, descricao: "Atestado admissional" },
  { id: "5", nome: "Comprovante de Residência", tipo: "Parceria", obrigatorio: false, descricao: "" },
];

const tipos = ["Estágio", "Jovem Aprendiz", "Parceria"];
const emptyForm = { nome: "", descricao: "", tipo: "", obrigatorio: true };

export default function DocumentosObrigatoriosPage() {
  const [data, setData] = useState(mockData);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteItem, setDeleteItem] = useState<any>(null);

  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  const columns: Column[] = [
    { key: "id", label: "ID" },
    { key: "nome", label: "Documento", sortable: true },
    { key: "tipo", label: "Tipo de Contrato", render: (v) => <Badge variant="outline">{v}</Badge> },
    { key: "obrigatorio", label: "Obrigatório", render: (v) => <Badge className={v ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}>{v ? "Sim" : "Não"}</Badge> },
  ];

  const filters: FilterConfig[] = [
    { key: "nome", label: "Nome", type: "text" },
    { key: "tipo", label: "Tipo", type: "select", options: tipos.map(t => ({ label: t, value: t })) },
  ];

  const actions: ActionConfig[] = [
    { label: "Visualizar", icon: <Eye className="h-4 w-4" />, onClick: (r) => { setForm({ nome: r.nome, descricao: r.descricao, tipo: r.tipo, obrigatorio: r.obrigatorio }); setEditId(null); setModalOpen(true); } },
    { label: "Editar", icon: <Pencil className="h-4 w-4" />, onClick: (r) => { setForm({ nome: r.nome, descricao: r.descricao, tipo: r.tipo, obrigatorio: r.obrigatorio }); setEditId(r.id); setModalOpen(true); } },
    { label: "Excluir", icon: <Trash2 className="h-4 w-4" />, onClick: (r) => setDeleteItem(r), variant: "destructive" },
  ];

  const handleSave = () => {
    if (!form.nome || !form.tipo) { toast.error("Preencha campos obrigatórios"); return; }
    if (editId) { setData(data.map(d => d.id === editId ? { ...d, ...form } : d)); toast.success("Documento atualizado"); }
    else { setData([...data, { ...form, id: String(data.length + 1) }]); toast.success("Documento criado"); }
    setModalOpen(false); setEditId(null); setForm(emptyForm);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Contratos" }, { label: "Documentos Obrigatórios" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Documentos Obrigatórios</h1><p className="text-sm text-muted-foreground mt-1">{data.length} documentos.</p></div>
          <Button onClick={() => { setForm(emptyForm); setEditId(null); setModalOpen(true); }}><Plus className="h-4 w-4 mr-2" />Novo Documento</Button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>

      <FormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditId(null); }} title={editId ? "Editar Documento" : "Novo Documento"} onSave={handleSave}>
        <div className="space-y-4">
          <div><Label>Nome *</Label><Input value={form.nome} onChange={(e) => set("nome", e.target.value)} /></div>
          <div><Label>Descrição</Label><Textarea value={form.descricao} onChange={(e) => set("descricao", e.target.value)} /></div>
          <div><Label>Tipo de Contrato *</Label><Select value={form.tipo} onValueChange={(v) => set("tipo", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{tipos.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
          <div className="flex items-center gap-3"><Switch checked={form.obrigatorio} onCheckedChange={(v) => set("obrigatorio", v)} /><Label>Obrigatório</Label></div>
        </div>
      </FormModal>

      <ConfirmDialog open={!!deleteItem} onClose={() => setDeleteItem(null)} title="Excluir Documento" description={`Excluir "${deleteItem?.nome}"?`} onConfirm={() => { setData(data.filter(d => d.id !== deleteItem?.id)); toast.success("Documento excluído"); setDeleteItem(null); }} />
    </DashboardLayout>
  );
}
