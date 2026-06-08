<template>
  <div class="admin-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Salary Restructuring</h1>
        <p class="page-sub">Salary component templates used to build CTC structures</p>
      </div>
      <div class="header-actions">
        <button class="btn-primary" @click="exportCSV">⬇ Export CSV</button>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-row">
      <div class="kpi-card">
        <div class="kpi-icon">💼</div>
        <div>
          <p class="kpi-label">Components</p>
          <p class="kpi-value">{{ kpi.total }}</p>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon">➕</div>
        <div>
          <p class="kpi-label">Earnings</p>
          <p class="kpi-value kpi-green">{{ kpi.earnings }}</p>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon">➖</div>
        <div>
          <p class="kpi-label">Deductions</p>
          <p class="kpi-value kpi-gold">{{ kpi.deductions }}</p>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon">🧾</div>
        <div>
          <p class="kpi-label">Taxable</p>
          <p class="kpi-value">{{ kpi.taxable }}</p>
        </div>
      </div>
    </div>

    <!-- Filters Bar -->
    <div class="filter-bar card">
      <input v-model="search" class="search-input" placeholder="🔍  Search by component name…" />
      <div class="filter-right">
        <select v-model="filterType" class="range-select" title="Type">
          <option value="">All Types</option>
          <option value="earning">Earning</option>
          <option value="deduction">Deduction</option>
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
        :rows="filteredComponents"
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
            <div class="comp-cell">
              <code class="comp-code">{{ props.row.code }}</code>
              <span class="comp-name">{{ props.row.name }}</span>
            </div>
          </q-td>
        </template>

        <template #body-cell-type="props">
          <q-td :props="props">
            <span :class="['type-tag', props.row.type]">{{ typeLabel(props.row.type) }}</span>
          </q-td>
        </template>

        <template #body-cell-calculation="props">
          <q-td :props="props">
            <span v-if="props.row.basis === 'percent'" class="calc-cell"
              >{{ props.row.value }}% of {{ props.row.of }}</span
            >
            <span v-else class="amount-cell"
              ><strong>₹{{ props.row.value.toLocaleString('en-IN') }}</strong> fixed</span
            >
          </q-td>
        </template>

        <template #body-cell-taxable="props">
          <q-td :props="props">
            <span :class="['pill', props.row.taxable ? 'yes' : 'no']">{{
              props.row.taxable ? 'Yes' : 'No'
            }}</span>
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
              <button class="btn-icon" title="Edit" @click="editComponent(props.row)">✏️</button>
            </div>
          </q-td>
        </template>

        <template #no-data>
          <div class="empty-state">No components match your filters.</div>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdminApi } from 'src/composables/useAdminApi'

defineOptions({ name: 'AdminSalaryRestructuringPage' })

const { apiFetch } = useAdminApi()
const loading = ref(true)
const components = ref([])

const search = ref('')
const filterType = ref('')
const filterStatus = ref('')

const columns = [
  { name: 'name', label: 'Component', field: 'name', align: 'left', sortable: true },
  { name: 'type', label: 'Type', field: 'type', align: 'left', sortable: true },
  { name: 'calculation', label: 'Calculation', field: 'value', align: 'left', sortable: true },
  { name: 'taxable', label: 'Taxable', field: 'taxable', align: 'left', sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'left', sortable: true },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'left' },
]

// ── Seed / mock data ────────────────────────────────────────────────────────
function seed() {
  return [
    { code: 'BASIC', name: 'Basic Salary', type: 'earning', basis: 'percent', value: 40, of: 'CTC', taxable: true, status: 'active' },
    { code: 'HRA', name: 'House Rent Allowance', type: 'earning', basis: 'percent', value: 50, of: 'Basic', taxable: true, status: 'active' },
    { code: 'DA', name: 'Dearness Allowance', type: 'earning', basis: 'percent', value: 10, of: 'Basic', taxable: true, status: 'active' },
    { code: 'CONV', name: 'Conveyance Allowance', type: 'earning', basis: 'fixed', value: 1600, of: '', taxable: false, status: 'active' },
    { code: 'MED', name: 'Medical Allowance', type: 'earning', basis: 'fixed', value: 1250, of: '', taxable: false, status: 'active' },
    { code: 'SPL', name: 'Special Allowance', type: 'earning', basis: 'percent', value: 15, of: 'CTC', taxable: true, status: 'active' },
    { code: 'LTA', name: 'Leave Travel Allowance', type: 'earning', basis: 'percent', value: 8, of: 'Basic', taxable: false, status: 'inactive' },
    { code: 'PF', name: 'Provident Fund (Employee)', type: 'deduction', basis: 'percent', value: 12, of: 'Basic', taxable: false, status: 'active' },
    { code: 'ESI', name: 'Employee State Insurance', type: 'deduction', basis: 'percent', value: 0.75, of: 'Gross', taxable: false, status: 'active' },
    { code: 'PT', name: 'Professional Tax', type: 'deduction', basis: 'fixed', value: 200, of: '', taxable: false, status: 'active' },
    { code: 'TDS', name: 'Tax Deducted at Source', type: 'deduction', basis: 'percent', value: 10, of: 'Taxable', taxable: false, status: 'active' },
    { code: 'GRAT', name: 'Gratuity', type: 'deduction', basis: 'percent', value: 4.81, of: 'Basic', taxable: false, status: 'inactive' },
  ]
}

async function loadComponents() {
  loading.value = true
  try {
    const res = await apiFetch('/admin/salary-components')
    components.value = res || seed()
  } catch {
    components.value = seed()
  }
  loading.value = false
}

// ── Derived ─────────────────────────────────────────────────────────────────
const kpi = computed(() => {
  const r = components.value
  return {
    total: r.length,
    earnings: r.filter((c) => c.type === 'earning').length,
    deductions: r.filter((c) => c.type === 'deduction').length,
    taxable: r.filter((c) => c.taxable).length,
  }
})

const filteredComponents = computed(() => {
  let r = components.value
  if (filterType.value) r = r.filter((c) => c.type === filterType.value)
  if (filterStatus.value) r = r.filter((c) => c.status === filterStatus.value)
  return r
})

// ── Helpers ─────────────────────────────────────────────────────────────────
function typeLabel(t) {
  return { earning: 'Earning', deduction: 'Deduction' }[t] || t
}
function statusLabel(s) {
  return { active: 'Active', inactive: 'Inactive' }[s] || s
}
function clearFilters() {
  search.value = ''
  filterType.value = ''
  filterStatus.value = ''
}
function editComponent(row) {
  console.log('edit component', row.code)
}

function exportCSV() {
  const headers = ['Code', 'Component', 'Type', 'Basis', 'Value', 'Of', 'Taxable', 'Status']
  const rows = components.value.map((c) => [
    c.code,
    c.name,
    c.type,
    c.basis,
    c.value,
    c.of,
    c.taxable ? 'Yes' : 'No',
    c.status,
  ])
  const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'salary-components.csv'
  a.click()
}

onMounted(loadComponents)
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
.kpi-gold {
  color: var(--gold);
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
.comp-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}
.comp-code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  color: var(--brand);
  background: var(--bg-soft);
  border: 1px solid var(--rule);
  border-radius: 4px;
  padding: 2px 6px;
}
[data-theme='night'] .comp-code {
  color: var(--gold);
}
.comp-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
}
.calc-cell {
  font-size: 13px;
  color: var(--ink-soft);
}
.amount-cell {
  white-space: nowrap;
}
.row-actions {
  display: flex;
  gap: 6px;
  align-items: center;
}

.type-tag {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;
  white-space: nowrap;
}
.type-tag.earning {
  background: var(--green-bg);
  color: var(--green);
}
.type-tag.deduction {
  background: var(--gold-bg);
  color: var(--gold);
}

.pill {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;
}
.pill.yes {
  background: var(--gold-bg);
  color: var(--gold);
}
.pill.no {
  background: var(--bg-soft);
  color: var(--ink-mute);
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
