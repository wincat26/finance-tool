import { IModule } from '../core/ModuleManager';
import { FinanceApplication } from '../core/Application';
import financeRoutes from '../routes/finance';

export class FinanceModule implements IModule {
  name = 'finance';
  private app: FinanceApplication;

  constructor(app: FinanceApplication) {
    this.app = app;
  }

  async initialize() {
    // 註冊 Revenues Schema
    this.app.registerSchema('revenues', {
      name: 'revenues',
      tableName: 'revenues',
      fields: {
        project_id: { 
          type: 'relation',
          relation: { target: 'projects', type: 'belongsTo' },
          required: true
        },
        customer_id: { 
          type: 'relation',
          relation: { target: 'customers', type: 'belongsTo' }
        },
        contract_number: { type: 'string' },
        service_type: { type: 'string', required: true },
        amount: { type: 'number', required: true },
        income_date: { type: 'date', required: true },
        invoice_number: { type: 'string' },
        status: { 
          type: 'string', 
          default: 'pending',
          validation: (value) => ['pending', 'partial', 'completed'].includes(value)
        },
        notes: { type: 'string' }
      },
      hooks: {
        afterCreate: async (data) => {
          // 自動建立分期收款記錄
          await this.createInstallments(data);
        }
      }
    });

    // 註冊 Expenses Schema
    this.app.registerSchema('expenses', {
      name: 'expenses',
      tableName: 'expenses',
      fields: {
        project_id: { 
          type: 'relation',
          relation: { target: 'projects', type: 'belongsTo' },
          required: true
        },
        supplier_name: { type: 'string', required: true },
        expense_type: { type: 'string', required: true },
        amount: { type: 'number', required: true },
        expense_date: { type: 'date', required: true },
        invoice_number: { type: 'string' },
        file_url: { type: 'string' },
        notes: { type: 'string' },
        payment_request: { type: 'boolean', default: false },
        ad_platform: { type: 'string' },
        card_fee: { type: 'number' },
        overseas_tax: { type: 'number' },
        business_tax: { type: 'number' }
      },
      hooks: {
        beforeCreate: async (data) => {
          // 自動計算稅費
          if (data.ad_platform && data.amount) {
            data.card_fee = data.amount * 0.03; // 3% 刷卡手續費
            data.overseas_tax = data.amount * 0.05; // 5% 海外稅
          }
          return data;
        }
      }
    });

    // 註冊路由
    this.app.getApp().use('/api/finance', financeRoutes);
    
    console.log('💰 財務模組已載入');
  }

  private async createInstallments(revenueData: any) {
    // 根據金額自動建立分期收款
    const amount = revenueData.amount;
    if (amount > 100000) { // 超過 10 萬自動分期
      // 實作分期邏輯
      console.log(`💰 為收入 ${revenueData.id} 建立分期收款`);
    }
  }

  async destroy() {
    console.log('💰 財務模組已卸載');
  }
}