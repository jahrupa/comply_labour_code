<template>
  <div class="admin-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">States</h1>
        <p class="page-sub">State-wise minimum wage and compliance configuration</p>
      </div>
      <div class="header-actions">
        <button class="btn-primary" @click="exportCSV">⬇ Export CSV</button>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-row">
      <div class="kpi-card">
        <div class="kpi-icon">📍</div>
        <div>
          <p class="kpi-label">Total States</p>
          <p class="kpi-value">{{ kpi.total }}</p>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon">✅</div>
        <div>
          <p class="kpi-label">Active</p>
          <p class="kpi-value kpi-green">{{ kpi.active }}</p>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon">📜</div>
        <div>
          <p class="kpi-label">Total Acts</p>
          <p class="kpi-value">{{ kpi.acts }}</p>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon">💰</div>
        <div>
          <p class="kpi-label">Avg Min Wage</p>
          <p class="kpi-value">₹{{ kpi.avgWage.toLocaleString('en-IN') }}</p>
        </div>
      </div>
    </div>

    <!-- Filters Bar -->
    <div class="filter-bar card">
      <input v-model="search" class="search-input" placeholder="🔍  Search by state or code…" />
      <div class="filter-right">
        <select v-model="filterRegion" class="range-select" title="Region">
          <option value="">All Regions</option>
          <option v-for="r in regions" :key="r" :value="r">{{ r }}</option>
        </select>
        <select v-model="filterStatus" class="range-select" title="Status">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button class="btn-ghost btn-sm" @click="clearFilters">Clear</button>
      </div>
    </div>

    <!-- Table -->
    <div class="card mt-16 table-card">
      <q-table
        flat
        :rows="filteredStates"
        :columns="columns"
        row-key="code"
        :loading="loading"
        :filter="search"
        :rows-per-page-options="[10, 15, 25, 50]"
        :pagination="{ rowsPerPage: 15 }"
        class="admin-q-table"
      >
        <template #body-cell-name="props">
          <q-td :props="props">
            <div class="state-cell">
              <span class="state-code">{{ props.row.code }}</span>
              <span class="state-name">{{ props.row.name }}</span>
            </div>
          </q-td>
        </template>

        <template #body-cell-min_wage="props">
          <q-td :props="props" class="amount-cell">
            <strong>₹{{ props.row.min_wage.toLocaleString('en-IN') }}</strong>
            <span class="wage-unit">/ day</span>
          </q-td>
        </template>

        <template #body-cell-status="props">
          <q-td :props="props">
            <span :class="['status-tag', props.row.status]">{{
              statusLabel(props.row.status)
            }}</span>
          </q-td>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props">
            <div class="row-actions">
              <button class="btn-icon" title="View" @click="viewState(props.row)">👁</button>
              <button class="btn-icon" title="Edit" @click="editState(props.row)">✏️</button>
            </div>
          </q-td>
        </template>

        <template #no-data>
          <div class="empty-state">No states match your filters.</div>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdminApi } from 'src/composables/useAdminApi'

defineOptions({ name: 'AdminStatePage' })

const { apiFetch } = useAdminApi()
const loading = ref(true)
const states = ref([])

const search = ref('')
const filterRegion = ref('')
const filterStatus = ref('')

const columns = [
  { name: 'name', label: 'State', field: 'name', align: 'left', sortable: true },
  { name: 'region', label: 'Region', field: 'region', align: 'left', sortable: true },
  { name: 'capital', label: 'Capital', field: 'capital', align: 'left' },
  { name: 'min_wage', label: 'Min Wage', field: 'min_wage', align: 'left', sortable: true },
  { name: 'acts', label: 'Acts', field: 'acts', align: 'center', sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'left', sortable: true },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'left' },
]

// ── Seed / mock data ────────────────────────────────────────────────────────
function seed() {
  return [
    { code: 'MH', name: 'Maharashtra', region: 'West', capital: 'Mumbai', min_wage: 567, acts: 24, status: 'active' },
    { code: 'KA', name: 'Karnataka', region: 'South', capital: 'Bengaluru', min_wage: 521, acts: 21, status: 'active' },
    { code: 'TN', name: 'Tamil Nadu', region: 'South', capital: 'Chennai', min_wage: 489, acts: 23, status: 'active' },
    { code: 'DL', name: 'Delhi', region: 'North', capital: 'New Delhi', min_wage: 643, acts: 19, status: 'active' },
    { code: 'GJ', name: 'Gujarat', region: 'West', capital: 'Gandhinagar', min_wage: 458, acts: 20, status: 'active' },
    { code: 'WB', name: 'West Bengal', region: 'East', capital: 'Kolkata', min_wage: 412, acts: 18, status: 'active' },
    { code: 'UP', name: 'Uttar Pradesh', region: 'North', capital: 'Lucknow', min_wage: 395, acts: 17, status: 'active' },
    { code: 'RJ', name: 'Rajasthan', region: 'North', capital: 'Jaipur', min_wage: 379, acts: 16, status: 'active' },
    { code: 'TG', name: 'Telangana', region: 'South', capital: 'Hyderabad', min_wage: 510, acts: 20, status: 'active' },
    { code: 'KL', name: 'Kerala', region: 'South', capital: 'Thiruvananthapuram', min_wage: 553, acts: 22, status: 'active' },
    { code: 'MP', name: 'Madhya Pradesh', region: 'Central', capital: 'Bhopal', min_wage: 367, acts: 15, status: 'active' },
    { code: 'PB', name: 'Punjab', region: 'North', capital: 'Chandigarh', min_wage: 432, acts: 18, status: 'active' },
    { code: 'HR', name: 'Haryana', region: 'North', capital: 'Chandigarh', min_wage: 470, acts: 17, status: 'active' },
    { code: 'AS', name: 'Assam', region: 'Northeast', capital: 'Dispur', min_wage: 351, acts: 14, status: 'inactive' },
    { code: 'OD', name: 'Odisha', region: 'East', capital: 'Bhubaneswar', min_wage: 358, acts: 15, status: 'inactive' },
    { code: 'BR', name: 'Bihar', region: 'East', capital: 'Patna', min_wage: 344, acts: 13, status: 'inactive' },
  ]
}

async function loadStates() {
  loading.value = true
  try {
    const res = await apiFetch('/admin/states')
    states.value = res || seed()
  } catch {
    states.value = seed()
  }
  loading.value = false
}

// ── Derived ─────────────────────────────────────────────────────────────────
const regions = computed(() => [...new Set(states.value.map((s) => s.region))].sort())

const kpi = computed(() => {
  const r = states.value
  const active = r.filter((s) => s.status === 'active')
  return {
    total: r.length,
    active: active.length,
    acts: r.reduce((sum, s) => sum + s.acts, 0),
    avgWage: r.length ? Math.round(r.reduce((sum, s) => sum + s.min_wage, 0) / r.length) : 0,
  }
})

const filteredStates = computed(() => {
  let r = states.value
  if (filterRegion.value) r = r.filter((s) => s.region === filterRegion.value)
  if (filterStatus.value) r = r.filter((s) => s.status === filterStatus.value)
  return r
})

// ── Helpers ─────────────────────────────────────────────────────────────────
function statusLabel(s) {
  return { active: 'Active', inactive: 'Inactive' }[s] || s
}
function clearFilters() {
  search.value = ''
  filterRegion.value = ''
  filterStatus.value = ''
}
function viewState(row) {
  console.log('view state', row.code)
}
function editState(row) {
  console.log('edit state', row.code)
}

function exportCSV() {
  const headers = ['Code', 'State', 'Region', 'Capital', 'Min Wage', 'Acts', 'Status']
  const rows = states.value.map((s) => [
    s.code,
    s.name,
    s.region,
    s.capital,
    s.min_wage,
    s.acts,
    s.status,
  ])
  const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'states.csv'
  a.click()
}

onMounted(loadStates)
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
.kpi-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 20px;
}
@media (max-width: 900px) {
  .kpi-row {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 480px) {
  .kpi-row {
    grid-template-columns: 1fr;
  }
}
.kpi-card {
  background: var(--bg-card);
  border: 1px solid var(--rule);
  border-radius: 12px;
  padding: 18px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
}
.kpi-icon {
  font-size: 24px;
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
  font-size: 24px;
  font-weight: 700;
  color: var(--ink);
  line-height: 1;
}
.kpi-green {
  color: var(--green);
}

/* Filter bar */
.filter-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  flex-wrap: wrap;
}
.search-input {
  flex: 1;
  min-width: 200px;
  padding: 8px 12px;
  border: 1px solid var(--rule-strong);
  border-radius: 8px;
  background: var(--bg);
  color: var(--ink);
  font-size: 13px;
  font-family: inherit;
  outline: none;
}
.search-input:focus {
  border-color: var(--brand);
}
.filter-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.mt-16 {
  margin-top: 16px;
}
.table-card {
  padding: 0;
  overflow: hidden;
}

/* Cell content */
.state-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}
.state-code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  color: var(--brand);
  background: var(--bg-soft);
  border: 1px solid var(--rule);
  border-radius: 4px;
  padding: 2px 6px;
}
[data-theme='night'] .state-code {
  color: var(--gold);
}
.state-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
}
.amount-cell {
  white-space: nowrap;
}
.wage-unit {
  font-size: 11px;
  color: var(--ink-mute);
  margin-left: 4px;
}
.row-actions {
  display: flex;
  gap: 6px;
  align-items: center;
}

.status-tag {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;
  white-space: nowrap;
}
.status-tag.active {
  background: var(--green-bg);
  color: var(--green);
}
.status-tag.inactive {
  background: var(--bg-soft);
  color: var(--ink-mute);
}

/* ── Quasar q-table → admin .data-table look ───────────────────────────── */
.admin-q-table {
  background: transparent;
  color: var(--ink-soft);
}
.admin-q-table :deep(thead th) {
  text-align: left;
  padding: 12px 14px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--ink-faint);
  border-bottom: 1px solid var(--rule);
  background: var(--bg-card);
}
.admin-q-table :deep(tbody td) {
  padding: 13px 14px;
  border-bottom: 1px solid var(--rule);
  color: var(--ink-soft);
  font-size: 14px;
}
.admin-q-table :deep(tbody tr:hover td) {
  background: var(--bg-hover);
}
.admin-q-table :deep(.q-table__bottom) {
  border-top: 1px solid var(--rule);
  color: var(--ink-mute);
  font-size: 13px;
}
.admin-q-table :deep(.q-table__top) {
  padding: 0;
}
</style>
