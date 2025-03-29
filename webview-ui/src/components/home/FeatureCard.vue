<template>
  <div class="transition-all duration-300 ease-in-out feature-card p-6 bg-gray-50 rounded-lg">
    <div class="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
      <i :class="icon"></i>
    </div>
    <div class="mt-5">
      <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
      <p class="mt-2 text-base text-gray-500">
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  title: string
  description: string
}

defineProps<Props>()</script>