import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TrendingUp, TrendingDown, DollarSign, Users } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const revenueData = [
  { month: "Jan", receita: 42000, despesa: 28000 },
  { month: "Fev", receita: 45000, despesa: 30000 },
  { month: "Mar", receita: 52000, despesa: 31000 },
  { month: "Abr", receita: 48000, despesa: 29000 },
  { month: "Mai", receita: 55000, despesa: 32000 },
  { month: "Jun", receita: 61000, despesa: 34000 },
];

const invoiceData = [
  { name: "Pago", value: 68 },
  { name: "Pendente", value: 22 },
  { name: "Cancelado", value: 10 },
];
const COLORS = ["hsl(142, 71%, 45%)", "hsl(38, 92%, 50%)", "hsl(0, 84%, 60%)"];

export function FinancialReportsPage() {
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Relatórios" }, { label: "Financeiro" }]}>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Relatórios Financeiros</h1>
          <p className="text-sm text-muted-foreground mt-1">Visão geral das finanças do período.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard label="Receita Total" value="R$ 303k" trend={{ value: "+18%", positive: true }} icon={DollarSign} />
          <StatsCard label="Despesas" value="R$ 184k" trend={{ value: "+5%", positive: false }} icon={TrendingDown} />
          <StatsCard label="Lucro Líquido" value="R$ 119k" trend={{ value: "+24%", positive: true }} icon={TrendingUp} />
          <StatsCard label="Clientes Ativos" value="48" trend={{ value: "+3", positive: true }} icon={Users} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-6 rounded-xl bg-card shadow-card">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-6">Receita vs Despesas</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(215, 16%, 47%)" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(215, 16%, 47%)" }} />
                <Tooltip />
                <Bar dataKey="receita" fill="hsl(259, 50%, 52%)" radius={[4, 4, 0, 0]} name="Receita" />
                <Bar dataKey="despesa" fill="hsl(215, 16%, 47%)" radius={[4, 4, 0, 0]} name="Despesas" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-6 rounded-xl bg-card shadow-card">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-6">Status das Faturas</p>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width={200} height={200}>
                <PieChart>
                  <Pie data={invoiceData} innerRadius={60} outerRadius={90} dataKey="value" stroke="none">
                    {invoiceData.map((_, i) => (<Cell key={i} fill={COLORS[i]} />))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="ml-6 space-y-3">
                {invoiceData.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-2 text-sm">
                    <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-semibold text-foreground tabular-nums">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// === APPRENTICESHIP REPORTS ===
const attendanceData = [
  { month: "Jan", presenca: 92 }, { month: "Fev", presenca: 88 }, { month: "Mar", presenca: 95 },
  { month: "Abr", presenca: 90 }, { month: "Mai", presenca: 93 }, { month: "Jun", presenca: 97 },
];

const progressData = [
  { name: "Administração", progress: 75 },
  { name: "TI", progress: 60 },
  { name: "Logística", progress: 45 },
];

export function ApprenticeReportsPage() {
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Relatórios" }, { label: "Jovem Aprendiz" }]}>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Relatórios Jovem Aprendiz</h1>
          <p className="text-sm text-muted-foreground mt-1">Frequência e progresso dos programas.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-6 rounded-xl bg-card shadow-card">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-6">Taxa de Presença (%)</p>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(215, 16%, 47%)" }} />
                <YAxis domain={[80, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(215, 16%, 47%)" }} />
                <Line type="monotone" dataKey="presenca" stroke="hsl(259, 50%, 52%)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="p-6 rounded-xl bg-card shadow-card">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-6">Progresso dos Cursos</p>
            <div className="space-y-6 mt-4">
              {progressData.map((item) => (
                <div key={item.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{item.name}</span>
                    <span className="text-sm font-semibold text-foreground tabular-nums">{item.progress}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${item.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
