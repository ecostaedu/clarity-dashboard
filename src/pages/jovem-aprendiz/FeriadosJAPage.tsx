import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column, FilterConfig, ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";

const mockData = [
  { id: "1", data: "2024-02-12", descricao: "Carnaval", recorrente: true },
  { id: "2", data: "2024-01-25", descricao: "Aniversário de SP", recorrente: true },
  { id: "3", data: "2024-04-21", descricao: "Tiradentes", recorrente: true },
  { id: "4", data: "2024-11-20", descricao: "Consciência Negra", recorrente: false },
];
const emptyForm = { data: "", descricao: "", recorrente: true };

export default function FeriadosJAPage() {
  const [data, setData] = useState(mockData);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteItem, setDeleteItem] = useState<any>(null);
  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  const columns: Column[] = [
    { key: "data", label: "Data", sortable: true }, { key: "descricao", label: "Descrição", sortable: true },
    { key: "recorrente", label: "Recorrente", render: (v) => <Badge className={v ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}>{v ? "Sim" : "Não"}</Badge> },
  ];
  const filters: FilterConfig[] = [{ key: "descricao", label: "Descrição", type: "text" }];
  const actions: ActionConfig[] = [
    { label: "Visualizar", icon: <Eye className="h-4 w-4" />, onClick: (r) => { setForm({data:r.data,descricao:r.descricao,recorrente:r.recorrente}); setEditId(null); setModalOpen(true); } },
    { label: "Editar", icon: <Pencil className="h-4 w-4" />, onClick: (r) => { setForm({data:r.data,descricao:r.descricao,recorrente:r.recorrente}); setEditId(r.id); setModalOpen(true); } },
    { label: "Excluir", icon: <Trash2 className="h-4 w-4" />, onClick: (r) => setDeleteItem(r), variant: "destructive" },
  ];

  const handleSave = () => {
    if (!form.data || !form.descricao) { toast.error("Preencha campos obrigatórios"); return; }
    if (editId) { setData(data.map(d => d.id === editId ? {...d,...form} : d)); toast.success("Atualizado"); }
    else { setData([...data, {...form, id: String(data.length+1)}]); toast.success("Criado"); }
    setModalOpen(false); setEditId(null); setForm(emptyForm);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Jovem Aprendiz" }, { label: "Feriados" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Feriados</h1><p className="text-sm text-muted-foreground mt-1">{data.length} feriados.</p></div>
          <button onClick={() => { setForm(emptyForm); setEditId(null); setModalOpen(true); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"><Plus className="h-4 w-4" />Novo Feriado</button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>
      <FormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditId(null); }} title={editId ? "Editar Feriado" : "Novo Feriado"} onSave={handleSave}>
        <div className="space-y-4">
          <div><Label>Data *</Label><Input type="date" value={form.data} onChange={(e) => set("data", e.target.value)} /></div>
          <div><Label>Descrição *</Label><Input value={form.descricao} onChange={(e) => set("descricao", e.target.value)} /></div>
          <div className="flex items-center gap-3"><Switch checked={form.recorrente} onCheckedChange={(v) => set("recorrente", v)} /><Label>Recorrente</Label></div>
        </div>
      </FormModal>
      <ConfirmDialog open={!!deleteItem} onClose={() => setDeleteItem(null)} title="Excluir" description={`Excluir "${deleteItem?.descricao}"?`} onConfirm={() => { setData(data.filter(d=>d.id!==deleteItem?.id)); toast.success("Excluído"); setDeleteItem(null); }} />
    </DashboardLayout>
  );
}
