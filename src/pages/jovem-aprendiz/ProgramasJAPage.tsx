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
  { id: "1", numero: "001", nome: "Aprendiz em Administração", carga_horaria: 800, municipio: "São Paulo", ativo: true },
  { id: "2", numero: "002", nome: "Aprendiz em TI", carga_horaria: 960, municipio: "São Paulo", ativo: true },
  { id: "3", numero: "003", nome: "Aprendiz em Logística", carga_horaria: 640, municipio: "Campinas", ativo: false },
];

const emptyForm = { numero: "", nome: "", carga_horaria: "", municipio: "", ativo: true };

export default function ProgramasJAPage() {
  const [data, setData] = useState(mockData);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [inactivateItem, setInactivateItem] = useState<any>(null);
  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  const columns: Column[] = [
    { key: "numero", label: "#", sortable: true },
    { key: "nome", label: "Programa", sortable: true },
    { key: "carga_horaria", label: "Horas" },
    { key: "municipio", label: "Município", sortable: true },
    { key: "ativo", label: "Status", render: (v) => <Badge className={v ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}>{v ? "Ativo" : "Inativo"}</Badge> },
  ];
  const filters: FilterConfig[] = [{ key: "nome", label: "Nome", type: "text" }, { key: "municipio", label: "Município", type: "text" }];
  const actions: ActionConfig[] = [
    { label: "Visualizar", icon: <Eye className="h-4 w-4" />, onClick: (r) => { setForm({ numero: r.numero, nome: r.nome, carga_horaria: String(r.carga_horaria), municipio: r.municipio, ativo: r.ativo }); setEditId(null); setModalOpen(true); } },
    { label: "Editar", icon: <Pencil className="h-4 w-4" />, onClick: (r) => { setForm({ numero: r.numero, nome: r.nome, carga_horaria: String(r.carga_horaria), municipio: r.municipio, ativo: r.ativo }); setEditId(r.id); setModalOpen(true); } },
    { label: "Inativar", icon: <XCircle className="h-4 w-4" />, onClick: (r) => setInactivateItem(r), variant: "destructive" },
  ];

  const handleSave = () => {
    if (!form.numero || !form.nome) { toast.error("Preencha campos obrigatórios"); return; }
    if (editId) { setData(data.map(d => d.id === editId ? { ...d, ...form, carga_horaria: Number(form.carga_horaria) } : d)); toast.success("Programa atualizado"); }
    else { setData([...data, { ...form, carga_horaria: Number(form.carga_horaria), id: String(data.length + 1) }]); toast.success("Programa criado"); }
    setModalOpen(false); setEditId(null); setForm(emptyForm);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Jovem Aprendiz" }, { label: "Programas" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Programas</h1><p className="text-sm text-muted-foreground mt-1">{data.length} programas.</p></div>
          <button onClick={() => { setForm(emptyForm); setEditId(null); setModalOpen(true); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"><Plus className="h-4 w-4" />Novo Programa</button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>
      <FormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditId(null); }} title={editId ? "Editar Programa" : "Novo Programa"} onSave={handleSave}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Número *</Label><Input value={form.numero} onChange={(e) => set("numero", e.target.value)} /></div>
            <div><Label>Nome *</Label><Input value={form.nome} onChange={(e) => set("nome", e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Carga Horária Total</Label><Input type="number" value={form.carga_horaria} onChange={(e) => set("carga_horaria", e.target.value)} /></div>
            <div><Label>Município</Label><Input value={form.municipio} onChange={(e) => set("municipio", e.target.value)} /></div>
          </div>
          <div className="flex items-center gap-3"><Switch checked={form.ativo} onCheckedChange={(v) => set("ativo", v)} /><Label>Ativo</Label></div>
        </div>
      </FormModal>
      <ConfirmDialog open={!!inactivateItem} onClose={() => setInactivateItem(null)} title="Inativar Programa" description={`Inativar "${inactivateItem?.nome}"?`} onConfirm={() => { setData(data.map(d => d.id === inactivateItem?.id ? { ...d, ativo: false } : d)); toast.success("Programa inativado"); setInactivateItem(null); }} />
    </DashboardLayout>
  );
}
