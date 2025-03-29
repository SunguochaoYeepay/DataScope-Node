<template>
  <div class="test-view p-6">
    <h1 class="text-2xl font-bold mb-4">测试页面</h1>
    <p class="mb-4">这是一个用于测试路由和组件加载的简单页面</p>
    
    <div class="bg-white shadow rounded-lg p-6">
      <pre class="bg-gray-100 p-4 rounded">
        当前路径: {{ $route.fullPath }}
      </pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
</script>