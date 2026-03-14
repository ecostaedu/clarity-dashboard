import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CrudListPage, ColumnDef } from "@/components/crud/CrudListPage";
import { CrudFormPage, FieldDef } from "@/components/crud/CrudFormPage";
import { CrudDetailPage, DetailField } from "@/components/crud/CrudDetailPage";
import { Button } from "@/components/ui/button";
import { FileDown, Send } from "lucide-react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

// === CONTRACTS ===
const contractColumns: ColumnDef[] = [
  { key: "candidate", label: "Candidato", sortable: true },
  { key: "company", label: "Empresa", sortable: true },
  { key: "start_date", label: "Início", type: "date" },
  { key: "end_date", label: "Término", type: "date" },
  { key: "stipend_value", label: "Valor", type: "currency" },
  { key: "status", label: "Status", type: "status", sortable: true },
  { key: "signature_status", label: "Assinatura", type: "status" },
];

const contractData = [
  { id: "1", candidate: "João Silva", company: "TechSol", start_date: "01/03/2024", end_date: "01/03/2025", stipend_value: 5000, status: "Ativo", signature_status: "Assinado" },
  { id: "2", candidate: "Maria Oliveira", company: "RH Global", start_date: "15/02/2024", end_date: "15/02/2025", stipend_value: 3500, status: "Ativo", signature_status: "Pendente" },
  { id: "3", candidate: "Pedro Santos", company: "Apex Build", start_date: "01/01/2024", end_date: "01/07/2024", stipend_value: 1800, status: "Pendente", signature_status: "Pendente" },
  { id: "4", candidate: "Ana Costa", company: "TechSol", start_date: "10/04/2024", end_date: "10/04/2025", stipend_value: 6200, status: "Ativo", signature_status: "Assinado" },
  { id: "5", candidate: "Lucas Lima", company: "SaúdeTotal", start_date: "01/06/2023", end_date: "01/06/2024", stipend_value: 4800, status: "Concluído", signature_status: "Assinado" },
];

const contractFormFields: FieldDef[] = [
  { key: "candidate", label: "Candidato", required: true },
  { key: "company", label: "Empresa", type: "select", required: true, options: [{ label: "TechSol", value: "TechSol" }, { label: "RH Global", value: "RH Global" }, { label: "Apex Build", value: "Apex Build" }] },
  { key: "start_date", label: "Data Início", type: "date", required: true },
  { key: "end_date", label: "Data Término", type: "date", required: true },
  { key: "stipend_value", label: "Valor da Bolsa", mask: "currency", placeholder: "0,00" },
  { key: "status", label: "Status", type: "select", options: [{ label: "Ativo", value: "Ativo" }, { label: "Pendente", value: "Pendente" }, { label: "Concluído", value: "Concluído" }] },
  { key: "signature_status", label: "Status da Assinatura", type: "select", options: [{ label: "Pendente", value: "Pendente" }, { label: "Assinado", value: "Assinado" }] },
];

const contractDetailFields: DetailField[] = [
  { key: "candidate", label: "Candidato" }, { key: "company", label: "Empresa" },
  { key: "start_date", label: "Início", type: "date" }, { key: "end_date", label: "Término", type: "date" },
  { key: "stipend_value", label: "Valor", type: "currency" }, { key: "status", label: "Status", type: "status" },
  { key: "signature_status", label: "Assinatura", type: "status" },
];

export function ContractsList() {
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Contratos" }]}>
      <CrudListPage title="Contratos" subtitle={`${contractData.length} contratos cadastrados.`} columns={contractColumns} data={contractData} createRoute="/contracts/new" createLabel="Novo Contrato" baseRoute="/contracts" filterOptions={[{ key: "status", label: "Status", values: ["Ativo", "Pendente", "Concluído"] }, { key: "signature_status", label: "Assinatura", values: ["Pendente", "Assinado"] }]} />
    </DashboardLayout>
  );
}

export function ContractsNew() {
  return (<DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Contratos" }, { label: "Novo" }]}><CrudFormPage title="Novo Contrato" fields={contractFormFields} backRoute="/contracts" /></DashboardLayout>);
}

export function ContractsDetail() {
  const { id } = useParams();
  const item = contractData.find((d) => d.id === id) || contractData[0];
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Contratos" }, { label: item.candidate }]}>
      <CrudDetailPage
        title={`Contrato - ${item.candidate}`}
        fields={contractDetailFields}
        data={item}
        backRoute="/contracts"
        editRoute={`/contracts/${id}/edit`}
        actions={[
          { label: "Gerar PDF", icon: <FileDown className="h-3.5 w-3.5" />, onClick: () => toast.success("PDF gerado com sucesso") },
          { label: "Enviar para Assinatura", icon: <Send className="h-3.5 w-3.5" />, onClick: () => toast.success("Enviado para assinatura") },
        ]}
      />
    </DashboardLayout>
  );
}

// === SIGNATURES ===
const sigColumns: ColumnDef[] = [
  { key: "document", label: "Documento", sortable: true },
  { key: "signers", label: "Assinantes" },
  { key: "progress", label: "Progresso" },
  { key: "status", label: "Status", type: "status", sortable: true },
];

const sigData = [
  { id: "1", document: "Contrato CLT - João Silva", signers: "João, Ana, Carlos", progress: "2/3", status: "Pendente" },
  { id: "2", document: "Contrato PJ - Maria", signers: "Maria, Pedro", progress: "2/2", status: "Assinado" },
  { id: "3", document: "Termo de Estágio - Lucas", signers: "Lucas, Prof. Lima, Ana", progress: "1/3", status: "Pendente" },
];

export function SignaturesList() {
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Contratos" }, { label: "Assinaturas" }]}>
      <CrudListPage title="Assinaturas Digitais" subtitle={`${sigData.length} documentos em processo.`} columns={sigColumns} data={sigData} baseRoute="/signatures" filterOptions={[{ key: "status", label: "Status", values: ["Pendente", "Assinado"] }]} />
    </DashboardLayout>
  );
}
