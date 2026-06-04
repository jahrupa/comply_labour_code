<template>
  <div class="admin-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Coupon Analytics</h1>
        <p class="page-sub">Performance insights for all discount coupons</p>
      </div>
      <div class="header-actions">
        <select v-model="range" class="range-select">
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="all">All time</option>
        </select>
        <button class="btn-primary" @click="exportCSV">⬇ Export CSV</button>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-icon">🎟️</div>
        <div class="kpi-body">
          <p class="kpi-label">Total Coupons</p>
          <p class="kpi-value">{{ stats.total }}</p>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon">✅</div>
        <div class="kpi-body">
          <p class="kpi-label">Active Coupons</p>
          <p class="kpi-value kpi-green">{{ stats.active }}</p>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon">📈</div>
        <div class="kpi-body">
          <p class="kpi-label">Total Redemptions</p>
          <p class="kpi-value">{{ stats.redemptions }}</p>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon">💰</div>
        <div class="kpi-body">
          <p class="kpi-label">Discount Given</p>
          <p class="kpi-value kpi-gold">₹{{ stats.discountGiven.toLocaleString('en-IN') }}</p>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon">⚡</div>
        <div class="kpi-body">
          <p class="kpi-label">Avg. Redemptions</p>
          <p class="kpi-value">{{ stats.avgRedemptions }}</p>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon">🏆</div>
        <div class="kpi-body">
          <p class="kpi-label">Top Coupon</p>
          <p class="kpi-value kpi-sm">{{ stats.topCoupon }}</p>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="charts-row">
      <!-- Redemptions Over Time (bar chart) -->
      <div class="card chart-card">
        <h3 class="chart-title">Redemptions Over Time</h3>
        <div class="bar-chart">
          <div
            v-for="(d, i) in chartData"
            :key="i"
            class="bar-wrap"
            :title="`${d.label}: ${d.value} redemptions`"
          >
            <div class="bar-value">{{ d.value }}</div>
            <div class="bar" :style="{ height: barHeight(d.value) + 'px' }"></div>
            <div class="bar-label">{{ d.label }}</div>
          </div>
        </div>
      </div>

      <!-- Discount type split (donut-like) -->
      <div class="card chart-card chart-card-sm">
        <h3 class="chart-title">Discount Type Split</h3>
        <div class="donut-wrap">
          <svg viewBox="0 0 120 120" class="donut-svg">
            <circle cx="60" cy="60" r="45" fill="none" stroke="var(--rule)" stroke-width="22" />
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke="var(--brand)"
              stroke-width="22"
              :stroke-dasharray="`${percentArc} ${circumference}`"
              stroke-linecap="round"
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div class="donut-center">
            <span class="donut-pct">{{ Math.round(typeData.percentRatio * 100) }}%</span>
            <span class="donut-sub">Percent</span>
          </div>
        </div>
        <div class="donut-legend">
          <div class="legend-item">
            <span class="legend-dot brand"></span>
            <span>Percent Off</span>
            <strong>{{ typeData.percent }}</strong>
          </div>
          <div class="legend-item">
            <span class="legend-dot gold"></span>
            <span>Flat Amount</span>
            <strong>{{ typeData.flat }}</strong>
          </div>
        </div>
      </div>
    </div>

    <!-- Per-coupon breakdown table -->
    <div class="card mt-24">
      <div class="table-toolbar">
        <h3 class="chart-title" style="margin: 0">Coupon Breakdown</h3>
        <input v-model="search" class="search-input" placeholder="🔍  Search coupon…" />
      </div>
      <div v-if="loading" class="empty-state">Loading analytics…</div>
      <div v-else-if="filteredRows.length === 0" class="empty-state">No coupons found.</div>
      <table v-else class="data-table">
        <thead>
          <tr>
            <th @click="sortBy('name')" class="sortable">
              Name <span class="sort-arrow">{{ sortArrow('name') }}</span>
            </th>
            <th>Code</th>
            <th @click="sortBy('redemptions')" class="sortable">
              Redemptions <span class="sort-arrow">{{ sortArrow('redemptions') }}</span>
            </th>
            <th @click="sortBy('usage_limit')" class="sortable">
              Limit <span class="sort-arrow">{{ sortArrow('usage_limit') }}</span>
            </th>
            <th>Usage %</th>
            <th @click="sortBy('discount')" class="sortable">
              Discount <span class="sort-arrow">{{ sortArrow('discount') }}</span>
            </th>
            <th @click="sortBy('discount_given')" class="sortable">
              Amount Given <span class="sort-arrow">{{ sortArrow('discount_given') }}</span>
            </th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in filteredRows" :key="row.id">
            <td>
              <strong>{{ row.name }}</strong>
            </td>
            <td>
              <code class="code-tag">{{ row.code }}</code>
            </td>
            <td>{{ row.redemptions }}</td>
            <td>{{ row.usage_limit }}</td>
            <td>
              <div class="usage-wrap">
                <div class="usage-bar">
                  <div
                    class="usage-fill"
                    :class="usageClass(row)"
                    :style="{ width: usagePct(row) + '%' }"
                  ></div>
                </div>
                <span class="usage-pct">{{ usagePct(row) }}%</span>
              </div>
            </td>
            <td>
              <span v-if="row.discount_type === 'percent'">{{ row.percent_off }}%</span>
              <span v-else>₹{{ (row.amount_off / 100).toFixed(0) }}</span>
            </td>
            <td>₹{{ row.discount_given.toLocaleString('en-IN') }}</td>
            <td>
              <span :class="['status-tag', row.status]">{{ row.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdminApi } from 'src/composables/useAdminApi'

defineOptions({ name: 'CouponAnalyticsPage' })

const { apiFetch } = useAdminApi()
const loading = ref(true)
const range = ref('30')
const search = ref('')
const sortKey = ref('redemptions')
const sortDir = ref('desc')

// Raw coupon rows augmented with analytics fields
const rows = ref([])

// ── Mock / seed data (replace with real API call) ──────────────────────────
function seedRows() {
  return [
    {
      id: '1',
      name: 'Summer Sale',
      code: 'SUMMER10',
      discount_type: 'percent',
      percent_off: 10,
      amount_off: 0,
      usage_limit: 500,
      redemptions: 342,
      discount_given: 68400,
      valid_to: '2026-08-31',
      status: 'active',
    },
    {
      id: '2',
      name: 'New User',
      code: 'WELCOME20',
      discount_type: 'percent',
      percent_off: 20,
      amount_off: 0,
      usage_limit: 200,
      redemptions: 198,
      discount_given: 59400,
      valid_to: '2026-12-31',
      status: 'active',
    },
    {
      id: '3',
      name: 'Flat 500',
      code: 'FLAT500',
      discount_type: 'flat',
      percent_off: 0,
      amount_off: 50000,
      usage_limit: 100,
      redemptions: 100,
      discount_given: 50000,
      valid_to: '2025-12-31',
      status: 'expired',
    },
    {
      id: '4',
      name: 'Diwali Offer',
      code: 'DIWALI25',
      discount_type: 'percent',
      percent_off: 25,
      amount_off: 0,
      usage_limit: 300,
      redemptions: 87,
      discount_given: 26100,
      valid_to: '2026-11-01',
      status: 'active',
    },
    {
      id: '5',
      name: 'Flash Deal',
      code: 'FLASH15',
      discount_type: 'percent',
      percent_off: 15,
      amount_off: 0,
      usage_limit: 50,
      redemptions: 50,
      discount_given: 11250,
      valid_to: '2026-01-15',
      status: 'expired',
    },
  ]
}

async function loadData() {
  loading.value = true
  try {
    const res = await apiFetch('/admin/coupon-analytics')
    rows.value = res || seedRows()
  } catch {
    rows.value = seedRows()
  }
  loading.value = false
}

// ── KPI Stats ──────────────────────────────────────────────────────────────
const stats = computed(() => {
  const r = rows.value
  const active = r.filter((c) => c.status === 'active').length
  const redemptions = r.reduce((s, c) => s + c.redemptions, 0)
  const discountGiven = r.reduce((s, c) => s + c.discount_given, 0)
  const top = r.slice().sort((a, b) => b.redemptions - a.redemptions)[0]
  return {
    total: r.length,
    active,
    redemptions,
    discountGiven,
    avgRedemptions: r.length ? Math.round(redemptions / r.length) : 0,
    topCoupon: top ? top.code : '—',
  }
})

// ── Donut chart ────────────────────────────────────────────────────────────
const circumference = 2 * Math.PI * 45
const typeData = computed(() => {
  const percent = rows.value.filter((r) => r.discount_type === 'percent').length
  const flat = rows.value.filter((r) => r.discount_type === 'flat').length
  const total = percent + flat || 1
  return { percent, flat, percentRatio: percent / total }
})
const percentArc = computed(() => circumference * typeData.value.percentRatio)

// ── Bar chart ──────────────────────────────────────────────────────────────
const chartData = computed(() => {
  // Mock monthly data; swap with real time-series
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  const base = [45, 78, 112, 95, 134, 158]
  return months.map((label, i) => ({ label, value: base[i] }))
})
const maxBar = computed(() => Math.max(...chartData.value.map((d) => d.value)))
const barHeight = (v) => Math.max(4, Math.round((v / maxBar.value) * 120))

// ── Table helpers ──────────────────────────────────────────────────────────
function usagePct(row) {
  if (!row.usage_limit) return 0
  return Math.min(100, Math.round((row.redemptions / row.usage_limit) * 100))
}
function usageClass(row) {
  const p = usagePct(row)
  if (p >= 90) return 'fill-red'
  if (p >= 60) return 'fill-gold'
  return 'fill-green'
}

function sortBy(key) {
  if (sortKey.value === key) sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  else {
    sortKey.value = key
    sortDir.value = 'desc'
  }
}
function sortArrow(key) {
  if (sortKey.value !== key) return '↕'
  return sortDir.value === 'asc' ? '↑' : '↓'
}

const filteredRows = computed(() => {
  let r = rows.value
  if (search.value) {
    const q = search.value.toLowerCase()
    r = r.filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q))
  }
  return r.slice().sort((a, b) => {
    const av = a[sortKey.value] ?? 0
    const bv = b[sortKey.value] ?? 0
    return sortDir.value === 'asc'
      ? typeof av === 'string'
        ? av.localeCompare(bv)
        : av - bv
      : typeof bv === 'string'
        ? bv.localeCompare(av)
        : bv - av
  })
})

// ── CSV Export ─────────────────────────────────────────────────────────────
function exportCSV() {
  const headers = [
    'Name',
    'Code',
    'Type',
    'Discount',
    'Redemptions',
    'Limit',
    'Amount Given',
    'Status',
  ]
  const csvRows = filteredRows.value.map((r) => [
    r.name,
    r.code,
    r.discount_type,
    r.discount_type === 'percent' ? `${r.percent_off}%` : `₹${(r.amount_off / 100).toFixed(2)}`,
    r.redemptions,
    r.usage_limit,
    `₹${r.discount_given}`,
    r.status,
  ])
  const csv = [headers, ...csvRows].map((r) => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'coupon-analytics.csv'
  a.click()
}

onMounted(loadData)
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

/* KPI */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 14px;
  margin-bottom: 24px;
}
@media (max-width: 1100px) {
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
  padding: 18px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.kpi-icon {
  font-size: 22px;
  flex-shrink: 0;
}
.kpi-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--ink-mute);
  margin-bottom: 4px;
}
.kpi-value {
  font-family: 'Fraunces', serif;
  font-size: 22px;
  font-weight: 700;
  color: var(--ink);
  line-height: 1;
}
.kpi-value.kpi-sm {
  font-size: 16px;
}
.kpi-green {
  color: var(--green);
}
.kpi-gold {
  color: var(--gold);
}

/* Charts */
.charts-row {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 16px;
  margin-bottom: 0;
}
@media (max-width: 900px) {
  .charts-row {
    grid-template-columns: 1fr;
  }
}

.chart-card {
  display: flex;
  flex-direction: column;
}
.chart-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 20px;
}

/* Bar chart */
.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  height: 160px;
  padding-bottom: 4px;
}
.bar-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.bar-value {
  font-size: 11px;
  color: var(--ink-mute);
  font-weight: 600;
}
.bar {
  width: 100%;
  background: var(--brand);
  border-radius: 6px 6px 0 0;
  transition: height 0.4s;
  min-height: 4px;
}
[data-theme='night'] .bar {
  background: var(--gold);
}
.bar-label {
  font-size: 11px;
  color: var(--ink-mute);
}

/* Donut */
.donut-wrap {
  position: relative;
  width: 120px;
  margin: 0 auto 20px;
}
.donut-svg {
  display: block;
}
.donut-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.donut-pct {
  font-size: 20px;
  font-weight: 700;
  font-family: 'Fraunces', serif;
  color: var(--ink);
}
.donut-sub {
  font-size: 10px;
  color: var(--ink-mute);
  text-transform: uppercase;
}

.donut-legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--ink-soft);
}
.legend-item strong {
  margin-left: auto;
  color: var(--ink);
}
.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
.legend-dot.brand {
  background: var(--brand);
}
[data-theme='night'] .legend-dot.brand {
  background: var(--gold);
}
.legend-dot.gold {
  background: var(--rule-strong);
}

/* Table toolbar */
.table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 12px;
}
.search-input {
  padding: 8px 12px;
  border: 1px solid var(--rule-strong);
  border-radius: 8px;
  background: var(--bg);
  color: var(--ink);
  font-size: 13px;
  font-family: inherit;
  outline: none;
  width: 220px;
}
.search-input:focus {
  border-color: var(--brand);
}

.sortable {
  cursor: pointer;
  user-select: none;
}
.sortable:hover {
  color: var(--brand);
}
.sort-arrow {
  color: var(--ink-faint);
  font-size: 10px;
  margin-left: 2px;
}

/* Usage bar */
.usage-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
}
.usage-bar {
  flex: 1;
  height: 6px;
  background: var(--rule);
  border-radius: 3px;
  overflow: hidden;
}
.usage-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.4s;
}
.fill-green {
  background: var(--green);
}
.fill-gold {
  background: var(--gold);
}
.fill-red {
  background: #dc2626;
}
.usage-pct {
  font-size: 11px;
  color: var(--ink-mute);
  white-space: nowrap;
}

.code-tag {
  font-family: 'JetBrains Mono', monospace;
  background: var(--bg-soft);
  border: 1px solid var(--rule);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: var(--brand);
  font-weight: 600;
}
[data-theme='night'] .code-tag {
  color: var(--gold);
}

.status-tag {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;
}
.status-tag.active {
  background: var(--green-bg);
  color: var(--green);
}
.status-tag.expired {
  background: #fef2f2;
  color: #dc2626;
}
[data-theme='night'] .status-tag.expired {
  background: #2a1010;
  color: #f87171;
}

.mt-24 {
  margin-top: 24px;
}
</style>
