import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, type Column, type FilterConfig, type ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const initialData = [
  { id: "1", nome: "Técnico", descricao: "Provas de conhecimento técnico específico", provasCount: 3 },
  { id: "2", nome: "Raciocínio Lógico", descricao: "Provas de lógica e raciocínio", provasCount: 2 },
  { id: "3", nome: "Comportamental", descricao: "Avaliações comportamentais e psicológicas", provasCount: 1 },
  { id: "4", nome: "Idiomas", descricao: "Provas de proficiência em idiomas", provasCount: 0 },
];

const emptyForm = { id: "", nome: "", descricao: "" };

export default function CategoriasProvaPage() {
  const [data, setData] = useState(initialData);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [editing, setEditing] = useState(false);

  const columns: Column[] = [
    { key: "id", label: "ID", sortable: true },
    { key: "nome", label: "Nome", sortable: true },
    { key: "descricao", label: "Descrição" },
  ];

  const filters: FilterConfig[] = [
    { key: "nome", label: "Nome", type: "text" },
  ];

  const actions: ActionConfig[] = [
    { label: "Visualizar", icon: <Eye className="h-4 w-4" />, onClick: (row) => { setSelected(row); setViewOpen(true); } },
    { label: "Editar", icon: <Pencil className="h-4 w-4" />, onClick: (row) => { setForm({ id: row.id, nome: row.nome, descricao: row.descricao }); setEditing(true); setModalOpen(true); } },
    {
      label: "Excluir", icon: <Trash2 className="h-4 w-4" />,
      onClick: (row) => {
        if (row.provasCount > 0) { toast.error(`Não é possível excluir: ${row.provasCount} prova(s) associada(s).`); return; }
        setSelected(row); setConfirmOpen(true);
      },
      variant: "destructive",
    },
  ];

  const handleSave = () => {
    if (!form.nome) { toast.error("Nome é obrigatório."); return; }
    if (editing) {
      setData(data.map((d) => d.id === form.id ? { ...d, ...form } : d));
      toast.success("Categoria atualizada!");
    } else {
      setData([...data, { ...form, id: String(data.length + 1), provasCount: 0 }]);
      toast.success("Categoria criada!");
    }
    setModalOpen(false); setForm({ ...emptyForm }); setEditing(false);
  };

  const handleDelete = () => {
    setData(data.filter((d) => d.id !== selected?.id));
    toast.success("Categoria excluída.");
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Recrutamento" }, { label: "Categorias de Prova" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Categorias de Prova</h1>
            <p className="text-sm text-muted-foreground mt-1">{data.length} categorias cadastradas.</p>
          </div>
          <Button onClick={() => { setForm({ ...emptyForm }); setEditing(false); setModalOpen(true); }} className="gap-2"><Plus className="h-4 w-4" /> Nova Categoria</Button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>

      <FormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(false); }} title={editing ? "Editar Categoria" : "Nova Categoria"} onSave={handleSave}>
        <div className="space-y-4">
          <div className="space-y-1.5"><Label>Nome *</Label><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Descrição</Label><Textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} rows={3} /></div>
        </div>
      </FormModal>

      <FormModal open={viewOpen} onClose={() => setViewOpen(false)} title="Detalhes" onSave={() => setViewOpen(false)}>
        {selected && (
          <div className="space-y-2 text-sm">
            <div><span className="text-muted-foreground">Nome:</span> <span className="font-medium">{selected.nome}</span></div>
            <div><span className="text-muted-foreground">Descrição:</span> <span className="font-medium">{selected.descricao}</span></div>
          </div>
        )}
      </FormModal>

      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} title="Excluir Categoria" description={`Deseja excluir a categoria "${selected?.nome}"?`} confirmLabel="Excluir" variant="destructive" />
    </DashboardLayout>
  );
}
