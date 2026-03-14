import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CrudListPage, ColumnDef } from "@/components/crud/CrudListPage";
import { CrudFormPage, FieldDef } from "@/components/crud/CrudFormPage";
import { CrudDetailPage, DetailField } from "@/components/crud/CrudDetailPage";
import { useParams } from "react-router-dom";

// === PLANS ===
const planColumns: ColumnDef[] = [
  { key: "name", label: "Plano", sortable: true },
  { key: "price", label: "Preço", type: "currency" },
  { key: "billing_cycle", label: "Ciclo" },
  { key: "active", label: "Status", type: "status", sortable: true },
];

const planData = [
  { id: "1", name: "Basic", price: 299, features: "5 usuários, 1GB", billing_cycle: "Mensal", active: "Ativo" },
  { id: "2", name: "Pro", price: 799, features: "25 usuários, 10GB, Relatórios", billing_cycle: "Mensal", active: "Ativo" },
  { id: "3", name: "Enterprise", price: 1999, features: "Ilimitado, API, Suporte 24h", billing_cycle: "Anual", active: "Ativo" },
];

const planFormFields: FieldDef[] = [
  { key: "name", label: "Nome do Plano", required: true },
  { key: "price", label: "Preço", mask: "currency", required: true },
  { key: "features", label: "Funcionalidades", type: "textarea", span: 2 },
  { key: "billing_cycle", label: "Ciclo de Cobrança", type: "select", options: [{ label: "Mensal", value: "Mensal" }, { label: "Trimestral", value: "Trimestral" }, { label: "Anual", value: "Anual" }] },
  { key: "active", label: "Ativo", type: "toggle" },
];

export function PlansList() {
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Financeiro" }, { label: "Planos" }]}>
      <CrudListPage title="Planos" subtitle={`${planData.length} planos disponíveis.`} columns={planColumns} data={planData} createRoute="/plans/new" createLabel="Novo Plano" baseRoute="/plans" />
    </DashboardLayout>
  );
}

export function PlansNew() {
  return (<DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Financeiro" }, { label: "Planos" }, { label: "Novo" }]}><CrudFormPage title="Novo Plano" fields={planFormFields} backRoute="/plans" /></DashboardLayout>);
}

// === INVOICES ===
const invColumns: ColumnDef[] = [
  { key: "company", label: "Empresa", sortable: true },
  { key: "billing_period", label: "Período" },
  { key: "due_date", label: "Vencimento", type: "date", sortable: true },
  { key: "total_value", label: "Valor", type: "currency" },
  { key: "status", label: "Status", type: "status", sortable: true },
];

const invData = [
  { id: "1", company: "TechSol", billing_period: "Mar/2024", due_date: "10/03/2024", total_value: 799, status: "Pago" },
  { id: "2", company: "RH Global", billing_period: "Mar/2024", due_date: "15/03/2024", total_value: 1999, status: "Pendente" },
  { id: "3", company: "EduPlus", billing_period: "Mar/2024", due_date: "05/03/2024", total_value: 299, status: "Cancelado" },
  { id: "4", company: "Apex Build", billing_period: "Mar/2024", due_date: "20/03/2024", total_value: 799, status: "Pendente" },
  { id: "5", company: "SaúdeTotal", billing_period: "Fev/2024", due_date: "01/02/2024", total_value: 1999, status: "Pago" },
];

export function InvoicesList() {
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Financeiro" }, { label: "Faturas" }]}>
      <CrudListPage title="Faturas" subtitle={`${invData.length} faturas.`} columns={invColumns} data={invData} baseRoute="/invoices" filterOptions={[{ key: "status", label: "Status", values: ["Pago", "Pendente", "Cancelado"] }]} />
    </DashboardLayout>
  );
}

// === ACCOUNTS RECEIVABLE ===
const recColumns: ColumnDef[] = [
  { key: "company", label: "Empresa", sortable: true },
  { key: "amount", label: "Valor", type: "currency" },
  { key: "due_date", label: "Vencimento", type: "date", sortable: true },
  { key: "status", label: "Status", type: "status", sortable: true },
];

const recData = [
  { id: "1", company: "TechSol", amount: 4500, due_date: "15/03/2024", status: "Pendente" },
  { id: "2", company: "RH Global", amount: 8900, due_date: "20/03/2024", status: "Pago" },
  { id: "3", company: "Apex Build", amount: 3200, due_date: "10/04/2024", status: "Pendente" },
];

export function ReceivableList() {
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Financeiro" }, { label: "Contas a Receber" }]}>
      <CrudListPage title="Contas a Receber" subtitle={`${recData.length} registros.`} columns={recColumns} data={recData} baseRoute="/finance/receivable" filterOptions={[{ key: "status", label: "Status", values: ["Pendente", "Pago"] }]} />
    </DashboardLayout>
  );
}

// === ACCOUNTS PAYABLE ===
const payColumns: ColumnDef[] = [
  { key: "supplier", label: "Fornecedor", sortable: true },
  { key: "amount", label: "Valor", type: "currency" },
  { key: "due_date", label: "Vencimento", type: "date", sortable: true },
  { key: "status", label: "Status", type: "status", sortable: true },
];

const payData = [
  { id: "1", supplier: "SENAI SP", amount: 12000, due_date: "10/03/2024", status: "Pago" },
  { id: "2", supplier: "AWS", amount: 3500, due_date: "15/03/2024", status: "Pendente" },
  { id: "3", supplier: "Google Workspace", amount: 890, due_date: "01/04/2024", status: "Pendente" },
];

export function PayableList() {
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Financeiro" }, { label: "Contas a Pagar" }]}>
      <CrudListPage title="Contas a Pagar" subtitle={`${payData.length} registros.`} columns={payColumns} data={payData} baseRoute="/finance/payable" filterOptions={[{ key: "status", label: "Status", values: ["Pendente", "Pago"] }]} />
    </DashboardLayout>
  );
}
