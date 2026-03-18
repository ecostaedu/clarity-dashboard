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
  { id: "1", estagiario: "João Silva", mes_ano: "03/2024", dias_trabalhados: 20, faltas_just: 1, faltas_injust: 0, status: "Pendente", obs: "" },
  { id: "2", estagiario: "Maria Oliveira", mes_ano: "03/2024", dias_trabalhados: 18, faltas_just: 0, faltas_injust: 2, status: "Validado", obs: "" },
  { id: "3", estagiario: "Pedro Santos", mes_ano: "02/2024", dias_trabalhados: 22, faltas_just: 0, faltas_injust: 0, status: "Validado", obs: "" },
];

const emptyForm = { estagiario: "", mes_ano: "", dias_trabalhados: "", faltas_just: "", faltas_injust: "", obs: "" };

export default function FrequenciaPage() {
  const [data, setData] = useState(mockData);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteItem, setDeleteItem] = useState<any>(null);

  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  const columns: Column[] = [
    { key: "id", label: "ID" },
    { key: "estagiario", label: "Estagiário", sortable: true },
    { key: "mes_ano", label: "Mês/Ano", sortable: true },
    { key: "dias_trabalhados", label: "Dias Trab." },
    { key: "status", label: "Status", render: (v) => <Badge className={v === "Validado" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>{v}</Badge> },
  ];

  const filters: FilterConfig[] = [
    { key: "estagiario", label: "Estagiário", type: "text" },
    { key: "mes_ano", label: "Mês/Ano", type: "text" },
  ];

  const actions: ActionConfig[] = [
    { label: "Visualizar", icon: <Eye className="h-4 w-4" />, onClick: (r) => { setForm({ ...emptyForm, ...r, dias_trabalhados: String(r.dias_trabalhados), faltas_just: String(r.faltas_just), faltas_injust: String(r.faltas_injust) }); setEditId(null); setModalOpen(true); } },
    { label: "Editar", icon: <Pencil className="h-4 w-4" />, onClick: (r) => { setForm({ ...emptyForm, ...r, dias_trabalhados: String(r.dias_trabalhados), faltas_just: String(r.faltas_just), faltas_injust: String(r.faltas_injust) }); setEditId(r.id); setModalOpen(true); } },
    { label: "Validar", icon: <CheckCircle className="h-4 w-4" />, onClick: (r) => { setData(data.map(d => d.id === r.id ? { ...d, status: "Validado" } : d)); toast.success("Ateste validado"); } },
    { label: "Excluir", icon: <Trash2 className="h-4 w-4" />, onClick: (r) => setDeleteItem(r), variant: "destructive" },
  ];

  const handleSave = () => {
    if (!form.estagiario || !form.mes_ano) { toast.error("Preencha campos obrigatórios"); return; }
    const item = { ...form, dias_trabalhados: Number(form.dias_trabalhados), faltas_just: Number(form.faltas_just), faltas_injust: Number(form.faltas_injust), status: "Pendente" };
    if (editId) { setData(data.map(d => d.id === editId ? { ...d, ...item } : d)); toast.success("Ateste atualizado"); }
    else { setData([...data, { ...item, id: String(data.length + 1) } as any]); toast.success("Ateste criado"); }
    setModalOpen(false); setEditId(null); setForm(emptyForm);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Gestão de Estágio" }, { label: "Frequência" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Ateste de Frequência</h1><p className="text-sm text-muted-foreground mt-1">{data.length} registros.</p></div>
          <Button onClick={() => { setForm(emptyForm); setEditId(null); setModalOpen(true); }}><Plus className="h-4 w-4 mr-2" />Novo Ateste</Button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>

      <FormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditId(null); }} title={editId ? "Editar Ateste" : "Novo Ateste"} onSave={handleSave}>
        <div className="space-y-4">
          <div><Label>Estagiário *</Label><Select value={form.estagiario} onValueChange={(v) => set("estagiario", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{["João Silva","Maria Oliveira","Pedro Santos"].map(e=><SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Mês/Ano *</Label><Input type="month" value={form.mes_ano} onChange={(e) => set("mes_ano", e.target.value)} /></div>
          <div className="grid grid-cols-3 gap-3">
            <div><Label>Dias Trabalhados</Label><Input type="number" value={form.dias_trabalhados} onChange={(e) => set("dias_trabalhados", e.target.value)} /></div>
            <div><Label>Faltas Justif.</Label><Input type="number" value={form.faltas_just} onChange={(e) => set("faltas_just", e.target.value)} /></div>
            <div><Label>Faltas Injustif.</Label><Input type="number" value={form.faltas_injust} onChange={(e) => set("faltas_injust", e.target.value)} /></div>
          </div>
          <div><Label>Observações</Label><Textarea value={form.obs} onChange={(e) => set("obs", e.target.value)} /></div>
          <Button variant="outline" onClick={() => toast.success("PDF gerado com sucesso")}><FileDown className="h-4 w-4 mr-2" />Gerar PDF</Button>
        </div>
      </FormModal>

      <ConfirmDialog open={!!deleteItem} onClose={() => setDeleteItem(null)} title="Excluir Ateste" description="Confirma exclusão?" onConfirm={() => { setData(data.filter(d => d.id !== deleteItem?.id)); toast.success("Excluído"); setDeleteItem(null); }} />
    </DashboardLayout>
  );
}
