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
import BancosPage from "./pages/financeiro/BancosPage";
import FornecedoresPage from "./pages/financeiro/FornecedoresPage";
import PlanosClientePage from "./pages/financeiro/PlanosClientePage";
import ContaContabilPage from "./pages/financeiro/ContaContabilPage";
import EventosFolhaPage from "./pages/financeiro/EventosFolhaPage";
import TipoPagamentoPage from "./pages/financeiro/TipoPagamentoPage";
import ContaBancoPage from "./pages/financeiro/ContaBancoPage";
import CalculoFolhaPage from "./pages/financeiro/CalculoFolhaPage";
import FaturasFinPage from "./pages/financeiro/FaturasFinPage";
import ContasReceberPage from "./pages/financeiro/ContasReceberPage";
import ContasPagarPage from "./pages/financeiro/ContasPagarPage";
import ReciboPagRescisaoPage from "./pages/financeiro/ReciboPagRescisaoPage";
import InformesRendimentosPage from "./pages/financeiro/InformesRendimentosPage";
import FolhasAjustadasPage from "./pages/financeiro/FolhasAjustadasPage";
import SaldoBancarioPage from "./pages/financeiro/SaldoBancarioPage";
import MovimentoAnaliticoPage from "./pages/financeiro/MovimentoAnaliticoPage";
import ExtratoBancarioPage from "./pages/financeiro/ExtratoBancarioPage";
import NfseEmissaoPage from "./pages/financeiro/NfseEmissaoPage";

// Relatórios
import RelatoriosIndex from "./pages/relatorios/RelatoriosIndex";
import RelatoriosJAPage from "./pages/relatorios/RelatoriosJAPage";

// Social / Psicóloga
import SocialIndex from "./pages/social/SocialIndex";
import ModelosSocialPage from "./pages/social/ModelosSocialPage";
import JovensAcompanhamentoPage from "./pages/social/JovensAcompanhamentoPage";
import TiposAtendimentoPage from "./pages/social/TiposAtendimentoPage";
import AtendimentosPage from "./pages/social/AtendimentosPage";

// Outros
import OutrosIndex from "./pages/outros/OutrosIndex";
import SeguroPage from "./pages/outros/SeguroPage";
import ImportacoesPage from "./pages/outros/ImportacoesPage";
import ChamadosPage from "./pages/outros/ChamadosPage";
import CrmPage from "./pages/outros/CrmPage";

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
            <Route path="/financeiro/bancos" element={<P><BancosPage /></P>} />
            <Route path="/financeiro/fornecedores" element={<P><FornecedoresPage /></P>} />
            <Route path="/financeiro/planos-cliente" element={<P><PlanosClientePage /></P>} />
            <Route path="/financeiro/conta-contabil" element={<P><ContaContabilPage /></P>} />
            <Route path="/financeiro/eventos-folha" element={<P><EventosFolhaPage /></P>} />
            <Route path="/financeiro/tipo-pagamento" element={<P><TipoPagamentoPage /></P>} />
            <Route path="/financeiro/conta-banco-personalizada" element={<P><ContaBancoPage /></P>} />
            <Route path="/financeiro/calculo-folha" element={<P><CalculoFolhaPage /></P>} />
            <Route path="/financeiro/faturas" element={<P><FaturasFinPage /></P>} />
            <Route path="/financeiro/contas-receber" element={<P><ContasReceberPage /></P>} />
            <Route path="/financeiro/contas-pagar" element={<P><ContasPagarPage /></P>} />
            <Route path="/financeiro/recibo-pagamento-rescisao" element={<P><ReciboPagRescisaoPage /></P>} />
            <Route path="/financeiro/informes-rendimentos" element={<P><InformesRendimentosPage /></P>} />
            <Route path="/financeiro/folhas-ajustadas" element={<P><FolhasAjustadasPage /></P>} />
            <Route path="/financeiro/saldo-bancario" element={<P><SaldoBancarioPage /></P>} />

            {/* Relatórios Financeiros */}
            <Route path="/relatorios-financeiros/movimento-analitico" element={<P><MovimentoAnaliticoPage /></P>} />
            <Route path="/relatorios-financeiros/extrato-bancario" element={<P><ExtratoBancarioPage /></P>} />
            <Route path="/relatorios-financeiros" element={<Navigate to="/relatorios-financeiros/movimento-analitico" replace />} />

            {/* NFS-e */}
            <Route path="/nfse" element={<Navigate to="/nfse/emissao" replace />} />
            <Route path="/nfse/emissao" element={<P><NfseEmissaoPage /></P>} />

            {/* Relatórios */}
            <Route path="/relatorios" element={<P><RelatoriosIndex /></P>} />
            <Route path="/relatorios-jovem-aprendiz" element={<P><RelatoriosJAPage /></P>} />
            <Route path="/relatorios-jovem-aprendiz/especificos" element={<P><RelatoriosJAPage /></P>} />

            {/* Social / Psicóloga */}
            <Route path="/social-psicologa" element={<P><SocialIndex /></P>} />
            <Route path="/social-psicologa/modelos" element={<P><ModelosSocialPage /></P>} />
            <Route path="/social-psicologa/jovens-aprendizes" element={<P><JovensAcompanhamentoPage /></P>} />
            <Route path="/social-psicologa/tipos-atendimento" element={<P><TiposAtendimentoPage /></P>} />
            <Route path="/social-psicologa/atendimentos" element={<P><AtendimentosPage /></P>} />

            {/* Outros */}
            <Route path="/outros" element={<P><OutrosIndex /></P>} />
            <Route path="/outros/seguro" element={<P><SeguroPage /></P>} />
            <Route path="/outros/importacoes" element={<P><ImportacoesPage /></P>} />
            <Route path="/outros/chamados" element={<P><ChamadosPage /></P>} />
            <Route path="/outros/crm" element={<P><CrmPage /></P>} />

            {/* Configurações */}
            <Route path="/configuracoes" element={<P><ConfiguracoesIndex /></P>} />
            <Route path="/settings/alerts" element={<P><AlertSettingsPage /></P>} />
            <Route path="/settings/roles" element={<P><RolesSettingsPage /></P>} />
            <Route path="/settings/system" element={<P><SystemSettingsPage /></P>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
