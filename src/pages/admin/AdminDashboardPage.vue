<template>
  <div class="admin-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Admin Dashboard</h1>
        <p class="page-sub">Platform overview — {{ today }}</p>
      </div>
      <div class="header-actions">
        <select v-model="range" class="range-select" @change="loadAll">
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
        <button class="btn-primary" @click="loadAll">↻ Refresh</button>
      </div>
    </div>

    <!-- Primary KPI Row -->
    <div class="kpi-grid">
      <div class="kpi-card kpi-card--accent" v-for="k in primaryKpis" :key="k.label">
        <div class="kpi-top">
          <span class="kpi-icon">{{ k.icon }}</span>
          <span :class="['kpi-trend', k.trend > 0 ? 'up' : 'down']">
            {{ k.trend > 0 ? '↑' : '↓' }} {{ Math.abs(k.trend) }}%
          </span>
        </div>
        <p class="kpi-value">{{ k.value }}</p>
        <p class="kpi-label">{{ k.label }}</p>
      </div>
    </div>

    <!-- Revenue + User Growth Charts -->
    <div class="charts-2col">
      <!-- Revenue Bar -->
      <div class="card">
        <div class="chart-header">
          <h3 class="chart-title">Revenue (₹)</h3>
          <span class="chart-sub">Monthly breakdown</span>
        </div>
        <div class="bar-chart">
          <div
            v-for="(d, i) in revenueChart"
            :key="i"
            class="bar-wrap"
            :title="`${d.label}: ₹${d.value.toLocaleString('en-IN')}`"
          >
            <div class="bar-value">{{ formatK(d.value) }}</div>
            <div class="bar" :style="{ height: barPct(d.value, maxRevenue) + 'px' }"></div>
            <div class="bar-label">{{ d.label }}</div>
          </div>
        </div>
      </div>

      <!-- Users Line (CSS line approximation) -->
      <div class="card">
        <div class="chart-header">
          <h3 class="chart-title">New Signups</h3>
          <span class="chart-sub">Monthly trend</span>
        </div>
        <div class="line-chart">
          <svg :viewBox="`0 0 ${lineW} ${lineH}`" class="line-svg" preserveAspectRatio="none">
            <defs>
              <linearGradient id="lgrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="var(--brand)" stop-opacity="0.25" />
                <stop offset="100%" stop-color="var(--brand)" stop-opacity="0.02" />
              </linearGradient>
            </defs>
            <path :d="areaPath" fill="url(#lgrad)" />
            <path
              :d="linePath"
              fill="none"
              stroke="var(--brand)"
              stroke-width="2.5"
              stroke-linejoin="round"
            />
            <circle
              v-for="(pt, i) in linePoints"
              :key="i"
              :cx="pt.x"
              :cy="pt.y"
              r="4"
              fill="var(--brand)"
              class="dot"
            >
              <title>{{ signupChart[i].label }}: {{ signupChart[i].value }}</title>
            </circle>
          </svg>
          <div class="line-labels">
            <span v-for="d in signupChart" :key="d.label">{{ d.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Plan split + Coupon usage + Recent signups -->
    <div class="charts-3col mt-20">
      <!-- Plan Distribution -->
      <div class="card">
        <h3 class="chart-title">Plan Distribution</h3>
        <div class="plan-bars">
          <div v-for="p in planDist" :key="p.name" class="plan-row">
            <div class="plan-name-wrap">
              <span class="plan-dot" :style="{ background: p.color }"></span>
              <span class="plan-name">{{ p.name }}</span>
              <span class="plan-count">{{ p.count }}</span>
            </div>
            <div class="plan-bar-bg">
              <div class="plan-bar-fill" :style="{ width: p.pct + '%', background: p.color }"></div>
            </div>
            <span class="plan-pct">{{ p.pct }}%</span>
          </div>
        </div>
      </div>

      <!-- Coupon usage summary -->
      <div class="card">
        <h3 class="chart-title">Coupon Activity</h3>
        <div class="coupon-stats">
          <div class="cs-row" v-for="c in couponActivity" :key="c.code">
            <code class="code-tag">{{ c.code }}</code>
            <div class="cs-bar-wrap">
              <div class="cs-bar-bg">
                <div class="cs-bar-fill" :style="{ width: c.pct + '%' }"></div>
              </div>
              <span class="cs-count">{{ c.uses }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card">
        <h3 class="chart-title">Quick Actions</h3>
        <div class="quick-actions">
          <button class="qa-btn" @click="$router.push('/admin/users')">
            <span>👤</span><span>Manage Users</span>
          </button>
          <button class="qa-btn" @click="$router.push('/admin/plans')">
            <span>📦</span><span>Subscription Plans</span>
          </button>
          <button class="qa-btn" @click="$router.push('/admin/coupons')">
            <span>🎁</span><span>Coupons</span>
          </button>
          <button class="qa-btn" @click="$router.push('/admin/invoices')">
            <span>🧾</span><span>Invoices</span>
          </button>
          <button class="qa-btn" @click="$router.push('/admin/rules')">
            <span>📋</span><span>Rules</span>
          </button>
          <button class="qa-btn" @click="$router.push('/admin/rule-groups')">
            <span>🗂</span><span>Rule Groups</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="mt-20 two-col-bottom">
      <!-- Recent Users -->
      <div class="card">
        <div class="section-header">
          <h3 class="chart-title" style="margin: 0">Recent Signups</h3>
          <button class="btn-ghost btn-sm" @click="$router.push('/admin/users')">View all</button>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Plan</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in recentUsers" :key="u.id">
              <td>
                <div class="user-cell">
                  <div class="avatar">{{ initials(u.name) }}</div>
                  <div>
                    <div style="font-size: 13px; font-weight: 600; color: var(--ink)">
                      {{ u.name }}
                    </div>
                    <div style="font-size: 11px; color: var(--ink-mute)">{{ u.email }}</div>
                  </div>
                </div>
              </td>
              <td>
                <span class="plan-tag">{{ u.plan }}</span>
              </td>
              <td style="font-size: 12px; color: var(--ink-mute)">{{ formatDate(u.joined) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Recent Invoices -->
      <div class="card">
        <div class="section-header">
          <h3 class="chart-title" style="margin: 0">Recent Invoices</h3>
          <button class="btn-ghost btn-sm" @click="$router.push('/admin/invoices')">
            View all
          </button>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="inv in recentInvoices" :key="inv.id">
              <td>
                <div
                  style="
                    font-size: 12px;
                    font-family: 'JetBrains Mono', monospace;
                    color: var(--brand);
                  "
                >
                  {{ inv.no }}
                </div>
                <div style="font-size: 11px; color: var(--ink-mute)">{{ inv.user }}</div>
              </td>
              <td style="font-weight: 600; color: var(--ink)">
                ₹{{ inv.amount.toLocaleString('en-IN') }}
              </td>
              <td>
                <span :class="['status-tag', inv.status]">{{ inv.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
// import { useRouter } from 'vue-router'

defineOptions({ name: 'AdminDashboardPage' })
// const router = useRouter()

const range = ref('30')
const today = new Date().toLocaleDateString('en-IN', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

// ── KPIs ──────────────────────────────────────────────────────────────────
const primaryKpis = ref([
  { icon: '👥', label: 'Total Users', value: '1,284', trend: 12 },
  { icon: '💰', label: 'Monthly Revenue', value: '₹4,82,500', trend: 8 },
  { icon: '📦', label: 'Active Subscriptions', value: '963', trend: 5 },
  { icon: '🧾', label: 'Invoices (Month)', value: '321', trend: -2 },
  { icon: '🎟️', label: 'Coupons Used', value: '87', trend: 15 },
  { icon: '📋', label: 'Active Rules', value: '24', trend: 0 },
])

// ── Revenue chart ─────────────────────────────────────────────────────────
const revenueChart = ref([
  { label: 'Jan', value: 312000 },
  { label: 'Feb', value: 285000 },
  { label: 'Mar', value: 398000 },
  { label: 'Apr', value: 421000 },
  { label: 'May', value: 463000 },
  { label: 'Jun', value: 482500 },
])
const maxRevenue = computed(() => Math.max(...revenueChart.value.map((d) => d.value)))
const barPct = (v, max) => Math.max(4, Math.round((v / max) * 130))
const formatK = (v) => (v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${Math.round(v / 1000)}K`)

// ── Signup line chart ─────────────────────────────────────────────────────
const signupChart = ref([
  { label: 'Jan', value: 98 },
  { label: 'Feb', value: 112 },
  { label: 'Mar', value: 145 },
  { label: 'Apr', value: 134 },
  { label: 'May', value: 178 },
  { label: 'Jun', value: 203 },
])
const lineW = 400
const lineH = 130
const linePoints = computed(() => {
  const vals = signupChart.value.map((d) => d.value)
  const maxV = Math.max(...vals)
  const minV = Math.min(...vals)
  const pad = 10
  return vals.map((v, i) => ({
    x: pad + (i / (vals.length - 1)) * (lineW - pad * 2),
    y: lineH - pad - ((v - minV) / (maxV - minV + 1)) * (lineH - pad * 2),
  }))
})
const linePath = computed(() =>
  linePoints.value.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' '),
)
const areaPath = computed(() => {
  const pts = linePoints.value
  if (!pts.length) return ''
  return `${linePath.value} L ${pts[pts.length - 1].x} ${lineH} L ${pts[0].x} ${lineH} Z`
})

// ── Plan distribution ─────────────────────────────────────────────────────
const planDist = ref([
  { name: 'Enterprise', count: 142, pct: 45, color: '#1b3a5c' },
  { name: 'Pro', count: 98, pct: 31, color: '#b5893a' },
  { name: 'Starter', count: 75, pct: 24, color: '#1a7a4a' },
])

// ── Coupon activity ───────────────────────────────────────────────────────
const couponActivity = ref([
  { code: 'SUMMER10', uses: 342, pct: 100 },
  { code: 'WELCOME20', uses: 198, pct: 58 },
  { code: 'DIWALI25', uses: 87, pct: 25 },
  { code: 'FLASH15', uses: 50, pct: 15 },
])

// ── Recent Users ──────────────────────────────────────────────────────────
const recentUsers = ref([
  {
    id: 1,
    name: 'Arjun Sharma',
    email: 'arjun@techcorp.in',
    plan: 'Pro',
    joined: new Date(2026, 5, 3),
  },
  {
    id: 2,
    name: 'Priya Patel',
    email: 'priya@legalease.com',
    plan: 'Enterprise',
    joined: new Date(2026, 5, 2),
  },
  {
    id: 3,
    name: 'Rohan Mehta',
    email: 'rohan@finserv.co',
    plan: 'Starter',
    joined: new Date(2026, 5, 1),
  },
  {
    id: 4,
    name: 'Ananya Singh',
    email: 'ananya@startup.io',
    plan: 'Pro',
    joined: new Date(2026, 4, 31),
  },
  {
    id: 5,
    name: 'Vikram Nair',
    email: 'vikram@enterprise.in',
    plan: 'Enterprise',
    joined: new Date(2026, 4, 30),
  },
])

// ── Recent Invoices ───────────────────────────────────────────────────────
const recentInvoices = ref([
  { id: 1, no: 'INV-0018', user: 'Arjun Sharma', amount: 5998, status: 'paid' },
  { id: 2, no: 'INV-0017', user: 'Priya Patel', amount: 11799, status: 'paid' },
  { id: 3, no: 'INV-0016', user: 'Rohan Mehta', amount: 2358, status: 'pending' },
  { id: 4, no: 'INV-0015', user: 'Ananya Singh', amount: 5998, status: 'paid' },
  { id: 5, no: 'INV-0014', user: 'Flash Deal Ltd', amount: 2358, status: 'failed' },
])

const initials = (name) =>
  (name || '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'

function loadAll() {
  /* trigger real API calls */
}

onMounted(loadAll)
</script>

<style scoped>
.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}
.range-select {
  padding: 9px 12px;
  border: 1px solid var(--rule-strong);
  border-radius: 8px;
  background: var(--bg);
  color: var(--ink);
  font-size: 13px;
  font-family: inherit;
  outline: none;
  cursor: pointer;
}

/* KPIs */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 14px;
  margin-bottom: 22px;
}
@media (max-width: 1200px) {
  .kpi-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 600px) {
  .kpi-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.kpi-card {
  background: var(--bg-card);
  border: 1px solid var(--rule);
  border-radius: 12px;
  padding: 16px;
}
.kpi-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.kpi-icon {
  font-size: 20px;
}
.kpi-trend {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 10px;
}
.kpi-trend.up {
  background: var(--green-bg);
  color: var(--green);
}
.kpi-trend.down {
  background: #fef2f2;
  color: #dc2626;
}
[data-theme='night'] .kpi-trend.down {
  background: #2a1010;
  color: #f87171;
}
.kpi-value {
  font-family: 'Fraunces', serif;
  font-size: 20px;
  font-weight: 700;
  color: var(--ink);
  line-height: 1;
  margin-bottom: 4px;
}
.kpi-label {
  font-size: 11px;
  color: var(--ink-mute);
  font-weight: 500;
}

/* Charts 2-col */
.charts-2col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 0;
}
@media (max-width: 900px) {
  .charts-2col {
    grid-template-columns: 1fr;
  }
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 18px;
}
.chart-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--ink);
  margin: 0 0 16px;
}
.chart-sub {
  font-size: 11px;
  color: var(--ink-mute);
}

/* Bar chart */
.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  height: 150px;
}
.bar-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.bar-value {
  font-size: 10px;
  color: var(--ink-mute);
  font-weight: 600;
  white-space: nowrap;
}
.bar {
  width: 100%;
  background: var(--brand);
  border-radius: 6px 6px 0 0;
  min-height: 4px;
}
[data-theme='night'] .bar {
  background: var(--gold);
}
.bar-label {
  font-size: 11px;
  color: var(--ink-mute);
}

/* Line chart */
.line-svg {
  width: 100%;
  height: 130px;
}
.dot {
  transition: r 0.2s;
}
.dot:hover {
  r: 6;
}
.line-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  font-size: 11px;
  color: var(--ink-mute);
}

/* 3-col */
.charts-3col {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
}
@media (max-width: 900px) {
  .charts-3col {
    grid-template-columns: 1fr;
  }
}

.mt-20 {
  margin-top: 20px;
}

/* Plan bars */
.plan-bars {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.plan-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.plan-name-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 120px;
}
.plan-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.plan-name {
  font-size: 13px;
  color: var(--ink-soft);
  flex: 1;
}
.plan-count {
  font-size: 12px;
  color: var(--ink-mute);
}
.plan-bar-bg {
  flex: 1;
  height: 6px;
  background: var(--rule);
  border-radius: 3px;
  overflow: hidden;
}
.plan-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s;
}
.plan-pct {
  font-size: 11px;
  color: var(--ink-mute);
  min-width: 30px;
  text-align: right;
}

/* Coupon activity */
.coupon-stats {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.cs-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.cs-bar-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}
.cs-bar-bg {
  flex: 1;
  height: 6px;
  background: var(--rule);
  border-radius: 3px;
  overflow: hidden;
}
.cs-bar-fill {
  height: 100%;
  background: var(--brand);
  border-radius: 3px;
}
[data-theme='night'] .cs-bar-fill {
  background: var(--gold);
}
.cs-count {
  font-size: 11px;
  color: var(--ink-mute);
  min-width: 24px;
  text-align: right;
}
.code-tag {
  font-family: 'JetBrains Mono', monospace;
  background: var(--bg-soft);
  border: 1px solid var(--rule);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  color: var(--brand);
  white-space: nowrap;
}
[data-theme='night'] .code-tag {
  color: var(--gold);
}

/* Quick actions */
.quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.qa-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border: 1px solid var(--rule-strong);
  border-radius: 8px;
  background: var(--bg);
  color: var(--ink-soft);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
  text-align: left;
}
.qa-btn:hover {
  background: var(--brand);
  color: var(--bg);
  border-color: var(--brand);
}
[data-theme='night'] .qa-btn:hover {
  background: var(--gold);
  color: #0a0f1f;
  border-color: var(--gold);
}

/* Bottom 2-col */
.two-col-bottom {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
@media (max-width: 900px) {
  .two-col-bottom {
    grid-template-columns: 1fr;
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.user-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}
.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--brand);
  color: var(--bg);
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
[data-theme='night'] .avatar {
  background: var(--gold);
  color: #0a0f1f;
}
.plan-tag {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;
  background: var(--gold-bg);
  color: var(--gold);
}

.status-tag {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;
  white-space: nowrap;
}
.status-tag.paid {
  background: var(--green-bg);
  color: var(--green);
}
.status-tag.pending {
  background: var(--gold-bg);
  color: var(--gold);
}
.status-tag.failed {
  background: #fef2f2;
  color: #dc2626;
}
[data-theme='night'] .status-tag.failed {
  background: #2a1010;
  color: #f87171;
}
</style>
