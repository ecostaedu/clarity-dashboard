import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column, FilterConfig, ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";

const mockData = [
  { id: "1", nome: "Módulo Teórico", descricao: "Aulas teóricas em sala", ativo: true },
  { id: "2", nome: "Módulo Prático", descricao: "Atividades práticas na empresa", ativo: true },
  { id: "3", nome: "Módulo EAD", descricao: "Ensino a distância", ativo: false },
];
const emptyForm = { nome: "", descricao: "", ativo: true };

export default function TiposModulosPage() {
  const [data, setData] = useState(mockData);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteItem, setDeleteItem] = useState<any>(null);
  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  const columns: Column[] = [
    { key: "id", label: "ID" }, { key: "nome", label: "Nome", sortable: true }, { key: "descricao", label: "Descrição" },
    { key: "ativo", label: "Ativo", render: (v) => <Badge className={v ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}>{v ? "Sim" : "Não"}</Badge> },
  ];
  const filters: FilterConfig[] = [{ key: "nome", label: "Nome", type: "text" }];
  const actions: ActionConfig[] = [
    { label: "Visualizar", icon: <Eye className="h-4 w-4" />, onClick: (r) => { setForm({ nome: r.nome, descricao: r.descricao, ativo: r.ativo }); setEditId(null); setModalOpen(true); } },
    { label: "Editar", icon: <Pencil className="h-4 w-4" />, onClick: (r) => { setForm({ nome: r.nome, descricao: r.descricao, ativo: r.ativo }); setEditId(r.id); setModalOpen(true); } },
    { label: "Excluir", icon: <Trash2 className="h-4 w-4" />, onClick: (r) => setDeleteItem(r), variant: "destructive" },
  ];

  const handleSave = () => {
    if (!form.nome) { toast.error("Nome obrigatório"); return; }
    if (editId) { setData(data.map(d => d.id === editId ? { ...d, ...form } : d)); toast.success("Atualizado"); }
    else { setData([...data, { ...form, id: String(data.length + 1) }]); toast.success("Criado"); }
    setModalOpen(false); setEditId(null); setForm(emptyForm);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Jovem Aprendiz" }, { label: "Tipos de Módulos" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Tipos de Módulos</h1><p className="text-sm text-muted-foreground mt-1">{data.length} tipos.</p></div>
          <button onClick={() => { setForm(emptyForm); setEditId(null); setModalOpen(true); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"><Plus className="h-4 w-4" />Novo Tipo</button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>
      <FormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditId(null); }} title={editId ? "Editar" : "Novo Tipo de Módulo"} onSave={handleSave}>
        <div className="space-y-4">
          <div><Label>Nome *</Label><Input value={form.nome} onChange={(e) => set("nome", e.target.value)} /></div>
          <div><Label>Descrição</Label><Textarea value={form.descricao} onChange={(e) => set("descricao", e.target.value)} /></div>
          <div className="flex items-center gap-3"><Switch checked={form.ativo} onCheckedChange={(v) => set("ativo", v)} /><Label>Ativo</Label></div>
        </div>
      </FormModal>
      <ConfirmDialog open={!!deleteItem} onClose={() => setDeleteItem(null)} title="Excluir" description={`Excluir "${deleteItem?.nome}"?`} onConfirm={() => { setData(data.filter(d => d.id !== deleteItem?.id)); toast.success("Excluído"); setDeleteItem(null); }} />
    </DashboardLayout>
  );
}
