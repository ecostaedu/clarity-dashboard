import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column, FilterConfig, ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { RichTextEditor } from "@/components/RichTextEditor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";

interface Modelo { id: string; nome: string; tipo: string; conteudo: string; }

const tiposContrato = ["Estágio", "Jovem Aprendiz", "Parceria", "Pré-Aprendizagem"];
const variaveis = ["{{NOME_ESTAGIARIO}}", "{{DATA_INICIO}}", "{{DATA_TERMINO}}", "{{EMPRESA}}", "{{CNPJ}}", "{{SUPERVISOR}}", "{{VALOR_BOLSA}}"];

const mockData: Modelo[] = [
  { id: "1", nome: "Contrato Padrão Estágio", tipo: "Estágio", conteudo: "<p>Modelo de contrato de estágio...</p>" },
  { id: "2", nome: "Contrato JA Básico", tipo: "Jovem Aprendiz", conteudo: "<p>Modelo de contrato JA...</p>" },
  { id: "3", nome: "Termo de Parceria", tipo: "Parceria", conteudo: "<p>Termo de parceria...</p>" },
];

const emptyForm = { nome: "", tipo: "", conteudo: "" };

export default function ModelosPage() {
  const [data, setData] = useState(mockData);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [viewItem, setViewItem] = useState<Modelo | null>(null);
  const [deleteItem, setDeleteItem] = useState<Modelo | null>(null);

  const set = (k: string, v: string) => setForm({ ...form, [k]: v });

  const columns: Column[] = [
    { key: "id", label: "ID" },
    { key: "nome", label: "Nome do Modelo", sortable: true },
    { key: "tipo", label: "Tipo de Contrato", render: (v) => <Badge variant="outline">{v}</Badge> },
  ];

  const filters: FilterConfig[] = [
    { key: "nome", label: "Nome", type: "text" },
    { key: "tipo", label: "Tipo", type: "select", options: tiposContrato.map(t => ({ label: t, value: t })) },
  ];

  const actions: ActionConfig[] = [
    { label: "Visualizar", icon: <Eye className="h-4 w-4" />, onClick: (r) => setViewItem(r as Modelo) },
    { label: "Editar", icon: <Pencil className="h-4 w-4" />, onClick: (r) => { setForm({ nome: r.nome, tipo: r.tipo, conteudo: r.conteudo }); setEditId(r.id); setModalOpen(true); } },
    { label: "Excluir", icon: <Trash2 className="h-4 w-4" />, onClick: (r) => setDeleteItem(r as Modelo), variant: "destructive" },
  ];

  const handleSave = () => {
    if (!form.nome || !form.tipo) { toast.error("Preencha os campos obrigatórios"); return; }
    if (editId) { setData(data.map(d => d.id === editId ? { ...d, ...form } : d)); toast.success("Modelo atualizado"); }
    else { setData([...data, { ...form, id: String(data.length + 1) }]); toast.success("Modelo criado"); }
    setModalOpen(false); setEditId(null); setForm(emptyForm);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Contratos" }, { label: "Modelos" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Modelos de Contrato</h1><p className="text-sm text-muted-foreground mt-1">{data.length} modelos cadastrados.</p></div>
          <Button onClick={() => { setForm(emptyForm); setEditId(null); setModalOpen(true); }}><Plus className="h-4 w-4 mr-2" />Novo Modelo</Button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>

      <FormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditId(null); }} title={editId ? "Editar Modelo" : "Novo Modelo"} onSave={handleSave} wide>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><Label>Nome do Modelo *</Label><Input value={form.nome} onChange={(e) => set("nome", e.target.value)} /></div>
          <div><Label>Tipo de Contrato *</Label><Select value={form.tipo} onValueChange={(v) => set("tipo", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{tiposContrato.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
        </div>
        <div className="mt-4">
          <Label>Variáveis disponíveis</Label>
          <div className="flex flex-wrap gap-1 mt-1 mb-2">{variaveis.map(v => <Badge key={v} variant="secondary" className="cursor-pointer text-xs" onClick={() => set("conteudo", form.conteudo + v)}>{v}</Badge>)}</div>
        </div>
        <div><Label>Conteúdo</Label><RichTextEditor value={form.conteudo} onChange={(v) => set("conteudo", v)} placeholder="Digite o modelo..." /></div>
      </FormModal>

      {viewItem && <FormModal open title={viewItem.nome} onClose={() => setViewItem(null)} onSave={() => setViewItem(null)} wide>
        <div className="text-sm"><Badge variant="outline" className="mb-3">{viewItem.tipo}</Badge><div dangerouslySetInnerHTML={{ __html: viewItem.conteudo }} className="prose prose-sm max-w-none" /></div>
      </FormModal>}

      <ConfirmDialog open={!!deleteItem} onClose={() => setDeleteItem(null)} title="Excluir Modelo" description={`Excluir "${deleteItem?.nome}"?`} onConfirm={() => { setData(data.filter(d => d.id !== deleteItem?.id)); toast.success("Modelo excluído"); setDeleteItem(null); }} />
    </DashboardLayout>
  );
}
