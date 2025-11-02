import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { server } from '../../tests/server';
import CustomerDetail from '../CustomerDetail';
import { Project } from '../../types';

const mockCustomer: Project = {
  id: 1,
  company_name: '測試公司',
  company_alias: '測試',
  vat_number: '12345678',
  contact_name: '王小明',
  contact_phone: '0912-345-678',
  contact_email: 'test@example.com',
  project_date: '2024-01-01T00:00:00.000Z',
  responsible_person: '李業務',
  status: 'active',
  description: '重要客戶',
  finance_contact_name: '財務小姐',
  finance_contact_phone: '02-1234-5678',
  finance_contact_email: 'finance@example.com',
  finance_notes: '月初對帳',
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-02T00:00:00.000Z'
};

describe('CustomerDetail', () => {
  it('顯示基本資料與財務資訊', () => {
    render(
      <CustomerDetail
        customer={mockCustomer}
        onBack={() => {}}
        onEdit={() => {}}
      />
    );

    expect(screen.getByText('測試公司')).toBeInTheDocument();
    expect(screen.getByText('王小明')).toBeInTheDocument();
    expect(screen.getByText('財務小姐')).toBeInTheDocument();
    expect(screen.getByText('月初對帳')).toBeInTheDocument();
  });

  it('切換頁籤時載入收入與支出資料', async () => {
    server.use(
      rest.get('*/api/customers/:id/revenues', (_req, res, ctx) =>
        res(
          ctx.json([
            {
              id: 10,
              project_id: 1,
              service_type: '顧問費',
              amount: 1500,
              income_date: '2024-02-15T00:00:00.000Z',
              invoice_number: 'INV-001',
              status: 'completed',
              notes: '已入帳',
              created_at: '2024-02-15T00:00:00.000Z',
              updated_at: '2024-02-16T00:00:00.000Z'
            }
          ])
        )
      ),
      rest.get('*/api/customers/:id/expenses', (_req, res, ctx) =>
        res(
          ctx.json([
            {
              id: 20,
              project_id: 1,
              supplier_name: '廣告商',
              expense_type: '廣告費',
              amount: 800,
              expense_date: '2024-02-20T00:00:00.000Z',
              invoice_number: 'EXP-001',
              notes: '待報銷',
              payment_request: true,
              created_at: '2024-02-20T00:00:00.000Z',
              updated_at: '2024-02-21T00:00:00.000Z'
            }
          ])
        )
      )
    );

    const user = userEvent.setup();

    render(
      <CustomerDetail
        customer={mockCustomer}
        onBack={() => {}}
        onEdit={() => {}}
      />
    );

    await user.click(screen.getByRole('button', { name: '收入記錄' }));
    await waitFor(() => {
      expect(screen.getByText('顧問費')).toBeInTheDocument();
    });
    expect(screen.getByText('+$1,500')).toBeInTheDocument();
    expect(screen.getByText('狀態: 已收款')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '支出記錄' }));
    await waitFor(() => {
      expect(screen.getByText('廣告費 (1)')).toBeInTheDocument();
    });
    expect(screen.getByText('-$800')).toBeInTheDocument();
    expect(screen.getByText('需要請款')).toBeInTheDocument();
  });
});
