import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { DollarSign, Receipt, ArrowDownCircle, ArrowUpCircle } from "lucide-react";

const sections = [
  { title: "Planos", desc: "Planos de clientes", icon: DollarSign, route: "/plans" },
  { title: "Faturas", desc: "Faturamento e cobranças", icon: Receipt, route: "/invoices" },
  { title: "Contas a Receber", desc: "Recebimentos pendentes", icon: ArrowDownCircle, route: "/finance/receivable" },
  { title: "Contas a Pagar", desc: "Pagamentos pendentes", icon: ArrowUpCircle, route: "/finance/payable" },
];

export default function FinanceiroIndex() {
  const navigate = useNavigate();
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Financeiro" }]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Financeiro</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie planos, faturas e contas.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sections.map((s) => (
            <button key={s.title} onClick={() => navigate(s.route)} className="p-6 rounded-xl bg-card shadow-card hover:shadow-card-hover transition-all duration-150 text-left group">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors"><s.icon className="h-5 w-5 text-primary" /></div>
                <div><p className="text-sm font-semibold text-foreground">{s.title}</p><p className="text-xs text-muted-foreground">{s.desc}</p></div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
