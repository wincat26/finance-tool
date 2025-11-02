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
  files?: ProjectFile[];
}

export interface ProjectFile {
  id: number;
  project_id: number;
  file_type: string;
  file_name: string;
  google_drive_url: string;
  created_at: string;
}

export interface DashboardData {
  year: number;
  cashFlow: {
    month: string;
    revenue: number;
    expense: number;
    profit: number;
  }[];
  expenseStructure: {
    category: string;
    amount: number;
  }[];
  profitLoss: {
    totalRevenue: number;
    totalExpense: number;
    profit: number;
  };
  revenueStatus: {
    status: string;
    count: number;
    amount: number;
  }[];
  installmentProgress: {
    pendingCount: number;
    receivedCount: number;
    pendingAmount: number;
    receivedAmount: number;
  };
  projectStats: {
    status: string;
    count: number;
  }[];
}
