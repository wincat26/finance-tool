import { FinanceApplication } from './Application';

export interface IField {
  type: 'string' | 'number' | 'date' | 'boolean' | 'json' | 'relation';
  required?: boolean;
  unique?: boolean;
  default?: any;
  validation?: (value: any) => boolean;
  relation?: {
    target: string;
    type: 'hasOne' | 'hasMany' | 'belongsTo';
  };
}

export interface ISchema {
  name: string;
  tableName: string;
  fields: Record<string, IField>;
  hooks?: {
    beforeCreate?: (data: any) => Promise<any>;
    afterCreate?: (data: any) => Promise<void>;
    beforeUpdate?: (data: any) => Promise<any>;
    afterUpdate?: (data: any) => Promise<void>;
  };
}

export class SchemaManager {
  private schemas = new Map<string, ISchema>();
  private app: FinanceApplication;

  constructor(app: FinanceApplication) {
    this.app = app;
  }

  register(name: string, schema: ISchema) {
    this.schemas.set(name, schema);
  }

  get(name: string): ISchema | undefined {
    return this.schemas.get(name);
  }

  async initialize() {
    console.log(`📋 已註冊 ${this.schemas.size} 個 Schema`);
    for (const [name, schema] of this.schemas) {
      console.log(`  - ${name}: ${schema.tableName}`);
    }
  }

  // 驗證數據
  validate(schemaName: string, data: any): { valid: boolean; errors: string[] } {
    const schema = this.get(schemaName);
    if (!schema) {
      return { valid: false, errors: [`Schema ${schemaName} 不存在`] };
    }

    const errors: string[] = [];

    for (const [fieldName, field] of Object.entries(schema.fields)) {
      const value = data[fieldName];

      // 必填檢查
      if (field.required && (value === undefined || value === null)) {
        errors.push(`${fieldName} 為必填欄位`);
        continue;
      }

      // 類型檢查
      if (value !== undefined && value !== null) {
        if (!this.validateFieldType(value, field.type)) {
          errors.push(`${fieldName} 類型錯誤，期望 ${field.type}`);
        }

        // 自定義驗證
        if (field.validation && !field.validation(value)) {
          errors.push(`${fieldName} 驗證失敗`);
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }

  private validateFieldType(value: any, type: string): boolean {
    switch (type) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number';
      case 'boolean':
        return typeof value === 'boolean';
      case 'date':
        return value instanceof Date || !isNaN(Date.parse(value));
      case 'json':
        return typeof value === 'object';
      default:
        return true;
    }
  }

  list(): string[] {
    return Array.from(this.schemas.keys());
  }
}