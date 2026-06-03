<template>
  <div style="min-height: 100vh; display: flex; flex-direction: column">
    <AppNavbar />

    <main style="flex: 1">
      <RouterView />
    </main>

    <AppFooter />

    <div v-if="app.notification" :class="`notif notif-${app.notification?.type}`">
      {{ app.notification?.msg }}
    </div>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import AppNavbar from 'src/components/common/AppNavbar.vue'
import AppFooter from 'src/components/common/AppFooter.vue'
import { useAppStore } from 'src/stores/app'

const app = useAppStore()
</script>

<style scoped>
/* Optional styles */
</style>
