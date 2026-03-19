import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column, ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const variables = ["{{NOME_APRENDIZ}}", "{{DATA}}", "{{EMPRESA}}", "{{TURMA}}"];

const initial = [
  { id: "1", name: "Relatório de Atendimento", content: "<p>Atendimento realizado com {{NOME_APRENDIZ}} em {{DATA}}.</p>" },
  { id: "2", name: "Encaminhamento Social", content: "<p>Encaminhamos {{NOME_APRENDIZ}} para acompanhamento.</p>" },
];

export default function ModelosSocialPage() {
  const [data, setData] = useState(initial);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", content: "" });

  const columns: Column[] = [
    { key: "name", label: "Nome do Modelo", sortable: true },
  ];

  const actions: ActionConfig[] = [
    { label: "Editar", onClick: (r) => { setEditing(r); setForm({ name: r.name, content: r.content }); setModal(true); } },
    { label: "Excluir", variant: "destructive", onClick: (r) => { setData(data.filter(d => d.id !== r.id)); toast.success("Modelo excluído."); } },
  ];

  const handleSave = () => {
    if (!form.name) { toast.error("Preencha o nome."); return; }
    if (editing) { setData(data.map(d => d.id === editing.id ? { ...d, ...form } : d)); toast.success("Modelo atualizado!"); }
    else { setData([...data, { id: String(Date.now()), ...form }]); toast.success("Modelo criado!"); }
    setModal(false); setEditing(null);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Social / Psicóloga" }, { label: "Modelos" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Modelos de Atendimento</h1><p className="text-sm text-muted-foreground">{data.length} modelos.</p></div>
          <button onClick={() => { setEditing(null); setForm({ name: "", content: "" }); setModal(true); }} className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Novo Modelo</button>
        </div>
        <DataTable columns={columns} data={data} actions={actions} />
      </div>
      <FormModal open={modal} onClose={() => { setModal(false); setEditing(null); }} title={editing ? "Editar Modelo" : "Novo Modelo"} onSave={handleSave} wide>
        <div className="space-y-4">
          <div><Label>Nome *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
          <div><Label>Variáveis</Label><div className="flex flex-wrap gap-1 mb-2">{variables.map(v => <Button key={v} type="button" variant="outline" size="sm" className="text-xs" onClick={() => setForm({ ...form, content: form.content + v })}>{v}</Button>)}</div></div>
          <div><Label>Conteúdo</Label><RichTextEditor value={form.content} onChange={v => setForm({ ...form, content: v })} /></div>
        </div>
      </FormModal>
    </DashboardLayout>
  );
}
