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
import { Plus, Eye, Pencil, Globe, GlobeLock, Link2 } from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "@/lib/masks";

const empresas = ["TechSol", "EduGlobal", "Construtora ABC"];
const setores = ["Tecnologia", "Administração", "RH", "Financeiro", "Marketing", "Operações"];

const initialData = [
  { id: "1", titulo: "Desenvolvedor Frontend", empresa: "TechSol", tipo: "Estágio", setor: "Tecnologia", vagas: 3, remuneracao: "1500", cargaHoraria: "30h", descricao: "", requisitosObg: ["React", "TypeScript"], requisitosDesej: ["Tailwind"], status: "active" },
  { id: "2", titulo: "Auxiliar Administrativo", empresa: "EduGlobal", tipo: "Jovem Aprendiz", setor: "Administração", vagas: 5, remuneracao: "800", cargaHoraria: "20h", descricao: "", requisitosObg: ["Excel"], requisitosDesej: ["Power BI"], status: "active" },
  { id: "3", titulo: "Analista de Marketing", empresa: "TechSol", tipo: "Estágio", setor: "Marketing", vagas: 1, remuneracao: "1800", cargaHoraria: "30h", descricao: "", requisitosObg: ["SEO"], requisitosDesej: [], status: "pending" },
  { id: "4", titulo: "Assistente Financeiro", empresa: "Construtora ABC", tipo: "Jovem Aprendiz", setor: "Financeiro", vagas: 2, remuneracao: "900", cargaHoraria: "20h", descricao: "", requisitosObg: [], requisitosDesej: [], status: "inactive" },
];

const emptyForm = { id: "", titulo: "", empresa: "", tipo: "Estágio", setor: "", vagas: 1, remuneracao: "", cargaHoraria: "", descricao: "", requisitosObg: [] as string[], requisitosDesej: [] as string[], status: "pending" };

export default function GestaoVagasPage() {
  const [data, setData] = useState(initialData);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [editing, setEditing] = useState(false);

  const statusMap: Record<string, string> = { active: "Publicada", pending: "Rascunho", inactive: "Encerrada" };

  const columns: Column[] = [
    { key: "id", label: "ID", sortable: true },
    { key: "titulo", label: "Título", sortable: true },
    { key: "empresa", label: "Empresa", sortable: true },
    { key: "tipo", label: "Tipo", sortable: true },
    { key: "setor", label: "Setor", sortable: true },
    { key: "vagas", label: "Vagas Disp.", sortable: true },
    { key: "status", label: "Status", sortable: true, render: (v) => <StatusBadge status={v} /> },
  ];

  const filters: FilterConfig[] = [
    { key: "empresa", label: "Empresa", type: "select", options: empresas.map((e) => ({ label: e, value: e })) },
    { key: "tipo", label: "Tipo", type: "select", options: [{ label: "Estágio", value: "Estágio" }, { label: "Jovem Aprendiz", value: "Jovem Aprendiz" }] },
    { key: "status", label: "Status", type: "select", options: [{ label: "Publicada", value: "active" }, { label: "Rascunho", value: "pending" }, { label: "Encerrada", value: "inactive" }] },
    { key: "setor", label: "Setor", type: "select", options: setores.map((s) => ({ label: s, value: s })) },
  ];

  const actions: ActionConfig[] = [
    { label: "Visualizar", icon: <Eye className="h-4 w-4" />, onClick: (row) => { setSelected(row); setViewOpen(true); } },
    { label: "Editar", icon: <Pencil className="h-4 w-4" />, onClick: (row) => { setForm(row as any); setEditing(true); setModalOpen(true); } },
    {
      label: "Publicar/Despublicar", icon: <Globe className="h-4 w-4" />,
      onClick: (row) => {
        const newStatus = row.status === "active" ? "pending" : "active";
        setData(data.map((d) => d.id === row.id ? { ...d, status: newStatus } : d));
        toast.success(newStatus === "active" ? "Vaga publicada!" : "Vaga despublicada!");
      },
    },
  ];

  const handleSave = () => {
    if (!form.titulo || !form.empresa) { toast.error("Preencha os campos obrigatórios."); return; }
    if (editing) {
      setData(data.map((d) => d.id === form.id ? form : d));
      toast.success("Vaga atualizada!");
    } else {
      setData([...data, { ...form, id: String(data.length + 1) }]);
      toast.success("Vaga criada!");
    }
    setModalOpen(false); setForm({ ...emptyForm }); setEditing(false);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Vagas" }, { label: "Gestão de Vagas" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Gestão de Vagas</h1>
            <p className="text-sm text-muted-foreground mt-1">{data.length} vagas cadastradas.</p>
          </div>
          <Button onClick={() => { setForm({ ...emptyForm }); setEditing(false); setModalOpen(true); }} className="gap-2"><Plus className="h-4 w-4" /> Nova Vaga</Button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>

      <FormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(false); }} title={editing ? "Editar Vaga" : "Nova Vaga"} onSave={handleSave} wide>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>Título da Vaga *</Label><Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} /></div>
            <div className="space-y-1.5">
              <Label>Empresa Parceira *</Label>
              <Select value={form.empresa} onValueChange={(v) => setForm({ ...form, empresa: v })}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {empresas.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Tipo de Vaga</Label>
              <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Estágio">Estágio</SelectItem>
                  <SelectItem value="Jovem Aprendiz">Jovem Aprendiz</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Setor</Label>
              <Select value={form.setor} onValueChange={(v) => setForm({ ...form, setor: v })}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {setores.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label>Nº de Vagas</Label><Input type="number" value={form.vagas} onChange={(e) => setForm({ ...form, vagas: Number(e.target.value) })} /></div>
            <div className="space-y-1.5"><Label>Remuneração (R$)</Label><Input value={form.remuneracao} onChange={(e) => setForm({ ...form, remuneracao: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Carga Horária</Label><Input value={form.cargaHoraria} onChange={(e) => setForm({ ...form, cargaHoraria: e.target.value })} placeholder="Ex: 30h" /></div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Rascunho</SelectItem>
                  <SelectItem value="active">Publicada</SelectItem>
                  <SelectItem value="inactive">Encerrada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Descrição</Label>
            <RichTextEditor value={form.descricao} onChange={(v) => setForm({ ...form, descricao: v })} placeholder="Descreva a vaga..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>Requisitos Obrigatórios</Label><TagsInput value={form.requisitosObg} onChange={(v) => setForm({ ...form, requisitosObg: v })} /></div>
            <div className="space-y-1.5"><Label>Requisitos Desejáveis</Label><TagsInput value={form.requisitosDesej} onChange={(v) => setForm({ ...form, requisitosDesej: v })} /></div>
          </div>
        </div>
      </FormModal>

      <FormModal open={viewOpen} onClose={() => setViewOpen(false)} title="Detalhes da Vaga" onSave={() => setViewOpen(false)} wide>
        {selected && (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div><span className="text-muted-foreground">Título:</span> <span className="font-medium">{selected.titulo}</span></div>
              <div><span className="text-muted-foreground">Empresa:</span> <span className="font-medium">{selected.empresa}</span></div>
              <div><span className="text-muted-foreground">Tipo:</span> <span className="font-medium">{selected.tipo}</span></div>
              <div><span className="text-muted-foreground">Setor:</span> <span className="font-medium">{selected.setor}</span></div>
              <div><span className="text-muted-foreground">Vagas:</span> <span className="font-medium">{selected.vagas}</span></div>
              <div><span className="text-muted-foreground">Remuneração:</span> <span className="font-medium">R$ {selected.remuneracao}</span></div>
              <div><span className="text-muted-foreground">Status:</span> <StatusBadge status={selected.status} /></div>
            </div>
          </div>
        )}
      </FormModal>
    </DashboardLayout>
  );
}
