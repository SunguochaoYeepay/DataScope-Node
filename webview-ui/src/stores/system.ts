import { defineStore } from 'pinia';
import { ref } from 'vue';
// 删除对已删除的api服务的引用
// import { api } from '@/services/api';

// 表单字段类型
interface FormField {
  id: string;
  name: string;
  label: string;
  type: string;
  required: boolean;
}

// 表单类型
interface Form {
  id: string;
  name: string;
  description: string;
  type: string;
  status: string;
  fields: FormField[];
  createTime: string;
  updateTime: string;
}

// 筛选条件类型
interface FormFilters {
  type?: string;
  status?: string;
  search?: string;
  [key: string]: any;
}

// 模拟表单数据
const mockForms: Form[] = [
  {
    id: 'form-001',
    name: '客户反馈表单',
    description: '用于收集客户反馈的表单',
    type: 'FEEDBACK',
    status: 'ACTIVE',
    fields: [
      { id: 'f001', name: 'name', label: '姓名', type: 'TEXT', required: true },
      { id: 'f002', name: 'email', label: '邮箱', type: 'EMAIL', required: true },
      { id: 'f003', name: 'phone', label: '电话', type: 'PHONE', required: false },
      { id: 'f004', name: 'subject', label: '主题', type: 'TEXT', required: true },
      { id: 'f005', name: 'message', label: '内容', type: 'TEXTAREA', required: true }
    ],
    createTime: '2023-02-15T10:30:00Z',
    updateTime: '2023-05-10T14:20:00Z'
  },
  {
    id: 'form-002',
    name: '产品注册表单',
    description: '用于产品注册的表单',
    type: 'REGISTRATION',
    status: 'ACTIVE',
    fields: [
      { id: 'f101', name: 'product_id', label: '产品编号', type: 'TEXT', required: true },
      { id: 'f102', name: 'purchase_date', label: '购买日期', type: 'DATE', required: true },
      { id: 'f103', name: 'customer_name', label: '客户姓名', type: 'TEXT', required: true },
      { id: 'f104', name: 'email', label: '邮箱', type: 'EMAIL', required: true },
      { id: 'f105', name: 'address', label: '地址', type: 'TEXTAREA', required: true }
    ],
    createTime: '2023-03-05T09:15:00Z',
    updateTime: '2023-03-05T09:15:00Z'
  },
  {
    id: 'form-003',
    name: '员工入职表单',
    description: '用于员工入职的表单',
    type: 'HR',
    status: 'ACTIVE',
    fields: [
      { id: 'f201', name: 'first_name', label: '名', type: 'TEXT', required: true },
      { id: 'f202', name: 'last_name', label: '姓', type: 'TEXT', required: true },
      { id: 'f203', name: 'id_number', label: '身份证号', type: 'TEXT', required: true },
      { id: 'f204', name: 'birth_date', label: '出生日期', type: 'DATE', required: true },
      { id: 'f205', name: 'gender', label: '性别', type: 'RADIO', required: true },
      { id: 'f206', name: 'education', label: '学历', type: 'SELECT', required: true },
      { id: 'f207', name: 'position', label: '职位', type: 'TEXT', required: true },
      { id: 'f208', name: 'department', label: '部门', type: 'SELECT', required: true },
      { id: 'f209', name: 'start_date', label: '入职日期', type: 'DATE', required: true }
    ],
    createTime: '2023-04-20T11:45:00Z',
    updateTime: '2023-06-15T16:30:00Z'
  }
];

// 使用模拟数据
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true'; // 根据环境变量决定是否使用mock

export const useSystemStore = defineStore('system', () => {
  // 状态
  const forms = ref<Form[]>([]);
  const currentForm = ref<Form | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  // 获取表单列表
  const fetchForms = async (filters: FormFilters = {}) => {
    loading.value = true;
    error.value = null;
    
    try {
      if (USE_MOCK) {
        // 使用模拟数据
        // 根据过滤条件筛选表单
        let filteredForms = [...mockForms];
        
        if (filters.type) {
          filteredForms = filteredForms.filter(form => form.type === filters.type);
        }
        
        if (filters.status) {
          filteredForms = filteredForms.filter(form => form.status === filters.status);
        }
        
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredForms = filteredForms.filter(form => 
            form.name.toLowerCase().includes(searchLower) || 
            (form.description && form.description.toLowerCase().includes(searchLower))
          );
        }
        
        // 模拟延迟
        await new Promise(resolve => setTimeout(resolve, 300));
        
        forms.value = filteredForms;
        return filteredForms;
      } else {
        // 替换为使用fetch API
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, String(value));
          }
        });
        
        const response = await fetch(`/api/forms?${queryParams.toString()}`);
        if (!response.ok) {
          throw new Error(`API请求失败: ${response.status}`);
        }
        
        const result = await response.json();
        const data = result.data || result;
        forms.value = data;
        return data;
      }
    } catch (err: any) {
      console.error('获取表单列表失败', err);
      error.value = err.message || '获取表单列表失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  // 获取单个表单
  const fetchFormById = async (id: string) => {
    loading.value = true;
    error.value = null;
    
    try {
      if (USE_MOCK) {
        // 使用模拟数据
        const form = mockForms.find(f => f.id === id);
        
        // 模拟延迟
        await new Promise(resolve => setTimeout(resolve, 200));
        
        if (form) {
          currentForm.value = form;
          return form;
        }
        
        return null;
      } else {
        // 替换为使用fetch API
        const response = await fetch(`/api/forms/${id}`);
        if (!response.ok) {
          throw new Error(`API请求失败: ${response.status}`);
        }
        
        const result = await response.json();
        const data = result.data || result;
        currentForm.value = data;
        return data;
      }
    } catch (err: any) {
      console.error('获取表单失败', err);
      error.value = err.message || '获取表单失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  return {
    forms,
    currentForm,
    loading,
    error,
    fetchForms,
    fetchFormById
  };
});