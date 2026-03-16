import { useState } from "react";
import { Briefcase, FileText, PenTool, DollarSign, TrendingUp, Users, Calendar, ArrowRight, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { StatsCard } from "@/components/StatsCard";
import { DataTable } from "@/components/DataTable";
import { ContextPanel } from "@/components/ContextPanel";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

const stats = [
  { label: "Vagas Abertas", value: 24, trend: { value: "+12%", positive: true }, icon: Briefcase },
  { label: "Contratos Vencendo", value: 8, trend: { value: "-3%", positive: true }, icon: FileText },
  { label: "Assinaturas Pendentes", value: 15, trend: { value: "+5%", positive: false }, icon: PenTool },
  { label: "Receita Mensal", value: "R$ 142k", trend: { value: "+18%", positive: true }, icon: DollarSign },
];

const tableColumns: Column[] = [
  { key: "name", label: "Nome", sortable: true },
  { key: "status", label: "Status", sortable: true, render: (value) => (
    <span className={cn(
      "px-2 py-0.5 rounded text-xs font-medium",
      value === "Ativo" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      value === "Pendente" && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      value === "Concluído" && "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
    )}>{value}</span>
  )},
  { key: "owner", label: "Responsável", sortable: true },
  { key: "department", label: "Departamento", sortable: true },
  { key: "lastUpdate", label: "Atualizado", sortable: true },
];

const tableData = [
  { name: "Processo Seletivo - Dev Senior", status: "Ativo", owner: "Ana Maria", department: "Tecnologia", lastUpdate: "2m atrás", tags: ["Urgente", "Tech"] },
  { name: "Contrato CLT - João Santos", status: "Pendente", owner: "Carlos Silva", department: "RH", lastUpdate: "15m atrás", tags: ["CLT", "Novo"] },
  { name: "Estágio - Design UX", status: "Ativo", owner: "Maria Costa", department: "Design", lastUpdate: "1h atrás", tags: ["Estágio", "Design"] },
  { name: "Onboarding - Dev Pleno", status: "Concluído", owner: "Pedro Lima", department: "Tecnologia", lastUpdate: "3h atrás", tags: ["Onboarding"] },
  { name: "Avaliação 360 - Q1", status: "Ativo", owner: "Lucia Souza", department: "Geral", lastUpdate: "5h atrás", tags: ["Avaliação"] },
  { name: "Rescisão - Maria Oliveira", status: "Pendente", owner: "Carlos Silva", department: "RH", lastUpdate: "1d atrás", tags: ["Rescisão", "Urgente"] },
  { name: "Contrato PJ - Tech Lead", status: "Ativo", owner: "Ana Maria", department: "Tecnologia", lastUpdate: "2d atrás", tags: ["PJ", "Tech"] },
];

const barChartData = [
  { month: "Jan", value: 32 }, { month: "Fev", value: 45 }, { month: "Mar", value: 38 },
  { month: "Abr", value: 52 }, { month: "Mai", value: 48 }, { month: "Jun", value: 61 },
];

const lineChartData = [
  { month: "Jan", atual: 65, anterior: 50 }, { month: "Fev", atual: 72, anterior: 58 },
  { month: "Mar", atual: 68, anterior: 62 }, { month: "Abr", atual: 85, anterior: 65 },
  { month: "Mai", atual: 92, anterior: 70 }, { month: "Jun", atual: 98, anterior: 75 },
];

const donutData = [
  { name: "CLT", value: 45 }, { name: "PJ", value: 25 },
  { name: "Estágio", value: 20 }, { name: "Aprendiz", value: 10 },
];
const DONUT_COLORS = ["hsl(259, 50%, 52%)", "hsl(258, 90%, 66%)", "hsl(199, 89%, 48%)", "hsl(142, 71%, 45%)"];

const Index = () => {
  const navigate = useNavigate();
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleRowClick = (row: any) => {
    setSelectedItem({ ...row, type: "Documento" });
    setPanelOpen(true);
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Dashboard" }]}>
      <div className="flex gap-0 -m-8">
        <div className="flex-1 overflow-y-auto p-8">
          <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Gerencie 142 processos ativos em 8 departamentos. Atualizado 2m atrás.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate("/processes/new")}>
                  <Plus className="h-3.5 w-3.5" /> Novo Processo
                </Button>
                <Button size="sm" className="gap-2" onClick={() => navigate("/contracts/new")}>
                  <Plus className="h-3.5 w-3.5" /> Novo Contrato
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <StatsCard key={stat.label} {...stat} />
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-1 p-6 rounded-xl bg-card shadow-card">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Contratações</p>
                    <p className="text-lg font-bold text-foreground tabular-nums mt-1">296</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-success">
                    <TrendingUp className="h-3.5 w-3.5" /> +24%
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={barChartData}>
                    <Bar dataKey="value" fill="hsl(259, 50%, 52%)" radius={[4, 4, 0, 0]} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(215, 16%, 47%)" }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="lg:col-span-1 p-6 rounded-xl bg-card shadow-card">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Performance</p>
                    <p className="text-lg font-bold text-foreground tabular-nums mt-1">98%</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-success">
                    <TrendingUp className="h-3.5 w-3.5" /> +8%
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={lineChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                    <Line type="monotone" dataKey="atual" stroke="hsl(259, 50%, 52%)" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="anterior" stroke="hsl(215, 16%, 47%)" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(215, 16%, 47%)" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="lg:col-span-1 p-6 rounded-xl bg-card shadow-card">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-6">Tipos de Contrato</p>
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width={160} height={160}>
                    <PieChart>
                      <Pie data={donutData} innerRadius={50} outerRadius={75} dataKey="value" stroke="none">
                        {donutData.map((_, i) => (<Cell key={i} fill={DONUT_COLORS[i]} />))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="ml-4 space-y-2">
                    {donutData.map((item, i) => (
                      <div key={item.name} className="flex items-center gap-2 text-xs">
                        <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: DONUT_COLORS[i] }} />
                        <span className="text-muted-foreground">{item.name}</span>
                        <span className="font-medium text-foreground tabular-nums">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick access */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground tracking-tight">Acesso Rápido</h2>
                <button className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 font-medium transition-colors">
                  Ver todos <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: Users, label: "Novo Cadastro", desc: "Adicionar colaborador", route: "/candidates/new" },
                  { icon: Calendar, label: "Agendar Entrevista", desc: "Criar evento", route: "/processes" },
                  { icon: FileText, label: "Novo Contrato", desc: "Gerar documento", route: "/contracts/new" },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.route)}
                    className="p-4 rounded-xl bg-card shadow-card hover:shadow-card-hover transition-all duration-150 flex items-center gap-4 text-left group"
                  >
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div>
              <h2 className="text-lg font-semibold text-foreground tracking-tight mb-4">Processos Seletivos</h2>
              <DataTable columns={tableColumns} data={tableData} onRowClick={handleRowClick} />
            </div>
          </div>
        </div>

        {/* Context panel */}
        <ContextPanel open={panelOpen} onClose={() => setPanelOpen(false)} selectedItem={selectedItem} />
      </div>
    </DashboardLayout>
  );
};

export default Index;
