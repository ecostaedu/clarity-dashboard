import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column, FilterConfig, ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Eye, RefreshCw, XCircle } from "lucide-react";

const statusColor: Record<string, string> = { "Cancelado": "bg-destructive/10 text-destructive", "Em Andamento": "bg-amber-100 text-amber-700", "Finalizado": "bg-emerald-100 text-emerald-700" };

const mockData = [
  { id: "1", contratado: "João Silva", documento: "DOC-001", versao: "v1.0", signatarios_feitos: 2, signatarios_total: 3, tipo: "Contrato Estágio", status: "Em Andamento" },
  { id: "2", contratado: "Maria Oliveira", documento: "DOC-002", versao: "v1.0", signatarios_feitos: 2, signatarios_total: 2, tipo: "Contrato CLT", status: "Finalizado" },
  { id: "3", contratado: "Pedro Santos", documento: "DOC-003", versao: "v2.0", signatarios_feitos: 0, signatarios_total: 3, tipo: "Termo de Estágio", status: "Cancelado" },
  { id: "4", contratado: "Ana Costa", documento: "DOC-004", versao: "v1.0", signatarios_feitos: 1, signatarios_total: 4, tipo: "Contrato JA", status: "Em Andamento" },
];

export default function AssinaturasDigitaisPage() {
  const [data, setData] = useState(mockData);
  const [viewItem, setViewItem] = useState<any>(null);
  const [cancelItem, setCancelItem] = useState<any>(null);

  const columns: Column[] = [
    { key: "id", label: "ID" },
    { key: "contratado", label: "Contratado", sortable: true },
    { key: "documento", label: "Nº Documento" },
    { key: "versao", label: "Versão" },
    { key: "signatarios_feitos", label: "Signatários", render: (_, row) => (
      <div className="flex items-center gap-2 min-w-[120px]"><Progress value={(row.signatarios_feitos / row.signatarios_total) * 100} className="h-2 flex-1" /><span className="text-xs text-muted-foreground">{row.signatarios_feitos}/{row.signatarios_total}</span></div>
    )},
    { key: "tipo", label: "Tipo" },
    { key: "status", label: "Status", render: (v) => <Badge className={statusColor[v] || ""}>{v}</Badge> },
  ];

  const filters: FilterConfig[] = [
    { key: "id", label: "ID", type: "text" },
    { key: "contratado", label: "Contratado", type: "text" },
  ];

  const actions: ActionConfig[] = [
    { label: "Visualizar", icon: <Eye className="h-4 w-4" />, onClick: (r) => setViewItem(r) },
    { label: "Reenviar Convite", icon: <RefreshCw className="h-4 w-4" />, onClick: () => toast.success("Convite reenviado com sucesso") },
    { label: "Cancelar Assinatura", icon: <XCircle className="h-4 w-4" />, onClick: (r) => setCancelItem(r), variant: "destructive" },
  ];

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Contratos" }, { label: "Assinaturas Digitais" }]}>
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-foreground">Assinaturas Digitais</h1><p className="text-sm text-muted-foreground mt-1">{data.length} documentos.</p></div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>

      {viewItem && <FormModal open title="Documento" onClose={() => setViewItem(null)} onSave={() => setViewItem(null)}>
        <div className="grid grid-cols-2 gap-3 text-sm">{Object.entries(viewItem).filter(([k]) => !k.startsWith("signatarios")).map(([k, v]) => <div key={k}><span className="text-muted-foreground capitalize">{k.replace(/_/g, " ")}</span><p className="font-medium">{String(v)}</p></div>)}</div>
      </FormModal>}

      <ConfirmDialog open={!!cancelItem} onClose={() => setCancelItem(null)} title="Cancelar Assinatura" description={`Deseja cancelar a assinatura de "${cancelItem?.contratado}"?`} onConfirm={() => { setData(data.map(d => d.id === cancelItem?.id ? { ...d, status: "Cancelado" } : d)); toast.success("Assinatura cancelada"); setCancelItem(null); }} />
    </DashboardLayout>
  );
}
