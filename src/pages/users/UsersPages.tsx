import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CrudListPage, ColumnDef } from "@/components/crud/CrudListPage";
import { CrudFormPage, FieldDef } from "@/components/crud/CrudFormPage";
import { CrudDetailPage, DetailField } from "@/components/crud/CrudDetailPage";
import { useParams } from "react-router-dom";

const columns: ColumnDef[] = [
  { key: "name", label: "Nome", sortable: true },
  { key: "email", label: "E-mail", sortable: true },
  { key: "role", label: "Perfil", type: "badge", sortable: true },
  { key: "status", label: "Status", type: "status", sortable: true },
];

const mockData = [
  { id: "1", name: "Admin Master", email: "admin@connectrh.com", role: "Admin", status: "Ativo" },
  { id: "2", name: "Ana Maria", email: "ana@empresa.com", role: "HR Manager", status: "Ativo" },
  { id: "3", name: "Carlos Silva", email: "carlos@empresa.com", role: "Company User", status: "Ativo" },
  { id: "4", name: "Prof. Lima", email: "lima@instituicao.edu", role: "Educator", status: "Inativo" },
];

const formFields: FieldDef[] = [
  { key: "name", label: "Nome", required: true },
  { key: "email", label: "E-mail", type: "email", required: true },
  { key: "role", label: "Perfil", type: "select", required: true, options: [{ label: "Admin", value: "admin" }, { label: "Gestor RH", value: "hr_manager" }, { label: "Usuário Empresa", value: "company_user" }, { label: "Educador", value: "educator" }] },
  { key: "status", label: "Status", type: "select", required: true, options: [{ label: "Ativo", value: "Ativo" }, { label: "Inativo", value: "Inativo" }] },
];

const detailFields: DetailField[] = [
  { key: "name", label: "Nome" }, { key: "email", label: "E-mail" }, { key: "role", label: "Perfil", type: "badge" }, { key: "status", label: "Status", type: "status" },
];

export function UsersList() {
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Cadastros" }, { label: "Usuários" }]}>
      <CrudListPage title="Usuários" subtitle={`${mockData.length} usuários no sistema.`} columns={columns} data={mockData} createRoute="/users/new" createLabel="Novo Usuário" baseRoute="/users" filterOptions={[{ key: "role", label: "Perfil", values: ["Admin", "HR Manager", "Company User", "Educator"] }]} />
    </DashboardLayout>
  );
}

export function UsersNew() {
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Cadastros" }, { label: "Usuários" }, { label: "Novo" }]}>
      <CrudFormPage title="Novo Usuário" fields={formFields} backRoute="/users" />
    </DashboardLayout>
  );
}

export function UsersDetail() {
  const { id } = useParams();
  const item = mockData.find((d) => d.id === id) || mockData[0];
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Cadastros" }, { label: "Usuários" }, { label: item.name }]}>
      <CrudDetailPage title={item.name} fields={detailFields} data={item} backRoute="/users" />
    </DashboardLayout>
  );
}
