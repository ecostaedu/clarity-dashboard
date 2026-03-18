import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column, FilterConfig, ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Eye, Pencil, Users, Plus, Trash2 } from "lucide-react";

const mockData = [
  { id: "1", programa: "Aprendiz em Administração", sala: "Sala 101", educador: "Prof. Lima", data_inicio: "01/02/2024", data_termino: "01/12/2024", horario: "08:00-12:00", vagas_total: 30, vagas_preenchidas: 25, alunos: ["Lucas Lima", "Ana Costa"] },
  { id: "2", programa: "Aprendiz em TI", sala: "Lab 03", educador: "Prof. Santos", data_inicio: "01/03/2024", data_termino: "01/12/2024", horario: "13:00-17:00", vagas_total: 20, vagas_preenchidas: 18, alunos: ["Pedro Santos"] },
];

const emptyForm = { programa: "", sala: "", educador: "", data_inicio: "", data_termino: "", horario: "", vagas_total: "" };

export default function PlanejamentoTurmasPage() {
  const [data, setData] = useState(mockData);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [alunosModal, setAlunosModal] = useState<any>(null);
  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  const columns: Column[] = [
    { key: "id", label: "ID" },
    { key: "programa", label: "Programa", sortable: true },
    { key: "sala", label: "Sala" },
    { key: "educador", label: "Educador" },
    { key: "data_inicio", label: "Início" },
    { key: "data_termino", label: "Término" },
    { key: "vagas_preenchidas", label: "Vagas", render: (_, row) => <span className="text-sm">{row.vagas_preenchidas}/{row.vagas_total}</span> },
  ];
  const filters: FilterConfig[] = [{ key: "programa", label: "Programa", type: "text" }, { key: "sala", label: "Sala", type: "text" }];
  const actions: ActionConfig[] = [
    { label: "Visualizar", icon: <Eye className="h-4 w-4" />, onClick: (r) => { setForm({ programa: r.programa, sala: r.sala, educador: r.educador, data_inicio: r.data_inicio, data_termino: r.data_termino, horario: r.horario, vagas_total: String(r.vagas_total) }); setEditId(null); setModalOpen(true); } },
    { label: "Editar", icon: <Pencil className="h-4 w-4" />, onClick: (r) => { setForm({ programa: r.programa, sala: r.sala, educador: r.educador, data_inicio: r.data_inicio, data_termino: r.data_termino, horario: r.horario, vagas_total: String(r.vagas_total) }); setEditId(r.id); setModalOpen(true); } },
    { label: "Gerenciar Alunos", icon: <Users className="h-4 w-4" />, onClick: (r) => setAlunosModal(r) },
  ];

  const handleSave = () => {
    if (!form.programa || !form.sala) { toast.error("Preencha campos obrigatórios"); return; }
    if (editId) { setData(data.map(d => d.id === editId ? { ...d, ...form, vagas_total: Number(form.vagas_total) } : d)); toast.success("Turma atualizada"); }
    else { setData([...data, { ...form, vagas_total: Number(form.vagas_total), vagas_preenchidas: 0, id: String(data.length + 1), alunos: [] }]); toast.success("Turma criada"); }
    setModalOpen(false); setEditId(null); setForm(emptyForm);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Jovem Aprendiz" }, { label: "Planejamento de Turmas" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Planejamento de Turmas</h1><p className="text-sm text-muted-foreground mt-1">{data.length} turmas.</p></div>
          <button onClick={() => { setForm(emptyForm); setEditId(null); setModalOpen(true); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"><Plus className="h-4 w-4" />Nova Turma</button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>
      <FormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditId(null); }} title={editId ? "Editar Turma" : "Nova Turma"} onSave={handleSave}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Programa *</Label><Select value={form.programa} onValueChange={(v) => set("programa", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{["Aprendiz em Administração","Aprendiz em TI","Aprendiz em Logística"].map(e=><SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent></Select></div>
            <div><Label>Sala *</Label><Select value={form.sala} onValueChange={(v) => set("sala", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{["Sala 101","Lab 03","Sala 205"].map(e=><SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent></Select></div>
          </div>
          <div><Label>Educador</Label><Select value={form.educador} onValueChange={(v) => set("educador", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{["Prof. Lima","Prof. Santos","Prof. Costa"].map(e=><SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent></Select></div>
          <div className="grid grid-cols-3 gap-4">
            <div><Label>Data Início</Label><Input type="date" value={form.data_inicio} onChange={(e) => set("data_inicio", e.target.value)} /></div>
            <div><Label>Data Término</Label><Input type="date" value={form.data_termino} onChange={(e) => set("data_termino", e.target.value)} /></div>
            <div><Label>Nº de Vagas</Label><Input type="number" value={form.vagas_total} onChange={(e) => set("vagas_total", e.target.value)} /></div>
          </div>
          <div><Label>Horário</Label><Input value={form.horario} onChange={(e) => set("horario", e.target.value)} placeholder="Ex: 08:00-12:00" /></div>
        </div>
      </FormModal>
      {alunosModal && <FormModal open title={`Alunos - ${alunosModal.programa}`} onClose={() => setAlunosModal(null)} onSave={() => setAlunosModal(null)} wide>
        <div className="space-y-3">
          {(alunosModal.alunos || []).map((a: string, i: number) => <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/30"><span className="text-sm">{a}</span><Button variant="ghost" size="sm" onClick={() => { const newAlunos = [...alunosModal.alunos]; newAlunos.splice(i, 1); setAlunosModal({ ...alunosModal, alunos: newAlunos }); }}><Trash2 className="h-3 w-3" /></Button></div>)}
          <Button variant="outline" size="sm" onClick={() => { setAlunosModal({ ...alunosModal, alunos: [...(alunosModal.alunos || []), "Novo Aluno"] }); toast.success("Aluno adicionado"); }}><Plus className="h-3 w-3 mr-1" />Adicionar Aluno</Button>
        </div>
      </FormModal>}
    </DashboardLayout>
  );
}
