// 表单项类型
export type FormItemType = 
  | 'text'      // 文本输入
  | 'number'    // 数字输入
  | 'password'  // 密码输入
  | 'select'    // 下拉选择
  | 'radio'     // 单选
  | 'checkbox'  // 多选
  | 'switch'    // 开关
  | 'date'      // 日期选择
  | 'time'      // 时间选择
  | 'datetime'  // 日期时间选择
  | 'textarea'  // 多行文本
  | 'custom'    // 自定义组件

// 表单项验证规则
export interface FormRule {
  required?: boolean;           // 是否必填
  min?: number;                // 最小长度/值
  max?: number;                // 最大长度/值
  pattern?: RegExp;            // 正则表达式
  validator?: (value: any) => Promise<void> | void; // 自定义验证函数
  message?: string;            // 错误提示信息
}

// 表单项选项
export interface FormItemOption {
  label: string;               // 选项标签
  value: string | number;      // 选项值
  disabled?: boolean;          // 是否禁用
}

// 表单项配置
export interface FormItem {
  key: string;                 // 表单项标识
  label: string;               // 表单项标签
  type: FormItemType;          // 表单项类型
  value?: any;                 // 默认值
  placeholder?: string;        // 占位文本
  disabled?: boolean;          // 是否禁用
  required?: boolean;          // 是否必填
  rules?: FormRule[];          // 验证规则
  options?: FormItemOption[];  // 选项（用于select/radio/checkbox）
  props?: Record<string, any>; // 额外属性
  col?: number;                // 栅格列数（1-12）
  customRender?: (formItem: FormItem) => any; // 自定义渲染函数
}

// 表单布局
export type FormLayout = 'horizontal' | 'vertical' | 'inline';

// 表单配置
export interface FormConfig {
  layout?: FormLayout;         // 表单布局
  labelWidth?: string;         // 标签宽度
  labelAlign?: 'left' | 'right'; // 标签对齐方式
  gutter?: number;             // 栅格间距
  disabled?: boolean;          // 是否整体禁用
  showMessage?: boolean;       // 是否显示校验信息
  validateOnRuleChange?: boolean; // 是否在规则变化时触发验证
}

// 表单验证错误
export interface FormValidateError {
  key: string;                 // 表单项标识
  message: string;             // 错误信息
}

// 表单事件
export interface FormEvents {
  onSubmit: (values: Record<string, any>) => void;
  onChange?: (key: string, value: any) => void;
  onValidate?: (errors: FormValidateError[]) => void;
  onReset?: () => void;
}