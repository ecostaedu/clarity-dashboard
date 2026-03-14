import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CrudListPage, ColumnDef } from "@/components/crud/CrudListPage";
import { CrudFormPage, FieldDef } from "@/components/crud/CrudFormPage";
import { CrudDetailPage, DetailField } from "@/components/crud/CrudDetailPage";
import { useParams } from "react-router-dom";

const columns: ColumnDef[] = [
  { key: "name", label: "Nome", sortable: true },
  { key: "cpf", label: "CPF" },
  { key: "email", label: "E-mail", sortable: true },
  { key: "education_level", label: "Escolaridade", sortable: true },
  { key: "status", label: "Status", type: "status", sortable: true },
];

const mockData = [
  { id: "1", name: "João Silva", cpf: "123.456.789-00", email: "joao@email.com", phone: "(11) 99999-0001", education_level: "Superior Completo", resume: "CV anexado", status: "Ativo" },
  { id: "2", name: "Maria Oliveira", cpf: "987.654.321-00", email: "maria@email.com", phone: "(21) 99999-0002", education_level: "Pós-Graduação", resume: "CV anexado", status: "Ativo" },
  { id: "3", name: "Pedro Santos", cpf: "111.222.333-44", email: "pedro@email.com", phone: "(31) 99999-0003", education_level: "Superior Incompleto", resume: "—", status: "Pendente" },
  { id: "4", name: "Ana Costa", cpf: "555.666.777-88", email: "ana@email.com", phone: "(41) 99999-0004", education_level: "Ensino Médio", resume: "CV anexado", status: "Inativo" },
  { id: "5", name: "Lucas Lima", cpf: "999.888.777-66", email: "lucas@email.com", phone: "(51) 99999-0005", education_level: "Superior Completo", resume: "CV anexado", status: "Ativo" },
];

const formFields: FieldDef[] = [
  { key: "name", label: "Nome Completo", required: true, placeholder: "Nome do candidato" },
  { key: "cpf", label: "CPF", required: true, mask: "cpf", placeholder: "000.000.000-00" },
  { key: "email", label: "E-mail", type: "email", required: true, placeholder: "candidato@email.com" },
  { key: "phone", label: "Telefone", type: "tel", mask: "phone", placeholder: "(00) 00000-0000" },
  { key: "education_level", label: "Escolaridade", type: "select", options: [{ label: "Ensino Médio", value: "Ensino Médio" }, { label: "Superior Incompleto", value: "Superior Incompleto" }, { label: "Superior Completo", value: "Superior Completo" }, { label: "Pós-Graduação", value: "Pós-Graduação" }] },
  { key: "status", label: "Status", type: "select", required: true, options: [{ label: "Ativo", value: "Ativo" }, { label: "Inativo", value: "Inativo" }, { label: "Pendente", value: "Pendente" }] },
  { key: "resume", label: "Currículo", type: "textarea", span: 2, placeholder: "Informações do currículo ou link" },
];

const detailFields: DetailField[] = [
  { key: "name", label: "Nome" }, { key: "cpf", label: "CPF" }, { key: "email", label: "E-mail" },
  { key: "phone", label: "Telefone" }, { key: "education_level", label: "Escolaridade" }, { key: "status", label: "Status", type: "status" },
];

export function CandidatesList() {
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Cadastros" }, { label: "Candidatos" }]}>
      <CrudListPage title="Candidatos" subtitle={`${mockData.length} candidatos cadastrados.`} columns={columns} data={mockData} createRoute="/candidates/new" createLabel="Novo Candidato" baseRoute="/candidates" filterOptions={[{ key: "status", label: "Status", values: ["Ativo", "Inativo", "Pendente"] }]} />
    </DashboardLayout>
  );
}

export function CandidatesNew() {
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Cadastros" }, { label: "Candidatos" }, { label: "Novo" }]}>
      <CrudFormPage title="Novo Candidato" fields={formFields} backRoute="/candidates" />
    </DashboardLayout>
  );
}

export function CandidatesDetail() {
  const { id } = useParams();
  const item = mockData.find((d) => d.id === id) || mockData[0];
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Cadastros" }, { label: "Candidatos" }, { label: item.name }]}>
      <CrudDetailPage title={item.name} fields={detailFields} data={item} backRoute="/candidates" editRoute={`/candidates/${id}/edit`} />
    </DashboardLayout>
  );
}

export function CandidatesEdit() {
  const { id } = useParams();
  const item = mockData.find((d) => d.id === id) || mockData[0];
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Cadastros" }, { label: "Candidatos" }, { label: "Editar" }]}>
      <CrudFormPage title={`Editar ${item.name}`} fields={formFields} initialData={item} backRoute="/candidates" isEdit />
    </DashboardLayout>
  );
}
