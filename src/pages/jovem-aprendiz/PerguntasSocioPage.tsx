import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column, FilterConfig, ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";

const mockData = [
  { id: "1", pergunta: "Qual a renda familiar?", tipo: "Múltipla Escolha", opcoes: ["Até 1 SM", "1-3 SM", "3-5 SM", "Acima 5 SM"], obrigatoria: true },
  { id: "2", pergunta: "Possui moradia própria?", tipo: "Sim-Não", opcoes: [], obrigatoria: true },
  { id: "3", pergunta: "Observações adicionais", tipo: "Texto", opcoes: [], obrigatoria: false },
];
const tiposResposta = ["Texto", "Múltipla Escolha", "Sim-Não"];
const emptyForm = { pergunta: "", tipo: "Texto", obrigatoria: true };

export default function PerguntasSocioPage() {
  const [data, setData] = useState(mockData);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [opcoes, setOpcoes] = useState<string[]>([""]);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteItem, setDeleteItem] = useState<any>(null);
  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  const columns: Column[] = [
    { key: "id", label: "ID" }, { key: "pergunta", label: "Pergunta", sortable: true },
    { key: "tipo", label: "Tipo", render: (v) => <Badge variant="outline">{v}</Badge> },
    { key: "obrigatoria", label: "Obrigatória", render: (v) => <Badge className={v ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}>{v ? "Sim" : "Não"}</Badge> },
  ];
  const filters: FilterConfig[] = [{ key: "pergunta", label: "Pergunta", type: "text" }];
  const actions: ActionConfig[] = [
    { label: "Visualizar", icon: <Eye className="h-4 w-4" />, onClick: (r) => { setForm({ pergunta: r.pergunta, tipo: r.tipo, obrigatoria: r.obrigatoria }); setOpcoes(r.opcoes.length ? r.opcoes : [""]); setEditId(null); setModalOpen(true); } },
    { label: "Editar", icon: <Pencil className="h-4 w-4" />, onClick: (r) => { setForm({ pergunta: r.pergunta, tipo: r.tipo, obrigatoria: r.obrigatoria }); setOpcoes(r.opcoes.length ? r.opcoes : [""]); setEditId(r.id); setModalOpen(true); } },
    { label: "Excluir", icon: <Trash2 className="h-4 w-4" />, onClick: (r) => setDeleteItem(r), variant: "destructive" },
  ];

  const handleSave = () => {
    if (!form.pergunta) { toast.error("Preencha a pergunta"); return; }
    const item = { ...form, opcoes: form.tipo === "Múltipla Escolha" ? opcoes.filter(o => o) : [] };
    if (editId) { setData(data.map(d => d.id === editId ? { ...d, ...item } : d)); toast.success("Atualizada"); }
    else { setData([...data, { ...item, id: String(data.length + 1) }]); toast.success("Criada"); }
    setModalOpen(false); setEditId(null); setForm(emptyForm); setOpcoes([""]);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Jovem Aprendiz" }, { label: "Perguntas Sócio Econômicas" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Perguntas Sócio Econômicas</h1><p className="text-sm text-muted-foreground mt-1">{data.length} perguntas.</p></div>
          <button onClick={() => { setForm(emptyForm); setOpcoes([""]); setEditId(null); setModalOpen(true); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"><Plus className="h-4 w-4" />Nova Pergunta</button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>
      <FormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditId(null); }} title={editId ? "Editar Pergunta" : "Nova Pergunta"} onSave={handleSave}>
        <div className="space-y-4">
          <div><Label>Pergunta *</Label><Textarea value={form.pergunta} onChange={(e) => set("pergunta", e.target.value)} /></div>
          <div><Label>Tipo de Resposta</Label><Select value={form.tipo} onValueChange={(v) => set("tipo", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{tiposResposta.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
          {form.tipo === "Múltipla Escolha" && <div><Label>Opções de Resposta</Label><div className="space-y-2 mt-1">{opcoes.map((o, i) => (
            <div key={i} className="flex gap-2"><Input value={o} onChange={(e) => { const n = [...opcoes]; n[i] = e.target.value; setOpcoes(n); }} placeholder={`Opção ${i + 1}`} />{opcoes.length > 1 && <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setOpcoes(opcoes.filter((_, j) => j !== i))}><Trash2 className="h-3 w-3" /></Button>}</div>
          ))}</div><Button variant="outline" size="sm" className="mt-1" onClick={() => setOpcoes([...opcoes, ""])}><Plus className="h-3 w-3 mr-1" />Adicionar Opção</Button></div>}
          <div className="flex items-center gap-3"><Switch checked={form.obrigatoria} onCheckedChange={(v) => set("obrigatoria", v)} /><Label>Obrigatória</Label></div>
        </div>
      </FormModal>
      <ConfirmDialog open={!!deleteItem} onClose={() => setDeleteItem(null)} title="Excluir" description={`Excluir pergunta?`} onConfirm={() => { setData(data.filter(d => d.id !== deleteItem?.id)); toast.success("Excluída"); setDeleteItem(null); }} />
    </DashboardLayout>
  );
}
