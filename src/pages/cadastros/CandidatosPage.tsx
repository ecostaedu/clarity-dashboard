import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, type Column, type FilterConfig, type ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Eye, Pencil, Trash2, UserPlus, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { maskCpf, maskPhone, maskCep, fetchCep, StatusBadge } from "@/lib/masks";

const statusMap: Record<string, { label: string; color: string }> = {
  disponivel: { label: "Disponível", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  em_processo: { label: "Em Processo", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  contratado: { label: "Contratado", color: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400" },
};

const escolaridades = ["Ensino Médio", "Técnico", "Superior Incompleto", "Superior Completo", "Pós-Graduação"];

const initialData = [
  { id: "1", nome: "João Pedro Silva", cpf: "123.456.789-00", email: "joao@email.com", escolaridade: "Superior Completo", status: "disponivel", dataNascimento: "1998-05-15", genero: "Masculino", telefone: "(11) 99999-1111", cep: "", logradouro: "", numero: "", complemento: "", bairro: "", cidade: "São Paulo", estado: "SP", curso: "Administração", instituicao: "USP", experiencia: "2 anos em RH", habilidades: "Excel, PowerBI", curriculo: "" },
  { id: "2", nome: "Maria Oliveira", cpf: "987.654.321-00", email: "maria@email.com", escolaridade: "Técnico", status: "em_processo", dataNascimento: "2000-08-22", genero: "Feminino", telefone: "(21) 99999-2222", cep: "", logradouro: "", numero: "", complemento: "", bairro: "", cidade: "Rio de Janeiro", estado: "RJ", curso: "Informática", instituicao: "SENAI", experiencia: "", habilidades: "Java, Python", curriculo: "" },
  { id: "3", nome: "Carlos Santos", cpf: "111.222.333-44", email: "carlos@email.com", escolaridade: "Ensino Médio", status: "contratado", dataNascimento: "2001-01-10", genero: "Masculino", telefone: "(41) 99999-3333", cep: "", logradouro: "", numero: "", complemento: "", bairro: "", cidade: "Curitiba", estado: "PR", curso: "", instituicao: "", experiencia: "", habilidades: "Atendimento", curriculo: "" },
];

const emptyForm = { id: "", nome: "", cpf: "", dataNascimento: "", genero: "", email: "", telefone: "", cep: "", logradouro: "", numero: "", complemento: "", bairro: "", cidade: "", estado: "", escolaridade: "", curso: "", instituicao: "", experiencia: "", habilidades: "", status: "disponivel", curriculo: "" };

export default function CandidatosPage() {
  const [data, setData] = useState(initialData);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [editing, setEditing] = useState(false);

  const columns: Column[] = [
    { key: "id", label: "ID", sortable: true },
    { key: "nome", label: "Nome", sortable: true },
    { key: "cpf", label: "CPF" },
    { key: "email", label: "Email", sortable: true },
    { key: "escolaridade", label: "Escolaridade" },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} map={statusMap} /> },
  ];

  const filters: FilterConfig[] = [
    { key: "nome", label: "Nome", type: "text" },
    { key: "cpf", label: "CPF", type: "text" },
    { key: "status", label: "Status", type: "select", options: Object.entries(statusMap).map(([k, v]) => ({ label: v.label, value: k })) },
    { key: "escolaridade", label: "Escolaridade", type: "select", options: escolaridades.map((e) => ({ label: e, value: e })) },
  ];

  const actions: ActionConfig[] = [
    { label: "Visualizar Perfil", icon: <Eye className="h-4 w-4" />, onClick: (row) => { setSelected(row); setViewOpen(true); } },
    { label: "Editar", icon: <Pencil className="h-4 w-4" />, onClick: (row) => { setForm(row as any); setEditing(true); setModalOpen(true); } },
    { label: "Mover p/ Processo", icon: <Briefcase className="h-4 w-4" />, onClick: (row) => { setData(data.map((d) => d.id === row.id ? { ...d, status: "em_processo" } : d)); toast.success(`${row.nome} movido para processo seletivo.`); } },
    { label: "Contratar", icon: <UserPlus className="h-4 w-4" />, onClick: (row) => { setData(data.map((d) => d.id === row.id ? { ...d, status: "contratado" } : d)); toast.success(`${row.nome} contratado!`); } },
    { label: "Excluir", icon: <Trash2 className="h-4 w-4" />, onClick: (row) => { setSelected(row); setConfirmOpen(true); }, variant: "destructive" },
  ];

  const handleSave = () => {
    if (!form.nome || !form.cpf) { toast.error("Preencha os campos obrigatórios."); return; }
    if (editing) { setData(data.map((d) => d.id === form.id ? form : d)); toast.success("Candidato atualizado!"); }
    else { setData([...data, { ...form, id: String(data.length + 1) }]); toast.success("Candidato cadastrado!"); }
    setModalOpen(false); setForm({ ...emptyForm }); setEditing(false);
  };

  const handleCep = async (cep: string) => {
    setForm({ ...form, cep: maskCep(cep) });
    const addr = await fetchCep(cep);
    if (addr) setForm((f) => ({ ...f, ...addr, cep: maskCep(cep) }));
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Cadastros" }, { label: "Candidatos" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-heading font-bold text-foreground">Candidatos</h1><p className="text-sm text-muted-foreground mt-1">Base de candidatos do sistema.</p></div>
          <Button onClick={() => { setForm({ ...emptyForm }); setEditing(false); setModalOpen(true); }} className="gap-2"><Plus className="h-4 w-4" /> Novo Candidato</Button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>

      <FormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(false); }} title={editing ? "Editar Candidato" : "Novo Candidato"} onSave={handleSave} wide>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>Nome Completo *</Label><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>CPF *</Label><Input value={form.cpf} onChange={(e) => setForm({ ...form, cpf: maskCpf(e.target.value) })} placeholder="XXX.XXX.XXX-XX" /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5"><Label>Data de Nascimento</Label><Input type="date" value={form.dataNascimento} onChange={(e) => setForm({ ...form, dataNascimento: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Gênero</Label>
              <Select value={form.genero} onValueChange={(v) => setForm({ ...form, genero: v })}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="Masculino">Masculino</SelectItem><SelectItem value="Feminino">Feminino</SelectItem><SelectItem value="Outro">Outro</SelectItem></SelectContent></Select>
            </div>
            <div className="space-y-1.5"><Label>Telefone</Label><Input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: maskPhone(e.target.value) })} /></div>
          </div>
          <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5"><Label>CEP</Label><Input value={form.cep} onChange={(e) => handleCep(e.target.value)} /></div>
            <div className="space-y-1.5 col-span-2"><Label>Logradouro</Label><Input value={form.logradouro} onChange={(e) => setForm({ ...form, logradouro: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-1.5"><Label>Número</Label><Input value={form.numero} onChange={(e) => setForm({ ...form, numero: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Complemento</Label><Input value={form.complemento} onChange={(e) => setForm({ ...form, complemento: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Cidade</Label><Input value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Estado</Label><Input value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })} maxLength={2} /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5"><Label>Escolaridade</Label>
              <Select value={form.escolaridade} onValueChange={(v) => setForm({ ...form, escolaridade: v })}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{escolaridades.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent></Select>
            </div>
            <div className="space-y-1.5"><Label>Curso</Label><Input value={form.curso} onChange={(e) => setForm({ ...form, curso: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Instituição</Label><Input value={form.instituicao} onChange={(e) => setForm({ ...form, instituicao: e.target.value })} /></div>
          </div>
          <div className="space-y-1.5"><Label>Experiência Profissional</Label><Textarea value={form.experiencia} onChange={(e) => setForm({ ...form, experiencia: e.target.value })} rows={3} /></div>
          <div className="space-y-1.5"><Label>Habilidades (separar por vírgula)</Label><Input value={form.habilidades} onChange={(e) => setForm({ ...form, habilidades: e.target.value })} placeholder="Excel, Python, Liderança" /></div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(statusMap).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}</SelectContent></Select>
          </div>
          <div className="space-y-1.5"><Label>Currículo (PDF)</Label><Input type="file" accept=".pdf" className="cursor-pointer" /></div>
        </div>
      </FormModal>

      <FormModal open={viewOpen} onClose={() => setViewOpen(false)} title="Perfil do Candidato" onSave={() => setViewOpen(false)} wide>
        {selected && (
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <p><span className="text-muted-foreground">Nome:</span> {selected.nome}</p>
              <p><span className="text-muted-foreground">CPF:</span> {selected.cpf}</p>
              <p><span className="text-muted-foreground">Email:</span> {selected.email}</p>
              <p><span className="text-muted-foreground">Escolaridade:</span> {selected.escolaridade}</p>
              <p><span className="text-muted-foreground">Status:</span> <StatusBadge status={selected.status} map={statusMap} /></p>
              <p><span className="text-muted-foreground">Habilidades:</span> {selected.habilidades}</p>
            </div>
          </div>
        )}
      </FormModal>

      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={() => { setData(data.filter((d) => d.id !== selected?.id)); toast.success("Candidato excluído!"); }} title="Excluir Candidato" description={`Tem certeza que deseja excluir "${selected?.nome}"? Esta ação não pode ser desfeita.`} confirmLabel="Excluir" />
    </DashboardLayout>
  );
}
