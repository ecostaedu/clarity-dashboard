import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, type Column, type FilterConfig, type ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { TagsInput } from "@/components/TagsInput";
import { RichTextEditor } from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Eye, Pencil, Globe, Ban, ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "@/lib/masks";

const empresas = ["TechSol", "EduGlobal", "Construtora ABC"];
const provasDisponiveis = ["Teste Técnico React", "Teste Lógica", "Teste Comportamental"];

interface Etapa { nome: string; prova: string; }

const initialData = [
  { id: "1", titulo: "PS Dev Frontend 2024", empresa: "TechSol", tipo: "Estágio", vagas: 3, dataAbertura: "2024-03-01", dataEncerramento: "2024-04-30", descricao: "", requisitosObg: ["React"] as string[], requisitosDesej: [] as string[], etapas: [] as Etapa[], status: "active" },
  { id: "2", titulo: "PS Admin Q1", empresa: "EduGlobal", tipo: "Jovem Aprendiz", vagas: 5, dataAbertura: "2024-02-15", dataEncerramento: "2024-03-31", descricao: "", requisitosObg: [] as string[], requisitosDesej: [] as string[], etapas: [] as Etapa[], status: "pending" },
];

const emptyForm = { id: "", titulo: "", empresa: "", tipo: "Estágio", vagas: 1, dataAbertura: "", dataEncerramento: "", descricao: "", requisitosObg: [] as string[], requisitosDesej: [] as string[], etapas: [] as Etapa[], status: "pending" };

export default function CadastroProcessosPage() {
  const [data, setData] = useState(initialData);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [editing, setEditing] = useState(false);

  const columns: Column[] = [
    { key: "id", label: "ID", sortable: true },
    { key: "titulo", label: "Título", sortable: true },
    { key: "empresa", label: "Empresa", sortable: true },
    { key: "tipo", label: "Tipo", sortable: true },
    { key: "status", label: "Status", sortable: true, render: (v) => <StatusBadge status={v} /> },
  ];

  const filters: FilterConfig[] = [
    { key: "titulo", label: "Título", type: "text" },
    { key: "empresa", label: "Empresa", type: "select", options: empresas.map((e) => ({ label: e, value: e })) },
    { key: "status", label: "Status", type: "select", options: [{ label: "Ativo", value: "active" }, { label: "Pendente", value: "pending" }, { label: "Inativo", value: "inactive" }] },
  ];

  const actions: ActionConfig[] = [
    { label: "Visualizar", icon: <Eye className="h-4 w-4" />, onClick: (row) => { setSelected(row); setViewOpen(true); } },
    { label: "Editar", icon: <Pencil className="h-4 w-4" />, onClick: (row) => { setForm(row as any); setEditing(true); setModalOpen(true); } },
    {
      label: "Publicar/Despublicar", icon: <Globe className="h-4 w-4" />,
      onClick: (row) => {
        const ns = row.status === "active" ? "pending" : "active";
        setData(data.map((d) => d.id === row.id ? { ...d, status: ns } : d));
        toast.success(ns === "active" ? "Publicado!" : "Despublicado!");
      },
    },
    { label: "Inativar", icon: <Ban className="h-4 w-4" />, onClick: (row) => { setSelected(row); setConfirmOpen(true); }, variant: "destructive" },
  ];

  const handleSave = () => {
    if (!form.titulo || !form.empresa) { toast.error("Preencha os campos obrigatórios."); return; }
    if (editing) {
      setData(data.map((d) => d.id === form.id ? form : d));
      toast.success("Processo atualizado!");
    } else {
      setData([...data, { ...form, id: String(data.length + 1) }]);
      toast.success("Processo criado!");
    }
    setModalOpen(false); setForm({ ...emptyForm }); setEditing(false);
  };

  const handleInactivate = () => {
    setData(data.map((d) => d.id === selected?.id ? { ...d, status: "inactive" } : d));
    toast.success("Processo inativado.");
  };

  const addEtapa = () => setForm({ ...form, etapas: [...form.etapas, { nome: "", prova: "" }] });
  const removeEtapa = (i: number) => setForm({ ...form, etapas: form.etapas.filter((_, j) => j !== i) });
  const moveEtapa = (i: number, dir: -1 | 1) => { const a = [...form.etapas]; const n = i + dir; if (n < 0 || n >= a.length) return; [a[i], a[n]] = [a[n], a[i]]; setForm({ ...form, etapas: a }); };
  const updateEtapa = (i: number, f: keyof Etapa, v: string) => { const a = [...form.etapas]; a[i] = { ...a[i], [f]: v }; setForm({ ...form, etapas: a }); };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Recrutamento" }, { label: "Cadastro de Processos" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Cadastro de Processos</h1>
            <p className="text-sm text-muted-foreground mt-1">{data.length} processos cadastrados.</p>
          </div>
          <Button onClick={() => { setForm({ ...emptyForm }); setEditing(false); setModalOpen(true); }} className="gap-2"><Plus className="h-4 w-4" /> Novo Processo</Button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>

      <FormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(false); }} title={editing ? "Editar Processo" : "Novo Processo"} onSave={handleSave} wide>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>Título *</Label><Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} /></div>
            <div className="space-y-1.5">
              <Label>Empresa *</Label>
              <Select value={form.empresa} onValueChange={(v) => setForm({ ...form, empresa: v })}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{empresas.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent></Select>
            </div>
            <div className="space-y-1.5"><Label>Tipo</Label><Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Estágio">Estágio</SelectItem><SelectItem value="Jovem Aprendiz">Jovem Aprendiz</SelectItem></SelectContent></Select></div>
            <div className="space-y-1.5"><Label>Nº de Vagas</Label><Input type="number" value={form.vagas} onChange={(e) => setForm({ ...form, vagas: Number(e.target.value) })} /></div>
            <div className="space-y-1.5"><Label>Abertura</Label><Input type="date" value={form.dataAbertura} onChange={(e) => setForm({ ...form, dataAbertura: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Encerramento</Label><Input type="date" value={form.dataEncerramento} onChange={(e) => setForm({ ...form, dataEncerramento: e.target.value })} /></div>
          </div>
          <div className="space-y-1.5"><Label>Descrição</Label><RichTextEditor value={form.descricao} onChange={(v) => setForm({ ...form, descricao: v })} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>Requisitos Obrigatórios</Label><TagsInput value={form.requisitosObg} onChange={(v) => setForm({ ...form, requisitosObg: v })} /></div>
            <div className="space-y-1.5"><Label>Requisitos Desejáveis</Label><TagsInput value={form.requisitosDesej} onChange={(v) => setForm({ ...form, requisitosDesej: v })} /></div>
          </div>
          {/* Etapas */}
          <div>
            <div className="flex items-center justify-between mb-3"><h3 className="text-sm font-semibold">Etapas</h3><Button type="button" variant="outline" size="sm" onClick={addEtapa}><Plus className="h-3.5 w-3.5 mr-1" /> Etapa</Button></div>
            {form.etapas.map((et, i) => (
              <div key={i} className="flex items-center gap-3 p-2 mb-2 rounded-lg border border-border bg-muted/20">
                <div className="flex flex-col gap-0.5">
                  <Button type="button" variant="ghost" size="icon" className="h-5 w-5" onClick={() => moveEtapa(i, -1)} disabled={i === 0}><ChevronUp className="h-3 w-3" /></Button>
                  <Button type="button" variant="ghost" size="icon" className="h-5 w-5" onClick={() => moveEtapa(i, 1)} disabled={i === form.etapas.length - 1}><ChevronDown className="h-3 w-3" /></Button>
                </div>
                <span className="text-xs font-semibold text-muted-foreground w-5">{i + 1}.</span>
                <Input value={et.nome} onChange={(e) => updateEtapa(i, "nome", e.target.value)} placeholder="Etapa" className="h-8 text-sm flex-1" />
                <Select value={et.prova} onValueChange={(v) => updateEtapa(i, "prova", v)}><SelectTrigger className="h-8 text-sm w-48"><SelectValue placeholder="Prova" /></SelectTrigger><SelectContent><SelectItem value="__none__">Nenhuma</SelectItem>{provasDisponiveis.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select>
                <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeEtapa(i)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
              </div>
            ))}
          </div>
        </div>
      </FormModal>

      <FormModal open={viewOpen} onClose={() => setViewOpen(false)} title="Detalhes" onSave={() => setViewOpen(false)}>
        {selected && (
          <div className="space-y-2 text-sm">
            <div><span className="text-muted-foreground">Título:</span> {selected.titulo}</div>
            <div><span className="text-muted-foreground">Empresa:</span> {selected.empresa}</div>
            <div><span className="text-muted-foreground">Tipo:</span> {selected.tipo}</div>
            <div><span className="text-muted-foreground">Status:</span> <StatusBadge status={selected.status} /></div>
          </div>
        )}
      </FormModal>

      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleInactivate} title="Inativar Processo" description={`Deseja inativar "${selected?.titulo}"?`} confirmLabel="Inativar" variant="destructive" />
    </DashboardLayout>
  );
}
