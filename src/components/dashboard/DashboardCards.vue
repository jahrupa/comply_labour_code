<template>
  <div class="dashboard-card">
    <div class="bg-circle"></div>

    <h2 class="welcome-title">Welcome back, {{ auth.user?.first }} 👋</h2>

    <p class="welcome-text">
      Your New Wage Code compliance engine is ready. Upload salary data to get started.
    </p>

    <div class="badge-container">
      <div class="badge">⚡ {{ app.trialRemaining }} employee restructures remaining</div>

      <div v-if="app.activePlan" class="badge">✅ {{ app.activePlan.name }} active</div>
    </div>

    <div v-if="app.trialLimit > 0" class="progress-wrapper">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${pct}%` }" />
      </div>

      <p class="progress-text">{{ app.trialUsed }} / {{ app.trialLimit }} credits used</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from 'src/stores/auth'
import { useAppStore } from 'src/stores/app'

const auth = useAuthStore()
const app = useAppStore()

const pct = computed(() => {
  return app.trialLimit > 0 ? Math.min(100, (app.trialUsed / app.trialLimit) * 100) : 0
})
</script>

<style scoped>
.dashboard-card {
  background: linear-gradient(135deg, var(--brand), var(--brand-soft));
  border-radius: 16px;
  padding: 28px 32px;
  color: var(--bg);
  margin-bottom: 28px;
  position: relative;
  overflow: hidden;
}

.bg-circle {
  position: absolute;
  right: -20px;
  top: -40px;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1), transparent 70%);
  pointer-events: none;
}

.welcome-title {
  color: var(--bg);
  font-size: 22px;
  margin-bottom: 6px;
}

.welcome-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.badge-container {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 14px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.2);
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  color: white;
}

.progress-wrapper {
  max-width: 240px;
  margin-top: 12px;
}

.progress-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--gold-soft);
  border-radius: 3px;
  transition: width 0.5s ease;
}

.progress-text {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 4px;
}
</style>
