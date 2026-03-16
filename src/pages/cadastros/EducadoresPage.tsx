import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, type Column, type FilterConfig, type ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Eye, Pencil, ShieldOff } from "lucide-react";
import { toast } from "sonner";
import { maskCpf, maskPhone, StatusBadge } from "@/lib/masks";

const initialData = [
  { id: "1", nome: "Prof. Ana Lima", email: "ana.lima@edu.com", cpf: "111.222.333-44", telefone: "(11) 99999-0001", multiFrequencia: true, bloqueado: false },
  { id: "2", nome: "Prof. Carlos Mendes", email: "carlos@edu.com", cpf: "555.666.777-88", telefone: "(21) 99999-0002", multiFrequencia: false, bloqueado: false },
  { id: "3", nome: "Prof. Maria Santos", email: "maria.s@edu.com", cpf: "999.000.111-22", telefone: "(41) 99999-0003", multiFrequencia: true, bloqueado: true },
];

const emptyForm = { id: "", nome: "", email: "", cpf: "", telefone: "", multiFrequencia: false, bloqueado: false };

export default function EducadoresPage() {
  const [data, setData] = useState(initialData);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [editing, setEditing] = useState(false);

  const boolBadge = (v: boolean, yes = "Sim", no = "Não") => <StatusBadge status={v ? "yes" : "no"} map={{ yes: { label: yes, color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" }, no: { label: no, color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" } }} />;

  const columns: Column[] = [
    { key: "nome", label: "Nome", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "multiFrequencia", label: "Múltiplas Frequências?", render: (v) => boolBadge(v) },
    { key: "bloqueado", label: "Bloqueado?", render: (v) => boolBadge(v, "Sim", "Não") },
  ];

  const filters: FilterConfig[] = [
    { key: "nome", label: "Nome", type: "text" },
    { key: "email", label: "Email", type: "text" },
  ];

  const actions: ActionConfig[] = [
    { label: "Visualizar", icon: <Eye className="h-4 w-4" />, onClick: (row) => { setSelected(row); setViewOpen(true); } },
    { label: "Editar", icon: <Pencil className="h-4 w-4" />, onClick: (row) => { setForm(row); setEditing(true); setModalOpen(true); } },
    { label: "Bloquear/Desbloquear", icon: <ShieldOff className="h-4 w-4" />, onClick: (row) => { setSelected(row); setConfirmOpen(true); }, variant: "destructive" },
  ];

  const handleSave = () => {
    if (!form.nome || !form.email) { toast.error("Preencha os campos obrigatórios."); return; }
    if (editing) { setData(data.map((d) => d.id === form.id ? form : d)); toast.success("Educador atualizado!"); }
    else { setData([...data, { ...form, id: String(data.length + 1) }]); toast.success("Educador cadastrado!"); }
    setModalOpen(false); setForm({ ...emptyForm }); setEditing(false);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Cadastros" }, { label: "Educadores" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-heading font-bold text-foreground">Educadores</h1><p className="text-sm text-muted-foreground mt-1">Gerencie educadores e instrutores.</p></div>
          <Button onClick={() => { setForm({ ...emptyForm }); setEditing(false); setModalOpen(true); }} className="gap-2"><Plus className="h-4 w-4" /> Novo Educador</Button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>

      <FormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(false); }} title={editing ? "Editar Educador" : "Novo Educador"} onSave={handleSave}>
        <div className="space-y-4">
          <div className="space-y-1.5"><Label>Nome *</Label><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>Email *</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>CPF</Label><Input value={form.cpf} onChange={(e) => setForm({ ...form, cpf: maskCpf(e.target.value) })} /></div>
          </div>
          <div className="space-y-1.5"><Label>Telefone</Label><Input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: maskPhone(e.target.value) })} /></div>
          <div className="flex items-center gap-3"><Switch checked={form.multiFrequencia} onCheckedChange={(v) => setForm({ ...form, multiFrequencia: v })} /><Label>Pode lançar mais de uma frequência por aluno/dia?</Label></div>
          <div className="flex items-center gap-3"><Switch checked={form.bloqueado} onCheckedChange={(v) => setForm({ ...form, bloqueado: v })} /><Label>Bloqueado?</Label></div>
        </div>
      </FormModal>

      <FormModal open={viewOpen} onClose={() => setViewOpen(false)} title="Detalhes do Educador" onSave={() => setViewOpen(false)}>
        {selected && (
          <div className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Nome:</span> {selected.nome}</p>
            <p><span className="text-muted-foreground">Email:</span> {selected.email}</p>
            <p><span className="text-muted-foreground">Múltiplas Frequências:</span> {boolBadge(selected.multiFrequencia)}</p>
            <p><span className="text-muted-foreground">Bloqueado:</span> {boolBadge(selected.bloqueado)}</p>
          </div>
        )}
      </FormModal>

      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={() => { setData(data.map((d) => d.id === selected?.id ? { ...d, bloqueado: !d.bloqueado } : d)); toast.success("Status alterado!"); }} title="Bloquear/Desbloquear" description={`Deseja ${selected?.bloqueado ? "desbloquear" : "bloquear"} "${selected?.nome}"?`} confirmLabel={selected?.bloqueado ? "Desbloquear" : "Bloquear"} />
    </DashboardLayout>
  );
}
