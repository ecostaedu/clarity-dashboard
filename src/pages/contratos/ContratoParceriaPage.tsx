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
import { Eye, Pencil, RefreshCw, XCircle, Plus } from "lucide-react";

const statusColor: Record<string, string> = { Ativo: "bg-emerald-100 text-emerald-700", Encerrado: "bg-muted text-muted-foreground", Vencido: "bg-amber-100 text-amber-700" };

const mockData = [
  { id: "1", nome: "Convênio Educacional USP", parceiro: "USP", data_inicio: "01/01/2024", data_termino: "31/12/2025", status: "Ativo", objeto: "" },
  { id: "2", nome: "Parceria TechSol", parceiro: "TechSol", data_inicio: "01/06/2023", data_termino: "01/06/2024", status: "Vencido", objeto: "" },
  { id: "3", nome: "Convênio SENAC", parceiro: "SENAC", data_inicio: "01/03/2024", data_termino: "01/03/2026", status: "Ativo", objeto: "" },
];

const emptyForm = { nome: "", parceiro: "", data_inicio: "", data_termino: "", objeto: "", status: "Ativo" };

export default function ContratoParceriaPage() {
  const [data, setData] = useState(mockData);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [renewItem, setRenewItem] = useState<any>(null);
  const [renewDate, setRenewDate] = useState("");
  const [endItem, setEndItem] = useState<any>(null);

  const set = (k: string, v: string) => setForm({ ...form, [k]: v });

  const columns: Column[] = [
    { key: "id", label: "ID" },
    { key: "nome", label: "Convênio", sortable: true },
    { key: "parceiro", label: "Parceiro", sortable: true },
    { key: "data_inicio", label: "Início" },
    { key: "data_termino", label: "Término" },
    { key: "status", label: "Status", render: (v) => <Badge className={statusColor[v] || ""}>{v}</Badge> },
  ];

  const filters: FilterConfig[] = [
    { key: "nome", label: "Nome", type: "text" },
    { key: "parceiro", label: "Parceiro", type: "text" },
    { key: "status", label: "Status", type: "select", options: [{ label: "Ativo", value: "Ativo" }, { label: "Encerrado", value: "Encerrado" }, { label: "Vencido", value: "Vencido" }] },
  ];

  const actions: ActionConfig[] = [
    { label: "Visualizar", icon: <Eye className="h-4 w-4" />, onClick: (r) => { setForm({ ...emptyForm, ...r }); setEditId(null); setModalOpen(true); } },
    { label: "Editar", icon: <Pencil className="h-4 w-4" />, onClick: (r) => { setForm({ ...emptyForm, ...r }); setEditId(r.id); setModalOpen(true); } },
    { label: "Renovar", icon: <RefreshCw className="h-4 w-4" />, onClick: (r) => setRenewItem(r) },
    { label: "Encerrar", icon: <XCircle className="h-4 w-4" />, onClick: (r) => setEndItem(r), variant: "destructive" },
  ];

  const handleSave = () => {
    if (!form.nome || !form.parceiro) { toast.error("Preencha campos obrigatórios"); return; }
    if (editId) { setData(data.map(d => d.id === editId ? { ...d, ...form } : d)); toast.success("Convênio atualizado"); }
    else { setData([...data, { ...form, id: String(data.length + 1) }]); toast.success("Convênio criado"); }
    setModalOpen(false); setEditId(null); setForm(emptyForm);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Contratos" }, { label: "Parceria / Convênio" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Contratos de Parceria / Convênio</h1><p className="text-sm text-muted-foreground mt-1">{data.length} convênios.</p></div>
          <Button onClick={() => { setForm(emptyForm); setEditId(null); setModalOpen(true); }}><Plus className="h-4 w-4 mr-2" />Novo Convênio</Button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>

      <FormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditId(null); }} title={editId ? "Editar Convênio" : "Novo Convênio"} onSave={handleSave} wide>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><Label>Nome do Convênio *</Label><Input value={form.nome} onChange={(e) => set("nome", e.target.value)} /></div>
          <div><Label>Parceiro *</Label><Select value={form.parceiro} onValueChange={(v) => set("parceiro", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{["USP","UNICAMP","TechSol","SENAC","RH Global"].map(e=><SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Data de Início</Label><Input type="date" value={form.data_inicio} onChange={(e) => set("data_inicio", e.target.value)} /></div>
          <div><Label>Data de Término</Label><Input type="date" value={form.data_termino} onChange={(e) => set("data_termino", e.target.value)} /></div>
          <div><Label>Status</Label><Select value={form.status} onValueChange={(v) => set("status", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Ativo">Ativo</SelectItem><SelectItem value="Encerrado">Encerrado</SelectItem></SelectContent></Select></div>
        </div>
        <div className="mt-4"><Label>Objeto do Convênio</Label><RichTextEditor value={form.objeto} onChange={(v) => set("objeto", v)} placeholder="Descreva o objeto..." /></div>
      </FormModal>

      <FormModal open={!!renewItem} onClose={() => setRenewItem(null)} title="Renovar Convênio" onSave={() => { if (renewItem) { setData(data.map(d => d.id === renewItem.id ? { ...d, data_termino: renewDate, status: "Ativo" } : d)); toast.success("Convênio renovado"); } setRenewItem(null); }}>
        <div><Label>Nova Data de Término</Label><Input type="date" value={renewDate} onChange={(e) => setRenewDate(e.target.value)} /></div>
      </FormModal>

      <ConfirmDialog open={!!endItem} onClose={() => setEndItem(null)} title="Encerrar Convênio" description={`Encerrar "${endItem?.nome}"?`} onConfirm={() => { setData(data.map(d => d.id === endItem?.id ? { ...d, status: "Encerrado" } : d)); toast.success("Convênio encerrado"); setEndItem(null); }} />
    </DashboardLayout>
  );
}
