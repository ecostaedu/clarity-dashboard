import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column, FilterConfig, ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { RichTextEditor } from "@/components/RichTextEditor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";

const mockData = [
  { id: "1", aprendiz: "Lucas Lima", data_registro: "10/03/2024", descricao: "Visita domiciliar realizada" },
  { id: "2", aprendiz: "Ana Costa", data_registro: "08/03/2024", descricao: "Acompanhamento familiar" },
];
const emptyForm = { aprendiz: "", data_registro: "", descricao: "" };

export default function RegistroSocialPage() {
  const [data, setData] = useState(mockData);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteItem, setDeleteItem] = useState<any>(null);
  const set = (k: string, v: string) => setForm({ ...form, [k]: v });

  const columns: Column[] = [
    { key: "id", label: "ID" }, { key: "aprendiz", label: "Aprendiz", sortable: true },
    { key: "data_registro", label: "Data" }, { key: "descricao", label: "Descrição" },
  ];
  const filters: FilterConfig[] = [{ key: "aprendiz", label: "Aprendiz", type: "text" }];
  const actions: ActionConfig[] = [
    { label: "Visualizar", icon: <Eye className="h-4 w-4" />, onClick: (r) => { setForm({...emptyForm,...r}); setEditId(null); setModalOpen(true); } },
    { label: "Editar", icon: <Pencil className="h-4 w-4" />, onClick: (r) => { setForm({...emptyForm,...r}); setEditId(r.id); setModalOpen(true); } },
    { label: "Excluir", icon: <Trash2 className="h-4 w-4" />, onClick: (r) => setDeleteItem(r), variant: "destructive" },
  ];

  const handleSave = () => {
    if (!form.aprendiz) { toast.error("Preencha campos obrigatórios"); return; }
    if (editId) { setData(data.map(d => d.id === editId ? {...d,...form} : d)); toast.success("Atualizado"); }
    else { setData([...data, {...form, id: String(data.length+1)}]); toast.success("Registro criado"); toast.info("Notificação enviada"); }
    setModalOpen(false); setEditId(null); setForm(emptyForm);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Jovem Aprendiz" }, { label: "Registro Social" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Registro Social</h1><p className="text-sm text-muted-foreground mt-1">{data.length} registros.</p></div>
          <button onClick={() => { setForm(emptyForm); setEditId(null); setModalOpen(true); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"><Plus className="h-4 w-4" />Novo Registro</button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>
      <FormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditId(null); }} title={editId ? "Editar" : "Novo Registro Social"} onSave={handleSave} wide>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Aprendiz *</Label><Select value={form.aprendiz} onValueChange={(v) => set("aprendiz", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{["Lucas Lima","Ana Costa","Pedro Santos"].map(e=><SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Data do Registro</Label><Input type="date" value={form.data_registro} onChange={(e) => set("data_registro", e.target.value)} /></div>
        </div>
        <div className="mt-4"><Label>Descrição</Label><RichTextEditor value={form.descricao} onChange={(v) => set("descricao", v)} /></div>
      </FormModal>
      <ConfirmDialog open={!!deleteItem} onClose={() => setDeleteItem(null)} title="Excluir" description="Confirma?" onConfirm={() => { setData(data.filter(d=>d.id!==deleteItem?.id)); toast.success("Excluído"); setDeleteItem(null); }} />
    </DashboardLayout>
  );
}
