export interface Project {
  id: number;
  company_name: string;
  company_alias?: string;
  vat_number?: string;
  contact_name: string;
  contact_phone?: string;
  contact_email?: string;
  project_date: string;
  responsible_person: string;
  status: 'active' | 'completed' | 'cancelled';
  description?: string;
  finance_contact_name?: string;
  finance_contact_phone?: string;
  finance_contact_email?: string;
  finance_notes?: string;
  created_at: string;
  updated_at: string;
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
  last_contact_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  converted_at?: string;
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
  created_at: string;
  updated_at: string;
}

export interface DashboardData {
  profitLoss: {
    totalRevenue: number;
    totalExpense: number;
    profit: number;
  };
  projectStats: {
    status: string;
    count: number;
  }[];
  cashFlow: {
    month: string;
    revenue: number;
    expense: number;
  }[];
  expenseStructure: {
    category: string;
    amount: number;
  }[];
  installmentProgress: {
    receivedCount: number;
    pendingCount: number;
    receivedAmount: number;
    pendingAmount: number;
  };
}
