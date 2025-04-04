<template>
  <div class="page-header">
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center">
        <h1 class="text-xl font-semibold mb-0">{{ title }}</h1>
      </div>
      
      <div class="flex items-center space-x-2">
        <template v-for="(item, index) in actionItems" :key="index">
          <a-button 
            :type="item.type || 'default'" 
            @click="item.onClick"
          >
            <template #icon v-if="item.icon">
              <component :is="item.icon" />
            </template>
            {{ item.text }}
          </a-button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
  title: string;
  actionItems?: Array<{
    text: string;
    icon?: any;
    type?: 'primary' | 'default' | 'dashed' | 'text' | 'link';
    onClick: () => void;
  }>;
}>();
</script>

<style scoped>
.page-header {
  margin-bottom: 16px;
}
</style>