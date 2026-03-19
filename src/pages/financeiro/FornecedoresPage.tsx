import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column, FilterConfig, ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { maskCnpj, maskPhone, maskCep, fetchCep } from "@/lib/masks";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

const initial = [
  { id: "1", razao_social: "SENAI SP", cnpj: "12.345.678/0001-90", email: "contato@senai.com", phone: "(11) 99999-0001", active: true },
  { id: "2", razao_social: "AWS Brasil", cnpj: "23.456.789/0001-01", email: "aws@aws.com", phone: "(11) 99999-0002", active: true },
];

type Contact = { name: string; cargo: string; email: string; phone: string };

export default function FornecedoresPage() {
  const [data, setData] = useState(initial);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [confirm, setConfirm] = useState<any>(null);
  const [form, setForm] = useState({ razao_social: "", cnpj: "", ie: "", im: "", cep: "", logradouro: "", numero: "", complemento: "", bairro: "", cidade: "", estado: "", phone: "", email: "", active: true });
  const [contacts, setContacts] = useState<Contact[]>([]);

  const columns: Column[] = [
    { key: "razao_social", label: "Razão Social", sortable: true },
    { key: "cnpj", label: "CNPJ" },
    { key: "email", label: "Email" },
    { key: "active", label: "Ativo", render: (v) => <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${v ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>{v ? "Sim" : "Não"}</span> },
  ];

  const filters: FilterConfig[] = [
    { key: "razao_social", label: "Razão Social", type: "text" },
    { key: "cnpj", label: "CNPJ", type: "text" },
  ];

  const actions: ActionConfig[] = [
    { label: "Editar", onClick: (r) => { setEditing(r); setForm({ razao_social: r.razao_social, cnpj: r.cnpj, ie: "", im: "", cep: "", logradouro: "", numero: "", complemento: "", bairro: "", cidade: "", estado: "", phone: r.phone || "", email: r.email || "", active: r.active }); setContacts([]); setModal(true); } },
    { label: "Inativar", variant: "destructive", onClick: (r) => setConfirm(r) },
  ];

  const handleCep = async () => {
    const result = await fetchCep(form.cep);
    if (result) setForm({ ...form, logradouro: result.logradouro, bairro: result.bairro, cidade: result.cidade, estado: result.estado });
    else toast.error("CEP não encontrado.");
  };

  const handleSave = () => {
    if (!form.razao_social || !form.cnpj) { toast.error("Preencha os campos obrigatórios."); return; }
    if (editing) {
      setData(data.map(d => d.id === editing.id ? { ...d, ...form } : d));
      toast.success("Fornecedor atualizado!");
    } else {
      setData([...data, { id: String(Date.now()), ...form }]);
      toast.success("Fornecedor criado!");
    }
    setModal(false); setEditing(null);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Financeiro" }, { label: "Fornecedores" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Fornecedores</h1><p className="text-sm text-muted-foreground">{data.length} fornecedores.</p></div>
          <button onClick={() => { setEditing(null); setForm({ razao_social: "", cnpj: "", ie: "", im: "", cep: "", logradouro: "", numero: "", complemento: "", bairro: "", cidade: "", estado: "", phone: "", email: "", active: true }); setContacts([]); setModal(true); }} className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Novo Fornecedor</button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>
      <FormModal open={modal} onClose={() => { setModal(false); setEditing(null); }} title={editing ? "Editar Fornecedor" : "Novo Fornecedor"} onSave={handleSave} wide>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Razão Social *</Label><Input value={form.razao_social} onChange={e => setForm({ ...form, razao_social: e.target.value })} /></div>
          <div><Label>CNPJ *</Label><Input value={form.cnpj} onChange={e => setForm({ ...form, cnpj: maskCnpj(e.target.value) })} /></div>
          <div><Label>Inscrição Estadual</Label><Input value={form.ie} onChange={e => setForm({ ...form, ie: e.target.value })} /></div>
          <div><Label>Inscrição Municipal</Label><Input value={form.im} onChange={e => setForm({ ...form, im: e.target.value })} /></div>
          <div><Label>CEP</Label><div className="flex gap-2"><Input value={form.cep} onChange={e => setForm({ ...form, cep: maskCep(e.target.value) })} /><Button type="button" variant="outline" size="sm" onClick={handleCep}>Buscar</Button></div></div>
          <div><Label>Logradouro</Label><Input value={form.logradouro} onChange={e => setForm({ ...form, logradouro: e.target.value })} /></div>
          <div><Label>Número</Label><Input value={form.numero} onChange={e => setForm({ ...form, numero: e.target.value })} /></div>
          <div><Label>Complemento</Label><Input value={form.complemento} onChange={e => setForm({ ...form, complemento: e.target.value })} /></div>
          <div><Label>Bairro</Label><Input value={form.bairro} onChange={e => setForm({ ...form, bairro: e.target.value })} /></div>
          <div><Label>Cidade</Label><Input value={form.cidade} onChange={e => setForm({ ...form, cidade: e.target.value })} /></div>
          <div><Label>Estado</Label><Input value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value })} /></div>
          <div><Label>Telefone</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: maskPhone(e.target.value) })} /></div>
          <div><Label>Email</Label><Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
          <div className="flex items-center gap-2"><Switch checked={form.active} onCheckedChange={v => setForm({ ...form, active: v })} /><Label>Ativo</Label></div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2"><Label>Contatos</Label><Button type="button" variant="outline" size="sm" onClick={() => setContacts([...contacts, { name: "", cargo: "", email: "", phone: "" }])}><Plus className="h-3 w-3 mr-1" />Adicionar</Button></div>
          {contacts.map((c, i) => (
            <div key={i} className="grid grid-cols-5 gap-2 mb-2">
              <Input placeholder="Nome" value={c.name} onChange={e => { const u = [...contacts]; u[i].name = e.target.value; setContacts(u); }} />
              <Input placeholder="Cargo" value={c.cargo} onChange={e => { const u = [...contacts]; u[i].cargo = e.target.value; setContacts(u); }} />
              <Input placeholder="Email" value={c.email} onChange={e => { const u = [...contacts]; u[i].email = e.target.value; setContacts(u); }} />
              <Input placeholder="Telefone" value={c.phone} onChange={e => { const u = [...contacts]; u[i].phone = maskPhone(e.target.value); setContacts(u); }} />
              <Button type="button" variant="ghost" size="icon" onClick={() => setContacts(contacts.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
        </div>
      </FormModal>
      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => { setData(data.map(d => d.id === confirm.id ? { ...d, active: false } : d)); toast.success("Fornecedor inativado."); setConfirm(null); }} title="Inativar Fornecedor" description={`Deseja inativar "${confirm?.razao_social}"?`} />
    </DashboardLayout>
  );
}
