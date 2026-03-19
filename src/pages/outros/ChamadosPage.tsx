import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column, FilterConfig, ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RichTextEditor } from "@/components/RichTextEditor";
import { toast } from "sonner";

const initial = [
  { id: "CH-001", titulo: "Erro no relatório financeiro", tipo: "Bug", prioridade: "Alta", status: "Aberto", data: "19/03/2024", solicitante: "Admin", responsavel: "—" },
  { id: "CH-002", titulo: "Novo campo no cadastro", tipo: "Sugestão", prioridade: "Baixa", status: "Em Andamento", data: "15/03/2024", solicitante: "Admin", responsavel: "Carlos" },
  { id: "CH-003", titulo: "Dúvida sobre folha", tipo: "Dúvida", prioridade: "Média", status: "Resolvido", data: "10/03/2024", solicitante: "Maria", responsavel: "Ana" },
];

const prioridadeBadge = (v: string) => {
  const c = v === "Crítica" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : v === "Alta" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" : v === "Média" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-muted text-muted-foreground";
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${c}`}>{v}</span>;
};

const statusBadge = (v: string) => {
  const c = v === "Aberto" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : v === "Em Andamento" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : v === "Resolvido" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-muted text-muted-foreground";
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${c}`}>{v}</span>;
};

export default function ChamadosPage() {
  const [data, setData] = useState(initial);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [confirm, setConfirm] = useState<any>(null);
  const [atribuir, setAtribuir] = useState<any>(null);
  const [resp, setResp] = useState("");
  const [form, setForm] = useState({ titulo: "", descricao: "", tipo: "Bug", prioridade: "Média" });

  const columns: Column[] = [
    { key: "id", label: "ID" },
    { key: "titulo", label: "Título", sortable: true },
    { key: "tipo", label: "Tipo" },
    { key: "prioridade", label: "Prioridade", render: prioridadeBadge },
    { key: "status", label: "Status", render: statusBadge },
    { key: "data", label: "Data" },
    { key: "solicitante", label: "Solicitante" },
    { key: "responsavel", label: "Responsável" },
  ];

  const filters: FilterConfig[] = [
    { key: "titulo", label: "Título", type: "text" },
    { key: "tipo", label: "Tipo", type: "select", options: [{ label: "Bug", value: "Bug" }, { label: "Sugestão", value: "Sugestão" }, { label: "Dúvida", value: "Dúvida" }, { label: "Solicitação", value: "Solicitação" }] },
    { key: "prioridade", label: "Prioridade", type: "select", options: [{ label: "Baixa", value: "Baixa" }, { label: "Média", value: "Média" }, { label: "Alta", value: "Alta" }, { label: "Crítica", value: "Crítica" }] },
    { key: "status", label: "Status", type: "select", options: [{ label: "Aberto", value: "Aberto" }, { label: "Em Andamento", value: "Em Andamento" }, { label: "Resolvido", value: "Resolvido" }, { label: "Arquivado", value: "Arquivado" }] },
  ];

  const actions: ActionConfig[] = [
    { label: "Editar", onClick: (r) => { setEditing(r); setForm({ titulo: r.titulo, descricao: "", tipo: r.tipo, prioridade: r.prioridade }); setModal(true); } },
    { label: "Atribuir", onClick: (r) => { setAtribuir(r); setResp(""); } },
    { label: "Arquivar", variant: "destructive", onClick: (r) => setConfirm(r) },
  ];

  const handleSave = () => {
    if (!form.titulo) { toast.error("Preencha o título."); return; }
    if (editing) { setData(data.map(d => d.id === editing.id ? { ...d, titulo: form.titulo, tipo: form.tipo, prioridade: form.prioridade } : d)); toast.success("Chamado atualizado!"); }
    else { setData([{ id: `CH-${String(data.length + 1).padStart(3, "0")}`, titulo: form.titulo, tipo: form.tipo, prioridade: form.prioridade, status: "Aberto", data: new Date().toLocaleDateString("pt-BR"), solicitante: "Admin", responsavel: "—" }, ...data]); toast.success("Chamado criado!"); }
    setModal(false); setEditing(null);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Outros" }, { label: "Chamados" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Chamados</h1><p className="text-sm text-muted-foreground">{data.length} chamados.</p></div>
          <button onClick={() => { setEditing(null); setForm({ titulo: "", descricao: "", tipo: "Bug", prioridade: "Média" }); setModal(true); }} className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Novo Chamado</button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>
      <FormModal open={modal} onClose={() => { setModal(false); setEditing(null); }} title={editing ? "Editar Chamado" : "Novo Chamado"} onSave={handleSave} wide>
        <div className="space-y-4">
          <div><Label>Título *</Label><Input value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Tipo</Label><Select value={form.tipo} onValueChange={v => setForm({ ...form, tipo: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Bug">Bug</SelectItem><SelectItem value="Sugestão">Sugestão</SelectItem><SelectItem value="Dúvida">Dúvida</SelectItem><SelectItem value="Solicitação">Solicitação</SelectItem></SelectContent></Select></div>
            <div><Label>Prioridade</Label><Select value={form.prioridade} onValueChange={v => setForm({ ...form, prioridade: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Baixa">Baixa</SelectItem><SelectItem value="Média">Média</SelectItem><SelectItem value="Alta">Alta</SelectItem><SelectItem value="Crítica">Crítica</SelectItem></SelectContent></Select></div>
          </div>
          <div><Label>Descrição</Label><RichTextEditor value={form.descricao} onChange={v => setForm({ ...form, descricao: v })} /></div>
        </div>
      </FormModal>
      <FormModal open={!!atribuir} onClose={() => setAtribuir(null)} title="Atribuir Responsável" onSave={() => { setData(data.map(d => d.id === atribuir.id ? { ...d, responsavel: resp, status: "Em Andamento" } : d)); toast.success("Chamado atribuído!"); setAtribuir(null); }}>
        <div><Label>Responsável</Label><Select value={resp} onValueChange={setResp}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="Carlos">Carlos</SelectItem><SelectItem value="Ana">Ana</SelectItem><SelectItem value="Pedro">Pedro</SelectItem></SelectContent></Select></div>
      </FormModal>
      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => { setData(data.map(d => d.id === confirm.id ? { ...d, status: "Arquivado" } : d)); toast.success("Chamado arquivado."); setConfirm(null); }} title="Arquivar Chamado" description="Deseja arquivar este chamado?" />
    </DashboardLayout>
  );
}
