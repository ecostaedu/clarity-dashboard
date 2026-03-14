import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CrudListPage, ColumnDef } from "@/components/crud/CrudListPage";

const columns: ColumnDef[] = [
  { key: "company", label: "Empresa", sortable: true },
  { key: "stage", label: "Etapa", type: "status", sortable: true },
  { key: "value", label: "Valor", type: "currency" },
  { key: "responsible", label: "Responsável", sortable: true },
];

const mockData = [
  { id: "1", company: "Nova Corp", stage: "Lead", value: 15000, responsible: "Ana Maria" },
  { id: "2", company: "Tech Startup", stage: "Proposta", value: 45000, responsible: "Carlos Silva" },
  { id: "3", company: "Mega Corp", stage: "Negociação", value: 120000, responsible: "Ana Maria" },
  { id: "4", company: "Global Inc", stage: "Fechado", value: 89000, responsible: "Pedro Lima" },
  { id: "5", company: "Smart Solutions", stage: "Lead", value: 32000, responsible: "Carlos Silva" },
  { id: "6", company: "Inova Tec", stage: "Proposta", value: 67000, responsible: "Ana Maria" },
];

export function OpportunitiesList() {
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "CRM" }, { label: "Oportunidades" }]}>
      <CrudListPage
        title="Oportunidades"
        subtitle={`${mockData.length} oportunidades no pipeline. Valor total: R$ ${mockData.reduce((s, d) => s + d.value, 0).toLocaleString("pt-BR")}`}
        columns={columns}
        data={mockData}
        baseRoute="/crm/opportunities"
        filterOptions={[{ key: "stage", label: "Etapa", values: ["Lead", "Proposta", "Negociação", "Fechado"] }]}
      />
    </DashboardLayout>
  );
}
