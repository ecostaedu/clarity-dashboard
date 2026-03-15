
-- =============================================
-- CONNECTRH — MULTI-TENANT SAAS DATABASE SCHEMA
-- =============================================

-- ENUMS
CREATE TYPE public.app_role AS ENUM ('admin', 'hr_manager', 'company_user', 'educator', 'finance');
CREATE TYPE public.entity_status AS ENUM ('active', 'inactive', 'pending', 'suspended');
CREATE TYPE public.contract_type AS ENUM ('internship', 'apprentice', 'clt', 'pj');
CREATE TYPE public.contract_status AS ENUM ('draft', 'active', 'expired', 'terminated', 'renewed');
CREATE TYPE public.signature_status AS ENUM ('pending', 'signed', 'rejected', 'expired');
CREATE TYPE public.invoice_status AS ENUM ('pending', 'paid', 'canceled', 'overdue');
CREATE TYPE public.ticket_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE public.ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE public.billing_cycle AS ENUM ('monthly', 'quarterly', 'yearly');
CREATE TYPE public.opportunity_stage AS ENUM ('lead', 'proposal', 'negotiation', 'closed_won', 'closed_lost');
CREATE TYPE public.attendance_status AS ENUM ('present', 'absent', 'justified', 'late');
CREATE TYPE public.occurrence_type AS ENUM ('warning', 'suspension', 'praise', 'observation');

-- TIMESTAMP TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- =============================================
-- 1. TENANTS
-- =============================================
CREATE TABLE public.tenants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  cnpj TEXT UNIQUE,
  plan_id UUID,
  status entity_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_tenants_slug ON public.tenants(slug);
CREATE INDEX idx_tenants_status ON public.tenants(status);

-- =============================================
-- 2. PROFILES (linked to auth.users)
-- =============================================
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  status entity_status NOT NULL DEFAULT 'active',
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_profiles_tenant ON public.profiles(tenant_id);
CREATE INDEX idx_profiles_user ON public.profiles(user_id);

-- =============================================
-- 3. ROLES & PERMISSIONS (separate table per security rules)
-- =============================================
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE(user_id, tenant_id, role)
);
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_tenant ON public.user_roles(tenant_id);

CREATE TABLE public.permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE public.role_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role app_role NOT NULL,
  permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(role, permission_id)
);

-- =============================================
-- 4. SECURITY DEFINER FUNCTIONS
-- =============================================
CREATE OR REPLACE FUNCTION public.get_user_tenant_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tenant_id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- =============================================
-- 5. COMPANIES (partner companies)
-- =============================================
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  legal_name TEXT NOT NULL,
  trade_name TEXT,
  cnpj TEXT,
  industry TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  billing_day INTEGER DEFAULT 10,
  status entity_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_companies_tenant ON public.companies(tenant_id);
CREATE INDEX idx_companies_status ON public.companies(status);

-- =============================================
-- 6. INSTITUTIONS
-- =============================================
CREATE TABLE public.institutions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  cnpj TEXT,
  address TEXT,
  contact_email TEXT,
  phone TEXT,
  status entity_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_institutions_tenant ON public.institutions(tenant_id);

-- =============================================
-- 7. EDUCATORS
-- =============================================
CREATE TABLE public.educators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  specialty TEXT,
  can_register_multiple_attendance BOOLEAN DEFAULT false,
  blocked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_educators_tenant ON public.educators(tenant_id);

-- =============================================
-- 8. CANDIDATES
-- =============================================
CREATE TABLE public.candidates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  cpf TEXT,
  email TEXT,
  phone TEXT,
  birth_date DATE,
  education_level TEXT,
  resume_url TEXT,
  status entity_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_candidates_tenant ON public.candidates(tenant_id);
CREATE INDEX idx_candidates_status ON public.candidates(status);

CREATE TABLE public.candidate_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  candidate_id UUID REFERENCES public.candidates(id) ON DELETE CASCADE NOT NULL,
  document_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_candidate_docs_tenant ON public.candidate_documents(tenant_id);

-- =============================================
-- 9. RECRUITMENT
-- =============================================
CREATE TABLE public.job_openings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  job_type TEXT,
  vacancies INTEGER DEFAULT 1,
  description TEXT,
  status entity_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_job_openings_tenant ON public.job_openings(tenant_id);

CREATE TABLE public.selection_processes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  job_opening_id UUID REFERENCES public.job_openings(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  status entity_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_selection_processes_tenant ON public.selection_processes(tenant_id);

CREATE TABLE public.process_stages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  process_id UUID REFERENCES public.selection_processes(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  order_position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_process_stages_tenant ON public.process_stages(tenant_id);

CREATE TABLE public.candidate_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  candidate_id UUID REFERENCES public.candidates(id) ON DELETE CASCADE NOT NULL,
  process_id UUID REFERENCES public.selection_processes(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'applied',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_candidate_applications_tenant ON public.candidate_applications(tenant_id);

CREATE TABLE public.tests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  category TEXT,
  duration_minutes INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_tests_tenant ON public.tests(tenant_id);

CREATE TABLE public.test_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  test_id UUID REFERENCES public.tests(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'multiple_choice',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_test_questions_tenant ON public.test_questions(tenant_id);

-- =============================================
-- 10. CONTRACTS
-- =============================================
CREATE TABLE public.contracts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  candidate_id UUID REFERENCES public.candidates(id) ON DELETE SET NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  contract_type contract_type NOT NULL DEFAULT 'internship',
  start_date DATE,
  end_date DATE,
  stipend NUMERIC(10,2),
  status contract_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_contracts_tenant ON public.contracts(tenant_id);
CREATE INDEX idx_contracts_status ON public.contracts(status);

CREATE TABLE public.contract_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  contract_id UUID REFERENCES public.contracts(id) ON DELETE CASCADE NOT NULL,
  document_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_contract_docs_tenant ON public.contract_documents(tenant_id);

CREATE TABLE public.digital_signatures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  contract_id UUID REFERENCES public.contracts(id) ON DELETE CASCADE NOT NULL,
  document_url TEXT,
  status signature_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_digital_signatures_tenant ON public.digital_signatures(tenant_id);

CREATE TABLE public.signature_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  signature_id UUID REFERENCES public.digital_signatures(id) ON DELETE CASCADE NOT NULL,
  signer_name TEXT NOT NULL,
  signer_email TEXT NOT NULL,
  signed_at TIMESTAMPTZ,
  status signature_status NOT NULL DEFAULT 'pending'
);
CREATE INDEX idx_signature_participants_tenant ON public.signature_participants(tenant_id);

-- =============================================
-- 11. APPRENTICESHIP PROGRAMS
-- =============================================
CREATE TABLE public.programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  program_number TEXT,
  name TEXT NOT NULL,
  total_hours INTEGER,
  city TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_programs_tenant ON public.programs(tenant_id);

CREATE TABLE public.classes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE NOT NULL,
  room TEXT,
  schedule TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_classes_tenant ON public.classes(tenant_id);

CREATE TABLE public.apprentices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  candidate_id UUID REFERENCES public.candidates(id) ON DELETE SET NULL,
  program_id UUID REFERENCES public.programs(id) ON DELETE SET NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  status entity_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_apprentices_tenant ON public.apprentices(tenant_id);

CREATE TABLE public.attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  apprentice_id UUID REFERENCES public.apprentices(id) ON DELETE CASCADE NOT NULL,
  attendance_date DATE NOT NULL,
  hours NUMERIC(4,2),
  status attendance_status NOT NULL DEFAULT 'present',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_attendance_tenant ON public.attendance(tenant_id);

CREATE TABLE public.occurrences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  apprentice_id UUID REFERENCES public.apprentices(id) ON DELETE CASCADE NOT NULL,
  type occurrence_type NOT NULL DEFAULT 'observation',
  description TEXT,
  occurrence_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_occurrences_tenant ON public.occurrences(tenant_id);

CREATE TABLE public.holidays (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  holiday_date DATE NOT NULL,
  city TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_holidays_tenant ON public.holidays(tenant_id);

CREATE TABLE public.vacations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  apprentice_id UUID REFERENCES public.apprentices(id) ON DELETE CASCADE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_vacations_tenant ON public.vacations(tenant_id);

-- =============================================
-- 12. FINANCE
-- =============================================
CREATE TABLE public.plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  billing_cycle billing_cycle NOT NULL DEFAULT 'monthly',
  features JSONB DEFAULT '[]',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Link tenants.plan_id to plans
ALTER TABLE public.tenants ADD CONSTRAINT fk_tenants_plan FOREIGN KEY (plan_id) REFERENCES public.plans(id) ON DELETE SET NULL;

CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  billing_period TEXT,
  due_date DATE,
  status invoice_status NOT NULL DEFAULT 'pending',
  total_value NUMERIC(10,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_invoices_tenant ON public.invoices(tenant_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);

CREATE TABLE public.accounts_receivable (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  amount NUMERIC(10,2) NOT NULL,
  due_date DATE,
  status invoice_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_accounts_receivable_tenant ON public.accounts_receivable(tenant_id);

CREATE TABLE public.accounts_payable (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  supplier TEXT,
  amount NUMERIC(10,2) NOT NULL,
  due_date DATE,
  status invoice_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_accounts_payable_tenant ON public.accounts_payable(tenant_id);

-- =============================================
-- 13. CRM
-- =============================================
CREATE TABLE public.opportunities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  stage opportunity_stage NOT NULL DEFAULT 'lead',
  value NUMERIC(12,2),
  responsible_user UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_opportunities_tenant ON public.opportunities(tenant_id);

-- =============================================
-- 14. SUPPORT TICKETS
-- =============================================
CREATE TABLE public.tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority ticket_priority NOT NULL DEFAULT 'medium',
  status ticket_status NOT NULL DEFAULT 'open',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_tickets_tenant ON public.tickets(tenant_id);
CREATE INDEX idx_tickets_status ON public.tickets(status);

CREATE TABLE public.ticket_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_ticket_messages_tenant ON public.ticket_messages(tenant_id);

-- =============================================
-- 15. AUDIT LOGS
-- =============================================
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_audit_logs_tenant ON public.audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs(entity, entity_id);

-- =============================================
-- 16. SYSTEM NOTIFICATIONS
-- =============================================
CREATE TABLE public.system_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  read_status BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_notifications_tenant ON public.system_notifications(tenant_id);
CREATE INDEX idx_notifications_user ON public.system_notifications(user_id);

-- =============================================
-- 17. FEATURE FLAGS
-- =============================================
CREATE TABLE public.feature_flags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  enabled_by_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.tenant_feature_flags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  feature_flag_id UUID REFERENCES public.feature_flags(id) ON DELETE CASCADE NOT NULL,
  enabled BOOLEAN DEFAULT true,
  UNIQUE(tenant_id, feature_flag_id)
);

-- =============================================
-- 18. USAGE METRICS
-- =============================================
CREATE TABLE public.usage_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value INTEGER NOT NULL DEFAULT 0,
  period TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_usage_metrics_tenant ON public.usage_metrics(tenant_id);

-- =============================================
-- 19. ACTIVITY REPORTS (Internship)
-- =============================================
CREATE TABLE public.activity_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  apprentice_id UUID REFERENCES public.apprentices(id) ON DELETE CASCADE NOT NULL,
  month TEXT NOT NULL,
  report TEXT,
  supervisor TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_activity_reports_tenant ON public.activity_reports(tenant_id);

-- =============================================
-- UPDATE TRIGGERS
-- =============================================
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON public.tenants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_institutions_updated_at BEFORE UPDATE ON public.institutions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_educators_updated_at BEFORE UPDATE ON public.educators FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON public.candidates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_job_openings_updated_at BEFORE UPDATE ON public.job_openings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_selection_processes_updated_at BEFORE UPDATE ON public.selection_processes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tests_updated_at BEFORE UPDATE ON public.tests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON public.contracts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_digital_signatures_updated_at BEFORE UPDATE ON public.digital_signatures FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON public.programs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON public.classes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_apprentices_updated_at BEFORE UPDATE ON public.apprentices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON public.plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_accounts_receivable_updated_at BEFORE UPDATE ON public.accounts_receivable FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_accounts_payable_updated_at BEFORE UPDATE ON public.accounts_payable FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON public.opportunities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON public.tickets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_activity_reports_updated_at BEFORE UPDATE ON public.activity_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- 20. ROW LEVEL SECURITY
-- =============================================

-- TENANTS: only members can see their tenant
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own tenant" ON public.tenants FOR SELECT TO authenticated USING (id = public.get_user_tenant_id());

-- PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view profiles in tenant" ON public.profiles FOR SELECT TO authenticated USING (tenant_id = public.get_user_tenant_id());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- USER_ROLES
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view roles in tenant" ON public.user_roles FOR SELECT TO authenticated USING (tenant_id = public.get_user_tenant_id());
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- MACRO: tenant-isolated RLS for all operational tables
-- Companies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant isolation" ON public.companies FOR ALL TO authenticated USING (tenant_id = public.get_user_tenant_id()) WITH CHECK (tenant_id = public.get_user_tenant_id());

-- Institutions
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant isolation" ON public.institutions FOR ALL TO authenticated USING (tenant_id = public.get_user_tenant_id()) WITH CHECK (tenant_id = public.get_user_tenant_id());

-- Educators
ALTER TABLE public.educators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant isolation" ON public.educators FOR ALL TO authenticated USING (tenant_id = public.get_user_tenant_id()) WITH CHECK (tenant_id = public.get_user_tenant_id());

-- Candidates
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant isolation" ON public.candidates FOR ALL TO authenticated USING (tenant_id = public.get_user_tenant_id()) WITH CHECK (tenant_id = public.get_user_tenant_id());

-- Candidate Documents
ALTER TABLE public.candidate_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant isolation" ON public.candidate_documents FOR ALL TO authenticated USING (tenant_id = public.get_user_tenant_id()) WITH CHECK (tenant_id = public.get_user_tenant_id());

-- Job Openings
ALTER TABLE public.job_openings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant isolation" ON public.job_openings FOR ALL TO authenticated USING (tenant_id = public.get_user_tenant_id()) WITH CHECK (tenant_id = public.get_user_tenant_id());

-- Selection Processes
ALTER TABLE public.selection_processes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant isolation" ON public.selection_processes FOR ALL TO authenticated USING (tenant_id = public.get_user_tenant_id()) WITH CHECK (tenant_id = public.get_user_tenant_id());

-- Process Stages
ALTER TABLE public.process_stages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant isolation" ON public.process_stages FOR ALL TO authenticated USING (tenant_id = public.get_user_tenant_id()) WITH CHECK (tenant_id = public.get_user_tenant_id());

-- Candidate Applications
ALTER TABLE public.candidate_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant isolation" ON public.candidate_applications FOR ALL TO authenticated USING (tenant_id = public.get_user_tenant_id()) WITH CHECK (tenant_id = public.get_user_tenant_id());

-- Tests
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant isolation" ON public.tests FOR ALL TO authenticated USING (tenant_id = public.get_user_tenant_id()) WITH CHECK (tenant_id = public.get_user_tenant_id());

-- Test Questions
ALTER TABLE public.test_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant isolation" ON public.test_questions FOR ALL TO authenticated USING (tenant_id = public.get_user_tenant_id()) WITH CHECK (tenant_id = public.get_user_tenant_id());

-- Contracts
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant isolation" ON public.contracts FOR ALL TO authenticated USING (tenant_id = public.get_user_tenant_id()) WITH CHECK (tenant_id = public.get_user_tenant_id());

-- Contract Documents
ALTER TABLE public.contract_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant isolation" ON public.contract_documents FOR ALL TO authenticated USING (tenant_id = public.get_user_tenant_id()) WITH CHECK (tenant_id = public.get_user_tenant_id());

-- Digital Signatures
ALTER TABLE public.digital_signatures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant isolation" ON public.digital_signatures FOR ALL TO authenticated USING (tenant_id = public.get_user_tenant_id()) WITH CHECK (tenant_id = public.get_user_tenant_id());

-- Signature Participants
ALTER TABLE public.signature_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant isolation" ON public.signature_participants FOR ALL TO authenticated USING (tenant_id = public.get_user_tenant_id()) WITH CHECK (tenant_id = public.get_user_tenant_id());

-- Programs
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant isolation" ON public.programs FOR ALL TO authenticated USING (tenant_id = public.get_user_tenant_id()) WITH CHECK (tenant_id = public.get_user_tenant_id());

-- Classes
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant isolation" ON public.classes FOR ALL TO authenticated USING (tenant_id = public.get_user_tenant_id()) WITH CHECK (tenant_id = public.get_user_tenant_id());

-- Apprentices
ALTER TABLE public.apprentices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant isolation" ON public.apprentices FOR ALL TO authenticated USING (tenant_id = public.get_user_tenant_id()) WITH CHECK (tenant_id = public.get_user_tenant_id());

-- Attendance
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant isolation" ON public.attendance FOR ALL TO authenticated USING (tenant_id = public.get_user_tenant_id()) WITH CHECK (tenant_id = public.get_user_tenant_id());

-- Occurrences
ALTER TABLE public.occurrences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant isolation" ON public.occurrences FOR ALL TO authenticated USING (tenant_id = public.get_user_tenant_id()) WITH CHECK (tenant_id = public.get_user_tenant_id());

-- Holidays
ALTER TABLE public.holidays ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant isolation" ON public.holidays FOR ALL TO authenticated USING (tenant_id = public.get_user_tenant_id()) WITH CHECK (tenant_id = public.get_user_tenant_id());

-- Vacations
ALTER TABLE public.vacations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant isolation" ON public.vacations FOR ALL TO authenticated USING (tenant_id = public.get_user_tenant_id()) WITH CHECK (tenant_id = public.get_user_tenant_id());

-- Plans (global, no tenant isolation needed - read only for all)
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Plans are viewable by all" ON public.plans FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only admins can manage plans" ON public.plans FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Invoices
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant isolation" ON public.invoices FOR ALL TO authenticated USING (tenant_id = public.get_user_tenant_id()) WITH CHECK (tenant_id = public.get_user_tenant_id());

-- Accounts Receivable
ALTER TABLE public.accounts_receivable ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant isolation" ON public.accounts_receivable FOR ALL TO authenticated USING (tenant_id = public.get_user_tenant_id()) WITH CHECK (tenant_id = public.get_user_tenant_id());

-- Accounts Payable
ALTER TABLE public.accounts_payable ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant isolation" ON public.accounts_payable FOR ALL TO authenticated USING (tenant_id = public.get_user_tenant_id()) WITH CHECK (tenant_id = public.get_user_tenant_id());

-- Opportunities
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant isolation" ON public.opportunities FOR ALL TO authenticated USING (tenant_id = public.get_user_tenant_id()) WITH CHECK (tenant_id = public.get_user_tenant_id());

-- Tickets
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant isolation" ON public.tickets FOR ALL TO authenticated USING (tenant_id = public.get_user_tenant_id()) WITH CHECK (tenant_id = public.get_user_tenant_id());

-- Ticket Messages
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant isolation" ON public.ticket_messages FOR ALL TO authenticated USING (tenant_id = public.get_user_tenant_id()) WITH CHECK (tenant_id = public.get_user_tenant_id());

-- Audit Logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant isolation" ON public.audit_logs FOR ALL TO authenticated USING (tenant_id = public.get_user_tenant_id()) WITH CHECK (tenant_id = public.get_user_tenant_id());

-- System Notifications
ALTER TABLE public.system_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own notifications" ON public.system_notifications FOR SELECT TO authenticated USING (user_id = auth.uid() AND tenant_id = public.get_user_tenant_id());
CREATE POLICY "System can create notifications" ON public.system_notifications FOR INSERT TO authenticated WITH CHECK (tenant_id = public.get_user_tenant_id());

-- Feature Flags (global read)
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Feature flags viewable by all" ON public.feature_flags FOR SELECT TO authenticated USING (true);

-- Tenant Feature Flags
ALTER TABLE public.tenant_feature_flags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant isolation" ON public.tenant_feature_flags FOR SELECT TO authenticated USING (tenant_id = public.get_user_tenant_id());

-- Usage Metrics
ALTER TABLE public.usage_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant isolation" ON public.usage_metrics FOR SELECT TO authenticated USING (tenant_id = public.get_user_tenant_id());

-- Permissions (global read)
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permissions viewable by all" ON public.permissions FOR SELECT TO authenticated USING (true);

-- Role Permissions (global read)
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Role permissions viewable by all" ON public.role_permissions FOR SELECT TO authenticated USING (true);

-- Activity Reports
ALTER TABLE public.activity_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant isolation" ON public.activity_reports FOR ALL TO authenticated USING (tenant_id = public.get_user_tenant_id()) WITH CHECK (tenant_id = public.get_user_tenant_id());
