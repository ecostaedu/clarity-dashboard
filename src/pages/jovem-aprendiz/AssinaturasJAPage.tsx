// Reutiliza o mesmo componente de Assinaturas Digitais com breadcrumbs JA
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column, ActionConfig, FilterConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Eye, RefreshCw, XCircle } from "lucide-react";

const statusColor: Record<string, string> = { "Cancelado": "bg-destructive/10 text-destructive", "Em Andamento": "bg-amber-100 text-amber-700", "Finalizado": "bg-emerald-100 text-emerald-700" };
const mockData = [
  { id: "1", contratado: "Lucas Lima", documento: "JA-001", versao: "v1.0", feitos: 2, total: 3, tipo: "Contrato JA", status: "Em Andamento" },
  { id: "2", contratado: "Ana Costa", documento: "JA-002", versao: "v1.0", feitos: 3, total: 3, tipo: "Contrato JA", status: "Finalizado" },
];

export default function AssinaturasJAPage() {
  const [data, setData] = useState(mockData);
  const [viewItem, setViewItem] = useState<any>(null);
  const [cancelItem, setCancelItem] = useState<any>(null);

  const columns: Column[] = [
    { key: "id", label: "ID" }, { key: "contratado", label: "Contratado", sortable: true }, { key: "documento", label: "Documento" }, { key: "versao", label: "Versão" },
    { key: "feitos", label: "Signatários", render: (_, r) => <div className="flex items-center gap-2 min-w-[120px]"><Progress value={(r.feitos/r.total)*100} className="h-2 flex-1" /><span className="text-xs text-muted-foreground">{r.feitos}/{r.total}</span></div> },
    { key: "tipo", label: "Tipo" },
    { key: "status", label: "Status", render: (v) => <Badge className={statusColor[v] || ""}>{v}</Badge> },
  ];
  const filters: FilterConfig[] = [{ key: "contratado", label: "Contratado", type: "text" }];
  const actions: ActionConfig[] = [
    { label: "Visualizar", icon: <Eye className="h-4 w-4" />, onClick: (r) => setViewItem(r) },
    { label: "Reenviar", icon: <RefreshCw className="h-4 w-4" />, onClick: () => toast.success("Convite reenviado") },
    { label: "Cancelar", icon: <XCircle className="h-4 w-4" />, onClick: (r) => setCancelItem(r), variant: "destructive" },
  ];

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Jovem Aprendiz" }, { label: "Assinaturas Digitais" }]}>
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-foreground">Assinaturas Digitais JA</h1><p className="text-sm text-muted-foreground mt-1">{data.length} documentos.</p></div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>
      {viewItem && <FormModal open title="Documento" onClose={() => setViewItem(null)} onSave={() => setViewItem(null)}><div className="grid grid-cols-2 gap-3 text-sm">{Object.entries(viewItem).filter(([k]) => !["feitos","total"].includes(k)).map(([k,v])=><div key={k}><span className="text-muted-foreground capitalize">{k}</span><p className="font-medium">{String(v)}</p></div>)}</div></FormModal>}
      <ConfirmDialog open={!!cancelItem} onClose={() => setCancelItem(null)} title="Cancelar" description={`Cancelar assinatura de "${cancelItem?.contratado}"?`} onConfirm={() => { setData(data.map(d=>d.id===cancelItem?.id?{...d,status:"Cancelado"}:d)); toast.success("Cancelada"); setCancelItem(null); }} />
    </DashboardLayout>
  );
}
