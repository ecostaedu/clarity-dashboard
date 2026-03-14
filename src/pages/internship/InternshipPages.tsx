import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CrudListPage, ColumnDef } from "@/components/crud/CrudListPage";

// === ATTENDANCE ===
const attColumns: ColumnDef[] = [
  { key: "student", label: "Estudante", sortable: true },
  { key: "date", label: "Data", type: "date", sortable: true },
  { key: "hours", label: "Horas" },
  { key: "status", label: "Status", type: "status", sortable: true },
];

const attData = [
  { id: "1", student: "Lucas Lima", date: "14/03/2024", hours: "6h", status: "Presente" },
  { id: "2", student: "Ana Costa", date: "14/03/2024", hours: "4h", status: "Parcial" },
  { id: "3", student: "Pedro Santos", date: "14/03/2024", hours: "0h", status: "Ausente" },
  { id: "4", student: "Lucas Lima", date: "13/03/2024", hours: "6h", status: "Presente" },
  { id: "5", student: "Ana Costa", date: "13/03/2024", hours: "6h", status: "Presente" },
];

export function AttendancePage() {
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Gestão de Estágio" }, { label: "Frequência" }]}>
      <CrudListPage title="Frequência" subtitle={`${attData.length} registros.`} columns={attColumns} data={attData} baseRoute="/attendance" filterOptions={[{ key: "status", label: "Status", values: ["Presente", "Parcial", "Ausente"] }]} />
    </DashboardLayout>
  );
}

// === ACTIVITY REPORTS ===
const repColumns: ColumnDef[] = [
  { key: "student", label: "Estudante", sortable: true },
  { key: "month", label: "Mês", sortable: true },
  { key: "supervisor", label: "Supervisor" },
  { key: "report", label: "Relatório" },
];

const repData = [
  { id: "1", student: "Lucas Lima", month: "Março/2024", report: "Entregue", supervisor: "Ana Maria" },
  { id: "2", student: "Ana Costa", month: "Março/2024", report: "Pendente", supervisor: "Carlos Silva" },
  { id: "3", student: "Pedro Santos", month: "Fevereiro/2024", report: "Entregue", supervisor: "Ana Maria" },
];

export function ActivityReportsPage() {
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Gestão de Estágio" }, { label: "Relatórios de Atividades" }]}>
      <CrudListPage title="Relatórios de Atividades" subtitle={`${repData.length} relatórios.`} columns={repColumns} data={repData} baseRoute="/reports/activities" />
    </DashboardLayout>
  );
}
