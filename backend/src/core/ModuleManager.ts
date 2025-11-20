import { FinanceApplication } from './Application';

export interface IModule {
  name: string;
  initialize(): Promise<void>;
  destroy(): Promise<void>;
}

export class ModuleManager {
  private modules = new Map<string, IModule>();
  private app: FinanceApplication;

  constructor(app: FinanceApplication) {
    this.app = app;
  }

  register(name: string, module: IModule) {
    this.modules.set(name, module);
  }

  get(name: string): IModule | undefined {
    return this.modules.get(name);
  }

  async initialize() {
    for (const [name, module] of this.modules) {
      try {
        await module.initialize();
        console.log(`✅ 模組 ${name} 初始化成功`);
      } catch (error) {
        console.error(`❌ 模組 ${name} 初始化失敗:`, error);
        throw error;
      }
    }
  }

  async destroy() {
    for (const [name, module] of this.modules) {
      try {
        await module.destroy();
        console.log(`✅ 模組 ${name} 銷毀成功`);
      } catch (error) {
        console.error(`❌ 模組 ${name} 銷毀失敗:`, error);
      }
    }
  }

  list(): string[] {
    return Array.from(this.modules.keys());
  }
}