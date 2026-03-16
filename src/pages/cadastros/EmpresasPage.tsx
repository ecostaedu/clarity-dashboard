import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, type Column, type FilterConfig, type ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Plus, Eye, Pencil, Ban, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { maskCnpj, maskPhone, maskCep, fetchCep, StatusBadge } from "@/lib/masks";

interface Contact { nome: string; cargo: string; email: string; telefone: string; }

const initialData = [
  { id: "1", razaoSocial: "Tech Solutions Ltda", nomeFantasia: "TechSol", cnpj: "12.345.678/0001-90", email: "contato@techsol.com", plano: "Pro", status: "active", setor: "Tecnologia", website: "", inscricao: "", cep: "", logradouro: "", numero: "", complemento: "", bairro: "", cidade: "São Paulo", estado: "SP", telefone: "(11) 99999-0001", diaVencimento: "10", contatos: [] as Contact[] },
  { id: "2", razaoSocial: "Educação Global S.A.", nomeFantasia: "EduGlobal", cnpj: "98.765.432/0001-10", email: "admin@eduglobal.com", plano: "Basic", status: "active", setor: "Educação", website: "", inscricao: "", cep: "", logradouro: "", numero: "", complemento: "", bairro: "", cidade: "Rio de Janeiro", estado: "RJ", telefone: "(21) 99999-0002", diaVencimento: "15", contatos: [] as Contact[] },
  { id: "3", razaoSocial: "Construtora ABC Ltda", nomeFantasia: "ABC", cnpj: "11.222.333/0001-44", email: "rh@abc.com", plano: "Enterprise", status: "inactive", setor: "Construção", website: "", inscricao: "", cep: "", logradouro: "", numero: "", complemento: "", bairro: "", cidade: "Curitiba", estado: "PR", telefone: "(41) 99999-0003", diaVencimento: "20", contatos: [] as Contact[] },
];

const emptyForm = { id: "", razaoSocial: "", nomeFantasia: "", cnpj: "", inscricao: "", setor: "", website: "", cep: "", logradouro: "", numero: "", complemento: "", bairro: "", cidade: "", estado: "", telefone: "", email: "", plano: "Basic", diaVencimento: "10", status: "active", contatos: [] as Contact[] };

export default function EmpresasPage() {
  const [data, setData] = useState(initialData);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [editing, setEditing] = useState(false);

  const columns: Column[] = [
    { key: "id", label: "ID", sortable: true },
    { key: "razaoSocial", label: "Razão Social", sortable: true },
    { key: "cnpj", label: "CNPJ", sortable: false },
    { key: "email", label: "Email Principal", sortable: true },
    { key: "plano", label: "Plano", sortable: true },
    { key: "status", label: "Status", sortable: true, render: (v) => <StatusBadge status={v} /> },
  ];

  const filters: FilterConfig[] = [
    { key: "razaoSocial", label: "Razão Social", type: "text" },
    { key: "cnpj", label: "CNPJ", type: "text" },
    { key: "status", label: "Status", type: "select", options: [{ label: "Ativo", value: "active" }, { label: "Inativo", value: "inactive" }] },
  ];

  const actions: ActionConfig[] = [
    { label: "Visualizar", icon: <Eye className="h-4 w-4" />, onClick: (row) => { setSelected(row); setViewOpen(true); } },
    { label: "Editar", icon: <Pencil className="h-4 w-4" />, onClick: (row) => { setForm(row as any); setEditing(true); setModalOpen(true); } },
    { label: "Inativar", icon: <Ban className="h-4 w-4" />, onClick: (row) => { setSelected(row); setConfirmOpen(true); }, variant: "destructive" },
  ];

  const handleSave = () => {
    if (!form.razaoSocial || !form.cnpj || !form.email) { toast.error("Preencha os campos obrigatórios."); return; }
    if (editing) {
      setData(data.map((d) => d.id === form.id ? form : d));
      toast.success("Empresa atualizada com sucesso!");
    } else {
      setData([...data, { ...form, id: String(data.length + 1) }]);
      toast.success("Empresa cadastrada com sucesso!");
    }
    setModalOpen(false); setForm({ ...emptyForm }); setEditing(false);
  };

  const handleInactivate = () => {
    setData(data.map((d) => d.id === selected?.id ? { ...d, status: d.status === "active" ? "inactive" : "active" } : d));
    toast.success("Status alterado com sucesso!");
  };

  const handleCep = async (cep: string) => {
    setForm({ ...form, cep: maskCep(cep) });
    const addr = await fetchCep(cep);
    if (addr) setForm((f) => ({ ...f, ...addr, cep: maskCep(cep) }));
  };

  const addContact = () => setForm({ ...form, contatos: [...form.contatos, { nome: "", cargo: "", email: "", telefone: "" }] });
  const removeContact = (i: number) => setForm({ ...form, contatos: form.contatos.filter((_, j) => j !== i) });
  const updateContact = (i: number, field: keyof Contact, val: string) => {
    const c = [...form.contatos]; c[i] = { ...c[i], [field]: val }; setForm({ ...form, contatos: c });
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Cadastros" }, { label: "Empresas" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Empresas Parceiras</h1>
            <p className="text-sm text-muted-foreground mt-1">Gerencie as empresas parceiras do sistema.</p>
          </div>
          <Button onClick={() => { setForm({ ...emptyForm }); setEditing(false); setModalOpen(true); }} className="gap-2">
            <Plus className="h-4 w-4" /> Nova Empresa
          </Button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>

      {/* Form Modal */}
      <FormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(false); }} title={editing ? "Editar Empresa" : "Nova Empresa"} onSave={handleSave} wide>
        <Tabs defaultValue="geral" className="w-full">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="geral">Dados Gerais</TabsTrigger>
            <TabsTrigger value="endereco">Endereço</TabsTrigger>
            <TabsTrigger value="contatos">Contatos</TabsTrigger>
            <TabsTrigger value="contrato">Contrato</TabsTrigger>
          </TabsList>
          <TabsContent value="geral" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Razão Social *</Label><Input value={form.razaoSocial} onChange={(e) => setForm({ ...form, razaoSocial: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Nome Fantasia</Label><Input value={form.nomeFantasia} onChange={(e) => setForm({ ...form, nomeFantasia: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>CNPJ *</Label><Input value={form.cnpj} onChange={(e) => setForm({ ...form, cnpj: maskCnpj(e.target.value) })} placeholder="XX.XXX.XXX/XXXX-XX" /></div>
              <div className="space-y-1.5"><Label>Inscrição Est./Mun.</Label><Input value={form.inscricao} onChange={(e) => setForm({ ...form, inscricao: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Setor de Atuação</Label><Input value={form.setor} onChange={(e) => setForm({ ...form, setor: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Website</Label><Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} /></div>
            </div>
          </TabsContent>
          <TabsContent value="endereco" className="space-y-4 pt-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5"><Label>CEP</Label><Input value={form.cep} onChange={(e) => handleCep(e.target.value)} placeholder="XXXXX-XXX" /></div>
              <div className="space-y-1.5 col-span-2"><Label>Logradouro</Label><Input value={form.logradouro} onChange={(e) => setForm({ ...form, logradouro: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-1.5"><Label>Número</Label><Input value={form.numero} onChange={(e) => setForm({ ...form, numero: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Complemento</Label><Input value={form.complemento} onChange={(e) => setForm({ ...form, complemento: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Bairro</Label><Input value={form.bairro} onChange={(e) => setForm({ ...form, bairro: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Cidade</Label><Input value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5"><Label>Estado</Label><Input value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })} maxLength={2} /></div>
              <div className="space-y-1.5"><Label>Telefone Comercial</Label><Input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: maskPhone(e.target.value) })} placeholder="(XX) XXXXX-XXXX" /></div>
              <div className="space-y-1.5"><Label>Email Principal *</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            </div>
          </TabsContent>
          <TabsContent value="contatos" className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">Contatos da empresa</p>
              <Button variant="outline" size="sm" onClick={addContact}><Plus className="h-3.5 w-3.5 mr-1" /> Adicionar</Button>
            </div>
            {form.contatos.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Nenhum contato adicionado.</p>}
            {form.contatos.map((c, i) => (
              <div key={i} className="grid grid-cols-5 gap-3 items-end">
                <div className="space-y-1"><Label className="text-xs">Nome</Label><Input value={c.nome} onChange={(e) => updateContact(i, "nome", e.target.value)} className="h-8 text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Cargo</Label><Input value={c.cargo} onChange={(e) => updateContact(i, "cargo", e.target.value)} className="h-8 text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Email</Label><Input value={c.email} onChange={(e) => updateContact(i, "email", e.target.value)} className="h-8 text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Telefone</Label><Input value={c.telefone} onChange={(e) => updateContact(i, "telefone", maskPhone(e.target.value))} className="h-8 text-xs" /></div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeContact(i)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="contrato" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Plano de Serviço</Label>
                <Select value={form.plano} onValueChange={(v) => setForm({ ...form, plano: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic">Basic</SelectItem>
                    <SelectItem value="Pro">Pro</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Dia de Vencimento da Fatura</Label>
                <Select value={form.diaVencimento} onValueChange={(v) => setForm({ ...form, diaVencimento: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[5, 10, 15, 20, 25].map((d) => <SelectItem key={d} value={String(d)}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </FormModal>

      {/* View Modal */}
      <FormModal open={viewOpen} onClose={() => setViewOpen(false)} title="Detalhes da Empresa" onSave={() => setViewOpen(false)} wide>
        {selected && (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div><span className="text-muted-foreground">Razão Social:</span> <span className="font-medium">{selected.razaoSocial}</span></div>
              <div><span className="text-muted-foreground">CNPJ:</span> <span className="font-medium">{selected.cnpj}</span></div>
              <div><span className="text-muted-foreground">Email:</span> <span className="font-medium">{selected.email}</span></div>
              <div><span className="text-muted-foreground">Plano:</span> <span className="font-medium">{selected.plano}</span></div>
              <div><span className="text-muted-foreground">Cidade:</span> <span className="font-medium">{selected.cidade}</span></div>
              <div><span className="text-muted-foreground">Status:</span> <StatusBadge status={selected.status} /></div>
            </div>
          </div>
        )}
      </FormModal>

      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleInactivate} title="Alterar Status" description={`Deseja ${selected?.status === "active" ? "inativar" : "ativar"} a empresa "${selected?.razaoSocial}"?`} confirmLabel={selected?.status === "active" ? "Inativar" : "Ativar"} />
    </DashboardLayout>
  );
}
