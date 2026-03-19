import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column, FilterConfig, ActionConfig } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const data = [
  { id: "1", data: "19/03/2024", description: "Recebimento TechSol", tipo: "Receita", conta: "1.1.01", valor: 4500 },
  { id: "2", data: "18/03/2024", description: "Pagamento SENAI", tipo: "Despesa", conta: "2.1.01", valor: 12000 },
  { id: "3", data: "17/03/2024", description: "Recebimento RH Global", tipo: "Receita", conta: "1.1.01", valor: 8900 },
  { id: "4", data: "16/03/2024", description: "Pagamento AWS", tipo: "Despesa", conta: "2.2.01", valor: 3500 },
];

export default function MovimentoAnaliticoPage() {
  const columns: Column[] = [
    { key: "data", label: "Data", sortable: true },
    { key: "description", label: "Descrição" },
    { key: "tipo", label: "Tipo", render: (v) => <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${v === "Receita" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>{v}</span> },
    { key: "conta", label: "Conta Contábil" },
    { key: "valor", label: "Valor", render: (v) => `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` },
  ];

  const filters: FilterConfig[] = [
    { key: "tipo", label: "Tipo", type: "select", options: [{ label: "Receita", value: "Receita" }, { label: "Despesa", value: "Despesa" }] },
    { key: "conta", label: "Conta Contábil", type: "text" },
  ];

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Rel. Financeiros" }, { label: "Movimento Analítico" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Movimento Analítico</h1><p className="text-sm text-muted-foreground">{data.length} movimentos.</p></div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.success("Excel exportado!")}>Exportar Excel</Button>
            <Button variant="outline" size="sm" onClick={() => toast.success("PDF exportado!")}>Exportar PDF</Button>
          </div>
        </div>
        <DataTable columns={columns} data={data} filters={filters} />
      </div>
    </DashboardLayout>
  );
}
