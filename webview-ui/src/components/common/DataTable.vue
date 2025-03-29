<script setup lang="ts">
import { computed, ref } from 'vue'
import type { 
  TableProps, 
  TableColumn, 
  Pagination, 
  SorterConfig, 
  TableChangeEvent 
} from '@/types/table'

// 定义组件属性
const props = withDefaults(defineProps<TableProps>(), {
  dataSource: () => [],
  loading: false,
  rowKey: 'id'
})

// 定义组件事件
const emit = defineEmits<{
  (e: 'change', event: TableChangeEvent): void
  (e: 'update:selectedRowKeys', keys: string[]): void
}>()

// 当前排序状态
const currentSorter = ref<SorterConfig | null>(null)

// 当前筛选状态
const currentFilters = ref<Record<string, string[]>>({})

// 计算排序后的数据
const sortedData = computed(() => {
  if (!currentSorter.value) return props.dataSource

  const { key, order } = currentSorter.value
  return [...props.dataSource].sort((a, b) => {
    const aValue = a[key]
    const bValue = b[key]
    if (order === 'ascend') {
      return aValue > bValue ? 1 : -1
    }
    return aValue < bValue ? 1 : -1
  })
})

// 计算筛选后的数据
const filteredData = computed(() => {
  return sortedData.value.filter(record => {
    return Object.entries(currentFilters.value).every(([key, values]) => {
      if (!values || values.length === 0) return true
      return values.includes(String(record[key]))
    })
  })
})

// 处理排序变更
const handleSort = (column: TableColumn) => {
  if (!column.sortable) return

  const key = column.key
  let order: 'ascend' | 'descend' | null = 'ascend'

  if (currentSorter.value?.key === key) {
    if (currentSorter.value.order === 'ascend') {
      order = 'descend'
    } else if (currentSorter.value.order === 'descend') {
      order = null
    }
  }

  currentSorter.value = order ? { key, order } : null
  emitChange()
}

// 处理筛选变更
const handleFilter = (column: TableColumn, values: string[]) => {
  if (!column.filterable) return

  if (values.length === 0) {
    delete currentFilters.value[column.key]
  } else {
    currentFilters.value[column.key] = values
  }
  emitChange()
}

// 处理分页变更
const handlePageChange = (page: number) => {
  if (!props.pagination) return

  const newPagination: Pagination = {
    ...props.pagination,
    current: page
  }
  emitChange({ pagination: newPagination })
}

// 处理每页条数变更
const handlePageSizeChange = (pageSize: number) => {
  if (!props.pagination) return

  const newPagination: Pagination = {
    ...props.pagination,
    pageSize,
    current: 1
  }
  emitChange({ pagination: newPagination })
}

// 发送变更事件
const emitChange = (extraParams?: Partial<TableChangeEvent>) => {
  emit('change', {
    pagination: props.pagination,
    sorter: currentSorter.value || undefined,
    filters: Object.keys(currentFilters.value).length > 0 ? currentFilters.value : undefined,
    ...extraParams
  })
}

// 处理行选择
const handleRowSelect = (record: any) => {
  if (!props.rowSelection) return

  const key = typeof props.rowKey === 'function' 
    ? props.rowKey(record)
    : record[props.rowKey]

  const selectedKeys = [...props.rowSelection.selectedRowKeys]
  const index = selectedKeys.indexOf(key)

  if (index === -1) {
    selectedKeys.push(key)
  } else {
    selectedKeys.splice(index, 1)
  }

  emit('update:selectedRowKeys', selectedKeys)
  props.rowSelection.onChange(selectedKeys, 
    props.dataSource.filter(item => selectedKeys.includes(
      typeof props.rowKey === 'function' ? props.rowKey(item) : item[props.rowKey]
    ))
  )
}
</script>

<template>
  <div class="w-full overflow-hidden">
    <!-- 加载状态 -->
    <div v-if="loading" class="w-full h-32 flex items-center justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <!-- 表格内容 -->
    <div v-else class="w-full">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <!-- 表头 -->
          <thead class="bg-gray-50">
            <tr>
              <!-- 选择列 -->
              <th v-if="rowSelection" class="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  :checked="
                    rowSelection.selectedRowKeys.length > 0 &&
                    rowSelection.selectedRowKeys.length === dataSource.length
                  "
                  :indeterminate="
                    rowSelection.selectedRowKeys.length > 0 &&
                    rowSelection.selectedRowKeys.length < dataSource.length
                  "
                  @change="
                    handleRowSelect(
                      rowSelection.selectedRowKeys.length === dataSource.length
                        ? []
                        : dataSource.map(record =>
                            typeof rowKey === 'function'
                              ? rowKey(record)
                              : record[rowKey]
                          )
                    )
                  "
                />
              </th>

              <!-- 数据列 -->
              <th
                v-for="column in columns"
                :key="column.key"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                :class="[
                  column.align === 'center' ? 'text-center' : '',
                  column.align === 'right' ? 'text-right' : '',
                ]"
                :style="{ width: column.width }"
              >
                <div class="flex items-center space-x-1">
                  <span>{{ column.title }}</span>
                  
                  <!-- 排序图标 -->
                  <button
                    v-if="column.sortable"
                    class="text-gray-400 hover:text-gray-600"
                    @click="handleSort(column)"
                  >
                    <span class="sr-only">Sort</span>
                    <svg
                      class="h-4 w-4"
                      :class="{
                        'text-indigo-600':
                          currentSorter?.key === column.key &&
                          currentSorter?.order === 'ascend',
                      }"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  </button>

                  <!-- 筛选图标 -->
                  <button
                    v-if="column.filterable"
                    class="text-gray-400 hover:text-gray-600"
                    @click="
                      handleFilter(column, currentFilters[column.key] || [])
                    "
                  >
                    <span class="sr-only">Filter</span>
                    <svg
                      class="h-4 w-4"
                      :class="{
                        'text-indigo-600':
                          currentFilters[column.key]?.length > 0,
                      }"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                      />
                    </svg>
                  </button>
                </div>
              </th>
            </tr>
          </thead>

          <!-- 表格内容 -->
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="(record, index) in filteredData"
              :key="typeof rowKey === 'function' ? rowKey(record) : record[rowKey]"
              class="hover:bg-gray-50"
            >
              <!-- 选择列 -->
              <td v-if="rowSelection" class="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  :checked="rowSelection.selectedRowKeys.includes(
                    typeof rowKey === 'function' ? rowKey(record) : record[rowKey]
                  )"
                  @change="handleRowSelect(record)"
                />
              </td>

              <!-- 数据列 -->
              <td
                v-for="column in columns"
                :key="column.key"
                class="px-6 py-4 whitespace-nowrap"
                :class="[
                  column.align === 'center' ? 'text-center' : '',
                  column.align === 'right' ? 'text-right' : '',
                ]"
              >
                <template v-if="column.render">
                  <component
                    :is="column.render(record[column.dataIndex], record, index)"
                  />
                </template>
                <template v-else>
                  {{ record[column.dataIndex] }}
                </template>
              </td>
            </tr>

            <!-- 空状态 -->
            <tr v-if="filteredData.length === 0">
              <td
                :colspan="rowSelection ? columns.length + 1 : columns.length"
                class="px-6 py-4 text-center text-gray-500"
              >
                暂无数据
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div
        v-if="pagination"
        class="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6"
      >
        <div class="flex items-center">
          <span class="text-sm text-gray-700">
            共 {{ pagination.total }} 条
          </span>
          <select
            v-if="pagination.showSizeChanger"
            class="ml-2 rounded-md border-gray-300 py-1 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            :value="pagination.pageSize"
            @change="handlePageSizeChange(Number($event.target.value))"
          >
            <option value="10">10 条/页</option>
            <option value="20">20 条/页</option>
            <option value="50">50 条/页</option>
            <option value="100">100 条/页</option>
          </select>
        </div>

        <div class="flex items-center space-x-2">
          <!-- 上一页 -->
          <button
            class="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            :disabled="pagination.current === 1"
            @click="handlePageChange(pagination.current - 1)"
          >
            上一页
          </button>

          <!-- 页码 -->
          <span class="text-sm text-gray-700">
            第 {{ pagination.current }} 页
          </span>

          <!-- 下一页 -->
          <button
            class="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            :disabled="
              pagination.current ===
              Math.ceil(pagination.total / pagination.pageSize)
            "
            @click="handlePageChange(pagination.current + 1)"
          >
            下一页
          </button>

          <!-- 快速跳转 -->
          <div v-if="pagination.showQuickJumper" class="flex items-center">
            <span class="text-sm text-gray-700">跳至</span>
            <input
              type="number"
              class="ml-2 w-16 rounded-md border-gray-300 py-1 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              :min="1"
              :max="Math.ceil(pagination.total / pagination.pageSize)"
              :value="pagination.current"
              @change="handlePageChange(Number($event.target.value))"
            />
            <span class="ml-1 text-sm text-gray-700">页</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 自定义样式 */
</style>