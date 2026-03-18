import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column, FilterConfig, ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, Pencil, Trash2, FileDown, Plus } from "lucide-react";

const mockData = [
  { id: "1", aprendiz: "Lucas Lima", data_inicio: "01/07/2024", data_termino: "15/07/2024", obs: "" },
  { id: "2", aprendiz: "Ana Costa", data_inicio: "15/07/2024", data_termino: "30/07/2024", obs: "" },
];
const emptyForm = { aprendiz: "", data_inicio: "", data_termino: "", obs: "" };

export default function FeriasJAPage() {
  const [data, setData] = useState(mockData);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteItem, setDeleteItem] = useState<any>(null);
  const set = (k: string, v: string) => setForm({ ...form, [k]: v });

  const columns: Column[] = [
    { key: "id", label: "ID" }, { key: "aprendiz", label: "Aprendiz", sortable: true },
    { key: "data_inicio", label: "Início" }, { key: "data_termino", label: "Término" },
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
    else { setData([...data, {...form, id: String(data.length+1)}]); toast.success("Criado"); }
    setModalOpen(false); setEditId(null); setForm(emptyForm);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Jovem Aprendiz" }, { label: "Férias" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Férias</h1><p className="text-sm text-muted-foreground mt-1">{data.length} registros.</p></div>
          <button onClick={() => { setForm(emptyForm); setEditId(null); setModalOpen(true); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"><Plus className="h-4 w-4" />Novo Período</button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>
      <FormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditId(null); }} title={editId ? "Editar" : "Novo Período de Férias"} onSave={handleSave}>
        <div className="space-y-4">
          <div><Label>Aprendiz *</Label><Select value={form.aprendiz} onValueChange={(v) => set("aprendiz", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{["Lucas Lima","Ana Costa","Pedro Santos"].map(e=><SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent></Select></div>
          <div className="grid grid-cols-2 gap-3"><div><Label>Início</Label><Input type="date" value={form.data_inicio} onChange={(e) => set("data_inicio", e.target.value)} /></div><div><Label>Término</Label><Input type="date" value={form.data_termino} onChange={(e) => set("data_termino", e.target.value)} /></div></div>
          <div><Label>Observações</Label><Textarea value={form.obs} onChange={(e) => set("obs", e.target.value)} /></div>
          <Button variant="outline" onClick={() => toast.success("PDF gerado")}><FileDown className="h-4 w-4 mr-2" />Gerar PDF</Button>
        </div>
      </FormModal>
      <ConfirmDialog open={!!deleteItem} onClose={() => setDeleteItem(null)} title="Excluir" description="Confirma?" onConfirm={() => { setData(data.filter(d=>d.id!==deleteItem?.id)); toast.success("Excluído"); setDeleteItem(null); }} />
    </DashboardLayout>
  );
}
