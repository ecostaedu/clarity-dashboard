import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, type Column, type FilterConfig, type ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Eye, Pencil, Trash2, Play } from "lucide-react";
import { toast } from "sonner";

interface Alternativa { texto: string; correta: boolean; }
interface Questao { tipo: "multipla" | "discursiva"; enunciado: string; pontuacao: number; alternativas: Alternativa[]; }

const categorias = ["Técnico", "Raciocínio Lógico", "Comportamental", "Idiomas"];

const initialData = [
  { id: "1", titulo: "Teste Técnico React", categoria: "Técnico", duracao: 60, questoes: [{ tipo: "multipla" as const, enunciado: "O que é JSX?", pontuacao: 10, alternativas: [{ texto: "JavaScript XML", correta: true }, { texto: "Java Syntax", correta: false }, { texto: "JSON Extended", correta: false }, { texto: "JavaScript Extra", correta: false }] }] },
  { id: "2", titulo: "Teste Lógica", categoria: "Raciocínio Lógico", duracao: 45, questoes: [{ tipo: "discursiva" as const, enunciado: "Explique o conceito de recursão.", pontuacao: 20, alternativas: [] }] },
  { id: "3", titulo: "Teste Comportamental", categoria: "Comportamental", duracao: 30, questoes: [] as Questao[] },
];

const emptyQuestao: Questao = { tipo: "multipla", enunciado: "", pontuacao: 10, alternativas: [{ texto: "", correta: true }, { texto: "", correta: false }, { texto: "", correta: false }, { texto: "", correta: false }] };
const emptyForm = { id: "", titulo: "", categoria: "", duracao: 60, questoes: [] as Questao[] };

export default function ProvasPage() {
  const [data, setData] = useState(initialData);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [editing, setEditing] = useState(false);

  const pontuacaoTotal = useMemo(() => form.questoes.reduce((s, q) => s + (q.pontuacao || 0), 0), [form.questoes]);

  const columns: Column[] = [
    { key: "id", label: "ID", sortable: true },
    { key: "titulo", label: "Título", sortable: true },
    { key: "categoria", label: "Categoria", sortable: true },
    { key: "duracao", label: "Duração (min)", sortable: true },
    { key: "questoes", label: "Questões", render: (v) => v?.length ?? 0 },
  ];

  const filters: FilterConfig[] = [
    { key: "titulo", label: "Título", type: "text" },
    { key: "categoria", label: "Categoria", type: "select", options: categorias.map((c) => ({ label: c, value: c })) },
  ];

  const actions: ActionConfig[] = [
    { label: "Visualizar", icon: <Eye className="h-4 w-4" />, onClick: (row) => { setSelected(row); setViewOpen(true); } },
    { label: "Editar", icon: <Pencil className="h-4 w-4" />, onClick: (row) => { setForm(row as any); setEditing(true); setModalOpen(true); } },
    { label: "Aplicar em Processo", icon: <Play className="h-4 w-4" />, onClick: () => toast.info("Vincule esta prova ao criar/editar um Processo Seletivo.") },
    { label: "Excluir", icon: <Trash2 className="h-4 w-4" />, onClick: (row) => { setSelected(row); setConfirmOpen(true); }, variant: "destructive" },
  ];

  const handleSave = () => {
    if (!form.titulo || !form.categoria) { toast.error("Preencha os campos obrigatórios."); return; }
    if (editing) {
      setData(data.map((d) => d.id === form.id ? form : d));
      toast.success("Prova atualizada!");
    } else {
      setData([...data, { ...form, id: String(data.length + 1) }]);
      toast.success("Prova criada!");
    }
    setModalOpen(false); setForm({ ...emptyForm }); setEditing(false);
  };

  const handleDelete = () => {
    setData(data.filter((d) => d.id !== selected?.id));
    toast.success("Prova excluída.");
  };

  const addQuestao = (tipo: "multipla" | "discursiva") => {
    const q: Questao = tipo === "multipla"
      ? { ...emptyQuestao }
      : { tipo: "discursiva", enunciado: "", pontuacao: 10, alternativas: [] };
    setForm({ ...form, questoes: [...form.questoes, q] });
  };

  const updateQuestao = (i: number, partial: Partial<Questao>) => {
    const q = [...form.questoes]; q[i] = { ...q[i], ...partial }; setForm({ ...form, questoes: q });
  };

  const updateAlternativa = (qi: number, ai: number, texto: string) => {
    const q = [...form.questoes]; const alts = [...q[qi].alternativas]; alts[ai] = { ...alts[ai], texto }; q[qi] = { ...q[qi], alternativas: alts }; setForm({ ...form, questoes: q });
  };

  const setCorreta = (qi: number, ai: number) => {
    const q = [...form.questoes]; q[qi] = { ...q[qi], alternativas: q[qi].alternativas.map((a, j) => ({ ...a, correta: j === ai })) }; setForm({ ...form, questoes: q });
  };

  const removeQuestao = (i: number) => setForm({ ...form, questoes: form.questoes.filter((_, j) => j !== i) });

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Recrutamento" }, { label: "Provas" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Provas</h1>
            <p className="text-sm text-muted-foreground mt-1">{data.length} provas cadastradas.</p>
          </div>
          <Button onClick={() => { setForm({ ...emptyForm }); setEditing(false); setModalOpen(true); }} className="gap-2"><Plus className="h-4 w-4" /> Nova Prova</Button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>

      <FormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(false); }} title={editing ? "Editar Prova" : "Nova Prova"} onSave={handleSave} wide>
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5"><Label>Título *</Label><Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} /></div>
            <div className="space-y-1.5">
              <Label>Categoria *</Label>
              <Select value={form.categoria} onValueChange={(v) => setForm({ ...form, categoria: v })}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{categorias.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
            </div>
            <div className="space-y-1.5"><Label>Duração (min)</Label><Input type="number" value={form.duracao} onChange={(e) => setForm({ ...form, duracao: Number(e.target.value) })} /></div>
          </div>

          {/* Questões */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold">Questões ({form.questoes.length})</h3>
                <p className="text-xs text-muted-foreground">Pontuação total: {pontuacaoTotal} pts</p>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => addQuestao("multipla")}><Plus className="h-3.5 w-3.5 mr-1" /> Múltipla Escolha</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => addQuestao("discursiva")}><Plus className="h-3.5 w-3.5 mr-1" /> Discursiva</Button>
              </div>
            </div>

            <div className="space-y-4">
              {form.questoes.map((q, i) => (
                <div key={i} className="p-4 rounded-lg border border-border bg-muted/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">Questão {i + 1} — {q.tipo === "multipla" ? "Múltipla Escolha" : "Discursiva"}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1"><Label className="text-xs">Pts:</Label><Input type="number" value={q.pontuacao} onChange={(e) => updateQuestao(i, { pontuacao: Number(e.target.value) })} className="h-7 w-16 text-xs" /></div>
                      <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeQuestao(i)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                    </div>
                  </div>
                  <Textarea value={q.enunciado} onChange={(e) => updateQuestao(i, { enunciado: e.target.value })} placeholder="Enunciado da questão" rows={2} className="text-sm" />
                  {q.tipo === "multipla" && (
                    <div className="space-y-2 pl-2">
                      <RadioGroup value={String(q.alternativas.findIndex((a) => a.correta))} onValueChange={(v) => setCorreta(i, Number(v))}>
                        {q.alternativas.map((alt, ai) => (
                          <div key={ai} className="flex items-center gap-2">
                            <RadioGroupItem value={String(ai)} id={`q${i}a${ai}`} />
                            <Input value={alt.texto} onChange={(e) => updateAlternativa(i, ai, e.target.value)} placeholder={`Alternativa ${String.fromCharCode(65 + ai)}`} className="h-8 text-sm flex-1" />
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </FormModal>

      <FormModal open={viewOpen} onClose={() => setViewOpen(false)} title="Detalhes da Prova" onSave={() => setViewOpen(false)} wide>
        {selected && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-3 gap-4">
              <div><span className="text-muted-foreground">Título:</span> <span className="font-medium">{selected.titulo}</span></div>
              <div><span className="text-muted-foreground">Categoria:</span> <span className="font-medium">{selected.categoria}</span></div>
              <div><span className="text-muted-foreground">Duração:</span> <span className="font-medium">{selected.duracao} min</span></div>
            </div>
            <div><span className="text-muted-foreground">Questões:</span> <span className="font-medium">{selected.questoes?.length ?? 0}</span></div>
            {selected.questoes?.map((q: Questao, i: number) => (
              <div key={i} className="p-3 rounded-lg bg-muted/30">
                <p className="font-medium">{i + 1}. {q.enunciado || "(sem enunciado)"} ({q.pontuacao} pts)</p>
                {q.tipo === "multipla" && q.alternativas.map((a, j) => (
                  <p key={j} className={`text-xs ml-4 ${a.correta ? "text-green-600 font-semibold" : ""}`}>{String.fromCharCode(65 + j)}) {a.texto} {a.correta && "✓"}</p>
                ))}
              </div>
            ))}
          </div>
        )}
      </FormModal>

      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} title="Excluir Prova" description={`Excluir a prova "${selected?.titulo}"?`} confirmLabel="Excluir" variant="destructive" />
    </DashboardLayout>
  );
}
