import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column, FilterConfig, ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, FileDown, RotateCcw, XCircle, Plus, Loader2 } from "lucide-react";

const mockData = [
  { id: "1", competencia: "03/2024", data_calculo: "05/04/2024", status: "Processado" },
  { id: "2", competencia: "02/2024", data_calculo: "05/03/2024", status: "Processado" },
  { id: "3", competencia: "04/2024", data_calculo: "", status: "Em Aberto" },
];

export default function GerarFolhaPage() {
  const [data, setData] = useState(mockData);
  const [modalOpen, setModalOpen] = useState(false);
  const [competencia, setCompetencia] = useState("");
  const [processing, setProcessing] = useState(false);
  const [viewItem, setViewItem] = useState<any>(null);
  const [estornoItem, setEstornoItem] = useState<any>(null);

  const columns: Column[] = [
    { key: "id", label: "ID" }, { key: "competencia", label: "Competência", sortable: true },
    { key: "data_calculo", label: "Data Cálculo" },
    { key: "status", label: "Status", render: (v) => <Badge className={v === "Processado" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>{v}</Badge> },
  ];
  const filters: FilterConfig[] = [{ key: "competencia", label: "Competência", type: "text" }];
  const actions: ActionConfig[] = [
    { label: "Visualizar", icon: <Eye className="h-4 w-4" />, onClick: (r) => setViewItem(r) },
    { label: "Exportar PDF", icon: <FileDown className="h-4 w-4" />, onClick: () => toast.success("PDF exportado") },
    { label: "Reabrir", icon: <RotateCcw className="h-4 w-4" />, onClick: (r) => { setData(data.map(d=>d.id===r.id?{...d,status:"Em Aberto"}:d)); toast.success("Folha reaberta"); } },
    { label: "Estornar", icon: <XCircle className="h-4 w-4" />, onClick: (r) => setEstornoItem(r), variant: "destructive" },
  ];

  const handleProcess = () => {
    if (!competencia) { toast.error("Informe a competência"); return; }
    setProcessing(true);
    setTimeout(() => {
      setData([...data, { id: String(data.length+1), competencia, data_calculo: new Date().toLocaleDateString("pt-BR"), status: "Processado" }]);
      toast.success("Folha processada com sucesso");
      setProcessing(false); setModalOpen(false); setCompetencia("");
    }, 2000);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Jovem Aprendiz" }, { label: "Gerar Folha" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Gerar Folha</h1><p className="text-sm text-muted-foreground mt-1">{data.length} folhas.</p></div>
          <button onClick={() => setModalOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"><Plus className="h-4 w-4" />Nova Folha</button>
        </div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title="Processar Folha" onSave={handleProcess} saving={processing}>
        <div className="space-y-4">
          <div><Label>Competência (mês/ano) *</Label><Input type="month" value={competencia} onChange={(e) => setCompetencia(e.target.value)} /></div>
          {processing && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Processando folha...</div>}
        </div>
      </FormModal>
      {viewItem && <FormModal open title={`Folha ${viewItem.competencia}`} onClose={() => setViewItem(null)} onSave={() => setViewItem(null)} wide>
        <div className="rounded-lg border">
          <table className="w-full text-sm"><thead><tr className="bg-muted/40"><th className="px-3 py-2 text-left">Aprendiz</th><th className="px-3 py-2 text-right">Salário</th><th className="px-3 py-2 text-right">Descontos</th><th className="px-3 py-2 text-right">Líquido</th></tr></thead>
          <tbody>{[{n:"Lucas Lima",s:800,d:80},{n:"Ana Costa",s:900,d:90},{n:"Pedro Santos",s:800,d:80}].map((a,i)=><tr key={i} className="border-t"><td className="px-3 py-2">{a.n}</td><td className="px-3 py-2 text-right">R$ {a.s.toFixed(2)}</td><td className="px-3 py-2 text-right">R$ {a.d.toFixed(2)}</td><td className="px-3 py-2 text-right font-medium">R$ {(a.s-a.d).toFixed(2)}</td></tr>)}</tbody></table>
        </div>
      </FormModal>}
      <ConfirmDialog open={!!estornoItem} onClose={() => setEstornoItem(null)} title="Estornar Cálculo" description="Confirma estorno?" onConfirm={() => { setData(data.filter(d=>d.id!==estornoItem?.id)); toast.success("Estornado"); setEstornoItem(null); }} />
    </DashboardLayout>
  );
}
