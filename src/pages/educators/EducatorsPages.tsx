import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CrudListPage, ColumnDef } from "@/components/crud/CrudListPage";
import { CrudFormPage, FieldDef } from "@/components/crud/CrudFormPage";
import { CrudDetailPage, DetailField } from "@/components/crud/CrudDetailPage";
import { useParams } from "react-router-dom";

const columns: ColumnDef[] = [
  { key: "name", label: "Nome", sortable: true },
  { key: "email", label: "E-mail", sortable: true },
  { key: "specialty", label: "Especialidade", sortable: true },
  { key: "blocked", label: "Status", type: "status", sortable: true },
];

const mockData = [
  { id: "1", name: "Prof. Lima", email: "lima@edu.com", specialty: "Administração", can_register_multiple_attendance: true, blocked: "Ativo" },
  { id: "2", name: "Prof. Souza", email: "souza@edu.com", specialty: "Informática", can_register_multiple_attendance: false, blocked: "Ativo" },
  { id: "3", name: "Prof. Costa", email: "costa@edu.com", specialty: "Logística", can_register_multiple_attendance: true, blocked: "Bloqueado" },
];

const formFields: FieldDef[] = [
  { key: "name", label: "Nome", required: true },
  { key: "email", label: "E-mail", type: "email", required: true },
  { key: "specialty", label: "Especialidade", required: true },
  { key: "can_register_multiple_attendance", label: "Registro múltiplo de frequência", type: "toggle" },
  { key: "blocked", label: "Bloqueado", type: "toggle" },
];

const detailFields: DetailField[] = [
  { key: "name", label: "Nome" }, { key: "email", label: "E-mail" }, { key: "specialty", label: "Especialidade" }, { key: "blocked", label: "Status", type: "status" },
];

export function EducatorsList() {
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Cadastros" }, { label: "Educadores" }]}>
      <CrudListPage title="Educadores" subtitle={`${mockData.length} educadores cadastrados.`} columns={columns} data={mockData} createRoute="/educators/new" createLabel="Novo Educador" baseRoute="/educators" />
    </DashboardLayout>
  );
}

export function EducatorsNew() {
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Cadastros" }, { label: "Educadores" }, { label: "Novo" }]}>
      <CrudFormPage title="Novo Educador" fields={formFields} backRoute="/educators" />
    </DashboardLayout>
  );
}

export function EducatorsDetail() {
  const { id } = useParams();
  const item = mockData.find((d) => d.id === id) || mockData[0];
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Cadastros" }, { label: "Educadores" }, { label: item.name }]}>
      <CrudDetailPage title={item.name} fields={detailFields} data={item} backRoute="/educators" />
    </DashboardLayout>
  );
}
