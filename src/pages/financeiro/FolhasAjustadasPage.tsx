import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column, ActionConfig } from "@/components/DataTable";
import { toast } from "sonner";

const data = [
  { id: "1", folha_original: "FOL-001", competencia: "02/2024", motivo: "Correção de horas extras", valor_ajuste: 350, data_ajuste: "05/03/2024" },
  { id: "2", folha_original: "FOL-003", competencia: "01/2024", motivo: "Inclusão de benefício retroativo", valor_ajuste: 120, data_ajuste: "10/02/2024" },
];

export default function FolhasAjustadasPage() {
  const columns: Column[] = [
    { key: "folha_original", label: "Folha Original" },
    { key: "competencia", label: "Competência", sortable: true },
    { key: "motivo", label: "Motivo do Ajuste" },
    { key: "valor_ajuste", label: "Valor do Ajuste", render: (v) => `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` },
    { key: "data_ajuste", label: "Data do Ajuste" },
  ];

  const actions: ActionConfig[] = [
    { label: "Visualizar Folha Original", onClick: () => toast.info("Visualizando folha original...") },
    { label: "Visualizar Ajuste", onClick: () => toast.info("Visualizando ajuste...") },
  ];

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Financeiro" }, { label: "Folhas Ajustadas" }]}>
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-foreground">Folhas Ajustadas</h1><p className="text-sm text-muted-foreground">{data.length} ajustes registrados.</p></div>
        <DataTable columns={columns} data={data} actions={actions} />
      </div>
    </DashboardLayout>
  );
}
