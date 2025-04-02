<template>
  <div class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex space-x-8 h-12">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          :class="[
            'inline-flex items-center px-3 py-2 text-sm font-medium border-b-2',
            isActiveRoute(item.path)
              ? 'border-indigo-500 text-gray-900'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
          ]"
        >
          <component :is="item.icon" class="h-4 w-4 mr-2" v-if="item.icon" />
          {{ item.name }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const baseUrl = import.meta.env.BASE_URL || '/';

const navItems = [
  { 
    name: '查询历史', 
    path: `${baseUrl}query/history`.replace('//', '/'),
    icon: 'HistoryIcon'
  },
  { 
    name: '查询编辑器', 
    path: `${baseUrl}query/editor`.replace('//', '/'),
    icon: 'PencilIcon'
  }
];

// 判断导航项是否处于激活状态
const isActiveRoute = (path: string) => {
  // 处理根路径特殊情况
  if (path === '/' || path === baseUrl) {
    return route.path === '/' || route.path === baseUrl;
  }
  
  // 考虑baseUrl的情况下检查路径是否匹配
  const routePath = route.path.startsWith(baseUrl) ? route.path.slice(baseUrl.length - 1) : route.path;
  const navPath = path.startsWith(baseUrl) ? path.slice(baseUrl.length - 1) : path;
  
  return routePath.startsWith(navPath);
};
</script>

<style scoped>
/* 确保子导航栏不会遮挡内容 */
.bg-white.shadow-sm {
  z-index: 10;
  position: relative;
}
</style>