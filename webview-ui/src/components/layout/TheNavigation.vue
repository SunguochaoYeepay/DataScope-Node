<template>
  <nav class="bg-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <img alt="DataScope" class="h-8 w-auto" src="@/assets/images/logo.png"/>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <router-link
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              :class="[
                'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                isActiveRoute(item.path)
                  ? 'border-indigo-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              ]"
            >
              {{ item.name }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

import { useRouter } from 'vue-router'

const router = useRouter()
const baseUrl = import.meta.env.BASE_URL || '/'

const navItems = [
  { name: '首页', path: baseUrl === '/' ? '/' : baseUrl },
  { name: '数据源', path: `${baseUrl}datasource`.replace('//', '/') },
  { name: '查询', path: `${baseUrl}query/history`.replace('//', '/') },
  { name: '系统集成', path: `${baseUrl}integration`.replace('//', '/') },
  { name: '设置', path: `${baseUrl}settings`.replace('//', '/') }
]

// 判断导航项是否处于激活状态
const isActiveRoute = (path: string) => {
  // 处理根路径特殊情况
  if (path === '/' || path === baseUrl) {
    return route.path === '/' || route.path === baseUrl
  }
  
  // 考虑baseUrl的情况下检查路径是否匹配
  const routePath = route.path.startsWith(baseUrl) ? route.path.slice(baseUrl.length - 1) : route.path
  const navPath = path.startsWith(baseUrl) ? path.slice(baseUrl.length - 1) : path
  
  return routePath.startsWith(navPath)
}
</script>