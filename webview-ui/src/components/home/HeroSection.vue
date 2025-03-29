<template>
  <div class="bg-indigo-600">
    <div class="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
      <div class="text-center">
        <h1 class="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
          DataScope
        </h1>
        <p class="mt-6 max-w-2xl mx-auto text-xl text-indigo-200">
          统一的数据查询和管理平台，让数据探索更简单
        </p>
        <div class="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
          <div class="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
            <router-link
              to="/datasource"
              class="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 sm:px-8"
            >
              开始使用
            </router-link>
            <a
              href="https://github.com/dreambt/data-scope"
              target="_blank"
              class="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-500 bg-opacity-60 hover:bg-opacity-70 sm:px-8"
            >
              了解更多
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>