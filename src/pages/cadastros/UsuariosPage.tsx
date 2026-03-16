import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, type Column, type FilterConfig, type ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Eye, Pencil, Ban, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { maskCpf, maskPhone, StatusBadge } from "@/lib/masks";

const perfis = ["Administrador", "RH", "Financeiro", "Operacional"];
const perfilColors: Record<string, { label: string; color: string }> = {
  Administrador: { label: "Administrador", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  RH: { label: "RH", color: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400" },
  Financeiro: { label: "Financeiro", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  Operacional: { label: "Operacional", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
};

const initialData = [
  { id: "1", nome: "Ana Maria Santos", email: "ana@liderahr.com", cpf: "123.456.789-00", perfil: "Administrador", status: "active", telefone: "(11) 99999-0001" },
  { id: "2", nome: "Carlos Silva", email: "carlos@liderahr.com", cpf: "987.654.321-00", perfil: "RH", status: "active", telefone: "(11) 99999-0002" },
  { id: "3", nome: "Maria Costa", email: "maria@liderahr.com", cpf: "111.222.333-44", perfil: "Financeiro", status: "inactive", telefone: "(21) 99999-0003" },
];

const emptyForm = { id: "", nome: "", email: "", cpf: "", perfil: "RH", status: "active", telefone: "" };

export default function UsuariosPage() {
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
    { key: "email", label: "Email", sortable: true },
    { key: "perfil", label: "Perfil", render: (v) => <StatusBadge status={v} map={perfilColors} /> },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
  ];

  const filters: FilterConfig[] = [
    { key: "nome", label: "Nome", type: "text" },
    { key: "email", label: "Email", type: "text" },
    { key: "perfil", label: "Perfil", type: "select", options: perfis.map((p) => ({ label: p, value: p })) },
    { key: "status", label: "Status", type: "select", options: [{ label: "Ativo", value: "active" }, { label: "Inativo", value: "inactive" }] },
  ];

  const actions: ActionConfig[] = [
    { label: "Visualizar", icon: <Eye className="h-4 w-4" />, onClick: (row) => { setSelected(row); setViewOpen(true); } },
    { label: "Editar", icon: <Pencil className="h-4 w-4" />, onClick: (row) => { setForm(row); setEditing(true); setModalOpen(true); } },
    { label: "Ativar/Inativar", icon: <Ban className="h-4 w-4" />, onClick: (row) => { setSelected(row); setConfirmOpen(true); } },
    { label: "Resetar Senha", icon: <KeyRound className="h-4 w-4" />, onClick: (row) => toast.success(`Link de reset enviado para ${row.email}`) },
  ];

  const handleSave = () => {
    if (!form.nome || !form.email) { toast.error("Preencha os campos obrigatórios."); return; }
    if (editing) { setData(data.map((d) => d.id === form.id ? form : d)); toast.success("Usuário atualizado!"); }
    else { setData([...data, { ...form, id: String(data.length + 1) }]); toast.success("Usuário cadastrado!"); }
    setModalOpen(false); setForm({ ...emptyForm }); setEditing(false);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Cadastros" }, { label: "Usuários" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-heading font-bold text-foreground">Usuários</h1><p className="text-sm text-muted-foreground mt-1">Gerencie os usuários do sistema.</p></div>
          <Button onClick={() => { setForm({ ...emptyForm }); setEditing(false); setModalOpen(true); }} className="gap-2"><Plus className="h-4 w-4" /> Novo Usuário</Button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>

      <FormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(false); }} title={editing ? "Editar Usuário" : "Novo Usuário"} onSave={handleSave}>
        <div className="space-y-4">
          <div className="space-y-1.5"><Label>Nome Completo *</Label><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>Email *</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>CPF</Label><Input value={form.cpf} onChange={(e) => setForm({ ...form, cpf: maskCpf(e.target.value) })} placeholder="XXX.XXX.XXX-XX" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Perfil</Label>
              <Select value={form.perfil} onValueChange={(v) => setForm({ ...form, perfil: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{perfis.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label>Telefone</Label><Input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: maskPhone(e.target.value) })} /></div>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="active">Ativo</SelectItem><SelectItem value="inactive">Inativo</SelectItem></SelectContent>
            </Select>
          </div>
        </div>
      </FormModal>

      <FormModal open={viewOpen} onClose={() => setViewOpen(false)} title="Detalhes do Usuário" onSave={() => setViewOpen(false)}>
        {selected && (
          <div className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Nome:</span> {selected.nome}</p>
            <p><span className="text-muted-foreground">Email:</span> {selected.email}</p>
            <p><span className="text-muted-foreground">CPF:</span> {selected.cpf}</p>
            <p><span className="text-muted-foreground">Perfil:</span> <StatusBadge status={selected.perfil} map={perfilColors} /></p>
            <p><span className="text-muted-foreground">Status:</span> <StatusBadge status={selected.status} /></p>
          </div>
        )}
      </FormModal>

      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={() => { setData(data.map((d) => d.id === selected?.id ? { ...d, status: d.status === "active" ? "inactive" : "active" } : d)); toast.success("Status alterado!"); }} title="Alterar Status" description={`Deseja alterar o status do usuário "${selected?.nome}"?`} />
    </DashboardLayout>
  );
}
