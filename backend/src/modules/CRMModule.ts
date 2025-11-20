import { IModule } from '../core/ModuleManager';
import { FinanceApplication } from '../core/Application';
import leadRoutes from '../routes/leads';

export class CRMModule implements IModule {
  name = 'crm';
  private app: FinanceApplication;

  constructor(app: FinanceApplication) {
    this.app = app;
  }

  async initialize() {
    // 註冊 Leads Schema
    this.app.registerSchema('leads', {
      name: 'leads',
      tableName: 'leads',
      fields: {
        name: { type: 'string', required: true },
        company: { type: 'string' },
        phone: { type: 'string' },
        email: { type: 'string' },
        source: { type: 'string' },
        status: { 
          type: 'string', 
          default: 'new',
          validation: (value) => ['new', 'contacted', 'qualified', 'lost'].includes(value)
        },
        lead_score: { type: 'number', default: 0 },
        tags: { type: 'json' },
        custom_fields: { type: 'json' },
        assigned_to: { type: 'string' }
      },
      hooks: {
        beforeCreate: async (data) => {
          // 自動計算評分
          data.lead_score = this.calculateLeadScore(data);
          return data;
        }
      }
    });

    // 註冊 Contacts Schema
    this.app.registerSchema('contacts', {
      name: 'contacts',
      tableName: 'contacts',
      fields: {
        name: { type: 'string', required: true },
        company: { type: 'string' },
        position: { type: 'string' },
        phone: { type: 'string' },
        email: { type: 'string' },
        lead_id: { 
          type: 'relation',
          relation: { target: 'leads', type: 'belongsTo' }
        },
        customer_id: { 
          type: 'relation',
          relation: { target: 'customers', type: 'belongsTo' }
        },
        tags: { type: 'json' },
        custom_fields: { type: 'json' },
        status: { 
          type: 'string', 
          default: 'active',
          validation: (value) => ['active', 'inactive'].includes(value)
        }
      }
    });

    // 註冊路由
    this.app.getApp().use('/api/leads', leadRoutes);
    
    console.log('👥 CRM 模組已載入');
  }

  private calculateLeadScore(data: any): number {
    let score = 0;
    
    // 基礎資料完整度
    if (data.name) score += 10;
    if (data.company) score += 15;
    if (data.phone) score += 10;
    if (data.email) score += 15;
    
    // 來源加分
    const sourceScores: Record<string, number> = {
      '推薦': 30,
      '官網': 20,
      '廣告': 15,
      '展會': 25,
      '其他': 5
    };
    score += sourceScores[data.source] || 0;
    
    return Math.min(score, 100);
  }

  async destroy() {
    console.log('👥 CRM 模組已卸載');
  }
}