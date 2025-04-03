<template>
  <i :class="[iconClass, sizeClass, colorClass]"></i>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Icon',
  props: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: 'md',
      validator: (value: string) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
    },
    color: {
      type: String,
      default: ''
    }
  },
  computed: {
    iconClass(): string {
      // 使用Font Awesome图标
      return `fas fa-${this.name}`;
    },
    sizeClass(): string {
      const sizes = {
        xs: 'text-xs',
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl'
      };
      return sizes[this.size as keyof typeof sizes] || 'text-base';
    },
    colorClass(): string {
      if (!this.color) return '';
      
      const colors = {
        primary: 'text-indigo-600',
        secondary: 'text-gray-600',
        success: 'text-green-600',
        danger: 'text-red-600',
        warning: 'text-yellow-600',
        info: 'text-blue-600'
      };
      
      return colors[this.color as keyof typeof colors] || `text-${this.color}`;
    }
  }
});
</script> 