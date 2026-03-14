import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CrudListPage, ColumnDef } from "@/components/crud/CrudListPage";
import { CrudFormPage, FieldDef } from "@/components/crud/CrudFormPage";
import { CrudDetailPage, DetailField } from "@/components/crud/CrudDetailPage";
import { useParams } from "react-router-dom";

const columns: ColumnDef[] = [
  { key: "trade_name", label: "Nome Fantasia", sortable: true },
  { key: "cnpj", label: "CNPJ", sortable: false },
  { key: "industry", label: "Setor", sortable: true },
  { key: "email", label: "E-mail" },
  { key: "status", label: "Status", type: "status", sortable: true },
];

const mockData = [
  { id: "1", legal_name: "Tech Solutions Ltda", trade_name: "TechSol", cnpj: "12.345.678/0001-90", industry: "Tecnologia", email: "contato@techsol.com", phone: "(11) 9999-0001", address: "São Paulo, SP", billing_day: "10", plan_id: "Pro", status: "Ativo" },
  { id: "2", legal_name: "RH Global S.A.", trade_name: "RH Global", cnpj: "98.765.432/0001-10", industry: "RH", email: "rh@global.com", phone: "(21) 9999-0002", address: "Rio de Janeiro, RJ", billing_day: "15", plan_id: "Enterprise", status: "Ativo" },
  { id: "3", legal_name: "Educação Plus ME", trade_name: "EduPlus", cnpj: "11.222.333/0001-44", industry: "Educação", email: "contato@eduplus.com", phone: "(31) 9999-0003", address: "Belo Horizonte, MG", billing_day: "5", plan_id: "Basic", status: "Inativo" },
  { id: "4", legal_name: "Construtora Apex", trade_name: "Apex Build", cnpj: "44.555.666/0001-77", industry: "Construção", email: "apex@build.com", phone: "(41) 9999-0004", address: "Curitiba, PR", billing_day: "20", plan_id: "Pro", status: "Ativo" },
  { id: "5", legal_name: "Saúde Total S.A.", trade_name: "SaúdeTotal", cnpj: "77.888.999/0001-11", industry: "Saúde", email: "contato@saudetotal.com", phone: "(51) 9999-0005", address: "Porto Alegre, RS", billing_day: "1", plan_id: "Enterprise", status: "Pendente" },
];

const formFields: FieldDef[] = [
  { key: "legal_name", label: "Razão Social", required: true, placeholder: "Nome legal da empresa" },
  { key: "trade_name", label: "Nome Fantasia", required: true, placeholder: "Nome fantasia" },
  { key: "cnpj", label: "CNPJ", required: true, mask: "cnpj", placeholder: "00.000.000/0000-00" },
  { key: "industry", label: "Setor", type: "select", options: [{ label: "Tecnologia", value: "Tecnologia" }, { label: "RH", value: "RH" }, { label: "Educação", value: "Educação" }, { label: "Saúde", value: "Saúde" }, { label: "Construção", value: "Construção" }] },
  { key: "email", label: "E-mail", type: "email", required: true, placeholder: "empresa@email.com" },
  { key: "phone", label: "Telefone", type: "tel", mask: "phone", placeholder: "(00) 00000-0000" },
  { key: "address", label: "Endereço", placeholder: "Cidade, UF", span: 2 },
  { key: "billing_day", label: "Dia de Faturamento", type: "number", placeholder: "10" },
  { key: "plan_id", label: "Plano", type: "select", options: [{ label: "Basic", value: "Basic" }, { label: "Pro", value: "Pro" }, { label: "Enterprise", value: "Enterprise" }] },
  { key: "status", label: "Status", type: "select", required: true, options: [{ label: "Ativo", value: "Ativo" }, { label: "Inativo", value: "Inativo" }, { label: "Pendente", value: "Pendente" }] },
];

const detailFields: DetailField[] = [
  { key: "legal_name", label: "Razão Social" },
  { key: "trade_name", label: "Nome Fantasia" },
  { key: "cnpj", label: "CNPJ" },
  { key: "industry", label: "Setor" },
  { key: "email", label: "E-mail" },
  { key: "phone", label: "Telefone" },
  { key: "address", label: "Endereço" },
  { key: "billing_day", label: "Dia Faturamento" },
  { key: "plan_id", label: "Plano" },
  { key: "status", label: "Status", type: "status" },
];

export function CompaniesList() {
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Cadastros" }, { label: "Empresas" }]}>
      <CrudListPage
        title="Empresas"
        subtitle={`Gerencie ${mockData.length} empresas cadastradas.`}
        columns={columns}
        data={mockData}
        createRoute="/companies/new"
        createLabel="Nova Empresa"
        baseRoute="/companies"
        filterOptions={[{ key: "status", label: "Status", values: ["Ativo", "Inativo", "Pendente"] }, { key: "industry", label: "Setor", values: ["Tecnologia", "RH", "Educação", "Saúde", "Construção"] }]}
      />
    </DashboardLayout>
  );
}

export function CompaniesNew() {
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Cadastros" }, { label: "Empresas" }, { label: "Nova" }]}>
      <CrudFormPage title="Nova Empresa" fields={formFields} backRoute="/companies" />
    </DashboardLayout>
  );
}

export function CompaniesDetail() {
  const { id } = useParams();
  const item = mockData.find((d) => d.id === id) || mockData[0];
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Cadastros" }, { label: "Empresas" }, { label: item.trade_name }]}>
      <CrudDetailPage title={item.trade_name} fields={detailFields} data={item} backRoute="/companies" editRoute={`/companies/${id}/edit`} />
    </DashboardLayout>
  );
}

export function CompaniesEdit() {
  const { id } = useParams();
  const item = mockData.find((d) => d.id === id) || mockData[0];
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Cadastros" }, { label: "Empresas" }, { label: "Editar" }]}>
      <CrudFormPage title={`Editar ${item.trade_name}`} fields={formFields} initialData={item} backRoute="/companies" isEdit />
    </DashboardLayout>
  );
}
