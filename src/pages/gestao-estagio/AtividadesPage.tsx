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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, Pencil, Trash2, FileDown, Plus } from "lucide-react";

const mockData = [
  { id: "1", estagiario: "João Silva", mes_ano: "03/2024", status: "Entregue", atividades: "", avaliacao: "" },
  { id: "2", estagiario: "Maria Oliveira", mes_ano: "03/2024", status: "Pendente", atividades: "", avaliacao: "" },
  { id: "3", estagiario: "Pedro Santos", mes_ano: "02/2024", status: "Entregue", atividades: "", avaliacao: "" },
];

const emptyForm = { estagiario: "", mes_ano: "", atividades: "", avaliacao: "" };

export default function AtividadesPage() {
  const [data, setData] = useState(mockData);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteItem, setDeleteItem] = useState<any>(null);

  const set = (k: string, v: string) => setForm({ ...form, [k]: v });

  const columns: Column[] = [
    { key: "id", label: "ID" },
    { key: "estagiario", label: "Estagiário", sortable: true },
    { key: "mes_ano", label: "Mês/Ano", sortable: true },
    { key: "status", label: "Status", render: (v) => <Badge className={v === "Entregue" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>{v}</Badge> },
  ];

  const filters: FilterConfig[] = [
    { key: "estagiario", label: "Estagiário", type: "text" },
    { key: "mes_ano", label: "Mês/Ano", type: "text" },
  ];

  const actions: ActionConfig[] = [
    { label: "Visualizar", icon: <Eye className="h-4 w-4" />, onClick: (r) => { setForm({ ...emptyForm, ...r }); setEditId(null); setModalOpen(true); } },
    { label: "Editar", icon: <Pencil className="h-4 w-4" />, onClick: (r) => { setForm({ ...emptyForm, ...r }); setEditId(r.id); setModalOpen(true); } },
    { label: "Excluir", icon: <Trash2 className="h-4 w-4" />, onClick: (r) => setDeleteItem(r), variant: "destructive" },
  ];

  const handleSave = () => {
    if (!form.estagiario) { toast.error("Preencha campos obrigatórios"); return; }
    if (editId) { setData(data.map(d => d.id === editId ? { ...d, ...form, status: "Entregue" } : d)); toast.success("Relatório atualizado"); }
    else { setData([...data, { ...form, id: String(data.length + 1), status: "Pendente" }]); toast.success("Relatório criado"); }
    setModalOpen(false); setEditId(null); setForm(emptyForm);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Gestão de Estágio" }, { label: "Atividades" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Relatório de Atividades</h1><p className="text-sm text-muted-foreground mt-1">{data.length} relatórios.</p></div>
          <Button onClick={() => { setForm(emptyForm); setEditId(null); setModalOpen(true); }}><Plus className="h-4 w-4 mr-2" />Novo Relatório</Button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>

      <FormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditId(null); }} title={editId ? "Editar Relatório" : "Novo Relatório"} onSave={handleSave} wide>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Estagiário *</Label><Select value={form.estagiario} onValueChange={(v) => set("estagiario", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{["João Silva","Maria Oliveira","Pedro Santos"].map(e=><SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent></Select></div>
            <div><Label>Mês/Ano</Label><Input type="month" value={form.mes_ano} onChange={(e) => set("mes_ano", e.target.value)} /></div>
          </div>
          <div><Label>Atividades Desenvolvidas</Label><RichTextEditor value={form.atividades} onChange={(v) => set("atividades", v)} placeholder="Descreva as atividades..." /></div>
          <div><Label>Avaliação do Supervisor</Label><RichTextEditor value={form.avaliacao} onChange={(v) => set("avaliacao", v)} placeholder="Avaliação..." /></div>
          <Button variant="outline" onClick={() => toast.success("PDF gerado com sucesso")}><FileDown className="h-4 w-4 mr-2" />Gerar PDF</Button>
        </div>
      </FormModal>

      <ConfirmDialog open={!!deleteItem} onClose={() => setDeleteItem(null)} title="Excluir Relatório" description="Confirma exclusão?" onConfirm={() => { setData(data.filter(d => d.id !== deleteItem?.id)); toast.success("Excluído"); setDeleteItem(null); }} />
    </DashboardLayout>
  );
}
