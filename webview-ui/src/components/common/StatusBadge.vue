<template>
  <span 
    class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium" 
    :class="statusClasses">
    <slot>{{ text }}</slot>
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export type StatusType = 'success' | 'warning' | 'error' | 'info' | 'default';

export default defineComponent({
  name: 'StatusBadge',
  props: {
    status: {
      type: String as () => StatusType,
      default: 'default',
      validator: (value: string): boolean => ['success', 'warning', 'error', 'info', 'default'].includes(value)
    },
    text: {
      type: String,
      default: ''
    }
  },
  computed: {
    statusClasses(): string {
      const classes = {
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        error: 'bg-red-100 text-red-800',
        info: 'bg-blue-100 text-blue-800',
        default: 'bg-gray-100 text-gray-800'
      };
      
      return classes[this.status] || classes.default;
    }
  }
});
</script> 