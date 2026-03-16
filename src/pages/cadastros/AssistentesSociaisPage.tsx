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
  { id: "1", nome: "Dra. Luciana Ferreira", email: "luciana@liderahr.com", cpf: "111.222.333-44", telefone: "(11) 99999-0001", registro: "CRESS-SP 12345", bloqueado: false },
  { id: "2", nome: "Dr. Roberto Almeida", email: "roberto@liderahr.com", cpf: "555.666.777-88", telefone: "(21) 99999-0002", registro: "CRESS-RJ 67890", bloqueado: false },
  { id: "3", nome: "Dra. Carla Souza", email: "carla@liderahr.com", cpf: "999.000.111-22", telefone: "(41) 99999-0003", registro: "CRESS-PR 11111", bloqueado: true },
];

const emptyForm = { id: "", nome: "", email: "", cpf: "", telefone: "", registro: "", bloqueado: false };

export default function AssistentesSociaisPage() {
  const [data, setData] = useState(initialData);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [editing, setEditing] = useState(false);

  const boolBadge = (v: boolean) => <StatusBadge status={v ? "yes" : "no"} map={{ yes: { label: "Sim", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" }, no: { label: "Não", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" } }} />;

  const columns: Column[] = [
    { key: "nome", label: "Nome", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "registro", label: "Registro Profissional" },
    { key: "bloqueado", label: "Bloqueado?", render: (v) => boolBadge(v) },
  ];

  const filters: FilterConfig[] = [
    { key: "nome", label: "Nome", type: "text" },
    { key: "email", label: "Email", type: "text" },
  ];

  const actions: ActionConfig[] = [
    { label: "Visualizar", icon: <Eye className="h-4 w-4" />, onClick: (row) => { setSelected(row); setViewOpen(true); } },
    { label: "Editar", icon: <Pencil className="h-4 w-4" />, onClick: (row) => { setForm(row as any); setEditing(true); setModalOpen(true); } },
    { label: "Bloquear/Desbloquear", icon: <ShieldOff className="h-4 w-4" />, onClick: (row) => { setSelected(row); setConfirmOpen(true); }, variant: "destructive" },
  ];

  const handleSave = () => {
    if (!form.nome || !form.email) { toast.error("Preencha os campos obrigatórios."); return; }
    if (editing) { setData(data.map((d) => d.id === form.id ? form : d)); toast.success("Assistente social atualizado!"); }
    else { setData([...data, { ...form, id: String(data.length + 1) }]); toast.success("Assistente social cadastrado!"); }
    setModalOpen(false); setForm({ ...emptyForm }); setEditing(false);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Cadastros" }, { label: "Assistentes Sociais" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-heading font-bold text-foreground">Assistentes Sociais</h1><p className="text-sm text-muted-foreground mt-1">Gerencie assistentes sociais do sistema.</p></div>
          <Button onClick={() => { setForm({ ...emptyForm }); setEditing(false); setModalOpen(true); }} className="gap-2"><Plus className="h-4 w-4" /> Novo(a) Assistente</Button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>

      <FormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(false); }} title={editing ? "Editar Assistente Social" : "Novo(a) Assistente Social"} onSave={handleSave}>
        <div className="space-y-4">
          <div className="space-y-1.5"><Label>Nome *</Label><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>Email *</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>CPF</Label><Input value={form.cpf} onChange={(e) => setForm({ ...form, cpf: maskCpf(e.target.value) })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>Telefone</Label><Input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: maskPhone(e.target.value) })} /></div>
            <div className="space-y-1.5"><Label>Registro Profissional</Label><Input value={form.registro} onChange={(e) => setForm({ ...form, registro: e.target.value })} placeholder="CRESS-XX XXXXX" /></div>
          </div>
          <div className="flex items-center gap-3"><Switch checked={form.bloqueado} onCheckedChange={(v) => setForm({ ...form, bloqueado: v })} /><Label>Bloqueado?</Label></div>
        </div>
      </FormModal>

      <FormModal open={viewOpen} onClose={() => setViewOpen(false)} title="Detalhes" onSave={() => setViewOpen(false)}>
        {selected && (
          <div className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Nome:</span> {selected.nome}</p>
            <p><span className="text-muted-foreground">Email:</span> {selected.email}</p>
            <p><span className="text-muted-foreground">Registro:</span> {selected.registro}</p>
            <p><span className="text-muted-foreground">Bloqueado:</span> {boolBadge(selected.bloqueado)}</p>
          </div>
        )}
      </FormModal>

      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={() => { setData(data.map((d) => d.id === selected?.id ? { ...d, bloqueado: !d.bloqueado } : d)); toast.success("Status alterado!"); }} title="Bloquear/Desbloquear" description={`Deseja ${selected?.bloqueado ? "desbloquear" : "bloquear"} "${selected?.nome}"?`} confirmLabel={selected?.bloqueado ? "Desbloquear" : "Bloquear"} />
    </DashboardLayout>
  );
}
