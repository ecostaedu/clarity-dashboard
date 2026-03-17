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
import { Plus, Eye, Pencil, XCircle, FileDown, ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "@/lib/masks";

const empresas = ["TechSol", "EduGlobal", "Construtora ABC"];

interface Etapa { nome: string; prova: string; }

const initialData = [
  { id: "1", titulo: "PS Dev Frontend 2024", empresa: "TechSol", curso: "Eng. Software", setor: "Tecnologia", tipo: "Estágio", vagas: 3, inscritos: 12, preenchidas: 1, dataAbertura: "2024-03-01", dataEncerramento: "2024-04-30", descricao: "", requisitosObg: ["React"] as string[], requisitosDesej: ["Node"] as string[], etapas: [{ nome: "Triagem", prova: "" }, { nome: "Prova Técnica", prova: "Teste Técnico React" }] as Etapa[], status: "active" },
  { id: "2", titulo: "PS Admin Q1", empresa: "EduGlobal", curso: "Administração", setor: "Administração", tipo: "Jovem Aprendiz", vagas: 5, inscritos: 20, preenchidas: 3, dataAbertura: "2024-02-15", dataEncerramento: "2024-03-31", descricao: "", requisitosObg: [] as string[], requisitosDesej: [] as string[], etapas: [] as Etapa[], status: "active" },
  { id: "3", titulo: "PS Marketing 2024", empresa: "TechSol", curso: "Marketing", setor: "Marketing", tipo: "Estágio", vagas: 2, inscritos: 8, preenchidas: 2, dataAbertura: "2024-01-10", dataEncerramento: "2024-02-28", descricao: "", requisitosObg: [] as string[], requisitosDesej: [] as string[], etapas: [] as Etapa[], status: "inactive" },
];

const provasDisponiveis = ["Teste Técnico React", "Teste Lógica", "Teste Comportamental"];

const emptyForm = { id: "", titulo: "", empresa: "", curso: "", setor: "", tipo: "Estágio", vagas: 1, inscritos: 0, preenchidas: 0, dataAbertura: "", dataEncerramento: "", descricao: "", requisitosObg: [] as string[], requisitosDesej: [] as string[], etapas: [] as Etapa[], status: "pending" };

export default function ProcessosSeletivosPage() {
  const [data, setData] = useState(initialData);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [editing, setEditing] = useState(false);

  const columns: Column[] = [
    { key: "id", label: "ID", sortable: true },
    { key: "empresa", label: "Empresa", sortable: true },
    { key: "curso", label: "Curso", sortable: true },
    { key: "setor", label: "Setor", sortable: true },
    { key: "vagas", label: "Saldo", sortable: true, render: (v, row) => `${row.preenchidas}/${v}` },
    { key: "status", label: "Status", sortable: true, render: (v) => <StatusBadge status={v} /> },
    { key: "inscritos", label: "Inscritos", sortable: true },
    { key: "dataAbertura", label: "Abertura", sortable: true },
    { key: "dataEncerramento", label: "Encerramento", sortable: true },
  ];

  const filters: FilterConfig[] = [
    { key: "id", label: "Nº Processo", type: "text" },
    { key: "empresa", label: "Empresa", type: "select", options: empresas.map((e) => ({ label: e, value: e })) },
    { key: "status", label: "Status", type: "select", options: [{ label: "Ativo", value: "active" }, { label: "Pendente", value: "pending" }, { label: "Encerrado", value: "inactive" }] },
  ];

  const actions: ActionConfig[] = [
    { label: "Visualizar", icon: <Eye className="h-4 w-4" />, onClick: (row) => { setSelected(row); setViewOpen(true); } },
    { label: "Editar", icon: <Pencil className="h-4 w-4" />, onClick: (row) => { setForm(row as any); setEditing(true); setModalOpen(true); } },
    { label: "Cancelar Processo", icon: <XCircle className="h-4 w-4" />, onClick: (row) => { setSelected(row); setConfirmOpen(true); }, variant: "destructive" },
    { label: "Exportar PDF", icon: <FileDown className="h-4 w-4" />, onClick: () => toast.info("Exportação de PDF será implementada com o backend.") },
  ];

  const handleSave = (asDraft = false) => {
    if (!form.titulo || !form.empresa) { toast.error("Preencha os campos obrigatórios."); return; }
    const finalForm = { ...form, status: asDraft ? "pending" : form.status };
    if (editing) {
      setData(data.map((d) => d.id === finalForm.id ? finalForm : d));
      toast.success("Processo atualizado!");
    } else {
      setData([...data, { ...finalForm, id: String(data.length + 1) }]);
      toast.success(asDraft ? "Salvo como rascunho!" : "Processo criado!");
    }
    setModalOpen(false); setForm({ ...emptyForm }); setEditing(false);
  };

  const handleCancel = () => {
    setData(data.map((d) => d.id === selected?.id ? { ...d, status: "inactive" } : d));
    toast.success("Processo cancelado.");
  };

  // Etapas helpers
  const addEtapa = () => setForm({ ...form, etapas: [...form.etapas, { nome: "", prova: "" }] });
  const removeEtapa = (i: number) => setForm({ ...form, etapas: form.etapas.filter((_, j) => j !== i) });
  const moveEtapa = (i: number, dir: -1 | 1) => {
    const arr = [...form.etapas];
    const ni = i + dir;
    if (ni < 0 || ni >= arr.length) return;
    [arr[i], arr[ni]] = [arr[ni], arr[i]];
    setForm({ ...form, etapas: arr });
  };
  const updateEtapa = (i: number, field: keyof Etapa, val: string) => {
    const arr = [...form.etapas]; arr[i] = { ...arr[i], [field]: val }; setForm({ ...form, etapas: arr });
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Recrutamento" }, { label: "Processos Seletivos" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Processos Seletivos</h1>
            <p className="text-sm text-muted-foreground mt-1">{data.length} processos cadastrados.</p>
          </div>
          <Button onClick={() => { setForm({ ...emptyForm }); setEditing(false); setModalOpen(true); }} className="gap-2"><Plus className="h-4 w-4" /> Novo Processo</Button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>

      <FormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(false); }} title={editing ? "Editar Processo" : "Novo Processo Seletivo"} onSave={() => handleSave(false)} wide>
        <div className="space-y-6">
          {/* Seção 1 */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Dados Básicos</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Título *</Label><Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} /></div>
              <div className="space-y-1.5">
                <Label>Empresa Parceira *</Label>
                <Select value={form.empresa} onValueChange={(v) => setForm({ ...form, empresa: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{empresas.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Tipo</Label>
                <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Estágio">Estágio</SelectItem>
                    <SelectItem value="Jovem Aprendiz">Jovem Aprendiz</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label>Nº de Vagas</Label><Input type="number" value={form.vagas} onChange={(e) => setForm({ ...form, vagas: Number(e.target.value) })} /></div>
              <div className="space-y-1.5"><Label>Data de Abertura</Label><Input type="date" value={form.dataAbertura} onChange={(e) => setForm({ ...form, dataAbertura: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Data de Encerramento</Label><Input type="date" value={form.dataEncerramento} onChange={(e) => setForm({ ...form, dataEncerramento: e.target.value })} /></div>
            </div>
          </div>

          {/* Seção 2 */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Descrição</h3>
            <div className="space-y-4">
              <div className="space-y-1.5"><Label>Descrição da Vaga</Label><RichTextEditor value={form.descricao} onChange={(v) => setForm({ ...form, descricao: v })} placeholder="Descreva o processo..." /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label>Requisitos Obrigatórios</Label><TagsInput value={form.requisitosObg} onChange={(v) => setForm({ ...form, requisitosObg: v })} /></div>
                <div className="space-y-1.5"><Label>Requisitos Desejáveis</Label><TagsInput value={form.requisitosDesej} onChange={(v) => setForm({ ...form, requisitosDesej: v })} /></div>
              </div>
            </div>
          </div>

          {/* Seção 3 — Etapas */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Etapas do Processo</h3>
              <Button type="button" variant="outline" size="sm" onClick={addEtapa}><Plus className="h-3.5 w-3.5 mr-1" /> Adicionar Etapa</Button>
            </div>
            {form.etapas.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Nenhuma etapa adicionada.</p>}
            <div className="space-y-2">
              {form.etapas.map((et, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/20">
                  <div className="flex flex-col gap-0.5">
                    <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveEtapa(i, -1)} disabled={i === 0}><ChevronUp className="h-3.5 w-3.5" /></Button>
                    <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveEtapa(i, 1)} disabled={i === form.etapas.length - 1}><ChevronDown className="h-3.5 w-3.5" /></Button>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground w-6">{i + 1}.</span>
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <Input value={et.nome} onChange={(e) => updateEtapa(i, "nome", e.target.value)} placeholder="Nome da etapa" className="h-8 text-sm" />
                    <Select value={et.prova} onValueChange={(v) => updateEtapa(i, "prova", v)}>
                      <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Prova (opcional)" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">Nenhuma</SelectItem>
                        {provasDisponiveis.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeEtapa(i)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button variant="outline" onClick={() => handleSave(true)}>Salvar como Rascunho</Button>
          </div>
        </div>
      </FormModal>

      <FormModal open={viewOpen} onClose={() => setViewOpen(false)} title="Detalhes do Processo" onSave={() => setViewOpen(false)} wide>
        {selected && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div><span className="text-muted-foreground">Título:</span> <span className="font-medium">{selected.titulo}</span></div>
              <div><span className="text-muted-foreground">Empresa:</span> <span className="font-medium">{selected.empresa}</span></div>
              <div><span className="text-muted-foreground">Tipo:</span> <span className="font-medium">{selected.tipo}</span></div>
              <div><span className="text-muted-foreground">Vagas:</span> <span className="font-medium">{selected.preenchidas}/{selected.vagas}</span></div>
              <div><span className="text-muted-foreground">Inscritos:</span> <span className="font-medium">{selected.inscritos}</span></div>
              <div><span className="text-muted-foreground">Status:</span> <StatusBadge status={selected.status} /></div>
              <div><span className="text-muted-foreground">Abertura:</span> <span className="font-medium">{selected.dataAbertura}</span></div>
              <div><span className="text-muted-foreground">Encerramento:</span> <span className="font-medium">{selected.dataEncerramento}</span></div>
            </div>
            {selected.etapas?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Etapas</h4>
                <div className="space-y-1">
                  {selected.etapas.map((et: Etapa, i: number) => (
                    <div key={i} className="text-sm">{i + 1}. {et.nome} {et.prova && `— Prova: ${et.prova}`}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </FormModal>

      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleCancel} title="Cancelar Processo" description={`Deseja cancelar o processo "${selected?.titulo}"?`} confirmLabel="Cancelar Processo" variant="destructive" />
    </DashboardLayout>
  );
}
