<template>
  <TheNavigation />
  <router-view />
  <TheFooter />
  <MessageNotification />
</template>

<script setup lang="ts">
import TheNavigation from './components/layout/TheNavigation.vue'
import TheFooter from './components/layout/TheFooter.vue'
import MessageNotification from './components/common/MessageNotification.vue'
</script>