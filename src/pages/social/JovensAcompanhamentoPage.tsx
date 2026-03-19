import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column, FilterConfig, ActionConfig } from "@/components/DataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const data = [
  { id: "1", name: "João Silva", cpf: "123.456.789-00", empresa: "TechSol", turma: "Turma 1", status: "Ativo" },
  { id: "2", name: "Maria Santos", cpf: "234.567.890-01", empresa: "RH Global", turma: "Turma 2", status: "Pendente" },
  { id: "3", name: "Pedro Lima", cpf: "345.678.901-02", empresa: "Apex Build", turma: "Turma 1", status: "Encerrado" },
];

const atendimentos = [
  { data: "15/03/2024", tipo: "Individual", desc: "Acompanhamento mensal" },
  { data: "10/02/2024", tipo: "Grupal", desc: "Dinâmica de grupo" },
];

const statusBadge = (v: string) => {
  const c = v === "Ativo" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : v === "Pendente" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-muted text-muted-foreground";
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${c}`}>{v}</span>;
};

export default function JovensAcompanhamentoPage() {
  const [viewHistory, setViewHistory] = useState(false);

  const columns: Column[] = [
    { key: "name", label: "Nome", sortable: true },
    { key: "cpf", label: "CPF" },
    { key: "empresa", label: "Empresa" },
    { key: "turma", label: "Turma" },
    { key: "status", label: "Status", render: statusBadge },
  ];

  const filters: FilterConfig[] = [
    { key: "name", label: "Nome", type: "text" },
    { key: "empresa", label: "Empresa", type: "text" },
    { key: "status", label: "Status", type: "select", options: [{ label: "Ativo", value: "Ativo" }, { label: "Pendente", value: "Pendente" }, { label: "Encerrado", value: "Encerrado" }] },
  ];

  const actions: ActionConfig[] = [
    { label: "Histórico de Atendimentos", onClick: () => setViewHistory(true) },
    { label: "Agendar Atendimento", onClick: () => toast.info("Redirecionando para atendimentos...") },
  ];

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Social / Psicóloga" }, { label: "Jovens Aprendizes" }]}>
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-foreground">Jovens Aprendizes — Acompanhamento</h1><p className="text-sm text-muted-foreground">{data.length} aprendizes.</p></div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>
      <Dialog open={viewHistory} onOpenChange={setViewHistory}>
        <DialogContent><DialogHeader><DialogTitle>Histórico de Atendimentos</DialogTitle></DialogHeader>
          <div className="space-y-3">
            {atendimentos.map((a, i) => (
              <div key={i} className="p-3 rounded-lg bg-muted/30 border border-border">
                <div className="flex justify-between text-sm"><span className="font-medium">{a.tipo}</span><span className="text-muted-foreground">{a.data}</span></div>
                <p className="text-sm text-muted-foreground mt-1">{a.desc}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
