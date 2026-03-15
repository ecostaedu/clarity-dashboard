export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      accounts_payable: {
        Row: {
          amount: number
          created_at: string
          due_date: string | null
          id: string
          status: Database["public"]["Enums"]["invoice_status"]
          supplier: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          due_date?: string | null
          id?: string
          status?: Database["public"]["Enums"]["invoice_status"]
          supplier?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string | null
          id?: string
          status?: Database["public"]["Enums"]["invoice_status"]
          supplier?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_payable_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      accounts_receivable: {
        Row: {
          amount: number
          company_id: string | null
          created_at: string
          due_date: string | null
          id: string
          status: Database["public"]["Enums"]["invoice_status"]
          tenant_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          company_id?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          status?: Database["public"]["Enums"]["invoice_status"]
          tenant_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          company_id?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          status?: Database["public"]["Enums"]["invoice_status"]
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_receivable_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_receivable_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_reports: {
        Row: {
          apprentice_id: string
          created_at: string
          id: string
          month: string
          report: string | null
          supervisor: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          apprentice_id: string
          created_at?: string
          id?: string
          month: string
          report?: string | null
          supervisor?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          apprentice_id?: string
          created_at?: string
          id?: string
          month?: string
          report?: string | null
          supervisor?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_reports_apprentice_id_fkey"
            columns: ["apprentice_id"]
            isOneToOne: false
            referencedRelation: "apprentices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_reports_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      apprentices: {
        Row: {
          candidate_id: string | null
          class_id: string | null
          created_at: string
          id: string
          program_id: string | null
          status: Database["public"]["Enums"]["entity_status"]
          tenant_id: string
          updated_at: string
        }
        Insert: {
          candidate_id?: string | null
          class_id?: string | null
          created_at?: string
          id?: string
          program_id?: string | null
          status?: Database["public"]["Enums"]["entity_status"]
          tenant_id: string
          updated_at?: string
        }
        Update: {
          candidate_id?: string | null
          class_id?: string | null
          created_at?: string
          id?: string
          program_id?: string | null
          status?: Database["public"]["Enums"]["entity_status"]
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "apprentices_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "apprentices_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "apprentices_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "apprentices_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance: {
        Row: {
          apprentice_id: string
          attendance_date: string
          created_at: string
          hours: number | null
          id: string
          status: Database["public"]["Enums"]["attendance_status"]
          tenant_id: string
        }
        Insert: {
          apprentice_id: string
          attendance_date: string
          created_at?: string
          hours?: number | null
          id?: string
          status?: Database["public"]["Enums"]["attendance_status"]
          tenant_id: string
        }
        Update: {
          apprentice_id?: string
          attendance_date?: string
          created_at?: string
          hours?: number | null
          id?: string
          status?: Database["public"]["Enums"]["attendance_status"]
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_apprentice_id_fkey"
            columns: ["apprentice_id"]
            isOneToOne: false
            referencedRelation: "apprentices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          entity: string
          entity_id: string | null
          id: string
          metadata: Json | null
          tenant_id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity: string
          entity_id?: string | null
          id?: string
          metadata?: Json | null
          tenant_id: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity?: string
          entity_id?: string | null
          id?: string
          metadata?: Json | null
          tenant_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_applications: {
        Row: {
          candidate_id: string
          created_at: string
          id: string
          process_id: string
          status: string
          tenant_id: string
        }
        Insert: {
          candidate_id: string
          created_at?: string
          id?: string
          process_id: string
          status?: string
          tenant_id: string
        }
        Update: {
          candidate_id?: string
          created_at?: string
          id?: string
          process_id?: string
          status?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_applications_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_applications_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "selection_processes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_applications_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_documents: {
        Row: {
          candidate_id: string
          created_at: string
          document_type: string
          file_url: string
          id: string
          tenant_id: string
        }
        Insert: {
          candidate_id: string
          created_at?: string
          document_type: string
          file_url: string
          id?: string
          tenant_id: string
        }
        Update: {
          candidate_id?: string
          created_at?: string
          document_type?: string
          file_url?: string
          id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_documents_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_documents_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      candidates: {
        Row: {
          birth_date: string | null
          cpf: string | null
          created_at: string
          education_level: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          resume_url: string | null
          status: Database["public"]["Enums"]["entity_status"]
          tenant_id: string
          updated_at: string
        }
        Insert: {
          birth_date?: string | null
          cpf?: string | null
          created_at?: string
          education_level?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          resume_url?: string | null
          status?: Database["public"]["Enums"]["entity_status"]
          tenant_id: string
          updated_at?: string
        }
        Update: {
          birth_date?: string | null
          cpf?: string | null
          created_at?: string
          education_level?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          resume_url?: string | null
          status?: Database["public"]["Enums"]["entity_status"]
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidates_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          created_at: string
          id: string
          program_id: string
          room: string | null
          schedule: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          program_id: string
          room?: string | null
          schedule?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          program_id?: string
          room?: string | null
          schedule?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "classes_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address: string | null
          billing_day: number | null
          cnpj: string | null
          created_at: string
          email: string | null
          id: string
          industry: string | null
          legal_name: string
          phone: string | null
          status: Database["public"]["Enums"]["entity_status"]
          tenant_id: string
          trade_name: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          billing_day?: number | null
          cnpj?: string | null
          created_at?: string
          email?: string | null
          id?: string
          industry?: string | null
          legal_name: string
          phone?: string | null
          status?: Database["public"]["Enums"]["entity_status"]
          tenant_id: string
          trade_name?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          billing_day?: number | null
          cnpj?: string | null
          created_at?: string
          email?: string | null
          id?: string
          industry?: string | null
          legal_name?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["entity_status"]
          tenant_id?: string
          trade_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "companies_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_documents: {
        Row: {
          contract_id: string
          created_at: string
          document_type: string
          file_url: string
          id: string
          tenant_id: string
        }
        Insert: {
          contract_id: string
          created_at?: string
          document_type: string
          file_url: string
          id?: string
          tenant_id: string
        }
        Update: {
          contract_id?: string
          created_at?: string
          document_type?: string
          file_url?: string
          id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_documents_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contract_documents_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          candidate_id: string | null
          company_id: string | null
          contract_type: Database["public"]["Enums"]["contract_type"]
          created_at: string
          end_date: string | null
          id: string
          start_date: string | null
          status: Database["public"]["Enums"]["contract_status"]
          stipend: number | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          candidate_id?: string | null
          company_id?: string | null
          contract_type?: Database["public"]["Enums"]["contract_type"]
          created_at?: string
          end_date?: string | null
          id?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["contract_status"]
          stipend?: number | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          candidate_id?: string | null
          company_id?: string | null
          contract_type?: Database["public"]["Enums"]["contract_type"]
          created_at?: string
          end_date?: string | null
          id?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["contract_status"]
          stipend?: number | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      digital_signatures: {
        Row: {
          contract_id: string
          created_at: string
          document_url: string | null
          id: string
          status: Database["public"]["Enums"]["signature_status"]
          tenant_id: string
          updated_at: string
        }
        Insert: {
          contract_id: string
          created_at?: string
          document_url?: string | null
          id?: string
          status?: Database["public"]["Enums"]["signature_status"]
          tenant_id: string
          updated_at?: string
        }
        Update: {
          contract_id?: string
          created_at?: string
          document_url?: string | null
          id?: string
          status?: Database["public"]["Enums"]["signature_status"]
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "digital_signatures_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "digital_signatures_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      educators: {
        Row: {
          blocked: boolean | null
          can_register_multiple_attendance: boolean | null
          created_at: string
          email: string | null
          id: string
          name: string
          specialty: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          blocked?: boolean | null
          can_register_multiple_attendance?: boolean | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          specialty?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          blocked?: boolean | null
          can_register_multiple_attendance?: boolean | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          specialty?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "educators_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_flags: {
        Row: {
          created_at: string
          description: string | null
          enabled_by_default: boolean | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          enabled_by_default?: boolean | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          enabled_by_default?: boolean | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      holidays: {
        Row: {
          city: string | null
          created_at: string
          holiday_date: string
          id: string
          name: string
          tenant_id: string
        }
        Insert: {
          city?: string | null
          created_at?: string
          holiday_date: string
          id?: string
          name: string
          tenant_id: string
        }
        Update: {
          city?: string | null
          created_at?: string
          holiday_date?: string
          id?: string
          name?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "holidays_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      institutions: {
        Row: {
          address: string | null
          cnpj: string | null
          contact_email: string | null
          created_at: string
          id: string
          name: string
          phone: string | null
          status: Database["public"]["Enums"]["entity_status"]
          tenant_id: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          cnpj?: string | null
          contact_email?: string | null
          created_at?: string
          id?: string
          name: string
          phone?: string | null
          status?: Database["public"]["Enums"]["entity_status"]
          tenant_id: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          cnpj?: string | null
          contact_email?: string | null
          created_at?: string
          id?: string
          name?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["entity_status"]
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "institutions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          billing_period: string | null
          company_id: string | null
          created_at: string
          due_date: string | null
          id: string
          status: Database["public"]["Enums"]["invoice_status"]
          tenant_id: string
          total_value: number | null
          updated_at: string
        }
        Insert: {
          billing_period?: string | null
          company_id?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          status?: Database["public"]["Enums"]["invoice_status"]
          tenant_id: string
          total_value?: number | null
          updated_at?: string
        }
        Update: {
          billing_period?: string | null
          company_id?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          status?: Database["public"]["Enums"]["invoice_status"]
          tenant_id?: string
          total_value?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      job_openings: {
        Row: {
          company_id: string | null
          created_at: string
          description: string | null
          id: string
          job_type: string | null
          status: Database["public"]["Enums"]["entity_status"]
          tenant_id: string
          title: string
          updated_at: string
          vacancies: number | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          job_type?: string | null
          status?: Database["public"]["Enums"]["entity_status"]
          tenant_id: string
          title: string
          updated_at?: string
          vacancies?: number | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          job_type?: string | null
          status?: Database["public"]["Enums"]["entity_status"]
          tenant_id?: string
          title?: string
          updated_at?: string
          vacancies?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "job_openings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_openings_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      occurrences: {
        Row: {
          apprentice_id: string
          created_at: string
          description: string | null
          id: string
          occurrence_date: string
          tenant_id: string
          type: Database["public"]["Enums"]["occurrence_type"]
        }
        Insert: {
          apprentice_id: string
          created_at?: string
          description?: string | null
          id?: string
          occurrence_date: string
          tenant_id: string
          type?: Database["public"]["Enums"]["occurrence_type"]
        }
        Update: {
          apprentice_id?: string
          created_at?: string
          description?: string | null
          id?: string
          occurrence_date?: string
          tenant_id?: string
          type?: Database["public"]["Enums"]["occurrence_type"]
        }
        Relationships: [
          {
            foreignKeyName: "occurrences_apprentice_id_fkey"
            columns: ["apprentice_id"]
            isOneToOne: false
            referencedRelation: "apprentices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "occurrences_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunities: {
        Row: {
          company_id: string | null
          created_at: string
          id: string
          responsible_user: string | null
          stage: Database["public"]["Enums"]["opportunity_stage"]
          tenant_id: string
          updated_at: string
          value: number | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          id?: string
          responsible_user?: string | null
          stage?: Database["public"]["Enums"]["opportunity_stage"]
          tenant_id: string
          updated_at?: string
          value?: number | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          id?: string
          responsible_user?: string | null
          stage?: Database["public"]["Enums"]["opportunity_stage"]
          tenant_id?: string
          updated_at?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          description: string | null
          id: string
          name: string
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      plans: {
        Row: {
          active: boolean | null
          billing_cycle: Database["public"]["Enums"]["billing_cycle"]
          created_at: string
          features: Json | null
          id: string
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          billing_cycle?: Database["public"]["Enums"]["billing_cycle"]
          created_at?: string
          features?: Json | null
          id?: string
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          billing_cycle?: Database["public"]["Enums"]["billing_cycle"]
          created_at?: string
          features?: Json | null
          id?: string
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      process_stages: {
        Row: {
          created_at: string
          id: string
          name: string
          order_position: number
          process_id: string
          tenant_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          order_position?: number
          process_id: string
          tenant_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          order_position?: number
          process_id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "process_stages_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "selection_processes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "process_stages_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          last_login: string | null
          name: string
          status: Database["public"]["Enums"]["entity_status"]
          tenant_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id?: string
          last_login?: string | null
          name: string
          status?: Database["public"]["Enums"]["entity_status"]
          tenant_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          last_login?: string | null
          name?: string
          status?: Database["public"]["Enums"]["entity_status"]
          tenant_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          active: boolean | null
          city: string | null
          created_at: string
          id: string
          name: string
          program_number: string | null
          tenant_id: string
          total_hours: number | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          city?: string | null
          created_at?: string
          id?: string
          name: string
          program_number?: string | null
          tenant_id: string
          total_hours?: number | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          city?: string | null
          created_at?: string
          id?: string
          name?: string
          program_number?: string | null
          tenant_id?: string
          total_hours?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "programs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          id: string
          permission_id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          id?: string
          permission_id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          id?: string
          permission_id?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      selection_processes: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          job_opening_id: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["entity_status"]
          tenant_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          job_opening_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["entity_status"]
          tenant_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          job_opening_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["entity_status"]
          tenant_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "selection_processes_job_opening_id_fkey"
            columns: ["job_opening_id"]
            isOneToOne: false
            referencedRelation: "job_openings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "selection_processes_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      signature_participants: {
        Row: {
          id: string
          signature_id: string
          signed_at: string | null
          signer_email: string
          signer_name: string
          status: Database["public"]["Enums"]["signature_status"]
          tenant_id: string
        }
        Insert: {
          id?: string
          signature_id: string
          signed_at?: string | null
          signer_email: string
          signer_name: string
          status?: Database["public"]["Enums"]["signature_status"]
          tenant_id: string
        }
        Update: {
          id?: string
          signature_id?: string
          signed_at?: string | null
          signer_email?: string
          signer_name?: string
          status?: Database["public"]["Enums"]["signature_status"]
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "signature_participants_signature_id_fkey"
            columns: ["signature_id"]
            isOneToOne: false
            referencedRelation: "digital_signatures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signature_participants_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      system_notifications: {
        Row: {
          created_at: string
          id: string
          message: string | null
          read_status: boolean | null
          tenant_id: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          read_status?: boolean | null
          tenant_id: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          read_status?: boolean | null
          tenant_id?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "system_notifications_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_feature_flags: {
        Row: {
          enabled: boolean | null
          feature_flag_id: string
          id: string
          tenant_id: string
        }
        Insert: {
          enabled?: boolean | null
          feature_flag_id: string
          id?: string
          tenant_id: string
        }
        Update: {
          enabled?: boolean | null
          feature_flag_id?: string
          id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_feature_flags_feature_flag_id_fkey"
            columns: ["feature_flag_id"]
            isOneToOne: false
            referencedRelation: "feature_flags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenant_feature_flags_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          cnpj: string | null
          created_at: string
          id: string
          name: string
          plan_id: string | null
          slug: string
          status: Database["public"]["Enums"]["entity_status"]
          updated_at: string
        }
        Insert: {
          cnpj?: string | null
          created_at?: string
          id?: string
          name: string
          plan_id?: string | null
          slug: string
          status?: Database["public"]["Enums"]["entity_status"]
          updated_at?: string
        }
        Update: {
          cnpj?: string | null
          created_at?: string
          id?: string
          name?: string
          plan_id?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["entity_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_tenants_plan"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      test_questions: {
        Row: {
          created_at: string
          id: string
          question_text: string
          question_type: string
          tenant_id: string
          test_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          question_text: string
          question_type?: string
          tenant_id: string
          test_id: string
        }
        Update: {
          created_at?: string
          id?: string
          question_text?: string
          question_type?: string
          tenant_id?: string
          test_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_questions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_questions_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      tests: {
        Row: {
          category: string | null
          created_at: string
          duration_minutes: number | null
          id: string
          tenant_id: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          tenant_id: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          tenant_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tests_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_messages: {
        Row: {
          author_id: string | null
          created_at: string
          id: string
          message: string
          tenant_id: string
          ticket_id: string
        }
        Insert: {
          author_id?: string | null
          created_at?: string
          id?: string
          message: string
          tenant_id: string
          ticket_id: string
        }
        Update: {
          author_id?: string | null
          created_at?: string
          id?: string
          message?: string
          tenant_id?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_messages_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          priority: Database["public"]["Enums"]["ticket_priority"]
          status: Database["public"]["Enums"]["ticket_status"]
          tenant_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          status?: Database["public"]["Enums"]["ticket_status"]
          tenant_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          status?: Database["public"]["Enums"]["ticket_status"]
          tenant_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_metrics: {
        Row: {
          created_at: string
          id: string
          metric_name: string
          metric_value: number
          period: string | null
          tenant_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metric_name: string
          metric_value?: number
          period?: string | null
          tenant_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metric_name?: string
          metric_value?: number
          period?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_metrics_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          tenant_id: string
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          tenant_id: string
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          tenant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      vacations: {
        Row: {
          apprentice_id: string
          created_at: string
          end_date: string
          id: string
          start_date: string
          tenant_id: string
        }
        Insert: {
          apprentice_id: string
          created_at?: string
          end_date: string
          id?: string
          start_date: string
          tenant_id: string
        }
        Update: {
          apprentice_id?: string
          created_at?: string
          end_date?: string
          id?: string
          start_date?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vacations_apprentice_id_fkey"
            columns: ["apprentice_id"]
            isOneToOne: false
            referencedRelation: "apprentices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vacations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_tenant_id: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "hr_manager" | "company_user" | "educator" | "finance"
      attendance_status: "present" | "absent" | "justified" | "late"
      billing_cycle: "monthly" | "quarterly" | "yearly"
      contract_status: "draft" | "active" | "expired" | "terminated" | "renewed"
      contract_type: "internship" | "apprentice" | "clt" | "pj"
      entity_status: "active" | "inactive" | "pending" | "suspended"
      invoice_status: "pending" | "paid" | "canceled" | "overdue"
      occurrence_type: "warning" | "suspension" | "praise" | "observation"
      opportunity_stage:
        | "lead"
        | "proposal"
        | "negotiation"
        | "closed_won"
        | "closed_lost"
      signature_status: "pending" | "signed" | "rejected" | "expired"
      ticket_priority: "low" | "medium" | "high" | "critical"
      ticket_status: "open" | "in_progress" | "resolved" | "closed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "hr_manager", "company_user", "educator", "finance"],
      attendance_status: ["present", "absent", "justified", "late"],
      billing_cycle: ["monthly", "quarterly", "yearly"],
      contract_status: ["draft", "active", "expired", "terminated", "renewed"],
      contract_type: ["internship", "apprentice", "clt", "pj"],
      entity_status: ["active", "inactive", "pending", "suspended"],
      invoice_status: ["pending", "paid", "canceled", "overdue"],
      occurrence_type: ["warning", "suspension", "praise", "observation"],
      opportunity_stage: [
        "lead",
        "proposal",
        "negotiation",
        "closed_won",
        "closed_lost",
      ],
      signature_status: ["pending", "signed", "rejected", "expired"],
      ticket_priority: ["low", "medium", "high", "critical"],
      ticket_status: ["open", "in_progress", "resolved", "closed"],
    },
  },
} as const
