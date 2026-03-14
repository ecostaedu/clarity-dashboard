import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CrudListPage, ColumnDef } from "@/components/crud/CrudListPage";
import { CrudFormPage, FieldDef } from "@/components/crud/CrudFormPage";
import { CrudDetailPage, DetailField } from "@/components/crud/CrudDetailPage";
import { useParams } from "react-router-dom";

const columns: ColumnDef[] = [
  { key: "title", label: "Título", sortable: true },
  { key: "description", label: "Descrição" },
  { key: "priority", label: "Prioridade", type: "badge", sortable: true },
  { key: "status", label: "Status", type: "status", sortable: true },
];

const mockData = [
  { id: "1", title: "Erro no relatório de frequência", description: "O relatório não gera PDF corretamente", priority: "Alta", status: "Aberto" },
  { id: "2", title: "Solicitar novo módulo", description: "Preciso de um módulo de avaliação de desempenho", priority: "Média", status: "Em Andamento" },
  { id: "3", title: "Ajuste no contrato", description: "Campo de valor não permite decimais", priority: "Baixa", status: "Resolvido" },
  { id: "4", title: "Login não funciona", description: "Usuário não consegue acessar com SSO", priority: "Alta", status: "Aberto" },
];

const formFields: FieldDef[] = [
  { key: "title", label: "Título", required: true },
  { key: "description", label: "Descrição", type: "textarea", required: true, span: 2 },
  { key: "priority", label: "Prioridade", type: "select", required: true, options: [{ label: "Baixa", value: "Baixa" }, { label: "Média", value: "Média" }, { label: "Alta", value: "Alta" }] },
  { key: "status", label: "Status", type: "select", options: [{ label: "Aberto", value: "Aberto" }, { label: "Em Andamento", value: "Em Andamento" }, { label: "Resolvido", value: "Resolvido" }] },
];

const detailFields: DetailField[] = [
  { key: "title", label: "Título" }, { key: "description", label: "Descrição" },
  { key: "priority", label: "Prioridade", type: "badge" }, { key: "status", label: "Status", type: "status" },
];

export function TicketsList() {
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Chamados" }]}>
      <CrudListPage title="Chamados" subtitle={`${mockData.length} chamados registrados.`} columns={columns} data={mockData} createRoute="/tickets/new" createLabel="Novo Chamado" baseRoute="/tickets" filterOptions={[{ key: "status", label: "Status", values: ["Aberto", "Em Andamento", "Resolvido"] }, { key: "priority", label: "Prioridade", values: ["Alta", "Média", "Baixa"] }]} />
    </DashboardLayout>
  );
}

export function TicketsNew() {
  return (<DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Chamados" }, { label: "Novo" }]}><CrudFormPage title="Novo Chamado" fields={formFields} backRoute="/tickets" /></DashboardLayout>);
}

export function TicketsDetail() {
  const { id } = useParams();
  const item = mockData.find((d) => d.id === id) || mockData[0];
  return (<DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Chamados" }, { label: item.title }]}><CrudDetailPage title={item.title} fields={detailFields} data={item} backRoute="/tickets" /></DashboardLayout>);
}
