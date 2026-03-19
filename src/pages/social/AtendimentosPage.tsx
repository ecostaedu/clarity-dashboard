import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column, FilterConfig, ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RichTextEditor } from "@/components/RichTextEditor";
import { toast } from "sonner";

const initial = [
  { id: "1", aprendiz: "João Silva", tipo: "Individual", data: "15/03/2024", responsavel: "Dra. Ana" },
  { id: "2", aprendiz: "Maria Santos", tipo: "Grupal", data: "10/03/2024", responsavel: "Dra. Ana" },
];

export default function AtendimentosPage() {
  const [data, setData] = useState(initial);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ aprendiz: "", tipo: "", data: "", descricao: "", proximo: "" });

  const columns: Column[] = [
    { key: "aprendiz", label: "Jovem Aprendiz", sortable: true },
    { key: "tipo", label: "Tipo" },
    { key: "data", label: "Data" },
    { key: "responsavel", label: "Responsável" },
  ];

  const filters: FilterConfig[] = [
    { key: "aprendiz", label: "Aprendiz", type: "text" },
    { key: "tipo", label: "Tipo", type: "select", options: [{ label: "Individual", value: "Individual" }, { label: "Grupal", value: "Grupal" }, { label: "Familiar", value: "Familiar" }] },
  ];

  const actions: ActionConfig[] = [
    { label: "Editar", onClick: (r) => { setEditing(r); setForm({ aprendiz: r.aprendiz, tipo: r.tipo, data: r.data, descricao: "", proximo: "" }); setModal(true); } },
    { label: "Excluir", variant: "destructive", onClick: (r) => { setData(data.filter(d => d.id !== r.id)); toast.success("Excluído."); } },
  ];

  const handleSave = () => {
    if (!form.aprendiz || !form.tipo) { toast.error("Preencha os campos obrigatórios."); return; }
    if (editing) { setData(data.map(d => d.id === editing.id ? { ...d, aprendiz: form.aprendiz, tipo: form.tipo, data: form.data } : d)); toast.success("Atualizado!"); }
    else { setData([...data, { id: String(Date.now()), aprendiz: form.aprendiz, tipo: form.tipo, data: form.data || new Date().toLocaleDateString("pt-BR"), responsavel: "Dra. Ana" }]); toast.success("Atendimento registrado!"); }
    setModal(false); setEditing(null);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Social / Psicóloga" }, { label: "Atendimentos" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Atendimentos</h1><p className="text-sm text-muted-foreground">{data.length} atendimentos.</p></div>
          <button onClick={() => { setEditing(null); setForm({ aprendiz: "", tipo: "", data: "", descricao: "", proximo: "" }); setModal(true); }} className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Novo Atendimento</button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>
      <FormModal open={modal} onClose={() => { setModal(false); setEditing(null); }} title={editing ? "Editar" : "Novo Atendimento"} onSave={handleSave} wide>
        <div className="space-y-4">
          <div><Label>Jovem Aprendiz *</Label><Select value={form.aprendiz} onValueChange={v => setForm({ ...form, aprendiz: v })}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="João Silva">João Silva</SelectItem><SelectItem value="Maria Santos">Maria Santos</SelectItem><SelectItem value="Pedro Lima">Pedro Lima</SelectItem></SelectContent></Select></div>
          <div><Label>Tipo *</Label><Select value={form.tipo} onValueChange={v => setForm({ ...form, tipo: v })}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="Individual">Individual</SelectItem><SelectItem value="Grupal">Grupal</SelectItem><SelectItem value="Familiar">Familiar</SelectItem></SelectContent></Select></div>
          <div><Label>Data</Label><Input type="date" value={form.data} onChange={e => setForm({ ...form, data: e.target.value })} /></div>
          <div><Label>Descrição</Label><RichTextEditor value={form.descricao} onChange={v => setForm({ ...form, descricao: v })} /></div>
          <div><Label>Próximo Agendamento</Label><Input type="date" value={form.proximo} onChange={e => setForm({ ...form, proximo: e.target.value })} /></div>
        </div>
      </FormModal>
    </DashboardLayout>
  );
}
