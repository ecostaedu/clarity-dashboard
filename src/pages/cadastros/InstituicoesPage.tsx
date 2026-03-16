import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, type Column, type FilterConfig, type ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Eye, Pencil, Ban } from "lucide-react";
import { toast } from "sonner";
import { maskCnpj, maskPhone, maskCep, fetchCep, StatusBadge } from "@/lib/masks";

const initialData = [
  { id: "1", nome: "Universidade Federal de SP", cnpj: "12.345.678/0001-90", contato: "Dr. Silva", email: "contato@ufsp.edu.br", telefone: "(11) 3333-4444", convenio: true, status: "active", cep: "", logradouro: "", numero: "", complemento: "", bairro: "", cidade: "São Paulo", estado: "SP", contatoNome: "Dr. Silva", contatoCargo: "Coordenador", contatoEmail: "silva@ufsp.edu.br", contatoTelefone: "(11) 99999-0001" },
  { id: "2", nome: "SENAI São Paulo", cnpj: "33.444.555/0001-66", contato: "Maria Costa", email: "admin@senai.br", telefone: "(11) 2222-3333", convenio: true, status: "active", cep: "", logradouro: "", numero: "", complemento: "", bairro: "", cidade: "São Paulo", estado: "SP", contatoNome: "Maria Costa", contatoCargo: "Diretora", contatoEmail: "costa@senai.br", contatoTelefone: "(11) 99999-0002" },
  { id: "3", nome: "Instituto Federal RJ", cnpj: "55.666.777/0001-88", contato: "Pedro Lima", email: "contato@ifrj.edu.br", telefone: "(21) 4444-5555", convenio: false, status: "inactive", cep: "", logradouro: "", numero: "", complemento: "", bairro: "", cidade: "Rio de Janeiro", estado: "RJ", contatoNome: "Pedro Lima", contatoCargo: "Secretário", contatoEmail: "lima@ifrj.edu.br", contatoTelefone: "(21) 99999-0003" },
];

const emptyForm = { id: "", nome: "", cnpj: "", telefone: "", email: "", cep: "", logradouro: "", numero: "", complemento: "", bairro: "", cidade: "", estado: "", convenio: true, status: "active", contatoNome: "", contatoCargo: "", contatoEmail: "", contatoTelefone: "", contato: "" };

export default function InstituicoesPage() {
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
    { key: "cnpj", label: "CNPJ" },
    { key: "contato", label: "Contato" },
    { key: "convenio", label: "Convênio", render: (v) => <StatusBadge status={v ? "active" : "inactive"} map={{ active: { label: "Sim", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" }, inactive: { label: "Não", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" } }} /> },
  ];

  const filters: FilterConfig[] = [
    { key: "nome", label: "Nome", type: "text" },
    { key: "cnpj", label: "CNPJ", type: "text" },
  ];

  const actions: ActionConfig[] = [
    { label: "Visualizar", icon: <Eye className="h-4 w-4" />, onClick: (row) => { setSelected(row); setViewOpen(true); } },
    { label: "Editar", icon: <Pencil className="h-4 w-4" />, onClick: (row) => { setForm(row); setEditing(true); setModalOpen(true); } },
    { label: "Inativar", icon: <Ban className="h-4 w-4" />, onClick: (row) => { setSelected(row); setConfirmOpen(true); }, variant: "destructive" },
  ];

  const handleSave = () => {
    if (!form.nome || !form.cnpj) { toast.error("Preencha os campos obrigatórios."); return; }
    if (editing) {
      setData(data.map((d) => d.id === form.id ? { ...form, contato: form.contatoNome } : d));
      toast.success("Instituição atualizada!");
    } else {
      setData([...data, { ...form, id: String(data.length + 1), contato: form.contatoNome }]);
      toast.success("Instituição cadastrada!");
    }
    setModalOpen(false); setForm({ ...emptyForm }); setEditing(false);
  };

  const handleCep = async (cep: string) => {
    setForm({ ...form, cep: maskCep(cep) });
    const addr = await fetchCep(cep);
    if (addr) setForm((f) => ({ ...f, ...addr, cep: maskCep(cep) }));
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Cadastros" }, { label: "Instituições" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Instituições de Ensino</h1>
            <p className="text-sm text-muted-foreground mt-1">Gerencie as instituições parceiras.</p>
          </div>
          <Button onClick={() => { setForm({ ...emptyForm }); setEditing(false); setModalOpen(true); }} className="gap-2"><Plus className="h-4 w-4" /> Nova Instituição</Button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>

      <FormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(false); }} title={editing ? "Editar Instituição" : "Nova Instituição"} onSave={handleSave} wide>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>Nome da Instituição *</Label><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>CNPJ *</Label><Input value={form.cnpj} onChange={(e) => setForm({ ...form, cnpj: maskCnpj(e.target.value) })} placeholder="XX.XXX.XXX/XXXX-XX" /></div>
            <div className="space-y-1.5"><Label>Telefone</Label><Input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: maskPhone(e.target.value) })} /></div>
            <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          </div>
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
          <p className="text-sm font-medium text-foreground pt-2">Contato Principal</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>Nome</Label><Input value={form.contatoNome} onChange={(e) => setForm({ ...form, contatoNome: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Cargo</Label><Input value={form.contatoCargo} onChange={(e) => setForm({ ...form, contatoCargo: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Email</Label><Input value={form.contatoEmail} onChange={(e) => setForm({ ...form, contatoEmail: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Telefone</Label><Input value={form.contatoTelefone} onChange={(e) => setForm({ ...form, contatoTelefone: maskPhone(e.target.value) })} /></div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Switch checked={form.convenio} onCheckedChange={(v) => setForm({ ...form, convenio: v })} />
            <Label>Convênio Ativo</Label>
          </div>
        </div>
      </FormModal>

      <FormModal open={viewOpen} onClose={() => setViewOpen(false)} title="Detalhes da Instituição" onSave={() => setViewOpen(false)}>
        {selected && (
          <div className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Nome:</span> {selected.nome}</p>
            <p><span className="text-muted-foreground">CNPJ:</span> {selected.cnpj}</p>
            <p><span className="text-muted-foreground">Contato:</span> {selected.contato}</p>
            <p><span className="text-muted-foreground">Convênio:</span> {selected.convenio ? "Sim" : "Não"}</p>
          </div>
        )}
      </FormModal>

      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={() => { setData(data.map((d) => d.id === selected?.id ? { ...d, status: d.status === "active" ? "inactive" : "active" } : d)); toast.success("Status alterado!"); }} title="Alterar Status" description={`Deseja alterar o status da instituição "${selected?.nome}"?`} />
    </DashboardLayout>
  );
}
