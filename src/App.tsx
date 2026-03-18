import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Auth
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

// Dashboard
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PlaceholderPage from "./pages/PlaceholderPage";

// Cadastros
import CadastrosIndex from "./pages/cadastros/CadastrosIndex";
import EmpresasPage from "./pages/cadastros/EmpresasPage";
import InstituicoesPage from "./pages/cadastros/InstituicoesPage";
import UsuariosPage from "./pages/cadastros/UsuariosPage";
import CandidatosPage from "./pages/cadastros/CandidatosPage";
import AniversariantesPage from "./pages/cadastros/AniversariantesPage";
import EducadoresPage from "./pages/cadastros/EducadoresPage";
import AssistentesSociaisPage from "./pages/cadastros/AssistentesSociaisPage";

// Vagas
import GestaoVagasPage from "./pages/vagas/GestaoVagasPage";

// Recrutamento
import RecrutamentoIndex from "./pages/recrutamento/RecrutamentoIndex";
import ProcessosSeletivosPage from "./pages/recrutamento/ProcessosSeletivosPage";
import AuditoriaPage from "./pages/recrutamento/AuditoriaPage";
import CadastroProcessosPage from "./pages/recrutamento/CadastroProcessosPage";
import CategoriasProvaPage from "./pages/recrutamento/CategoriasProvaPage";
import ProvasPage from "./pages/recrutamento/ProvasPage";

// Contratos
import ContratosIndex from "./pages/contratos/ContratosIndex";
import ContratoEstagioPage from "./pages/contratos/ContratoEstagioPage";
import AssinaturasDigitaisPage from "./pages/contratos/AssinaturasDigitaisPage";
import ModelosPage from "./pages/contratos/ModelosPage";
import ContratoParceriaPage from "./pages/contratos/ContratoParceriaPage";
import DocumentosObrigatoriosPage from "./pages/contratos/DocumentosObrigatoriosPage";
import FollowUpPage from "./pages/contratos/FollowUpPage";

// Gestão de Estágio
import GestaoEstagioIndex from "./pages/gestao-estagio/GestaoEstagioIndex";
import FrequenciaPage from "./pages/gestao-estagio/FrequenciaPage";
import RecessoPage from "./pages/gestao-estagio/RecessoPage";
import AtividadesPage from "./pages/gestao-estagio/AtividadesPage";
import AlertasEstagioPage from "./pages/gestao-estagio/AlertasEstagioPage";

// Jovem Aprendiz
import JovemAprendizIndex from "./pages/jovem-aprendiz/JovemAprendizIndex";
import ModelosJAPage from "./pages/jovem-aprendiz/ModelosJAPage";
import SalasPage from "./pages/jovem-aprendiz/SalasPage";
import ProgramasJAPage from "./pages/jovem-aprendiz/ProgramasJAPage";
import PlanejamentoTurmasPage from "./pages/jovem-aprendiz/PlanejamentoTurmasPage";
import ContratoJAPage from "./pages/jovem-aprendiz/ContratoJAPage";
import ContratoPreJAPage from "./pages/jovem-aprendiz/ContratoPreJAPage";
import AssinaturasJAPage from "./pages/jovem-aprendiz/AssinaturasJAPage";
import OcorrenciasJAPage from "./pages/jovem-aprendiz/OcorrenciasJAPage";
import FrequenciaJAPage from "./pages/jovem-aprendiz/FrequenciaJAPage";
import FeriadosJAPage from "./pages/jovem-aprendiz/FeriadosJAPage";
import FeriasJAPage from "./pages/jovem-aprendiz/FeriasJAPage";
import GerarFolhaPage from "./pages/jovem-aprendiz/GerarFolhaPage";
import FaturasJAPage from "./pages/jovem-aprendiz/FaturasJAPage";
import ReciboPagamentoPage from "./pages/jovem-aprendiz/ReciboPagamentoPage";
import PerguntasSocioPage from "./pages/jovem-aprendiz/PerguntasSocioPage";
import RegistroSocialPage from "./pages/jovem-aprendiz/RegistroSocialPage";
import CronogramasPage from "./pages/jovem-aprendiz/CronogramasPage";
import TiposModulosPage from "./pages/jovem-aprendiz/TiposModulosPage";
import TiposCursoPage from "./pages/jovem-aprendiz/TiposCursoPage";

// Financeiro
import FinanceiroIndex from "./pages/financeiro/FinanceiroIndex";
import { PlansList, PlansNew, InvoicesList, ReceivableList, PayableList } from "./pages/finance/FinancePages";

// Relatórios
import RelatoriosIndex from "./pages/relatorios/RelatoriosIndex";
import { FinancialReportsPage, ApprenticeReportsPage } from "./pages/reports/ReportsPages";

// Chamados
import { TicketsList, TicketsNew, TicketsDetail } from "./pages/tickets/TicketsPages";

// CRM
import { OpportunitiesList } from "./pages/crm/CrmPages";

// Configurações
import ConfiguracoesIndex from "./pages/configuracoes/ConfiguracoesIndex";
import { AlertSettingsPage, RolesSettingsPage, SystemSettingsPage } from "./pages/settings/SettingsPages";

const queryClient = new QueryClient();

function P({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Home */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<P><Index /></P>} />
            <Route path="/dashboard" element={<P><Index /></P>} />

            {/* Cadastros */}
            <Route path="/cadastros" element={<P><CadastrosIndex /></P>} />
            <Route path="/cadastros/empresas" element={<P><EmpresasPage /></P>} />
            <Route path="/cadastros/instituicoes" element={<P><InstituicoesPage /></P>} />
            <Route path="/cadastros/usuarios" element={<P><UsuariosPage /></P>} />
            <Route path="/cadastros/candidatos" element={<P><CandidatosPage /></P>} />
            <Route path="/cadastros/aniversariantes" element={<P><AniversariantesPage /></P>} />
            <Route path="/cadastros/educadores" element={<P><EducadoresPage /></P>} />
            <Route path="/cadastros/assistentes-sociais" element={<P><AssistentesSociaisPage /></P>} />

            {/* Vagas */}
            <Route path="/vagas" element={<Navigate to="/vagas/gestao" replace />} />
            <Route path="/vagas/gestao" element={<P><GestaoVagasPage /></P>} />

            {/* Recrutamento */}
            <Route path="/recrutamento" element={<P><RecrutamentoIndex /></P>} />
            <Route path="/recrutamento/processos" element={<P><ProcessosSeletivosPage /></P>} />
            <Route path="/recrutamento/auditoria" element={<P><AuditoriaPage /></P>} />
            <Route path="/recrutamento/cadastro-processos" element={<P><CadastroProcessosPage /></P>} />
            <Route path="/recrutamento/categorias-prova" element={<P><CategoriasProvaPage /></P>} />
            <Route path="/recrutamento/provas" element={<P><ProvasPage /></P>} />

            {/* Contratos */}
            <Route path="/contratos" element={<P><ContratosIndex /></P>} />
            <Route path="/contratos/estagio" element={<P><ContratoEstagioPage /></P>} />
            <Route path="/contratos/assinaturas" element={<P><AssinaturasDigitaisPage /></P>} />
            <Route path="/contratos/modelos" element={<P><ModelosPage /></P>} />
            <Route path="/contratos/parceria" element={<P><ContratoParceriaPage /></P>} />
            <Route path="/contratos/documentos-obrigatorios" element={<P><DocumentosObrigatoriosPage /></P>} />
            <Route path="/contratos/follow-up" element={<P><FollowUpPage /></P>} />

            {/* Gestão de Estágio */}
            <Route path="/gestao-estagio" element={<P><GestaoEstagioIndex /></P>} />
            <Route path="/gestao-estagio/frequencia" element={<P><FrequenciaPage /></P>} />
            <Route path="/gestao-estagio/recesso" element={<P><RecessoPage /></P>} />
            <Route path="/gestao-estagio/atividades" element={<P><AtividadesPage /></P>} />
            <Route path="/gestao-estagio/alertas" element={<P><AlertasEstagioPage /></P>} />

            {/* Jovem Aprendiz */}
            <Route path="/jovem-aprendiz" element={<P><JovemAprendizIndex /></P>} />
            <Route path="/jovem-aprendiz/modelos" element={<P><ModelosJAPage /></P>} />
            <Route path="/jovem-aprendiz/salas" element={<P><SalasPage /></P>} />
            <Route path="/jovem-aprendiz/programas" element={<P><ProgramasJAPage /></P>} />
            <Route path="/jovem-aprendiz/planejamento-turmas" element={<P><PlanejamentoTurmasPage /></P>} />
            <Route path="/jovem-aprendiz/contrato-ja" element={<P><ContratoJAPage /></P>} />
            <Route path="/jovem-aprendiz/contrato-pre-ja" element={<P><ContratoPreJAPage /></P>} />
            <Route path="/jovem-aprendiz/assinaturas" element={<P><AssinaturasJAPage /></P>} />
            <Route path="/jovem-aprendiz/ocorrencias" element={<P><OcorrenciasJAPage /></P>} />
            <Route path="/jovem-aprendiz/frequencia" element={<P><FrequenciaJAPage /></P>} />
            <Route path="/jovem-aprendiz/feriados" element={<P><FeriadosJAPage /></P>} />
            <Route path="/jovem-aprendiz/ferias" element={<P><FeriasJAPage /></P>} />
            <Route path="/jovem-aprendiz/gerar-folha" element={<P><GerarFolhaPage /></P>} />
            <Route path="/jovem-aprendiz/faturas" element={<P><FaturasJAPage /></P>} />
            <Route path="/jovem-aprendiz/recibo-pagamento" element={<P><ReciboPagamentoPage /></P>} />
            <Route path="/jovem-aprendiz/perguntas-socio-economicas" element={<P><PerguntasSocioPage /></P>} />
            <Route path="/jovem-aprendiz/registro-social" element={<P><RegistroSocialPage /></P>} />
            <Route path="/jovem-aprendiz/cronogramas" element={<P><CronogramasPage /></P>} />
            <Route path="/jovem-aprendiz/tipos-modulos" element={<P><TiposModulosPage /></P>} />
            <Route path="/jovem-aprendiz/tipos-curso" element={<P><TiposCursoPage /></P>} />

            {/* Financeiro */}
            <Route path="/financeiro" element={<P><FinanceiroIndex /></P>} />
            <Route path="/financeiro/*" element={<P><PlaceholderPage /></P>} />
            <Route path="/plans" element={<P><PlansList /></P>} />
            <Route path="/plans/new" element={<P><PlansNew /></P>} />
            <Route path="/invoices" element={<P><InvoicesList /></P>} />
            <Route path="/finance/receivable" element={<P><ReceivableList /></P>} />
            <Route path="/finance/payable" element={<P><PayableList /></P>} />

            {/* Relatórios */}
            <Route path="/relatorios" element={<P><RelatoriosIndex /></P>} />
            <Route path="/relatorios-financeiros" element={<P><FinancialReportsPage /></P>} />
            <Route path="/relatorios-financeiros/*" element={<P><PlaceholderPage /></P>} />
            <Route path="/relatorios-jovem-aprendiz" element={<P><ApprenticeReportsPage /></P>} />
            <Route path="/relatorios-jovem-aprendiz/*" element={<P><PlaceholderPage /></P>} />
            <Route path="/reports/financial" element={<P><FinancialReportsPage /></P>} />
            <Route path="/reports/apprenticeship" element={<P><ApprenticeReportsPage /></P>} />

            {/* NFS-e */}
            <Route path="/nfse" element={<P><PlaceholderPage /></P>} />
            <Route path="/nfse/*" element={<P><PlaceholderPage /></P>} />

            {/* Social / Psicóloga */}
            <Route path="/social-psicologa" element={<P><PlaceholderPage /></P>} />
            <Route path="/social-psicologa/*" element={<P><PlaceholderPage /></P>} />

            {/* Chamados */}
            <Route path="/chamados" element={<P><TicketsList /></P>} />
            <Route path="/tickets" element={<P><TicketsList /></P>} />
            <Route path="/tickets/new" element={<P><TicketsNew /></P>} />
            <Route path="/tickets/:id" element={<P><TicketsDetail /></P>} />

            {/* CRM */}
            <Route path="/crm" element={<P><OpportunitiesList /></P>} />
            <Route path="/crm/*" element={<P><PlaceholderPage /></P>} />

            {/* Configurações */}
            <Route path="/configuracoes" element={<P><ConfiguracoesIndex /></P>} />
            <Route path="/configuracoes/*" element={<P><PlaceholderPage /></P>} />
            <Route path="/settings/alerts" element={<P><AlertSettingsPage /></P>} />
            <Route path="/settings/roles" element={<P><RolesSettingsPage /></P>} />
            <Route path="/settings/system" element={<P><SystemSettingsPage /></P>} />

            {/* Outros */}
            <Route path="/outros" element={<P><PlaceholderPage /></P>} />
            <Route path="/outros/*" element={<P><PlaceholderPage /></P>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
