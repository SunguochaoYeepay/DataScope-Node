<template>
  <div class="bg-white mb-6 border-b border-gray-200">
    <nav class="-mb-px flex space-x-8 px-6" aria-label="标签页">
      <a
        v-for="tab in tabs"
        :key="tab.id"
        :class="[
          activeTab === tab.id
            ? 'border-indigo-500 text-indigo-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
          'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer'
        ]"
        @click="handleTabClick(tab.id)"
      >
        <i :class="['mr-1.5', tab.icon]"></i>
        {{ tab.name }}
      </a>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  activeTab: string
}>()

const emit = defineEmits<{
  (e: 'tab-change', tabId: string): void
}>()

const tabs = [
  {
    id: 'history',
    name: '执行历史',
    icon: 'fas fa-history'
  },
  {
    id: 'versions',
    name: '版本',
    icon: 'fas fa-code-branch'
  },
  {
    id: 'visualization',
    name: '可视化',
    icon: 'fas fa-chart-bar'
  },
  {
    id: 'execution-plan',
    name: '执行计划',
    icon: 'fas fa-sitemap'
  },
  {
    id: 'suggestions',
    name: '优化建议',
    icon: 'fas fa-lightbulb'
  },
  {
    id: 'results',
    name: '结果',
    icon: 'fas fa-table'
  }
]

const activeTab = computed(() => props.activeTab)

const handleTabClick = (tabId: string) => {
  emit('tab-change', tabId)
}
</script> 