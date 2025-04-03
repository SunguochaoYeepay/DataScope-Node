<template>
  <button
    :type="buttonType"
    :class="[
      'inline-flex items-center justify-center rounded-md focus:outline-none transition-colors',
      sizeClasses,
      variantClasses,
      disabledClasses,
      blockClass
    ]"
    :disabled="disabled || loading"
    @click="onClick"
  >
    <span v-if="loading" class="mr-2">
      <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </span>
    <span v-if="icon && !loading" class="mr-2">
      <i :class="`fas fa-${icon}`"></i>
    </span>
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

type ButtonType = 'button' | 'submit' | 'reset';

export default defineComponent({
  name: 'Button',
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: (value: string) => ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'text'].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: (value: string) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
    },
    type: {
      type: String as () => ButtonType,
      default: 'button',
      validator: (value: string) => ['button', 'submit', 'reset'].includes(value)
    },
    icon: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    block: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    buttonType(): ButtonType {
      return this.type as ButtonType;
    },
    sizeClasses(): string {
      const sizes = {
        xs: 'px-2 py-1 text-xs',
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-5 py-2.5 text-base',
        xl: 'px-6 py-3 text-lg'
      };
      return sizes[this.size as keyof typeof sizes] || sizes.md;
    },
    variantClasses(): string {
      const variants = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500',
        success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500',
        warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500',
        info: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
        text: 'bg-transparent text-indigo-600 hover:bg-gray-100 hover:text-indigo-800'
      };
      return variants[this.variant as keyof typeof variants] || variants.primary;
    },
    disabledClasses(): string {
      return (this.disabled || this.loading) ? 'opacity-50 cursor-not-allowed' : '';
    },
    blockClass(): string {
      return this.block ? 'w-full' : '';
    }
  },
  methods: {
    onClick(event: MouseEvent) {
      if (this.disabled || this.loading) return;
      this.$emit('click', event);
    }
  }
});
</script> 