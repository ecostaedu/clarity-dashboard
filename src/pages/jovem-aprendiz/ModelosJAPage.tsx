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
import { Eye, Pencil, Trash2, Plus } from "lucide-react";

const tiposJA = ["Contrato JA", "Aditivo JA", "Termo de Compromisso JA", "Pré-Aprendizagem"];
const variaveis = ["{{NOME_APRENDIZ}}", "{{DATA_INICIO}}", "{{DATA_TERMINO}}", "{{EMPRESA}}", "{{PROGRAMA}}", "{{SALARIO}}"];

const mockData = [
  { id: "1", nome: "Contrato Padrão JA", tipo: "Contrato JA", conteudo: "<p>Modelo JA...</p>" },
  { id: "2", nome: "Aditivo de Programa", tipo: "Aditivo JA", conteudo: "<p>Aditivo...</p>" },
];

const emptyForm = { nome: "", tipo: "", conteudo: "" };

export default function ModelosJAPage() {
  const [data, setData] = useState(mockData);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteItem, setDeleteItem] = useState<any>(null);

  const set = (k: string, v: string) => setForm({ ...form, [k]: v });

  const columns: Column[] = [
    { key: "id", label: "ID" },
    { key: "nome", label: "Nome", sortable: true },
    { key: "tipo", label: "Tipo", render: (v) => <Badge variant="outline">{v}</Badge> },
  ];

  const filters: FilterConfig[] = [
    { key: "nome", label: "Nome", type: "text" },
    { key: "tipo", label: "Tipo", type: "select", options: tiposJA.map(t => ({ label: t, value: t })) },
  ];

  const actions: ActionConfig[] = [
    { label: "Visualizar", icon: <Eye className="h-4 w-4" />, onClick: (r) => { setForm(r as any); setEditId(null); setModalOpen(true); } },
    { label: "Editar", icon: <Pencil className="h-4 w-4" />, onClick: (r) => { setForm(r as any); setEditId(r.id); setModalOpen(true); } },
    { label: "Excluir", icon: <Trash2 className="h-4 w-4" />, onClick: (r) => setDeleteItem(r), variant: "destructive" },
  ];

  const handleSave = () => {
    if (!form.nome || !form.tipo) { toast.error("Preencha campos obrigatórios"); return; }
    if (editId) { setData(data.map(d => d.id === editId ? { ...d, ...form } : d)); toast.success("Modelo atualizado"); }
    else { setData([...data, { ...form, id: String(data.length + 1) }]); toast.success("Modelo criado"); }
    setModalOpen(false); setEditId(null); setForm(emptyForm);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Jovem Aprendiz" }, { label: "Modelos" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Modelos p/ Jovem Aprendiz</h1><p className="text-sm text-muted-foreground mt-1">{data.length} modelos.</p></div>
          <button onClick={() => { setForm(emptyForm); setEditId(null); setModalOpen(true); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"><Plus className="h-4 w-4" />Novo Modelo</button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>
      <FormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditId(null); }} title={editId ? "Editar Modelo" : "Novo Modelo"} onSave={handleSave} wide>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Nome *</Label><Input value={form.nome} onChange={(e) => set("nome", e.target.value)} /></div>
          <div><Label>Tipo *</Label><Select value={form.tipo} onValueChange={(v) => set("tipo", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{tiposJA.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
        </div>
        <div className="mt-3"><Label>Variáveis</Label><div className="flex flex-wrap gap-1 mt-1 mb-2">{variaveis.map(v => <Badge key={v} variant="secondary" className="cursor-pointer text-xs" onClick={() => set("conteudo", form.conteudo + v)}>{v}</Badge>)}</div></div>
        <div><Label>Conteúdo</Label><RichTextEditor value={form.conteudo} onChange={(v) => set("conteudo", v)} /></div>
      </FormModal>
      <ConfirmDialog open={!!deleteItem} onClose={() => setDeleteItem(null)} title="Excluir" description={`Excluir "${deleteItem?.nome}"?`} onConfirm={() => { setData(data.filter(d => d.id !== deleteItem?.id)); toast.success("Excluído"); setDeleteItem(null); }} />
    </DashboardLayout>
  );
}
