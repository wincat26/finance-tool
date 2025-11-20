import { FinanceApplication } from './Application';

export interface IService {
  name: string;
  initialize(): Promise<void>;
  destroy(): Promise<void>;
}

export class ServiceManager {
  private services = new Map<string, IService>();
  private app: FinanceApplication;

  constructor(app: FinanceApplication) {
    this.app = app;
  }

  register(name: string, service: IService) {
    this.services.set(name, service);
  }

  get(name: string): IService | undefined {
    return this.services.get(name);
  }

  async initialize() {
    for (const [name, service] of this.services) {
      try {
        await service.initialize();
        console.log(`🔧 服務 ${name} 初始化成功`);
      } catch (error) {
        console.error(`❌ 服務 ${name} 初始化失敗:`, error);
        throw error;
      }
    }
  }

  async destroy() {
    for (const [name, service] of this.services) {
      try {
        await service.destroy();
        console.log(`✅ 服務 ${name} 銷毀成功`);
      } catch (error) {
        console.error(`❌ 服務 ${name} 銷毀失敗:`, error);
      }
    }
  }

  list(): string[] {
    return Array.from(this.services.keys());
  }
}