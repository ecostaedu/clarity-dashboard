import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Dashboard
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

// Cadastros
import CadastrosIndex from "./pages/cadastros/CadastrosIndex";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Dashboard */}
          <Route path="/" element={<Index />} />

          {/* Cadastros */}
          <Route path="/cadastros" element={<CadastrosIndex />} />
          <Route path="/companies" element={<CompaniesList />} />
          <Route path="/companies/new" element={<CompaniesNew />} />
          <Route path="/companies/:id" element={<CompaniesDetail />} />
          <Route path="/companies/:id/edit" element={<CompaniesEdit />} />
          <Route path="/candidates" element={<CandidatesList />} />
          <Route path="/candidates/new" element={<CandidatesNew />} />
          <Route path="/candidates/:id" element={<CandidatesDetail />} />
          <Route path="/candidates/:id/edit" element={<CandidatesEdit />} />
          <Route path="/institutions" element={<InstitutionsList />} />
          <Route path="/institutions/new" element={<InstitutionsNew />} />
          <Route path="/institutions/:id" element={<InstitutionsDetail />} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/users/new" element={<UsersNew />} />
          <Route path="/users/:id" element={<UsersDetail />} />
          <Route path="/educators" element={<EducatorsList />} />
          <Route path="/educators/new" element={<EducatorsNew />} />
          <Route path="/educators/:id" element={<EducatorsDetail />} />

          {/* Recrutamento */}
          <Route path="/recrutamento" element={<RecrutamentoIndex />} />
          <Route path="/jobs" element={<JobsList />} />
          <Route path="/jobs/new" element={<JobsNew />} />
          <Route path="/jobs/:id" element={<JobsDetail />} />
          <Route path="/processes" element={<ProcessesList />} />
          <Route path="/processes/new" element={<ProcessesNew />} />
          <Route path="/processes/:id" element={<ProcessesDetail />} />
          <Route path="/tests" element={<TestsList />} />
          <Route path="/tests/new" element={<TestsNew />} />
          <Route path="/tests/:id" element={<TestsDetail />} />

          {/* Contratos */}
          <Route path="/contratos" element={<ContractsList />} />
          <Route path="/contracts" element={<ContractsList />} />
          <Route path="/contracts/new" element={<ContractsNew />} />
          <Route path="/contracts/:id" element={<ContractsDetail />} />
          <Route path="/signatures" element={<SignaturesList />} />

          {/* Gestão de Estágio */}
          <Route path="/estagios" element={<EstagiosIndex />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/reports/activities" element={<ActivityReportsPage />} />

          {/* Jovem Aprendiz */}
          <Route path="/jovem-aprendiz" element={<JovemAprendizIndex />} />
          <Route path="/programs" element={<ProgramsList />} />
          <Route path="/programs/new" element={<ProgramsNew />} />
          <Route path="/classes" element={<ClassesList />} />
          <Route path="/classes/new" element={<ClassesNew />} />
          <Route path="/occurrences" element={<OccurrencesList />} />
          <Route path="/holidays" element={<HolidaysList />} />
          <Route path="/vacations" element={<VacationsList />} />

          {/* Financeiro */}
          <Route path="/financeiro" element={<FinanceiroIndex />} />
          <Route path="/plans" element={<PlansList />} />
          <Route path="/plans/new" element={<PlansNew />} />
          <Route path="/invoices" element={<InvoicesList />} />
          <Route path="/finance/receivable" element={<ReceivableList />} />
          <Route path="/finance/payable" element={<PayableList />} />

          {/* Relatórios */}
          <Route path="/relatorios" element={<RelatoriosIndex />} />
          <Route path="/reports/financial" element={<FinancialReportsPage />} />
          <Route path="/reports/apprenticeship" element={<ApprenticeReportsPage />} />

          {/* Chamados */}
          <Route path="/chamados" element={<TicketsList />} />
          <Route path="/tickets" element={<TicketsList />} />
          <Route path="/tickets/new" element={<TicketsNew />} />
          <Route path="/tickets/:id" element={<TicketsDetail />} />

          {/* CRM */}
          <Route path="/crm" element={<OpportunitiesList />} />
          <Route path="/crm/opportunities" element={<OpportunitiesList />} />

          {/* Configurações */}
          <Route path="/configuracoes" element={<ConfiguracoesIndex />} />
          <Route path="/settings/alerts" element={<AlertSettingsPage />} />
          <Route path="/settings/roles" element={<RolesSettingsPage />} />
          <Route path="/settings/system" element={<SystemSettingsPage />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
