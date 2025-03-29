<template>
  <div class="flex items-center justify-end mb-4">
    <span class="text-sm text-gray-500 mr-2">标准模式</span>
    <button
      type="button"
      class="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none"
      :class="[isTableMode ? 'bg-indigo-600' : 'bg-gray-200']"
      @click="toggleTableMode"
    >
      <span
        class="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
        :class="[isTableMode ? 'translate-x-5' : 'translate-x-0']"
      />
    </button>
    <span class="text-sm text-gray-500 ml-2">表格模式</span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

const props = defineProps<{
  modelValue: boolean
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>();

const isTableMode = ref(props.modelValue);

watch(() => props.modelValue, (newValue) => {
  isTableMode.value = newValue;
});

const toggleTableMode = () => {
  isTableMode.value = !isTableMode.value;
  emit('update:modelValue', isTableMode.value);
};

// 组件挂载时自动设置为表格模式
onMounted(() => {
  if (!isTableMode.value) {
    isTableMode.value = true;
    emit('update:modelValue', true);
  }
});
</script>