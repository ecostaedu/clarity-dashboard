import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { DollarSign, Receipt, ArrowDownCircle, ArrowUpCircle, Building2, Truck, CreditCard, Calculator, FileText, Landmark, BookOpen, BarChart3, Wallet, FileBarChart, Scale } from "lucide-react";

const sections = [
  { title: "Bancos", desc: "Cadastro de bancos", icon: Landmark, route: "/financeiro/bancos" },
  { title: "Fornecedores", desc: "Gestão de fornecedores", icon: Truck, route: "/financeiro/fornecedores" },
  { title: "Planos p/ Cliente", desc: "Planos de serviço", icon: DollarSign, route: "/financeiro/planos-cliente" },
  { title: "Conta Contábil", desc: "Plano de contas", icon: BookOpen, route: "/financeiro/conta-contabil" },
  { title: "Eventos da Folha", desc: "Proventos e descontos", icon: FileText, route: "/financeiro/eventos-folha" },
  { title: "Tipo de Pagamento", desc: "Formas de pagamento", icon: CreditCard, route: "/financeiro/tipo-pagamento" },
  { title: "Conta Banco Personalizada", desc: "Contas bancárias", icon: Building2, route: "/financeiro/conta-banco-personalizada" },
  { title: "Cálculo da Folha", desc: "Processar folha", icon: Calculator, route: "/financeiro/calculo-folha" },
  { title: "Faturas", desc: "Faturamento", icon: Receipt, route: "/financeiro/faturas" },
  { title: "Contas a Receber", desc: "Recebimentos", icon: ArrowDownCircle, route: "/financeiro/contas-receber" },
  { title: "Contas a Pagar", desc: "Pagamentos", icon: ArrowUpCircle, route: "/financeiro/contas-pagar" },
  { title: "Recibo Pagamento/Rescisão", desc: "Recibos", icon: FileBarChart, route: "/financeiro/recibo-pagamento-rescisao" },
  { title: "Informes de Rendimentos", desc: "Declarações anuais", icon: Scale, route: "/financeiro/informes-rendimentos" },
  { title: "Folhas Ajustadas", desc: "Ajustes de folha", icon: BarChart3, route: "/financeiro/folhas-ajustadas" },
  { title: "Saldo Bancário", desc: "Saldos e extratos", icon: Wallet, route: "/financeiro/saldo-bancario" },
];

export default function FinanceiroIndex() {
  const navigate = useNavigate();
  return (
    <DashboardLayout breadcrumbs={[{ label: "Home" }, { label: "Financeiro" }]}>
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-foreground tracking-tight">Financeiro</h1><p className="text-sm text-muted-foreground mt-1">Gerencie bancos, fornecedores, folha, faturas e contas.</p></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((s) => (
            <button key={s.title} onClick={() => navigate(s.route)} className="p-5 rounded-xl bg-card shadow-card hover:shadow-card-hover transition-all duration-150 text-left group">
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
