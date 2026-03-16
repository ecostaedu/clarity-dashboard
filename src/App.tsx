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
import { CompaniesList, CompaniesNew, CompaniesDetail, CompaniesEdit } from "./pages/companies/CompaniesPages";
import { CandidatesList, CandidatesNew, CandidatesDetail, CandidatesEdit } from "./pages/candidates/CandidatesPages";
import { InstitutionsList, InstitutionsNew, InstitutionsDetail } from "./pages/institutions/InstitutionsPages";
import { UsersList, UsersNew, UsersDetail } from "./pages/users/UsersPages";
import { EducatorsList, EducatorsNew, EducatorsDetail } from "./pages/educators/EducatorsPages";

// Recrutamento
import RecrutamentoIndex from "./pages/recrutamento/RecrutamentoIndex";
import { JobsList, JobsNew, JobsDetail } from "./pages/recruitment/RecruitmentPages";
import { ProcessesList, ProcessesNew, ProcessesDetail } from "./pages/recruitment/RecruitmentPages";
import { TestsList, TestsNew, TestsDetail } from "./pages/recruitment/RecruitmentPages";

// Contratos
import { ContractsList, ContractsNew, ContractsDetail, SignaturesList } from "./pages/contracts/ContractsPages";

// Estágio
import EstagiosIndex from "./pages/estagios/EstagiosIndex";
import { AttendancePage, ActivityReportsPage } from "./pages/internship/InternshipPages";

// Jovem Aprendiz
import JovemAprendizIndex from "./pages/jovem-aprendiz/JovemAprendizIndex";
import { ProgramsList, ProgramsNew, ClassesList, ClassesNew, OccurrencesList, HolidaysList, VacationsList } from "./pages/apprentice/ApprenticePages";

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
            {/* Auth (public) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Home & Dashboard */}
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
            <Route path="/companies/:id" element={<P><CompaniesDetail /></P>} />
            <Route path="/companies/:id/edit" element={<P><CompaniesEdit /></P>} />
            <Route path="/candidates" element={<P><CandidatesList /></P>} />
            <Route path="/candidates/new" element={<P><CandidatesNew /></P>} />
            <Route path="/candidates/:id" element={<P><CandidatesDetail /></P>} />
            <Route path="/candidates/:id/edit" element={<P><CandidatesEdit /></P>} />
            <Route path="/institutions" element={<P><InstitutionsList /></P>} />
            <Route path="/institutions/new" element={<P><InstitutionsNew /></P>} />
            <Route path="/institutions/:id" element={<P><InstitutionsDetail /></P>} />
            <Route path="/users" element={<P><UsersList /></P>} />
            <Route path="/users/new" element={<P><UsersNew /></P>} />
            <Route path="/users/:id" element={<P><UsersDetail /></P>} />
            <Route path="/educators" element={<P><EducatorsList /></P>} />
            <Route path="/educators/new" element={<P><EducatorsNew /></P>} />
            <Route path="/educators/:id" element={<P><EducatorsDetail /></P>} />

            {/* Vagas */}
            <Route path="/vagas" element={<P><PlaceholderPage /></P>} />
            <Route path="/vagas/*" element={<P><PlaceholderPage /></P>} />

            {/* Recrutamento */}
            <Route path="/recrutamento" element={<P><RecrutamentoIndex /></P>} />
            <Route path="/recrutamento/*" element={<P><PlaceholderPage /></P>} />
            <Route path="/jobs" element={<P><JobsList /></P>} />
            <Route path="/jobs/new" element={<P><JobsNew /></P>} />
            <Route path="/jobs/:id" element={<P><JobsDetail /></P>} />
            <Route path="/processes" element={<P><ProcessesList /></P>} />
            <Route path="/processes/new" element={<P><ProcessesNew /></P>} />
            <Route path="/processes/:id" element={<P><ProcessesDetail /></P>} />
            <Route path="/tests" element={<P><TestsList /></P>} />
            <Route path="/tests/new" element={<P><TestsNew /></P>} />
            <Route path="/tests/:id" element={<P><TestsDetail /></P>} />

            {/* Contratos */}
            <Route path="/contratos" element={<P><ContractsList /></P>} />
            <Route path="/contratos/*" element={<P><PlaceholderPage /></P>} />
            <Route path="/contracts" element={<P><ContractsList /></P>} />
            <Route path="/contracts/new" element={<P><ContractsNew /></P>} />
            <Route path="/contracts/:id" element={<P><ContractsDetail /></P>} />
            <Route path="/signatures" element={<P><SignaturesList /></P>} />

            {/* Gestão de Estágio */}
            <Route path="/gestao-estagio" element={<P><EstagiosIndex /></P>} />
            <Route path="/gestao-estagio/*" element={<P><PlaceholderPage /></P>} />
            <Route path="/attendance" element={<P><AttendancePage /></P>} />
            <Route path="/reports/activities" element={<P><ActivityReportsPage /></P>} />

            {/* Jovem Aprendiz */}
            <Route path="/jovem-aprendiz" element={<P><JovemAprendizIndex /></P>} />
            <Route path="/jovem-aprendiz/*" element={<P><PlaceholderPage /></P>} />
            <Route path="/programs" element={<P><ProgramsList /></P>} />
            <Route path="/programs/new" element={<P><ProgramsNew /></P>} />
            <Route path="/classes" element={<P><ClassesList /></P>} />
            <Route path="/classes/new" element={<P><ClassesNew /></P>} />
            <Route path="/occurrences" element={<P><OccurrencesList /></P>} />
            <Route path="/holidays" element={<P><HolidaysList /></P>} />
            <Route path="/vacations" element={<P><VacationsList /></P>} />

            {/* Financeiro */}
            <Route path="/financeiro" element={<P><FinanceiroIndex /></P>} />
            <Route path="/financeiro/*" element={<P><PlaceholderPage /></P>} />
            <Route path="/plans" element={<P><PlansList /></P>} />
            <Route path="/plans/new" element={<P><PlansNew /></P>} />
            <Route path="/invoices" element={<P><InvoicesList /></P>} />
            <Route path="/finance/receivable" element={<P><ReceivableList /></P>} />
            <Route path="/finance/payable" element={<P><PayableList /></P>} />

            {/* Relatórios Financeiros */}
            <Route path="/relatorios-financeiros" element={<P><FinancialReportsPage /></P>} />
            <Route path="/relatorios-financeiros/*" element={<P><PlaceholderPage /></P>} />

            {/* NFS-e */}
            <Route path="/nfse" element={<P><PlaceholderPage /></P>} />
            <Route path="/nfse/*" element={<P><PlaceholderPage /></P>} />

            {/* Relatórios Jovem Aprendiz */}
            <Route path="/relatorios-jovem-aprendiz" element={<P><ApprenticeReportsPage /></P>} />
            <Route path="/relatorios-jovem-aprendiz/*" element={<P><PlaceholderPage /></P>} />

            {/* Social / Psicóloga */}
            <Route path="/social-psicologa" element={<P><PlaceholderPage /></P>} />
            <Route path="/social-psicologa/*" element={<P><PlaceholderPage /></P>} />

            {/* Relatórios (legacy) */}
            <Route path="/relatorios" element={<P><RelatoriosIndex /></P>} />
            <Route path="/reports/financial" element={<P><FinancialReportsPage /></P>} />
            <Route path="/reports/apprenticeship" element={<P><ApprenticeReportsPage /></P>} />

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

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
