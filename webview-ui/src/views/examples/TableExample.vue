<script setup lang="ts">
import { ref } from 'vue'
import DataTable from '@/components/common/DataTable.vue'
import type { TableColumn, Pagination, TableChangeEvent } from '@/types/table'

// 定义列配置
const columns: TableColumn[] = [
  {
    key: 'name',
    title: '姓名',
    dataIndex: 'name',
    sortable: true,
    filterable: true
  },
  {
    key: 'age',
    title: '年龄',
    dataIndex: 'age',
    sortable: true,
    width: 100,
    align: 'center'
  },
  {
    key: 'address',
    title: '地址',
    dataIndex: 'address'
  },
  {
    key: 'action',
    title: '操作',
    dataIndex: 'action',
    width: 120,
    align: 'center',
    slots: {
      customRender: 'action'
    }
  }
]

// 模拟数据
const dataSource = ref([
  {
    id: '1',
    name: '张三',
    age: 32,
    address: '北京市朝阳区'
  },
  {
    id: '2',
    name: '李四',
    age: 42,
    address: '上海市浦东新区'
  },
  {
    id: '3',
    name: '王五',
    age: 28,
    address: '广州市天河区'
  }
])

// 分页配置
const pagination = ref<Pagination>({
  current: 1,
  pageSize: 10,
  total: 3,
  showSizeChanger: true,
  showQuickJumper: true
})

// 选中的行
const selectedRowKeys = ref<string[]>([])

// 处理表格变化
const handleTableChange = (event: TableChangeEvent) => {
  console.log('Table change:', event)
}

// 处理编辑
const handleEdit = (record: any) => {
  console.log('Edit:', record)
}

// 处理删除
const handleDelete = (record: any) => {
  console.log('Delete:', record)
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">表格组件示例</h1>
    
    <DataTable
      :columns="columns"
      :data-source="dataSource"
      :pagination="pagination"
      :row-selection="{
        selectedRowKeys,
        onChange: (keys) => selectedRowKeys = keys
      }"
      @change="handleTableChange"
    >
      <template #action="{ record }">
        <div class="space-x-2">
          <button
            class="text-indigo-600 hover:text-indigo-900"
            @click="handleEdit(record)"
          >
            编辑
          </button>
          <button
            class="text-red-600 hover:text-red-900"
            @click="handleDelete(record)"
          >
            删除
          </button>
        </div>
      </template>
    </DataTable>
  </div>
</template>