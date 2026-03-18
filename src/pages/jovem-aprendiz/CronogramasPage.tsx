import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column, FilterConfig, ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";

interface Etapa { nome: string; data_inicio: string; data_termino: string; }
const mockData = [
  { id: "1", nome: "Cronograma Adm 2024", programa: "Aprendiz em Administração", data_inicio: "01/02/2024", data_termino: "01/12/2024", etapas: [{ nome: "Integração", data_inicio: "01/02/2024", data_termino: "15/02/2024" }, { nome: "Módulo 1", data_inicio: "16/02/2024", data_termino: "30/04/2024" }] },
  { id: "2", nome: "Cronograma TI 2024", programa: "Aprendiz em TI", data_inicio: "01/03/2024", data_termino: "01/12/2024", etapas: [{ nome: "Fundamentos", data_inicio: "01/03/2024", data_termino: "30/05/2024" }] },
];
const emptyForm = { nome: "", programa: "", data_inicio: "", data_termino: "" };

export default function CronogramasPage() {
  const [data, setData] = useState(mockData);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [etapas, setEtapas] = useState<Etapa[]>([{ nome: "", data_inicio: "", data_termino: "" }]);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteItem, setDeleteItem] = useState<any>(null);
  const set = (k: string, v: string) => setForm({ ...form, [k]: v });

  const columns: Column[] = [
    { key: "id", label: "ID" }, { key: "nome", label: "Nome", sortable: true },
    { key: "programa", label: "Programa" }, { key: "data_inicio", label: "Início" }, { key: "data_termino", label: "Término" },
  ];
  const filters: FilterConfig[] = [{ key: "nome", label: "Nome", type: "text" }, { key: "programa", label: "Programa", type: "text" }];
  const actions: ActionConfig[] = [
    { label: "Visualizar", icon: <Eye className="h-4 w-4" />, onClick: (r) => { setForm({ nome: r.nome, programa: r.programa, data_inicio: r.data_inicio, data_termino: r.data_termino }); setEtapas(r.etapas); setEditId(null); setModalOpen(true); } },
    { label: "Editar", icon: <Pencil className="h-4 w-4" />, onClick: (r) => { setForm({ nome: r.nome, programa: r.programa, data_inicio: r.data_inicio, data_termino: r.data_termino }); setEtapas(r.etapas); setEditId(r.id); setModalOpen(true); } },
    { label: "Excluir", icon: <Trash2 className="h-4 w-4" />, onClick: (r) => setDeleteItem(r), variant: "destructive" },
  ];

  const handleSave = () => {
    if (!form.nome) { toast.error("Nome obrigatório"); return; }
    const item = { ...form, etapas: etapas.filter(e => e.nome) };
    if (editId) { setData(data.map(d => d.id === editId ? { ...d, ...item } : d)); toast.success("Atualizado"); }
    else { setData([...data, { ...item, id: String(data.length + 1) }]); toast.success("Criado"); }
    setModalOpen(false); setEditId(null); setForm(emptyForm); setEtapas([{ nome: "", data_inicio: "", data_termino: "" }]);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Jovem Aprendiz" }, { label: "Cronogramas" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Cronogramas</h1><p className="text-sm text-muted-foreground mt-1">{data.length} cronogramas.</p></div>
          <button onClick={() => { setForm(emptyForm); setEtapas([{ nome: "", data_inicio: "", data_termino: "" }]); setEditId(null); setModalOpen(true); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"><Plus className="h-4 w-4" />Novo Cronograma</button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>
      <FormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditId(null); }} title={editId ? "Editar" : "Novo Cronograma"} onSave={handleSave} wide>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Nome *</Label><Input value={form.nome} onChange={(e) => set("nome", e.target.value)} /></div>
          <div><Label>Programa</Label><Select value={form.programa} onValueChange={(v) => set("programa", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{["Aprendiz em Administração","Aprendiz em TI","Aprendiz em Logística"].map(e=><SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Data Início</Label><Input type="date" value={form.data_inicio} onChange={(e) => set("data_inicio", e.target.value)} /></div>
          <div><Label>Data Término</Label><Input type="date" value={form.data_termino} onChange={(e) => set("data_termino", e.target.value)} /></div>
        </div>
        <div className="mt-4">
          <Label>Etapas</Label>
          <div className="space-y-2 mt-2">{etapas.map((et, i) => (
            <div key={i} className="grid grid-cols-[1fr_120px_120px_auto] gap-2 items-end">
              <Input placeholder="Nome da Etapa" value={et.nome} onChange={(e) => { const n=[...etapas]; n[i]={...n[i],nome:e.target.value}; setEtapas(n); }} />
              <Input type="date" value={et.data_inicio} onChange={(e) => { const n=[...etapas]; n[i]={...n[i],data_inicio:e.target.value}; setEtapas(n); }} />
              <Input type="date" value={et.data_termino} onChange={(e) => { const n=[...etapas]; n[i]={...n[i],data_termino:e.target.value}; setEtapas(n); }} />
              <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setEtapas(etapas.filter((_,j)=>j!==i))}><Trash2 className="h-3 w-3" /></Button>
            </div>
          ))}</div>
          <Button variant="outline" size="sm" className="mt-2" onClick={() => setEtapas([...etapas, { nome: "", data_inicio: "", data_termino: "" }])}><Plus className="h-3 w-3 mr-1" />Adicionar Etapa</Button>
        </div>
      </FormModal>
      <ConfirmDialog open={!!deleteItem} onClose={() => setDeleteItem(null)} title="Excluir" description={`Excluir "${deleteItem?.nome}"?`} onConfirm={() => { setData(data.filter(d=>d.id!==deleteItem?.id)); toast.success("Excluído"); setDeleteItem(null); }} />
    </DashboardLayout>
  );
}
