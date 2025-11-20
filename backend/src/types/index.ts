export interface Project {
  id: number;
  company_name: string;
  company_alias?: string;
  vat_number?: string;
  contact_name: string;
  contact_phone?: string;
  contact_email?: string;
  project_date: Date;
  responsible_person: string;
  status: 'active' | 'completed' | 'cancelled';
  description?: string;
  finance_contact_name?: string;
  finance_contact_phone?: string;
  finance_contact_email?: string;
  finance_notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ProjectFile {
  id: number;
  project_id: number;
  file_type: string;
  file_name: string;
  google_drive_url: string;
  created_at: Date;
}

export interface Revenue {
  id: number;
  project_id: number;
  customer_id?: number;
  contract_number?: string;
  service_type: string;
  amount: number;
  income_date: Date;
  invoice_number?: string;
  status: 'pending' | 'partial' | 'completed';
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface RevenueInstallment {
  id: number;
  revenue_id: number;
  period: number;
  planned_date: Date;
  planned_amount: number;
  actual_received_date?: Date;
  actual_amount?: number;
  status: 'pending' | 'received';
  created_at: Date;
}

export interface Expense {
  id: number;
  project_id: number;
  supplier_name: string;
  expense_type: string;
  amount: number;
  expense_date: Date;
  invoice_number?: string;
  file_url?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Customer {
  id: number;
  name: string;
  vat_number?: string;
  contact_info?: string;
  primary_contact_id?: number;
  created_at: Date;
}

export interface ExpenseCategory {
  id: number;
  name: string;
  description?: string;
  created_at: Date;
}

export interface RevenueCategory {
  id: number;
  name: string;
  description?: string;
  created_at: Date;
}

export interface Lead {
  id: number;
  name: string;
  company?: string;
  phone?: string;
  email?: string;
  source?: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost';
  tags?: string[];
  custom_fields?: Record<string, any>;
  assigned_to?: string;
  lead_score: number;
  last_contact_date?: Date;
  notes?: string;
  created_at: Date;
  updated_at: Date;
  converted_at?: Date;
  converted_to_contact_id?: number;
}

export interface Contact {
  id: number;
  name: string;
  company?: string;
  position?: string;
  phone?: string;
  email?: string;
  tags?: string[];
  custom_fields?: Record<string, any>;
  status: 'active' | 'inactive';
  source?: string;
  lead_id?: number;
  customer_id?: number;
  created_at: Date;
  updated_at: Date;
}
