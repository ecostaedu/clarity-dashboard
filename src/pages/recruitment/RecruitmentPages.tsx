import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CrudListPage, ColumnDef } from "@/components/crud/CrudListPage";
import { CrudFormPage, FieldDef } from "@/components/crud/CrudFormPage";
import { CrudDetailPage, DetailField } from "@/components/crud/CrudDetailPage";
import { useParams } from "react-router-dom";

// === JOB OPENINGS ===
const jobColumns: ColumnDef[] = [
  { key: "title", label: "Título", sortable: true },
  { key: "company", label: "Empresa", sortable: true },
  { key: "type", label: "Tipo", sortable: true },
  { key: "vacancies", label: "Vagas" },
  { key: "status", label: "Status", type: "status", sortable: true },
];

const jobData = [
  { id: "1", title: "Desenvolvedor Senior", company: "TechSol", type: "CLT", vacancies: 2, status: "Ativo" },
  { id: "2", title: "Designer UX", company: "RH Global", type: "PJ", vacancies: 1, status: "Ativo" },
  { id: "3", title: "Analista Financeiro", company: "Apex Build", type: "CLT", vacancies: 3, status: "Pendente" },
  { id: "4", title: "Estagiário TI", company: "TechSol", type: "Estágio", vacancies: 5, status: "Ativo" },
  { id: "5", title: "Gerente de Projetos", company: "SaúdeTotal", type: "CLT", vacancies: 1, status: "Concluído" },
];

const jobFormFields: FieldDef[] = [
  { key: "title", label: "Título da Vaga", required: true },
  { key: "company", label: "Empresa", type: "select", required: true, options: [{ label: "TechSol", value: "TechSol" }, { label: "RH Global", value: "RH Global" }, { label: "Apex Build", value: "Apex Build" }] },
  { key: "type", label: "Tipo", type: "select", options: [{ label: "CLT", value: "CLT" }, { label: "PJ", value: "PJ" }, { label: "Estágio", value: "Estágio" }] },
  { key: "vacancies", label: "Quantidade de Vagas", type: "number" },
  { key: "status", label: "Status", type: "select", options: [{ label: "Ativo", value: "Ativo" }, { label: "Pendente", value: "Pendente" }, { label: "Concluído", value: "Concluído" }] },
];

const jobDetailFields: DetailField[] = [
  { key: "title", label: "Título" }, { key: "company", label: "Empresa" }, { key: "type", label: "Tipo" }, { key: "vacancies", label: "Vagas" }, { key: "status", label: "Status", type: "status" },
];

export function JobsList() {
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Recrutamento" }, { label: "Vagas" }]}>
      <CrudListPage title="Vagas" subtitle={`${jobData.length} vagas cadastradas.`} columns={jobColumns} data={jobData} createRoute="/jobs/new" createLabel="Nova Vaga" baseRoute="/jobs" filterOptions={[{ key: "status", label: "Status", values: ["Ativo", "Pendente", "Concluído"] }, { key: "type", label: "Tipo", values: ["CLT", "PJ", "Estágio"] }]} />
    </DashboardLayout>
  );
}
export function JobsNew() {
  return (<DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Recrutamento" }, { label: "Vagas" }, { label: "Nova" }]}><CrudFormPage title="Nova Vaga" fields={jobFormFields} backRoute="/jobs" /></DashboardLayout>);
}
export function JobsDetail() {
  const { id } = useParams(); const item = jobData.find((d) => d.id === id) || jobData[0];
  return (<DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Recrutamento" }, { label: "Vagas" }, { label: item.title }]}><CrudDetailPage title={item.title} fields={jobDetailFields} data={item} backRoute="/jobs" editRoute={`/jobs/${id}/edit`} /></DashboardLayout>);
}

// === SELECTION PROCESSES ===
const processColumns: ColumnDef[] = [
  { key: "title", label: "Título", sortable: true },
  { key: "company", label: "Empresa", sortable: true },
  { key: "job_type", label: "Tipo" },
  { key: "vacancies", label: "Vagas" },
  { key: "start_date", label: "Início", type: "date" },
  { key: "status", label: "Status", type: "status", sortable: true },
];

const processData = [
  { id: "1", title: "PS Dev Senior 2024", company: "TechSol", job_type: "CLT", vacancies: 2, start_date: "01/03/2024", end_date: "31/03/2024", description: "Processo para dev senior", required_skills: "React, Node", desired_skills: "AWS", status: "Ativo" },
  { id: "2", title: "PS Designer UX Q1", company: "RH Global", job_type: "PJ", vacancies: 1, start_date: "15/02/2024", end_date: "15/03/2024", description: "Processo para designer", required_skills: "Figma", desired_skills: "Motion", status: "Concluído" },
  { id: "3", title: "PS Estágio TI 2024", company: "TechSol", job_type: "Estágio", vacancies: 5, start_date: "01/04/2024", end_date: "30/04/2024", description: "Programa de estágio", required_skills: "HTML, CSS", desired_skills: "React", status: "Pendente" },
];

const processFormFields: FieldDef[] = [
  { key: "title", label: "Título do Processo", required: true },
  { key: "company", label: "Empresa", type: "select", required: true, options: [{ label: "TechSol", value: "TechSol" }, { label: "RH Global", value: "RH Global" }] },
  { key: "job_type", label: "Tipo de Vaga", type: "select", options: [{ label: "CLT", value: "CLT" }, { label: "PJ", value: "PJ" }, { label: "Estágio", value: "Estágio" }] },
  { key: "vacancies", label: "Vagas", type: "number" },
  { key: "start_date", label: "Data Início", type: "date" },
  { key: "end_date", label: "Data Fim", type: "date" },
  { key: "description", label: "Descrição", type: "textarea", span: 2 },
  { key: "required_skills", label: "Competências Obrigatórias", span: 2 },
  { key: "desired_skills", label: "Competências Desejáveis", span: 2 },
  { key: "status", label: "Status", type: "select", options: [{ label: "Ativo", value: "Ativo" }, { label: "Pendente", value: "Pendente" }, { label: "Concluído", value: "Concluído" }] },
];

const processDetailFields: DetailField[] = [
  { key: "title", label: "Título" }, { key: "company", label: "Empresa" }, { key: "job_type", label: "Tipo" }, { key: "vacancies", label: "Vagas" },
  { key: "start_date", label: "Início", type: "date" }, { key: "end_date", label: "Fim", type: "date" },
  { key: "description", label: "Descrição" }, { key: "required_skills", label: "Obrigatórias" }, { key: "desired_skills", label: "Desejáveis" }, { key: "status", label: "Status", type: "status" },
];

export function ProcessesList() {
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Recrutamento" }, { label: "Processos Seletivos" }]}>
      <CrudListPage title="Processos Seletivos" subtitle={`${processData.length} processos ativos.`} columns={processColumns} data={processData} createRoute="/processes/new" createLabel="Novo Processo" baseRoute="/processes" filterOptions={[{ key: "status", label: "Status", values: ["Ativo", "Pendente", "Concluído"] }]} />
    </DashboardLayout>
  );
}
export function ProcessesNew() {
  return (<DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Recrutamento" }, { label: "Processos" }, { label: "Novo" }]}><CrudFormPage title="Novo Processo Seletivo" fields={processFormFields} backRoute="/processes" /></DashboardLayout>);
}
export function ProcessesDetail() {
  const { id } = useParams(); const item = processData.find((d) => d.id === id) || processData[0];
  return (<DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Recrutamento" }, { label: "Processos" }, { label: item.title }]}><CrudDetailPage title={item.title} fields={processDetailFields} data={item} backRoute="/processes" editRoute={`/processes/${id}/edit`} /></DashboardLayout>);
}

// === TESTS ===
const testColumns: ColumnDef[] = [
  { key: "title", label: "Título", sortable: true },
  { key: "category", label: "Categoria", sortable: true },
  { key: "questions", label: "Questões" },
  { key: "duration", label: "Duração" },
];

const testData = [
  { id: "1", title: "Teste Técnico React", category: "Técnico", questions: 20, duration: "60 min" },
  { id: "2", title: "Teste Lógica", category: "Raciocínio", questions: 30, duration: "45 min" },
  { id: "3", title: "Teste Comportamental", category: "Comportamental", questions: 15, duration: "30 min" },
];

const testFormFields: FieldDef[] = [
  { key: "title", label: "Título do Teste", required: true },
  { key: "category", label: "Categoria", type: "select", options: [{ label: "Técnico", value: "Técnico" }, { label: "Raciocínio", value: "Raciocínio" }, { label: "Comportamental", value: "Comportamental" }] },
  { key: "questions", label: "Nº de Questões", type: "number" },
  { key: "duration", label: "Duração (minutos)", type: "number" },
];

const testDetailFields: DetailField[] = [
  { key: "title", label: "Título" }, { key: "category", label: "Categoria" }, { key: "questions", label: "Questões" }, { key: "duration", label: "Duração" },
];

export function TestsList() {
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Recrutamento" }, { label: "Testes" }]}>
      <CrudListPage title="Testes" subtitle={`${testData.length} testes disponíveis.`} columns={testColumns} data={testData} createRoute="/tests/new" createLabel="Novo Teste" baseRoute="/tests" />
    </DashboardLayout>
  );
}
export function TestsNew() {
  return (<DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Recrutamento" }, { label: "Testes" }, { label: "Novo" }]}><CrudFormPage title="Novo Teste" fields={testFormFields} backRoute="/tests" /></DashboardLayout>);
}
export function TestsDetail() {
  const { id } = useParams(); const item = testData.find((d) => d.id === id) || testData[0];
  return (<DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Recrutamento" }, { label: "Testes" }, { label: item.title }]}><CrudDetailPage title={item.title} fields={testDetailFields} data={item} backRoute="/tests" /></DashboardLayout>);
}
