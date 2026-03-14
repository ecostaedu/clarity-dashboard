import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CrudListPage, ColumnDef } from "@/components/crud/CrudListPage";
import { CrudFormPage, FieldDef } from "@/components/crud/CrudFormPage";
import { CrudDetailPage, DetailField } from "@/components/crud/CrudDetailPage";
import { useParams } from "react-router-dom";

const columns: ColumnDef[] = [
  { key: "name", label: "Instituição", sortable: true },
  { key: "cnpj", label: "CNPJ" },
  { key: "contact", label: "Contato" },
  { key: "status", label: "Status", type: "status", sortable: true },
];

const mockData = [
  { id: "1", name: "SENAI São Paulo", cnpj: "03.123.456/0001-00", address: "São Paulo, SP", contact: "senai@sp.org", status: "Ativo" },
  { id: "2", name: "CIEE", cnpj: "61.200.300/0001-11", address: "São Paulo, SP", contact: "contato@ciee.org", status: "Ativo" },
  { id: "3", name: "SENAC Rio", cnpj: "33.444.555/0001-22", address: "Rio de Janeiro, RJ", contact: "senac@rj.org", status: "Inativo" },
];

const formFields: FieldDef[] = [
  { key: "name", label: "Nome da Instituição", required: true },
  { key: "cnpj", label: "CNPJ", required: true, mask: "cnpj", placeholder: "00.000.000/0000-00" },
  { key: "address", label: "Endereço", span: 2 },
  { key: "contact", label: "Contato", type: "email" },
  { key: "status", label: "Status", type: "select", options: [{ label: "Ativo", value: "Ativo" }, { label: "Inativo", value: "Inativo" }] },
];

const detailFields: DetailField[] = [
  { key: "name", label: "Nome" }, { key: "cnpj", label: "CNPJ" }, { key: "address", label: "Endereço" },
  { key: "contact", label: "Contato" }, { key: "status", label: "Status", type: "status" },
];

export function InstitutionsList() {
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Cadastros" }, { label: "Instituições" }]}>
      <CrudListPage title="Instituições de Ensino" subtitle={`${mockData.length} instituições cadastradas.`} columns={columns} data={mockData} createRoute="/institutions/new" createLabel="Nova Instituição" baseRoute="/institutions" filterOptions={[{ key: "status", label: "Status", values: ["Ativo", "Inativo"] }]} />
    </DashboardLayout>
  );
}

export function InstitutionsNew() {
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Cadastros" }, { label: "Instituições" }, { label: "Nova" }]}>
      <CrudFormPage title="Nova Instituição" fields={formFields} backRoute="/institutions" />
    </DashboardLayout>
  );
}

export function InstitutionsDetail() {
  const { id } = useParams();
  const item = mockData.find((d) => d.id === id) || mockData[0];
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Cadastros" }, { label: "Instituições" }, { label: item.name }]}>
      <CrudDetailPage title={item.name} fields={detailFields} data={item} backRoute="/institutions" />
    </DashboardLayout>
  );
}
