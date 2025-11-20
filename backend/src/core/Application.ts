import { EventEmitter } from 'events';
import { Express } from 'express';
import { ModuleManager } from './ModuleManager';
import { SchemaManager } from './SchemaManager';
import { ServiceManager } from './ServiceManager';

export class FinanceApplication extends EventEmitter {
  private modules: ModuleManager;
  private schemas: SchemaManager;
  private services: ServiceManager;
  private app: Express;

  constructor(app: Express) {
    super();
    this.app = app;
    this.modules = new ModuleManager(this);
    this.schemas = new SchemaManager(this);
    this.services = new ServiceManager(this);
  }

  // 註冊模組
  registerModule(name: string, module: any) {
    this.modules.register(name, module);
    this.emit('module:registered', { name, module });
  }

  // 註冊 Schema
  registerSchema(name: string, schema: any) {
    this.schemas.register(name, schema);
    this.emit('schema:registered', { name, schema });
  }

  // 註冊服務
  registerService(name: string, service: any) {
    this.services.register(name, service);
    this.emit('service:registered', { name, service });
  }

  // 啟動應用
  async start() {
    await this.modules.initialize();
    await this.schemas.initialize();
    await this.services.initialize();
    this.emit('app:started');
  }

  // 取得模組
  getModule(name: string) {
    return this.modules.get(name);
  }

  // 取得服務
  getService(name: string) {
    return this.services.get(name);
  }

  // 取得 Express 實例
  getApp() {
    return this.app;
  }
}