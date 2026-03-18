import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column, FilterConfig, ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, Pencil, CheckCircle, Trash2, FileDown, Plus } from "lucide-react";

const mockData = [
  { id: "1", turma: "Aprendiz em Administração", mes_ano: "03/2024", dias: 20, fj: 1, fi: 0, status: "Pendente", obs: "" },
  { id: "2", turma: "Aprendiz em TI", mes_ano: "03/2024", dias: 18, fj: 0, fi: 2, status: "Validado", obs: "" },
];
const emptyForm = { turma: "", mes_ano: "", dias: "", fj: "", fi: "", obs: "" };

export default function FrequenciaJAPage() {
  const [data, setData] = useState(mockData);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteItem, setDeleteItem] = useState<any>(null);
  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  const columns: Column[] = [
    { key: "id", label: "ID" }, { key: "turma", label: "Turma", sortable: true }, { key: "mes_ano", label: "Mês/Ano" },
    { key: "dias", label: "Dias" },
    { key: "status", label: "Status", render: (v) => <Badge className={v === "Validado" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>{v}</Badge> },
  ];
  const filters: FilterConfig[] = [{ key: "turma", label: "Turma", type: "text" }, { key: "mes_ano", label: "Mês/Ano", type: "text" }];
  const actions: ActionConfig[] = [
    { label: "Visualizar", icon: <Eye className="h-4 w-4" />, onClick: (r) => { setForm({...emptyForm,...r,dias:String(r.dias),fj:String(r.fj),fi:String(r.fi)}); setEditId(null); setModalOpen(true); } },
    { label: "Editar", icon: <Pencil className="h-4 w-4" />, onClick: (r) => { setForm({...emptyForm,...r,dias:String(r.dias),fj:String(r.fj),fi:String(r.fi)}); setEditId(r.id); setModalOpen(true); } },
    { label: "Validar", icon: <CheckCircle className="h-4 w-4" />, onClick: (r) => { setData(data.map(d=>d.id===r.id?{...d,status:"Validado"}:d)); toast.success("Validado"); } },
    { label: "Excluir", icon: <Trash2 className="h-4 w-4" />, onClick: (r) => setDeleteItem(r), variant: "destructive" },
  ];

  const handleSave = () => {
    if (!form.turma) { toast.error("Preencha campos obrigatórios"); return; }
    const item = {...form, dias: Number(form.dias), fj: Number(form.fj), fi: Number(form.fi), status: "Pendente"};
    if (editId) { setData(data.map(d => d.id === editId ? {...d,...item} : d)); toast.success("Atualizado"); }
    else { setData([...data, {...item, id: String(data.length+1)} as any]); toast.success("Criado"); }
    setModalOpen(false); setEditId(null); setForm(emptyForm);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Jovem Aprendiz" }, { label: "Frequência" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Lista de Frequência</h1><p className="text-sm text-muted-foreground mt-1">{data.length} registros.</p></div>
          <button onClick={() => { setForm(emptyForm); setEditId(null); setModalOpen(true); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"><Plus className="h-4 w-4" />Nova Frequência</button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>
      <FormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditId(null); }} title={editId ? "Editar" : "Nova Frequência"} onSave={handleSave}>
        <div className="space-y-4">
          <div><Label>Turma *</Label><Select value={form.turma} onValueChange={(v) => set("turma", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{["Aprendiz em Administração","Aprendiz em TI"].map(e=><SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Mês/Ano</Label><Input type="month" value={form.mes_ano} onChange={(e) => set("mes_ano", e.target.value)} /></div>
          <div className="grid grid-cols-3 gap-3">
            <div><Label>Dias Presentes</Label><Input type="number" value={form.dias} onChange={(e) => set("dias", e.target.value)} /></div>
            <div><Label>Faltas Justif.</Label><Input type="number" value={form.fj} onChange={(e) => set("fj", e.target.value)} /></div>
            <div><Label>Faltas Injustif.</Label><Input type="number" value={form.fi} onChange={(e) => set("fi", e.target.value)} /></div>
          </div>
          <div><Label>Observações</Label><Textarea value={form.obs} onChange={(e) => set("obs", e.target.value)} /></div>
          <Button variant="outline" onClick={() => toast.success("PDF gerado")}><FileDown className="h-4 w-4 mr-2" />Gerar PDF</Button>
        </div>
      </FormModal>
      <ConfirmDialog open={!!deleteItem} onClose={() => setDeleteItem(null)} title="Excluir" description="Confirma?" onConfirm={() => { setData(data.filter(d=>d.id!==deleteItem?.id)); toast.success("Excluído"); setDeleteItem(null); }} />
    </DashboardLayout>
  );
}
