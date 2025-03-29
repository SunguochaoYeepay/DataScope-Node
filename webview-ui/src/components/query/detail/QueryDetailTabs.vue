<template>
  <div class="mb-6">
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-2">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="handleTabChange(tab.id)"
          class="py-4 px-6 text-sm font-medium border-b-2 whitespace-nowrap flex items-center"
          :class="[
            activeTab === tab.id
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          <i :class="[tab.icon, 'mr-2']"></i>
          {{ tab.label }}
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

export interface TabItem {
  id: string
  label: string
  icon: string
}

// 默认的标签页
const defaultTabs: TabItem[] = [
  { id: 'visualization', label: '可视化', icon: 'fas fa-chart-bar' },
  { id: 'execution-plan', label: '执行计划', icon: 'fas fa-sitemap' },
  { id: 'suggestions', label: '优化建议', icon: 'fas fa-lightbulb' },
  { id: 'results', label: '查询结果', icon: 'fas fa-table' },
]

const props = defineProps<{
  activeTab: string
  tabs?: TabItem[]
}>()

const emit = defineEmits<{
  (e: 'tab-change', tabId: string): void
}>()

// 使用传入的标签页或默认标签页
const tabs = props.tabs || defaultTabs

// 处理标签页切换
const handleTabChange = (tabId: string) => {
  emit('tab-change', tabId)
}
</script> 