import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CrudListPage, ColumnDef } from "@/components/crud/CrudListPage";
import { CrudFormPage, FieldDef } from "@/components/crud/CrudFormPage";

// === PROGRAMS ===
const progColumns: ColumnDef[] = [
  { key: "number", label: "#", sortable: true },
  { key: "name", label: "Programa", sortable: true },
  { key: "total_hours", label: "Horas" },
  { key: "city", label: "Cidade", sortable: true },
  { key: "active", label: "Status", type: "status", sortable: true },
];

const progData = [
  { id: "1", number: "001", name: "Aprendiz em Administração", total_hours: 800, city: "São Paulo", active: "Ativo" },
  { id: "2", number: "002", name: "Aprendiz em TI", total_hours: 960, city: "São Paulo", active: "Ativo" },
  { id: "3", number: "003", name: "Aprendiz em Logística", total_hours: 640, city: "Campinas", active: "Inativo" },
];

const progFormFields: FieldDef[] = [
  { key: "number", label: "Número", required: true },
  { key: "name", label: "Nome do Programa", required: true },
  { key: "total_hours", label: "Carga Horária Total", type: "number", required: true },
  { key: "city", label: "Cidade", required: true },
  { key: "active", label: "Ativo", type: "toggle" },
];

export function ProgramsList() {
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Jovem Aprendiz" }, { label: "Programas" }]}>
      <CrudListPage title="Programas" subtitle={`${progData.length} programas cadastrados.`} columns={progColumns} data={progData} createRoute="/programs/new" createLabel="Novo Programa" baseRoute="/programs" filterOptions={[{ key: "active", label: "Status", values: ["Ativo", "Inativo"] }]} />
    </DashboardLayout>
  );
}

export function ProgramsNew() {
  return (<DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Jovem Aprendiz" }, { label: "Programas" }, { label: "Novo" }]}><CrudFormPage title="Novo Programa" fields={progFormFields} backRoute="/programs" /></DashboardLayout>);
}

// === CLASSES ===
const classColumns: ColumnDef[] = [
  { key: "program", label: "Programa", sortable: true },
  { key: "room", label: "Sala" },
  { key: "schedule", label: "Horário" },
];

const classData = [
  { id: "1", program: "Aprendiz em Administração", room: "Sala 101", schedule: "Seg/Qua 08:00-12:00" },
  { id: "2", program: "Aprendiz em TI", room: "Lab 03", schedule: "Ter/Qui 13:00-17:00" },
  { id: "3", program: "Aprendiz em Logística", room: "Sala 205", schedule: "Sex 08:00-17:00" },
];

const classFormFields: FieldDef[] = [
  { key: "program", label: "Programa", type: "select", required: true, options: [{ label: "Aprendiz em Administração", value: "Aprendiz em Administração" }, { label: "Aprendiz em TI", value: "Aprendiz em TI" }, { label: "Aprendiz em Logística", value: "Aprendiz em Logística" }] },
  { key: "room", label: "Sala", required: true },
  { key: "schedule", label: "Horário", required: true },
];

export function ClassesList() {
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Jovem Aprendiz" }, { label: "Turmas" }]}>
      <CrudListPage title="Turmas" subtitle={`${classData.length} turmas ativas.`} columns={classColumns} data={classData} createRoute="/classes/new" createLabel="Nova Turma" baseRoute="/classes" />
    </DashboardLayout>
  );
}

export function ClassesNew() {
  return (<DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Jovem Aprendiz" }, { label: "Turmas" }, { label: "Nova" }]}><CrudFormPage title="Nova Turma" fields={classFormFields} backRoute="/classes" /></DashboardLayout>);
}

// === OCCURRENCES ===
const occColumns: ColumnDef[] = [
  { key: "student", label: "Estudante", sortable: true },
  { key: "type", label: "Tipo", type: "badge", sortable: true },
  { key: "description", label: "Descrição" },
  { key: "date", label: "Data", type: "date", sortable: true },
];

const occData = [
  { id: "1", student: "Lucas Lima", type: "Advertência", description: "Atraso recorrente", date: "10/03/2024" },
  { id: "2", student: "Ana Costa", type: "Elogio", description: "Destaque no projeto final", date: "08/03/2024" },
  { id: "3", student: "Pedro Santos", type: "Falta", description: "Falta sem justificativa", date: "05/03/2024" },
];

export function OccurrencesList() {
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Jovem Aprendiz" }, { label: "Ocorrências" }]}>
      <CrudListPage title="Ocorrências" subtitle={`${occData.length} registros.`} columns={occColumns} data={occData} baseRoute="/occurrences" filterOptions={[{ key: "type", label: "Tipo", values: ["Advertência", "Elogio", "Falta"] }]} />
    </DashboardLayout>
  );
}

// === HOLIDAYS ===
const holColumns: ColumnDef[] = [
  { key: "name", label: "Feriado", sortable: true },
  { key: "date", label: "Data", type: "date", sortable: true },
  { key: "city", label: "Cidade", sortable: true },
];

const holData = [
  { id: "1", name: "Carnaval", date: "12/02/2024", city: "Nacional" },
  { id: "2", name: "Aniversário de SP", date: "25/01/2024", city: "São Paulo" },
  { id: "3", name: "Tiradentes", date: "21/04/2024", city: "Nacional" },
];

export function HolidaysList() {
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Jovem Aprendiz" }, { label: "Feriados" }]}>
      <CrudListPage title="Feriados" subtitle={`${holData.length} feriados cadastrados.`} columns={holColumns} data={holData} baseRoute="/holidays" />
    </DashboardLayout>
  );
}

// === VACATIONS ===
const vacColumns: ColumnDef[] = [
  { key: "student", label: "Estudante", sortable: true },
  { key: "start_date", label: "Início", type: "date", sortable: true },
  { key: "end_date", label: "Término", type: "date" },
];

const vacData = [
  { id: "1", student: "Lucas Lima", start_date: "01/07/2024", end_date: "15/07/2024" },
  { id: "2", student: "Ana Costa", start_date: "15/07/2024", end_date: "30/07/2024" },
];

export function VacationsList() {
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Jovem Aprendiz" }, { label: "Férias" }]}>
      <CrudListPage title="Férias" subtitle={`${vacData.length} períodos registrados.`} columns={vacColumns} data={vacData} baseRoute="/vacations" />
    </DashboardLayout>
  );
}
