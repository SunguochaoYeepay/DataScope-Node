<template>
  <div class="query-layout">
    <main class="container mx-auto px-4 py-6">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
// 完全移除子导航
</script>

<style scoped>
.query-layout {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 4rem); /* 减去顶部导航的高度 */
}
</style>