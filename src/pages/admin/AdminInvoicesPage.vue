<template>
  <div class="admin-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Invoices</h1>
        <p class="page-sub">All user invoices and billing history</p>
      </div>
      <div class="header-actions">
        <select v-model="filterStatus" class="range-select">
          <option value="">All Statuses</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
        <button class="btn-primary" @click="exportCSV">⬇ Export CSV</button>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-row">
      <div class="kpi-card">
        <div class="kpi-icon">🧾</div>
        <div>
          <p class="kpi-label">Total Invoices</p>
          <p class="kpi-value">{{ kpi.total }}</p>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon">✅</div>
        <div>
          <p class="kpi-label">Paid</p>
          <p class="kpi-value kpi-green">{{ kpi.paid }}</p>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon">⏳</div>
        <div>
          <p class="kpi-label">Pending</p>
          <p class="kpi-value kpi-gold">{{ kpi.pending }}</p>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon">💸</div>
        <div>
          <p class="kpi-label">Total Revenue</p>
          <p class="kpi-value">₹{{ kpi.revenue.toLocaleString('en-IN') }}</p>
        </div>
      </div>
    </div>

    <!-- Filters Bar -->
    <div class="filter-bar card">
      <input
        v-model="search"
        class="search-input"
        placeholder="🔍  Search by name, email or invoice #…"
      />
      <div class="filter-right">
        <input v-model="dateFrom" type="date" class="range-select" title="From date" />
        <span class="sep">—</span>
        <input v-model="dateTo" type="date" class="range-select" title="To date" />
        <button class="btn-ghost btn-sm" @click="clearFilters">Clear</button>
      </div>
    </div>

    <!-- Table -->
    <div class="card mt-16">
      <div v-if="loading" class="empty-state">Loading invoices…</div>
      <div v-else-if="filteredInvoices.length === 0" class="empty-state">
        No invoices match your filters.
      </div>
      <table v-else class="data-table">
        <thead>
          <tr>
            <th @click="sortBy('invoice_no')" class="sortable">
              Invoice # <span class="sort-arrow">{{ sortArrow('invoice_no') }}</span>
            </th>
            <th @click="sortBy('user_name')" class="sortable">
              User <span class="sort-arrow">{{ sortArrow('user_name') }}</span>
            </th>
            <th>Email</th>
            <th>Plan</th>
            <th @click="sortBy('amount')" class="sortable">
              Amount <span class="sort-arrow">{{ sortArrow('amount') }}</span>
            </th>
            <th>Coupon</th>
            <th @click="sortBy('created_at')" class="sortable">
              Date <span class="sort-arrow">{{ sortArrow('created_at') }}</span>
            </th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="inv in filteredInvoices" :key="inv.id">
            <td>
              <code class="invoice-no">{{ inv.invoice_no }}</code>
            </td>
            <td>
              <div class="user-cell">
                <div class="avatar">{{ initials(inv.user_name) }}</div>
                <div>
                  <div class="user-name">{{ inv.user_name }}</div>
                  <div class="user-org">{{ inv.org_name || '' }}</div>
                </div>
              </div>
            </td>
            <td class="email-cell">{{ inv.email }}</td>
            <td>
              <span class="plan-tag">{{ inv.plan }}</span>
            </td>
            <td class="amount-cell">
              <strong>₹{{ inv.amount.toLocaleString('en-IN') }}</strong>
              <span v-if="inv.discount" class="discount-badge">-₹{{ inv.discount }}</span>
            </td>
            <td>
              <code v-if="inv.coupon_code" class="code-tag">{{ inv.coupon_code }}</code>
              <span v-else class="text-mute">—</span>
            </td>
            <td class="date-cell">{{ formatDate(inv.created_at) }}</td>
            <td>
              <span :class="['status-tag', inv.status]">{{ statusLabel(inv.status) }}</span>
            </td>
            <td class="actions">
              <button class="btn-icon" @click="viewInvoice(inv)" title="View details">👁</button>
              <button class="btn-icon" @click="downloadPDF(inv)" title="Download PDF">⬇️</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="pagination" v-if="totalPages > 1">
        <button class="pg-btn" :disabled="page === 1" @click="page--">‹</button>
        <span class="pg-info">Page {{ page }} of {{ totalPages }}</span>
        <button class="pg-btn" :disabled="page === totalPages" @click="page++">›</button>
      </div>
    </div>

    <!-- Invoice Detail Modal -->
    <div v-if="selected" class="modal-overlay" @click.self="selected = null">
      <div class="modal invoice-modal">
        <div class="modal-header">
          <h2>Invoice {{ selected.invoice_no }}</h2>
          <div class="modal-header-actions">
            <button class="btn-primary btn-sm" @click="downloadPDF(selected)">
              ⬇ Download PDF
            </button>
            <button class="modal-close" @click="selected = null">✕</button>
          </div>
        </div>
        <div class="modal-body">
          <!-- Invoice Preview -->
          <div class="invoice-preview">
            <div class="inv-header">
              <div class="inv-brand">
                <div class="inv-logo">CM</div>
                <div>
                  <p class="inv-company">ComplyMgmt</p>
                  <p class="inv-tagline">Compliance Management Platform</p>
                </div>
              </div>
              <div class="inv-meta">
                <p class="inv-no">{{ selected.invoice_no }}</p>
                <p class="inv-date">{{ formatDate(selected.created_at) }}</p>
                <span :class="['status-tag', selected.status]">{{
                  statusLabel(selected.status)
                }}</span>
              </div>
            </div>

            <div class="inv-parties">
              <div class="inv-from">
                <p class="inv-section-label">From</p>
                <p class="inv-name">ComplyMgmt Inc.</p>
                <p>billing@complymgmt.com</p>
                <p>Mumbai, Maharashtra, IN</p>
              </div>
              <div class="inv-to">
                <p class="inv-section-label">Bill To</p>
                <p class="inv-name">{{ selected.user_name }}</p>
                <p>{{ selected.email }}</p>
                <p v-if="selected.org_name">{{ selected.org_name }}</p>
              </div>
            </div>

            <table class="inv-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Period</th>
                  <th class="right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ selected.plan }} Plan — Subscription</td>
                  <td>
                    {{ formatDate(selected.period_start) }} – {{ formatDate(selected.period_end) }}
                  </td>
                  <td class="right">₹{{ selected.subtotal.toLocaleString('en-IN') }}</td>
                </tr>
                <tr v-if="selected.discount">
                  <td>
                    Coupon: <code>{{ selected.coupon_code }}</code>
                  </td>
                  <td>—</td>
                  <td class="right discount-row">
                    –₹{{ selected.discount.toLocaleString('en-IN') }}
                  </td>
                </tr>
                <tr v-if="selected.tax">
                  <td>GST (18%)</td>
                  <td>—</td>
                  <td class="right">₹{{ selected.tax.toLocaleString('en-IN') }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2"><strong>Total</strong></td>
                  <td class="right total-row">
                    <strong>₹{{ selected.amount.toLocaleString('en-IN') }}</strong>
                  </td>
                </tr>
              </tfoot>
            </table>

            <div v-if="selected.payment_method" class="inv-payment">
              <span class="inv-section-label">Payment Method</span>
              <span>{{ selected.payment_method }}</span>
              <span v-if="selected.transaction_id" class="txn-id"
                >TXN: {{ selected.transaction_id }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdminApi } from 'src/composables/useAdminApi'

defineOptions({ name: 'AdminInvoicesPage' })

const { apiFetch } = useAdminApi()
const loading = ref(true)
const invoices = ref([])
const selected = ref(null)

const search = ref('')
const filterStatus = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const sortKey = ref('created_at')
const sortDir = ref('desc')
const page = ref(1)
const perPage = 15

// ── Seed / mock data ────────────────────────────────────────────────────────
function seed() {
  const plans = ['Starter', 'Pro', 'Enterprise']
  const statuses = ['paid', 'paid', 'paid', 'pending', 'failed', 'refunded']
  const names = [
    ['Arjun Sharma', 'arjun@techcorp.in', 'TechCorp Pvt Ltd'],
    ['Priya Patel', 'priya@legalease.com', 'LegalEase Solutions'],
    ['Rohan Mehta', 'rohan@finserv.co', 'FinServ Co'],
    ['Ananya Singh', 'ananya@startup.io', ''],
    ['Vikram Nair', 'vikram@enterprise.in', 'Enterprise Inc'],
    ['Sneha Joshi', 'sneha@consult.com', 'Joshi Consulting'],
  ]
  return names.flatMap(([user_name, email, org_name], ni) =>
    Array.from({ length: 3 }, (_, i) => {
      const plan = plans[(ni + i) % 3]
      const subtotal = plan === 'Enterprise' ? 9999 : plan === 'Pro' ? 4999 : 1999
      const discount = i === 0 ? Math.round(subtotal * 0.1) : 0
      const tax = Math.round((subtotal - discount) * 0.18)
      const d = new Date(2026, 5 - i, 10 - ni)
      return {
        id: `${ni}-${i}`,
        invoice_no: `INV-${String(ni * 3 + i + 1).padStart(4, '0')}`,
        user_name,
        email,
        org_name,
        plan,
        subtotal,
        discount,
        tax,
        amount: subtotal - discount + tax,
        coupon_code: discount ? 'SUMMER10' : '',
        status: statuses[(ni + i) % statuses.length],
        created_at: d.toISOString(),
        period_start: d.toISOString(),
        period_end: new Date(d.getFullYear(), d.getMonth() + 1, d.getDate()).toISOString(),
        payment_method: 'UPI / Razorpay',
        transaction_id: `pay_${Math.random().toString(36).slice(2, 12)}`,
      }
    }),
  )
}

async function loadInvoices() {
  loading.value = true
  try {
    const res = await apiFetch('/admin/invoices')
    invoices.value = res || seed()
  } catch {
    invoices.value = seed()
  }
  loading.value = false
}

// ── KPIs ────────────────────────────────────────────────────────────────────
const kpi = computed(() => {
  const r = invoices.value
  return {
    total: r.length,
    paid: r.filter((i) => i.status === 'paid').length,
    pending: r.filter((i) => i.status === 'pending').length,
    revenue: r.filter((i) => i.status === 'paid').reduce((s, i) => s + i.amount, 0),
  }
})

// ── Filtering + sorting ─────────────────────────────────────────────────────
const filteredInvoices = computed(() => {
  let r = invoices.value
  if (search.value) {
    const q = search.value.toLowerCase()
    r = r.filter(
      (i) =>
        i.user_name.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        i.invoice_no.toLowerCase().includes(q),
    )
  }
  if (filterStatus.value) r = r.filter((i) => i.status === filterStatus.value)
  if (dateFrom.value) r = r.filter((i) => new Date(i.created_at) >= new Date(dateFrom.value))
  if (dateTo.value)
    r = r.filter((i) => new Date(i.created_at) <= new Date(dateTo.value + 'T23:59:59'))

  r = r.slice().sort((a, b) => {
    const av = a[sortKey.value] ?? ''
    const bv = b[sortKey.value] ?? ''
    return sortDir.value === 'asc'
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av))
  })

  const start = (page.value - 1) * perPage
  return r.slice(start, start + perPage)
})

const totalPages = computed(() => Math.ceil(invoices.value.length / perPage))

function sortBy(key) {
  if (sortKey.value === key) sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  else {
    sortKey.value = key
    sortDir.value = 'desc'
  }
  page.value = 1
}
function sortArrow(key) {
  if (sortKey.value !== key) return '↕'
  return sortDir.value === 'asc' ? '↑' : '↓'
}
function clearFilters() {
  search.value = ''
  filterStatus.value = ''
  dateFrom.value = ''
  dateTo.value = ''
  page.value = 1
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function initials(name) {
  return (name || '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
function formatDate(d) {
  return d
    ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—'
}
function statusLabel(s) {
  return { paid: 'Paid', pending: 'Pending', failed: 'Failed', refunded: 'Refunded' }[s] || s
}

function viewInvoice(inv) {
  selected.value = inv
}

function downloadPDF(inv) {
  // In production: call /admin/invoices/:id/pdf → get presigned URL
  const w = window.open('', '_blank')
  w.document.write(`
    <html><head><title>Invoice ${inv.invoice_no}</title>
    <style>body{font-family:sans-serif;padding:40px;max-width:700px;margin:auto}
    h1{color:#1b3a5c}table{width:100%;border-collapse:collapse;margin-top:20px}
    th,td{padding:10px;text-align:left;border-bottom:1px solid #eee}
    .total{font-weight:bold;font-size:16px}</style></head><body>
    <h1>Invoice ${inv.invoice_no}</h1>
    <p><strong>Bill To:</strong> ${inv.user_name} &lt;${inv.email}&gt;</p>
    <p><strong>Date:</strong> ${formatDate(inv.created_at)}</p>
    <p><strong>Status:</strong> ${statusLabel(inv.status)}</p>
    <table>
      <tr><th>Description</th><th>Amount</th></tr>
      <tr><td>${inv.plan} Plan</td><td>₹${inv.subtotal}</td></tr>
      ${inv.discount ? `<tr><td>Coupon ${inv.coupon_code}</td><td>–₹${inv.discount}</td></tr>` : ''}
      ${inv.tax ? `<tr><td>GST 18%</td><td>₹${inv.tax}</td></tr>` : ''}
      <tr class="total"><td><strong>Total</strong></td><td><strong>₹${inv.amount}</strong></td></tr>
    </table>
    </body></html>
  `)
  w.document.close()
  w.print()
}

function exportCSV() {
  const headers = ['Invoice #', 'User', 'Email', 'Org', 'Plan', 'Amount', 'Status', 'Date']
  const csvRows = invoices.value.map((i) => [
    i.invoice_no,
    i.user_name,
    i.email,
    i.org_name,
    i.plan,
    `₹${i.amount}`,
    i.status,
    formatDate(i.created_at),
  ])
  const csv = [headers, ...csvRows].map((r) => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'invoices.csv'
  a.click()
}

onMounted(loadInvoices)
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
.sep {
  color: var(--ink-mute);
}

.mt-16 {
  margin-top: 16px;
}

/* Table */
.user-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--brand);
  color: var(--bg);
  font-size: 12px;
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
.user-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
}
.user-org {
  font-size: 11px;
  color: var(--ink-mute);
}
.email-cell {
  font-size: 13px;
  color: var(--ink-mute);
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.date-cell {
  font-size: 13px;
  color: var(--ink-mute);
  white-space: nowrap;
}
.amount-cell {
  white-space: nowrap;
}
.discount-badge {
  font-size: 11px;
  background: var(--green-bg);
  color: var(--green);
  padding: 1px 6px;
  border-radius: 10px;
  margin-left: 4px;
}
.text-mute {
  color: var(--ink-faint);
}

.invoice-no {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--brand);
  font-weight: 600;
}
[data-theme='night'] .invoice-no {
  color: var(--gold);
}

.code-tag {
  font-family: 'JetBrains Mono', monospace;
  background: var(--bg-soft);
  border: 1px solid var(--rule);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  color: var(--brand);
}
[data-theme='night'] .code-tag {
  color: var(--gold);
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
.status-tag.refunded {
  background: var(--bg-soft);
  color: var(--ink-mute);
}
[data-theme='night'] .status-tag.failed {
  background: #2a1010;
  color: #f87171;
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 16px;
  border-top: 1px solid var(--rule);
}
.pg-btn {
  background: var(--bg-soft);
  border: 1px solid var(--rule-strong);
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 16px;
  cursor: pointer;
  color: var(--ink);
  transition: all 0.15s;
}
.pg-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.pg-btn:hover:not(:disabled) {
  background: var(--brand);
  color: var(--bg);
}
.pg-info {
  font-size: 13px;
  color: var(--ink-mute);
}

/* Invoice Modal */
.invoice-modal {
  max-width: 700px;
}
.modal-header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

/* Invoice Preview */
.invoice-preview {
  background: var(--bg);
  border: 1px solid var(--rule);
  border-radius: 10px;
  padding: 28px;
}
.inv-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
}
.inv-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}
.inv-logo {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: var(--brand);
  color: var(--bg);
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
[data-theme='night'] .inv-logo {
  background: var(--gold);
  color: #0a0f1f;
}
.inv-company {
  font-size: 15px;
  font-weight: 700;
  color: var(--ink);
}
.inv-tagline {
  font-size: 11px;
  color: var(--ink-mute);
}
.inv-meta {
  text-align: right;
}
.inv-no {
  font-family: 'JetBrains Mono', monospace;
  font-size: 16px;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 4px;
}
.inv-date {
  font-size: 12px;
  color: var(--ink-mute);
  margin-bottom: 8px;
}

.inv-parties {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--rule);
}
.inv-section-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--ink-faint);
  margin-bottom: 6px;
}
.inv-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 2px;
}
.inv-from p,
.inv-to p {
  font-size: 13px;
  color: var(--ink-mute);
  line-height: 1.5;
}

.inv-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  margin-bottom: 20px;
}
.inv-table th {
  text-align: left;
  padding: 8px 10px;
  border-bottom: 2px solid var(--rule-strong);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--ink-mute);
}
.inv-table td {
  padding: 10px;
  border-bottom: 1px solid var(--rule);
  color: var(--ink-soft);
}
.inv-table tfoot td {
  border-bottom: none;
  padding-top: 14px;
}
.right {
  text-align: right;
}
.discount-row {
  color: var(--green);
}
.total-row {
  font-size: 16px;
  color: var(--ink);
}

.inv-payment {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: var(--ink-mute);
  border-top: 1px solid var(--rule);
  padding-top: 16px;
}
.txn-id {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--ink-faint);
}
</style>
