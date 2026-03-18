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

const tipoColor: Record<string, string> = { Falta: "bg-destructive/10 text-destructive", Atraso: "bg-amber-100 text-amber-700", Advertência: "bg-orange-100 text-orange-700", Elogio: "bg-emerald-100 text-emerald-700" };
const mockData = [
  { id: "1", aprendiz: "Lucas Lima", tipo: "Advertência", data: "10/03/2024", descricao: "Atraso recorrente", status: "Registrado" },
  { id: "2", aprendiz: "Ana Costa", tipo: "Elogio", data: "08/03/2024", descricao: "Destaque no projeto", status: "Registrado" },
  { id: "3", aprendiz: "Pedro Santos", tipo: "Falta", data: "05/03/2024", descricao: "Falta sem justificativa", status: "Registrado" },
];
const emptyForm = { aprendiz: "", tipo: "", data: "", descricao: "" };

export default function OcorrenciasJAPage() {
  const [data, setData] = useState(mockData);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteItem, setDeleteItem] = useState<any>(null);
  const set = (k: string, v: string) => setForm({ ...form, [k]: v });

  const columns: Column[] = [
    { key: "id", label: "ID" }, { key: "aprendiz", label: "Aprendiz", sortable: true },
    { key: "tipo", label: "Tipo", render: (v) => <Badge className={tipoColor[v] || ""}>{v}</Badge> },
    { key: "data", label: "Data", sortable: true }, { key: "status", label: "Status" },
  ];
  const filters: FilterConfig[] = [{ key: "aprendiz", label: "Aprendiz", type: "text" }, { key: "tipo", label: "Tipo", type: "select", options: ["Falta","Atraso","Advertência","Elogio"].map(t=>({label:t,value:t})) }];
  const actions: ActionConfig[] = [
    { label: "Visualizar", icon: <Eye className="h-4 w-4" />, onClick: (r) => { setForm({...emptyForm,...r}); setEditId(null); setModalOpen(true); } },
    { label: "Editar", icon: <Pencil className="h-4 w-4" />, onClick: (r) => { setForm({...emptyForm,...r}); setEditId(r.id); setModalOpen(true); } },
    { label: "Excluir", icon: <Trash2 className="h-4 w-4" />, onClick: (r) => setDeleteItem(r), variant: "destructive" },
  ];

  const handleSave = () => {
    if (!form.aprendiz || !form.tipo) { toast.error("Preencha campos obrigatórios"); return; }
    if (editId) { setData(data.map(d => d.id === editId ? {...d,...form} : d)); toast.success("Ocorrência atualizada"); }
    else { setData([...data, {...form, id: String(data.length+1), status: "Registrado"}]); toast.success("Ocorrência registrada"); toast.info("Notificação enviada aos responsáveis"); }
    setModalOpen(false); setEditId(null); setForm(emptyForm);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Jovem Aprendiz" }, { label: "Ocorrências" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Cadastro de Ocorrências</h1><p className="text-sm text-muted-foreground mt-1">{data.length} registros.</p></div>
          <button onClick={() => { setForm(emptyForm); setEditId(null); setModalOpen(true); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"><Plus className="h-4 w-4" />Nova Ocorrência</button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>
      <FormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditId(null); }} title={editId ? "Editar Ocorrência" : "Nova Ocorrência"} onSave={handleSave} wide>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Aprendiz *</Label><Select value={form.aprendiz} onValueChange={(v) => set("aprendiz", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{["Lucas Lima","Ana Costa","Pedro Santos"].map(e=><SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Tipo *</Label><Select value={form.tipo} onValueChange={(v) => set("tipo", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{["Falta","Atraso","Advertência","Elogio"].map(e=><SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Data</Label><Input type="date" value={form.data} onChange={(e) => set("data", e.target.value)} /></div>
        </div>
        <div className="mt-4"><Label>Descrição</Label><RichTextEditor value={form.descricao} onChange={(v) => set("descricao", v)} /></div>
      </FormModal>
      <ConfirmDialog open={!!deleteItem} onClose={() => setDeleteItem(null)} title="Excluir" description={`Excluir ocorrência?`} onConfirm={() => { setData(data.filter(d=>d.id!==deleteItem?.id)); toast.success("Excluído"); setDeleteItem(null); }} />
    </DashboardLayout>
  );
}
