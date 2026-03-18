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
import { Eye, Pencil, XCircle, Plus } from "lucide-react";

const mockData = [
  { id: "1", nome: "Sala 101", capacidade: 30, localizacao: "Bloco A", ativo: true },
  { id: "2", nome: "Lab 03", capacidade: 20, localizacao: "Bloco B", ativo: true },
  { id: "3", nome: "Sala 205", capacidade: 40, localizacao: "Bloco A", ativo: false },
];

const emptyForm = { nome: "", capacidade: "", localizacao: "", ativo: true };

export default function SalasPage() {
  const [data, setData] = useState(mockData);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [inactivateItem, setInactivateItem] = useState<any>(null);
  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  const columns: Column[] = [
    { key: "nome", label: "Nome", sortable: true },
    { key: "capacidade", label: "Capacidade" },
    { key: "localizacao", label: "Localização" },
    { key: "ativo", label: "Ativo", render: (v) => <Badge className={v ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}>{v ? "Sim" : "Não"}</Badge> },
  ];
  const filters: FilterConfig[] = [{ key: "nome", label: "Nome", type: "text" }, { key: "localizacao", label: "Localização", type: "text" }];
  const actions: ActionConfig[] = [
    { label: "Visualizar", icon: <Eye className="h-4 w-4" />, onClick: (r) => { setForm({ nome: r.nome, capacidade: String(r.capacidade), localizacao: r.localizacao, ativo: r.ativo }); setEditId(null); setModalOpen(true); } },
    { label: "Editar", icon: <Pencil className="h-4 w-4" />, onClick: (r) => { setForm({ nome: r.nome, capacidade: String(r.capacidade), localizacao: r.localizacao, ativo: r.ativo }); setEditId(r.id); setModalOpen(true); } },
    { label: "Inativar", icon: <XCircle className="h-4 w-4" />, onClick: (r) => setInactivateItem(r), variant: "destructive" },
  ];

  const handleSave = () => {
    if (!form.nome) { toast.error("Nome obrigatório"); return; }
    if (editId) { setData(data.map(d => d.id === editId ? { ...d, ...form, capacidade: Number(form.capacidade) } : d)); toast.success("Sala atualizada"); }
    else { setData([...data, { ...form, capacidade: Number(form.capacidade), id: String(data.length + 1) }]); toast.success("Sala criada"); }
    setModalOpen(false); setEditId(null); setForm(emptyForm);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Jovem Aprendiz" }, { label: "Salas" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Cadastro de Salas</h1><p className="text-sm text-muted-foreground mt-1">{data.length} salas.</p></div>
          <button onClick={() => { setForm(emptyForm); setEditId(null); setModalOpen(true); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"><Plus className="h-4 w-4" />Nova Sala</button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>
      <FormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditId(null); }} title={editId ? "Editar Sala" : "Nova Sala"} onSave={handleSave}>
        <div className="space-y-4">
          <div><Label>Nome *</Label><Input value={form.nome} onChange={(e) => set("nome", e.target.value)} /></div>
          <div><Label>Capacidade</Label><Input type="number" value={form.capacidade} onChange={(e) => set("capacidade", e.target.value)} /></div>
          <div><Label>Localização</Label><Input value={form.localizacao} onChange={(e) => set("localizacao", e.target.value)} /></div>
          <div className="flex items-center gap-3"><Switch checked={form.ativo} onCheckedChange={(v) => set("ativo", v)} /><Label>Ativo</Label></div>
        </div>
      </FormModal>
      <ConfirmDialog open={!!inactivateItem} onClose={() => setInactivateItem(null)} title="Inativar Sala" description={`Inativar "${inactivateItem?.nome}"?`} onConfirm={() => { setData(data.map(d => d.id === inactivateItem?.id ? { ...d, ativo: false } : d)); toast.success("Sala inativada"); setInactivateItem(null); }} />
    </DashboardLayout>
  );
}
