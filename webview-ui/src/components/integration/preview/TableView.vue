<script setup lang="ts">
import { ref, computed, watch, reactive, h } from 'vue';
import type { TableConfig, TableColumn, TableAction } from '@/types/integration';
import { ColumnDisplayType, ColumnAlign } from '@/types/integration';
import { 
  SettingOutlined, 
  ReloadOutlined, 
  FileExcelOutlined, 
  DownOutlined 
} from '@ant-design/icons-vue';

const props = defineProps<{
  data: any[];
  columns: TableColumn[];
  actions?: TableAction[];
  pagination?: {
    enabled: boolean;
    pageSize: number;
    pageSizeOptions: number[];
  };
  exportConfig?: {
    enabled: boolean;
    formats: string[];
    maxRows: number;
  };
  loading?: boolean;
  title?: string;
}>();

const emit = defineEmits<{
  (e: 'action', action: TableAction, row: any): void;
  (e: 'export', format: string): void;
  (e: 'page-change', page: number): void;
  (e: 'page-size-change', size: number): void;
  (e: 'change', pagination: any, filters: any, sorter: any): void;
}>();

// 分页状态
const paginationConfig = reactive({
  current: 1,
  pageSize: props.pagination?.pageSize || 10,
  pageSizeOptions: props.pagination?.pageSizeOptions?.map(size => size.toString()) || ['10', '20', '50', '100'],
  showSizeChanger: true,
  showQuickJumper: true,
  total: computed(() => props.data.length),
  showTotal: (total: number) => `共 ${total} 条记录`
});

// 表格设置
const tableLoading = computed(() => props.loading);

// 重置分页
watch(() => props.data, () => {
  paginationConfig.current = 1;
}, { deep: true });

// 导出下拉菜单状态
const exportVisible = ref(false);

// 处理表格变化事件
const handleTableChange = (pagination: any, filters: any, sorter: any) => {
  paginationConfig.current = pagination.current;
  paginationConfig.pageSize = pagination.pageSize;
  emit('change', pagination, filters, sorter);
  emit('page-change', pagination.current);
  emit('page-size-change', pagination.pageSize);
};

// 处理表格操作
const handleTableAction = (action: TableAction, record: any) => {
  emit('action', action, record);
};

// 导出表格数据
const exportTable = (format: string) => {
  emit('export', format);
  exportVisible.value = false;
};

// 格式化列
const antColumns = computed(() => {
  const cols = props.columns.map(column => ({
    title: column.label,
    dataIndex: column.field,
    key: column.field,
    align: column.align === ColumnAlign.CENTER ? 'center' : 
           column.align === ColumnAlign.RIGHT ? 'right' : 'left',
    sorter: column.sortable,
    width: column.width,
    customRender: ({ text, record }: { text: any, record: any }) => {
      // 根据列类型选择不同的渲染方式
      if (column.displayType === ColumnDisplayType.TAG) {
        let color = 'default';
        if (typeof text === 'string') {
          const textLower = text.toLowerCase();
          if (textLower.includes('成功') || textLower.includes('正常') || textLower.includes('active')) {
            color = 'success';
          } else if (textLower.includes('失败') || textLower.includes('错误') || textLower.includes('禁用')) {
            color = 'error';
          } else if (textLower.includes('警告') || textLower.includes('注意')) {
            color = 'warning';
          } else if (textLower.includes('处理中') || textLower.includes('waiting')) {
            color = 'processing';
          }
        }
        return text ? h('a-tag', { color }, text) : '-';
      } 
      else if (column.displayType === ColumnDisplayType.STATUS) {
        let status = 'default';
        if (typeof text === 'string') {
          const textLower = text.toLowerCase();
          if (textLower.includes('成功') || textLower.includes('正常') || textLower.includes('active')) {
            status = 'success';
          } else if (textLower.includes('失败') || textLower.includes('错误') || textLower.includes('禁用')) {
            status = 'error';
          } else if (textLower.includes('警告') || textLower.includes('注意')) {
            status = 'warning';
          } else if (textLower.includes('处理中') || textLower.includes('waiting')) {
            status = 'processing';
          }
        }
        return text ? h('a-badge', { status }, text) : '-';
      } 
      else if (column.displayType === ColumnDisplayType.LINK) {
        return text ? h('a', { href: text, target: '_blank' }, text) : '-';
      }
      else if (column.displayType === ColumnDisplayType.DATE) {
        if (!text) return '-';
        // 简单日期格式化，实际项目中可能需要更复杂的处理
        const date = new Date(text);
        return !isNaN(date.getTime()) ? date.toLocaleDateString() : text;
      }
      else if (column.displayType === ColumnDisplayType.NUMBER) {
        return typeof text === 'number' ? text.toLocaleString() : (text || '-');
      }
      // 默认文本显示
      return text !== undefined && text !== null ? text : '-';
    }
  }));
  
  // 如果有操作按钮，添加操作列
  if (props.actions && props.actions.length > 0) {
    cols.push({
      title: '操作',
      key: 'operation',
      dataIndex: 'operation',
      align: 'center',
      sorter: false,
      width: props.actions.length > 2 ? '150px' : '100px',
      customRender: ({ record }: { record: any }) => {
        return h('div', { class: 'flex space-x-2' }, props.actions?.map(action => {
          let type = 'default';
          if (action.style === 'primary') type = 'primary';
          else if (action.style === 'danger') type = 'danger';
          
          return h('a-button', {
            type: 'link',
            size: 'small',
            danger: action.style === 'danger',
            onClick: () => handleTableAction(action, record)
          }, { default: () => action.label });
        }));
      }
    });
  }
  
  return cols;
});

// 导出下拉菜单项
const exportMenuItems = computed(() => {
  if (!props.exportConfig?.formats) return [];
  
  return props.exportConfig.formats.map(format => ({
    key: format,
    label: h('span', {}, `导出${format}`),
    onClick: () => exportTable(format)
  }));
});

// 刷新表格
const refreshTable = () => {
  emit('page-change', paginationConfig.current);
};
</script>

<template>
  <a-card class="table-section">
    <!-- 表格标题和操作区 -->
    <template #title>
      <div class="flex justify-between items-center">
        <span>{{ title || '数据列表' }}</span>
        <div class="flex items-center space-x-2">
          <!-- 导出按钮 -->
          <a-dropdown 
            v-if="exportConfig?.enabled" 
            :trigger="['click']" 
            v-model:open="exportVisible"
          >
            <a-button>
              <template #icon><FileExcelOutlined /></template>
              下载
              <DownOutlined />
            </a-button>
            <template #overlay>
              <a-menu>
                <a-menu-item 
                  v-for="format in exportConfig.formats" 
                  :key="format"
                  @click="exportTable(format)"
                >
                  导出{{ format }}
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          
          <!-- 刷新按钮 -->
          <a-button type="text" @click="refreshTable">
            <template #icon><ReloadOutlined /></template>
          </a-button>
          
          <!-- 列设置按钮 -->
          <a-button type="text">
            <template #icon><SettingOutlined /></template>
          </a-button>
        </div>
      </div>
    </template>

    <!-- 数据表格 -->
    <a-table
      :columns="antColumns"
      :data-source="data"
      :pagination="pagination?.enabled ? paginationConfig : false"
      :loading="tableLoading"
      :scroll="{ x: 'max-content' }"
      size="middle"
      row-key="id"
      @change="handleTableChange"
    >
      <!-- 空状态自定义 -->
      <template #emptyText>
        <a-empty description="暂无数据" />
      </template>
    </a-table>
  </a-card>
</template>