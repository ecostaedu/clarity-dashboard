import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column, FilterConfig } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const data = [
  { id: "1", data: "19/03/2024", historico: "TED Recebida - TechSol", tipo: "Crédito", valor: 4500, saldo: 125000 },
  { id: "2", data: "18/03/2024", historico: "Pagamento SENAI", tipo: "Débito", valor: 12000, saldo: 120500 },
  { id: "3", data: "17/03/2024", historico: "TED Recebida - RH Global", tipo: "Crédito", valor: 8900, saldo: 132500 },
  { id: "4", data: "16/03/2024", historico: "PIX - AWS", tipo: "Débito", valor: 3500, saldo: 123600 },
];

export default function ExtratoBancarioPage() {
  const columns: Column[] = [
    { key: "data", label: "Data", sortable: true },
    { key: "historico", label: "Histórico" },
    { key: "tipo", label: "Tipo", render: (v) => <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${v === "Crédito" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>{v}</span> },
    { key: "valor", label: "Valor", render: (v) => `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` },
    { key: "saldo", label: "Saldo", render: (v) => `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` },
  ];

  const filters: FilterConfig[] = [
    { key: "tipo", label: "Tipo", type: "select", options: [{ label: "Crédito", value: "Crédito" }, { label: "Débito", value: "Débito" }] },
  ];

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Rel. Financeiros" }, { label: "Extrato Bancário" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Extrato Bancário</h1><p className="text-sm text-muted-foreground">{data.length} lançamentos.</p></div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.success("OFX exportado!")}>Exportar OFX</Button>
            <Button variant="outline" size="sm" onClick={() => toast.success("PDF exportado!")}>Exportar PDF</Button>
          </div>
        </div>
        <DataTable columns={columns} data={data} filters={filters} />
      </div>
    </DashboardLayout>
  );
}
