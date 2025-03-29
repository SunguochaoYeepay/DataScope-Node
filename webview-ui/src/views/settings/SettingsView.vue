<script setup lang="ts">
// 设置页面组件
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">系统设置</h1>
      <p class="mt-2 text-sm text-gray-600">管理您的系统偏好设置</p>
    </div>

    <!-- 暂时显示一个占位内容 -->
    <div class="bg-white shadow rounded-lg p-6">
      <div class="space-y-6">
        <!-- 主题设置 -->
        <div>
          <h2 class="text-lg font-medium text-gray-900">主题设置</h2>
          <div class="mt-4 space-y-4">
            <div class="flex items-center">
              <input
                type="radio"
                name="theme"
                value="light"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                checked
              />
              <label class="ml-3 text-sm text-gray-700">浅色主题</label>
            </div>
            <div class="flex items-center">
              <input
                type="radio"
                name="theme"
                value="dark"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-3 text-sm text-gray-700">深色主题</label>
            </div>
          </div>
        </div>

        <!-- 语言设置 -->
        <div>
          <h2 class="text-lg font-medium text-gray-900">语言设置</h2>
          <select class="mt-4 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            <option value="zh">中文</option>
            <option value="en">English</option>
          </select>
        </div>

        <!-- 其他设置选项可以在这里添加 -->
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 组件样式 */
</style>