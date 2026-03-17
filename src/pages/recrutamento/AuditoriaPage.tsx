import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, type Column, type FilterConfig, type ActionConfig } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { Eye } from "lucide-react";

const initialData = [
  { id: "1", processoId: "PS-001", dataAuditoria: "2024-03-15 10:23", usuario: "Maria Silva", acao: "Alteração de Status", detalhes: '{"campo":"status","de":"Rascunho","para":"Ativo"}' },
  { id: "2", processoId: "PS-001", dataAuditoria: "2024-03-14 08:45", usuario: "João Santos", acao: "Adição de Etapa", detalhes: '{"etapa":"Prova Técnica","posicao":2}' },
  { id: "3", processoId: "PS-002", dataAuditoria: "2024-03-13 14:10", usuario: "Ana Costa", acao: "Edição de Dados", detalhes: '{"campo":"vagas","de":3,"para":5}' },
  { id: "4", processoId: "PS-001", dataAuditoria: "2024-03-12 09:00", usuario: "Maria Silva", acao: "Criação do Processo", detalhes: '{"titulo":"PS Dev Frontend 2024"}' },
  { id: "5", processoId: "PS-003", dataAuditoria: "2024-03-11 16:30", usuario: "Carlos Reis", acao: "Cancelamento", detalhes: '{"motivo":"Vaga preenchida internamente"}' },
];

export default function AuditoriaPage() {
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const columns: Column[] = [
    { key: "processoId", label: "Processo", sortable: true },
    { key: "dataAuditoria", label: "Data/Hora", sortable: true },
    { key: "usuario", label: "Usuário", sortable: true },
    { key: "acao", label: "Ação", sortable: true },
  ];

  const filters: FilterConfig[] = [
    { key: "processoId", label: "ID Processo", type: "text" },
    { key: "usuario", label: "Usuário", type: "text" },
  ];

  const actions: ActionConfig[] = [
    { label: "Ver Detalhes", icon: <Eye className="h-4 w-4" />, onClick: (row) => { setSelected(row); setViewOpen(true); } },
  ];

  const formatJson = (str: string) => {
    try { return JSON.stringify(JSON.parse(str), null, 2); } catch { return str; }
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Recrutamento" }, { label: "Auditoria" }]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Auditoria de Processos</h1>
          <p className="text-sm text-muted-foreground mt-1">Histórico de alterações em processos seletivos.</p>
        </div>
        <DataTable columns={columns} data={initialData} filters={filters} actions={actions} />
      </div>

      <FormModal open={viewOpen} onClose={() => setViewOpen(false)} title="Detalhes da Auditoria" onSave={() => setViewOpen(false)}>
        {selected && (
          <div className="space-y-3 text-sm">
            <div><span className="text-muted-foreground">Processo:</span> <span className="font-medium">{selected.processoId}</span></div>
            <div><span className="text-muted-foreground">Data:</span> <span className="font-medium">{selected.dataAuditoria}</span></div>
            <div><span className="text-muted-foreground">Usuário:</span> <span className="font-medium">{selected.usuario}</span></div>
            <div><span className="text-muted-foreground">Ação:</span> <span className="font-medium">{selected.acao}</span></div>
            <div>
              <span className="text-muted-foreground block mb-1">Detalhes:</span>
              <pre className="p-3 rounded-lg bg-muted/50 text-xs font-mono overflow-x-auto">{formatJson(selected.detalhes)}</pre>
            </div>
          </div>
        )}
      </FormModal>
    </DashboardLayout>
  );
}
