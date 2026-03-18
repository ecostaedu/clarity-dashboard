import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column, FilterConfig, ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { RichTextEditor } from "@/components/RichTextEditor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, Send, FileDown, Plus } from "lucide-react";
import { maskCurrency } from "@/lib/masks";

const mockData = [
  { id: "1", aprendiz: "Lucas Lima", competencia: "03/2024", valor: "R$ 720,00", detalhes: "" },
  { id: "2", aprendiz: "Ana Costa", competencia: "03/2024", valor: "R$ 810,00", detalhes: "" },
];
const emptyForm = { aprendiz: "", competencia: "", valor: "", detalhes: "" };

export default function ReciboPagamentoPage() {
  const [data, setData] = useState(mockData);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [viewItem, setViewItem] = useState<any>(null);
  const set = (k: string, v: string) => setForm({ ...form, [k]: v });

  const columns: Column[] = [
    { key: "id", label: "ID" }, { key: "aprendiz", label: "Aprendiz", sortable: true },
    { key: "competencia", label: "Competência" }, { key: "valor", label: "Valor" },
  ];
  const filters: FilterConfig[] = [{ key: "aprendiz", label: "Aprendiz", type: "text" }];
  const actions: ActionConfig[] = [
    { label: "Visualizar", icon: <Eye className="h-4 w-4" />, onClick: (r) => setViewItem(r) },
    { label: "Enviar Email", icon: <Send className="h-4 w-4" />, onClick: () => toast.success("Email enviado") },
  ];

  const handleSave = () => {
    if (!form.aprendiz || !form.competencia) { toast.error("Preencha campos obrigatórios"); return; }
    setData([...data, { ...form, id: String(data.length + 1) }]);
    toast.success("Recibo criado");
    setModalOpen(false); setForm(emptyForm);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Jovem Aprendiz" }, { label: "Recibo de Pagamento" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Recibo de Pagamento</h1><p className="text-sm text-muted-foreground mt-1">{data.length} recibos.</p></div>
          <button onClick={() => { setForm(emptyForm); setModalOpen(true); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"><Plus className="h-4 w-4" />Novo Recibo</button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title="Novo Recibo" onSave={handleSave}>
        <div className="space-y-4">
          <div><Label>Aprendiz *</Label><Select value={form.aprendiz} onValueChange={(v) => set("aprendiz", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{["Lucas Lima","Ana Costa","Pedro Santos"].map(e=><SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Competência *</Label><Input type="month" value={form.competencia} onChange={(e) => set("competencia", e.target.value)} /></div>
          <div><Label>Valor Total (R$)</Label><Input value={form.valor} onChange={(e) => set("valor", maskCurrency(e.target.value))} /></div>
          <div><Label>Detalhes</Label><RichTextEditor value={form.detalhes} onChange={(v) => set("detalhes", v)} /></div>
          <Button variant="outline" onClick={() => toast.success("PDF gerado")}><FileDown className="h-4 w-4 mr-2" />Gerar PDF</Button>
        </div>
      </FormModal>
      {viewItem && <FormModal open title={`Recibo - ${viewItem.aprendiz}`} onClose={() => setViewItem(null)} onSave={() => setViewItem(null)}>
        <div className="grid grid-cols-2 gap-3 text-sm">{Object.entries(viewItem).filter(([k])=>k!=="id"&&k!=="detalhes").map(([k,v])=><div key={k}><span className="text-muted-foreground capitalize">{k}</span><p className="font-medium">{String(v)}</p></div>)}</div>
      </FormModal>}
    </DashboardLayout>
  );
}
