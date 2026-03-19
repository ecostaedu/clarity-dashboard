import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column, FilterConfig, ActionConfig } from "@/components/DataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const data = [
  { id: "1", banco: "Banco do Brasil", agencia: "1234-5", conta: "1234567-8", saldo: 125000, ultima_atualizacao: "19/03/2024" },
  { id: "2", banco: "Itaú", agencia: "0001-9", conta: "9876543-2", saldo: 87500, ultima_atualizacao: "19/03/2024" },
  { id: "3", banco: "Caixa", agencia: "5678-0", conta: "5555555-1", saldo: 43200, ultima_atualizacao: "18/03/2024" },
];

const extrato = [
  { data: "19/03/2024", desc: "TED Recebida - TechSol", tipo: "Crédito", valor: 4500 },
  { data: "18/03/2024", desc: "Pagamento SENAI", tipo: "Débito", valor: -12000 },
  { data: "17/03/2024", desc: "TED Recebida - RH Global", tipo: "Crédito", valor: 8900 },
  { data: "16/03/2024", desc: "Pagamento AWS", tipo: "Débito", valor: -3500 },
];

export default function SaldoBancarioPage() {
  const [viewExtrato, setViewExtrato] = useState(false);

  const columns: Column[] = [
    { key: "banco", label: "Banco", sortable: true },
    { key: "agencia", label: "Agência" },
    { key: "conta", label: "Conta" },
    { key: "saldo", label: "Saldo Atual", render: (v) => <span className={Number(v) >= 0 ? "text-emerald-600 font-semibold" : "text-red-600 font-semibold"}>R$ {Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span> },
    { key: "ultima_atualizacao", label: "Última Atualização" },
  ];

  const filters: FilterConfig[] = [{ key: "banco", label: "Banco", type: "text" }];

  const actions: ActionConfig[] = [
    { label: "Visualizar Extrato", onClick: () => setViewExtrato(true) },
  ];

  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Financeiro" }, { label: "Saldo Bancário" }]}>
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-foreground">Saldo Bancário</h1><p className="text-sm text-muted-foreground">{data.length} contas.</p></div>
        <DataTable columns={columns} data={data} filters={filters} actions={actions} />
      </div>
      <Dialog open={viewExtrato} onOpenChange={setViewExtrato}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Extrato Bancário</DialogTitle></DialogHeader>
          <table className="w-full text-sm">
            <thead><tr className="bg-muted/40"><th className="text-left px-3 py-2">Data</th><th className="text-left px-3 py-2">Descrição</th><th className="text-left px-3 py-2">Tipo</th><th className="text-right px-3 py-2">Valor</th></tr></thead>
            <tbody>
              {extrato.map((e, i) => (
                <tr key={i} className="border-t border-border/50">
                  <td className="px-3 py-2">{e.data}</td>
                  <td className="px-3 py-2">{e.desc}</td>
                  <td className="px-3 py-2"><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${e.tipo === "Crédito" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>{e.tipo}</span></td>
                  <td className={`px-3 py-2 text-right font-semibold ${e.valor >= 0 ? "text-emerald-600" : "text-red-600"}`}>R$ {Math.abs(e.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
