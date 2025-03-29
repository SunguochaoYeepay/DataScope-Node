<template>
  <div class="py-12 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="lg:text-center">
        <h2 class="text-base text-indigo-600 font-semibold tracking-wide uppercase">
          功能特点
        </h2>
        <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          更智能的数据管理方式
        </p>
        <p class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
          DataScope提供全面的数据源管理、查询执行和结果处理功能，让数据探索变得简单高效。
        </p>
      </div>

      <div class="mt-10">
        <div class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            v-for="feature in features"
            :key="feature.title"
            v-bind="feature"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import FeatureCard from './FeatureCard.vue'

const features = [
  {
    icon: 'fas fa-database',
    title: '数据源管理',
    description: '轻松连接和管理多种数据库，包括MySQL、DB2等，自动提取和同步元数据。'
  },
  {
    icon: 'fas fa-search',
    title: '智能查询',
    description: '支持SQL查询和自然语言描述，通过机器学习推断表关系，优化查询体验。'
  },
  {
    icon: 'fas fa-code',
    title: '低代码集成',
    description: '通过JSON协议与低代码平台集成，同步查询结果和页面配置，加速应用开发。'
  },
  {
    icon: 'fas fa-shield-alt',
    title: '安全可靠',
    description: '内置密码加密和数据访问控制，保护敏感数据安全，支持数据脱敏。'
  },
  {
    icon: 'fas fa-chart-bar',
    title: '数据可视化',
    description: '支持多种数据展示形式，包括查询表单、视图页面和图表显示，直观呈现数据。'
  },
  {
    icon: 'fas fa-robot',
    title: 'AI辅助',
    description: '集成大语言模型，提供自然语言查询和智能推荐，增强用户体验。'
  }
]
</script>