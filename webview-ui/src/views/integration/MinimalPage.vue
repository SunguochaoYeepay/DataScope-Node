<template>
  <div class="minimal-page p-6">
    <h1 class="text-2xl font-bold mb-4">最小化测试页面</h1>
    <p>这是一个最小化的页面，用于测试路由加载是否正常。</p>
    
    <div class="mt-4 p-4 bg-gray-100 rounded">
      当前路径: {{ $route.fullPath }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
  console.log('最小化页面已加载');
});
</script>