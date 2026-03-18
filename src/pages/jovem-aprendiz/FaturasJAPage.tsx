import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column, FilterConfig, ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, Pencil, Send, XCircle, FileDown, Plus, Trash2 } from "lucide-react";
import { maskCurrency } from "@/lib/masks";

interface FaturaItem { descricao: string; qtd: number; valor_unit: number; }
const mockData = [
  { id: "1", empresa: "TechSol", competencia: "03/2024", data_emissao: "05/04/2024", data_vencimento: "15/04/2024", status: "Pendente", itens: [{ descricao: "Aprendiz Admin", qtd: 5, valor_unit: 800 }], descontos: 0, acrescimos: 0 },
  { id: "2", empresa: "RH Global", competencia: "03/2024", data_emissao: "05/04/2024", data_vencimento: "15/04/2024", status: "Paga", itens: [{ descricao: "Aprendiz TI", qtd: 3, valor_unit: 900 }], descontos: 100, acrescimos: 0 },
];

const emptyForm = { empresa: "", competencia: "", data_emissao: "", data_vencimento: "", descontos: "0", acrescimos: "0", obs: "" };

export default function FaturasJAPage() {
  const [data, setData] = useState(mockData);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [itens, setItens] = useState<FaturaItem[]>([{ descricao: "", qtd: 1, valor_unit: 0 }]);
  const [editId, setEditId] = useState<string | null>(null);
  const [cancelItem, setCancelItem] = useState<any>(null);
  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  const total = useMemo(() => {
    const subtotal = itens.reduce((s, i) => s + i.qtd * i.valor_unit, 0);
    return subtotal - Number(form.descontos) + Number(form.acrescimos);
  }, [itens, form.descontos, form.acrescimos]);

  const columns: Column[] = [
    { key: "id", label: "ID" }, { key: "empresa", label: "Empresa", sortable: true }, { key: "competencia", label: "Competência" },
    { key: "data_vencimento", label: "Vencimento" },
    { key: "status", label: "Status", render: (v) => <Badge className={v === "Paga" ? "bg-emerald-100 text-emerald-700" : v === "Cancelada" ? "bg-destructive/10 text-destructive" : "bg-amber-100 text-amber-700"}>{v}</Badge> },
  ];
  const filters: FilterConfig[] = [{ key: "empresa", label: "Empresa", type: "text" }, { key: "competencia", label: "Competência", type: "text" }];
  const actions: ActionConfig[] = [
    { label: "Visualizar", icon: <Eye className="h-4 w-4" />, onClick: (r) => { setForm({...emptyForm,...r,descontos:String(r.descontos),acrescimos:String(r.acrescimos)}); setItens(r.itens); setEditId(null); setModalOpen(true); } },
    { label: "Editar", icon: <Pencil className="h-4 w-4" />, onClick: (r) => { setForm({...emptyForm,...r,descontos:String(r.descontos),acrescimos:String(r.acrescimos)}); setItens(r.itens); setEditId(r.id); setModalOpen(true); } },
    { label: "Marcar como Paga", icon: <Eye className="h-4 w-4" />, onClick: (r) => { setData(data.map(d=>d.id===r.id?{...d,status:"Paga"}:d)); toast.success("Fatura marcada como paga"); } },
    { label: "Enviar Email", icon: <Send className="h-4 w-4" />, onClick: () => toast.success("Email enviado") },
    { label: "Cancelar", icon: <XCircle className="h-4 w-4" />, onClick: (r) => setCancelItem(r), variant: "destructive" },
    { label: "Gerar PDF", icon: <FileDown className="h-4 w-4" />, onClick: () => toast.success("PDF gerado") },
  ];

  const handleSave = () => {
    if (!form.empresa || !form.competencia) { toast.error("Preencha campos obrigatórios"); return; }
    const item = {...form, itens, descontos: Number(form.descontos), acrescimos: Number(form.acrescimos), status: "Pendente"};
    if (editId) { setData(data.map(d => d.id === editId ? {...d,...item} : d)); toast.success("Fatura atualizada"); }
    else { setData([...data, {...item, id: String(data.length+1)} as any]); toast.success("Fatura criada"); }
    setModalOpen(false); setEditId(null); setForm(emptyForm); setItens([{ descricao: "", qtd: 1, valor_unit: 0 }]);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Jovem Aprendiz" }, { label: "Faturas" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Faturas JA</h1><p className="text-sm text-muted-foreground mt-1">{data.length} faturas.</p></div>
          <button onClick={() => { setForm(emptyForm); setItens([{ descricao: "", qtd: 1, valor_unit: 0 }]); setEditId(null); setModalOpen(true); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"><Plus className="h-4 w-4" />Nova Fatura</button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>
      <FormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditId(null); }} title={editId ? "Editar Fatura" : "Nova Fatura"} onSave={handleSave} wide>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Empresa *</Label><Select value={form.empresa} onValueChange={(v) => set("empresa", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{["TechSol","RH Global","Apex Build"].map(e=><SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Competência *</Label><Input type="month" value={form.competencia} onChange={(e) => set("competencia", e.target.value)} /></div>
          <div><Label>Data Emissão</Label><Input type="date" value={form.data_emissao} onChange={(e) => set("data_emissao", e.target.value)} /></div>
          <div><Label>Data Vencimento</Label><Input type="date" value={form.data_vencimento} onChange={(e) => set("data_vencimento", e.target.value)} /></div>
        </div>
        <div className="mt-4">
          <Label>Itens da Fatura</Label>
          <div className="space-y-2 mt-2">{itens.map((item, i) => (
            <div key={i} className="grid grid-cols-[1fr_80px_100px_80px_auto] gap-2 items-end">
              <div><Input placeholder="Descrição" value={item.descricao} onChange={(e) => { const n=[...itens]; n[i]={...n[i],descricao:e.target.value}; setItens(n); }} /></div>
              <div><Input type="number" placeholder="Qtd" value={item.qtd} onChange={(e) => { const n=[...itens]; n[i]={...n[i],qtd:Number(e.target.value)}; setItens(n); }} /></div>
              <div><Input type="number" placeholder="Valor Unit." value={item.valor_unit} onChange={(e) => { const n=[...itens]; n[i]={...n[i],valor_unit:Number(e.target.value)}; setItens(n); }} /></div>
              <div className="text-sm font-medium text-right pt-2">R$ {(item.qtd * item.valor_unit).toFixed(2)}</div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setItens(itens.filter((_,j)=>j!==i))}><Trash2 className="h-3 w-3" /></Button>
            </div>
          ))}</div>
          <Button variant="outline" size="sm" className="mt-2" onClick={() => setItens([...itens, { descricao: "", qtd: 1, valor_unit: 0 }])}><Plus className="h-3 w-3 mr-1" />Adicionar Item</Button>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div><Label>Descontos</Label><Input type="number" value={form.descontos} onChange={(e) => set("descontos", e.target.value)} /></div>
          <div><Label>Acréscimos</Label><Input type="number" value={form.acrescimos} onChange={(e) => set("acrescimos", e.target.value)} /></div>
          <div className="flex items-end"><p className="text-lg font-bold text-foreground">Total: R$ {total.toFixed(2)}</p></div>
        </div>
        <div className="mt-3"><Label>Observações</Label><Textarea value={form.obs} onChange={(e) => set("obs", e.target.value)} /></div>
      </FormModal>
      <ConfirmDialog open={!!cancelItem} onClose={() => setCancelItem(null)} title="Cancelar Fatura" description="Confirma cancelamento?" onConfirm={() => { setData(data.map(d=>d.id===cancelItem?.id?{...d,status:"Cancelada"}:d)); toast.success("Fatura cancelada"); setCancelItem(null); }} />
    </DashboardLayout>
  );
}
