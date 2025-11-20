import { Router } from 'express';
import { IModule } from '../core/ModuleManager';
import { FinanceApplication } from '../core/Application';
import projectRoutes from '../routes/projects';

export class ProjectModule implements IModule {
  name = 'projects';
  private app: FinanceApplication;
  private router: Router;

  constructor(app: FinanceApplication) {
    this.app = app;
    this.router = Router();
  }

  async initialize() {
    // 註冊 Schema
    this.app.registerSchema('projects', {
      name: 'projects',
      tableName: 'projects',
      fields: {
        company_name: { type: 'string', required: true },
        vat_number: { type: 'string' },
        contact_name: { type: 'string', required: true },
        contact_phone: { type: 'string' },
        contact_email: { type: 'string' },
        project_date: { type: 'date', required: true },
        responsible_person: { type: 'string', required: true },
        status: {
          type: 'string',
          default: 'active',
          validation: (value: string) => ['active', 'completed', 'cancelled'].includes(value)
        },
        description: { type: 'string' }
      },
      hooks: {
        beforeCreate: async (data: any) => {
          data.created_at = new Date();
          data.updated_at = new Date();
          return data;
        },
        beforeUpdate: async (data: any) => {
          data.updated_at = new Date();
          return data;
        }
      }
    });

    // 註冊路由
    this.app.getApp().use('/api/projects', projectRoutes);

    console.log('📁 專案模組已載入');
  }

  async destroy() {
    console.log('📁 專案模組已卸載');
  }
}