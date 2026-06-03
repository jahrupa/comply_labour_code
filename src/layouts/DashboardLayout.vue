<template>
  <div style="min-height: 100vh; display: flex; flex-direction: column">
    <AppNavbar />

    <!-- ✅ Sidebar + Page content ek hi flex row mein hone chahiye -->
    <div class="dash-layout">
      <AppSidebar :active-tab="activeTab" @tab-change="activeTab = $event" />

      <RouterView :active-tab="activeTab" @tab-change="activeTab = $event" />
    </div>

    <div v-if="app.notification" :class="`notif notif-${app.notification?.type}`">
      {{ app.notification?.msg }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import AppNavbar from 'src/components/common/AppNavbar.vue'
import AppSidebar from 'src/components/common/AppSidebar.vue'
import { useAppStore } from 'src/stores/app'

defineOptions({ name: 'DashboardLayoutView' })

const app = useAppStore()
const activeTab = ref('calculator')
</script>

<style scoped>
.dash-layout {
  display: flex;
  flex: 1;
  min-height: calc(100vh - 68px);
}
.dash-main {
  flex: 1;
  padding: 24px;
}
@media (max-width: 960px) {
  .dash-layout {
    flex-direction: column;
  }
}
</style>
