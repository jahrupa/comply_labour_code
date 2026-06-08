<template>
  <aside class="sidebar">
    <div class="sidebar-section">
      <div class="sidebar-label">Main</div>

      <div
        v-for="item in items"
        :key="item.key"
        :class="['sidebar-item', { active: isActive(item) }]"
        @click="switchTab(item)"
      >
        <span class="sidebar-icon">{{ item.icon }}</span>
        {{ item.label }}
      </div>
    </div>

    <div class="sidebar-section mt-16">
      <div class="sidebar-label">Account</div>

      <div
        v-for="item in accountItems"
        :key="item.key"
        :class="['sidebar-item', { active: isActive(item) }]"
        @click="switchTab(item)"
      >
        <span class="sidebar-icon">{{ item.icon }}</span>
        {{ item.label }}
      </div>
    </div>
    <div>
      <div class="sidebar-section mt-16" v-if="userType === 'admin'">
        <div class="sidebar-label">Admin</div>

        <div
          v-for="item in adminItems"
          :key="item.key"
          :class="['sidebar-item', { active: isActive(item) }]"
          @click="switchTab(item)"
        >
          <span class="sidebar-icon">
            {{ item.icon }}
          </span>

          {{ item.label }}
        </div>

        <div class="sidebar-item" @click="auth.logout">
          <span class="sidebar-icon">🚪</span>
          Log out
        </div>
      </div>
    </div>
    <div class="trial-section">
      <div class="trial-card">
        <p class="plan-name">
          {{ app.activePlan ? app.activePlan.name : 'Free Trial' }}
        </p>

        <p class="plan-usage">{{ app.trialUsed }} / {{ app.trialLimit }} used</p>

        <div class="trial-bar">
          <div class="trial-fill" :style="{ width: `${pct}%` }" />
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from 'src/stores/app'
import { useAuthStore } from 'src/stores/auth'
import { useRouter, useRoute } from 'vue-router'

const props = defineProps({
  activeTab: {
    type: String,
    default: 'calculator',
  },
})
const router = useRouter()
const route = useRoute()

const isActive = (item) => {
  if (item.route) {
    return route.path === item.route || route.path.startsWith(item.route + '/')
  }

  return props.activeTab === item.key
}

const emit = defineEmits(['tab-change'])
// const userType = computed(() => auth.user?.type)
const userType = 'admin' // --- IGNORE ---
const app = useAppStore()
const auth = useAuthStore()

const switchTab = (item) => {
  // console.log('Clicked:', item)

  if (item.route) {
    router.push(item.route)
    return
  }

  emit('tab-change', item.key)
}

const pct = computed(() => {
  if (app.trialLimit <= 0) return 0

  return Math.min(100, (app.trialUsed / app.trialLimit) * 100)
})

const items = [
  {
    key: 'calculator',
    icon: '⚡',
    label: 'Wage Calculator',
  },
  {
    key: 'results',
    icon: '📊',
    label: 'My Results',
  },
  {
    key: 'tutorial',
    icon: '🎬',
    label: 'Video Tutorial',
  },
]

const accountItems = [
  {
    key: 'billing',
    icon: '💳',
    label: 'Plans & Billing',
  },
]
const adminItems = [
  {
    key: 'admin-dashboard',
    icon: '📊',
    label: 'Dashboard',
    route: '/admin/dashboard',
  },
  {
    key: 'subscription-plan',
    icon: '📦',
    label: 'Subscription Plan',
    route: '/admin/plans',
  },
  {
    key: 'user',
    icon: '👤',
    label: 'User',
    route: '/admin/users',
  },
  {
    key: 'rules',
    icon: '📋',
    label: 'Rules',
    route: '/admin/rules',
  },
  {
    key: 'rule-groups',
    icon: '📋',
    label: 'Rule Groups',
    route: '/admin/rule-groups',
  },
  {
    key: 'coupon',
    icon: '🎁',
    label: 'Coupon',
    route: '/admin/coupons',
  },
  {
    key: 'analytics',
    icon: '📊',
    label: 'Analytics',
    route: '/admin/analytics',
  },
  {
    key: 'invoices',
    icon: '🧾',
    label: 'Invoices',
    route: '/admin/invoices',
  },
]
</script>

<style scoped>
@media (max-width: 768px) {
  .sidebar {
    position: sticky;
    top: 60px;
    z-index: 120;
    width: 100%;
    height: auto;
    padding: 8px;
    gap: 4px;
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    border-right: none;
    border-bottom: 1px solid var(--rule);
    background: var(--bg-card);
  }
}
.mt-16 {
  margin-top: 16px;
}

/* Sidebar */
.sidebar {
  width: 240px;
  flex-shrink: 0;
  background: var(--bg-card);
  border-right: 1px solid var(--rule);
  padding: 24px 0;
  position: sticky;
  top: 68px;
  height: calc(100vh - 68px);
  overflow-y: auto;
}

.sidebar-section {
  padding: 0 16px;
  margin-bottom: 8px;
}

.sidebar-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: var(--ink-faint);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 0 12px;
  margin-bottom: 6px;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--ink-soft);
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 2px;
}

.sidebar-item:hover {
  background: var(--bg-soft);
  color: var(--ink);
}

.sidebar-item.active {
  background: var(--brand);
  color: var(--bg);
}

[data-theme='night'] .sidebar-item.active {
  background: var(--gold);
  color: #0a0f1f;
}

.sidebar-icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

/* Trial Card */
.trial-section {
  padding: 16px;
  margin-top: auto;
}

.trial-card {
  background: var(--gold-bg);
  border: 1px solid var(--gold);
  border-radius: 10px;
  padding: 14px;
}

.plan-name {
  font-size: 11px;
  font-weight: 700;
  color: var(--gold);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 6px;
}

.plan-usage {
  font-size: 13px;
  color: var(--ink-soft);
}

.trial-bar {
  margin-top: 8px;
  height: 6px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.trial-fill {
  height: 100%;
  background: var(--gold-soft);
  border-radius: 3px;
  transition: width 0.5s;
}

/* Tablet */
@media (max-width: 960px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: static;
    display: flex;
    overflow-x: auto;
    padding: 12px;
    border-right: none;
    border-bottom: 1px solid var(--rule);
  }

  .sidebar-label {
    display: none;
  }

  .sidebar-section {
    display: flex;
    flex-shrink: 0;
    gap: 4px;
    padding: 0;
    margin: 0;
  }

  .trial-section {
    display: none;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .sidebar {
    position: sticky;
    top: 60px;
    z-index: 120;
    width: 100%;
    height: auto;
    padding: 8px;
    gap: 4px;
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    border-right: none;
    border-bottom: 1px solid var(--rule);
    background: var(--bg-card);
  }

  .sidebar-item {
    gap: 6px;
    margin: 0;
    padding: 9px 10px;
    font-size: 12px;
    white-space: nowrap;
  }

  .sidebar-icon {
    width: auto;
    font-size: 14px;
  }
}
</style>
