import { IService } from '../core/ServiceManager';
import { FinanceApplication } from '../core/Application';

export interface IWorkflowTrigger {
  event: string;
  condition?: (data: any) => boolean;
  action: (data: any) => Promise<void>;
}

export class WorkflowService implements IService {
  name = 'workflow';
  private triggers = new Map<string, IWorkflowTrigger[]>();
  private app: FinanceApplication;

  constructor(app: FinanceApplication) {
    this.app = app;
  }

  async initialize() {
    // 註冊預設工作流
    this.registerDefaultWorkflows();
    console.log('🔄 工作流服務已啟動');
  }

  async destroy() {
    this.triggers.clear();
  }

  // 註冊觸發器
  registerTrigger(trigger: IWorkflowTrigger) {
    if (!this.triggers.has(trigger.event)) {
      this.triggers.set(trigger.event, []);
    }
    this.triggers.get(trigger.event)!.push(trigger);
  }

  // 觸發事件
  async trigger(event: string, data: any) {
    const eventTriggers = this.triggers.get(event);
    if (!eventTriggers) return;

    for (const trigger of eventTriggers) {
      try {
        // 檢查條件
        if (trigger.condition && !trigger.condition(data)) {
          continue;
        }
        
        // 執行動作
        await trigger.action(data);
        console.log(`✅ 工作流 ${event} 執行成功`);
      } catch (error) {
        console.error(`❌ 工作流 ${event} 執行失敗:`, error);
      }
    }
  }

  private registerDefaultWorkflows() {
    // 1. 潛客評分自動更新
    this.registerTrigger({
      event: 'lead:updated',
      action: async (data) => {
        // 重新計算評分邏輯
        console.log(`🎯 更新潛客 ${data.id} 評分`);
      }
    });

    // 2. 高價值潛客自動分配
    this.registerTrigger({
      event: 'lead:created',
      condition: (data) => data.lead_score >= 80,
      action: async (data) => {
        // 自動分配給資深業務
        console.log(`👑 高價值潛客 ${data.name} 自動分配`);
      }
    });

    // 3. 收款提醒
    this.registerTrigger({
      event: 'installment:due',
      action: async (data) => {
        // 發送收款提醒
        console.log(`💰 收款提醒: ${data.amount}`);
      }
    });

    // 4. 專案狀態變更通知
    this.registerTrigger({
      event: 'project:status_changed',
      action: async (data) => {
        console.log(`📋 專案 ${data.company_name} 狀態變更為 ${data.status}`);
      }
    });

    // 5. 大額支出審批
    this.registerTrigger({
      event: 'expense:created',
      condition: (data) => data.amount > 50000,
      action: async (data) => {
        console.log(`💸 大額支出需審批: ${data.amount}`);
      }
    });
  }
}