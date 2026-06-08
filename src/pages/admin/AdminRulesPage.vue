<template>
  <div class="admin-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Rules</h1>
        <p class="page-sub">Define business rules with expressions</p>
      </div>
      <button class="btn-primary" @click="openCreate">+ New Rule</button>
    </div>

    <!-- Search + filter bar -->
    <div class="filter-bar card">
      <input v-model="search" class="search-input" placeholder="🔍  Search rules…" />
      <div class="filter-right">
        <span class="result-count"
          >{{ filteredRules.length }} rule{{ filteredRules.length !== 1 ? 's' : '' }}</span
        >
      </div>
    </div>

    <!-- Rules Table -->
    <div class="card mt-16">
      <div v-if="loading" class="empty-state">Loading rules…</div>
      <div v-else-if="filteredRules.length === 0" class="empty-state">No rules found.</div>
      <table v-else class="data-table">
        <thead>
          <tr>
            <th @click="sortBy('name')" class="sortable">
              Name <span class="sort-arrow">{{ sortArrow('name') }}</span>
            </th>
            <th>Expression</th>
            <th>Created By</th>
            <th @click="sortBy('created_at')" class="sortable">
              Created <span class="sort-arrow">{{ sortArrow('created_at') }}</span>
            </th>
            <th>Groups</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rule in filteredRules" :key="rule.id">
            <td>
              <div class="rule-name">{{ rule.name }}</div>
              <div class="rule-id">{{ rule.id }}</div>
            </td>
            <td>
              <code class="expr-tag">{{ rule.expression }}</code>
            </td>
            <td>
              <div class="user-cell">
                <div class="avatar">{{ initials(rule.created_by_name || 'A') }}</div>
                <span class="creator-name">{{
                  rule.created_by_name || shortUUID(rule.created_by)
                }}</span>
              </div>
            </td>
            <td class="date-cell">{{ formatDate(rule.created_at) }}</td>
            <td>
              <span class="group-count-badge">{{ rule.group_count || 0 }}</span>
            </td>
            <td class="actions">
              <button class="btn-icon edit" @click="openEdit(rule)" title="Edit">✏️</button>
              <button class="btn-icon delete" @click="confirmDelete(rule)" title="Delete">
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create / Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h2>{{ editing ? 'Edit Rule' : 'Create Rule' }}</h2>
          <button class="modal-close" @click="closeModal">✕</button>
        </div>
        <div class="modal-body">
          <div class="field">
            <label>Rule Name *</label>
            <input v-model="form.name" placeholder="e.g. adult, loan_eligible" />
            <span class="hint">Use lowercase, snake_case names</span>
          </div>

          <div class="field">
            <label>Expression *</label>
            <div class="expr-wrap">
              <textarea
                v-model="form.expression"
                class="expr-input"
                placeholder="e.g. age >= 18"
                rows="3"
                spellcheck="false"
              ></textarea>
              <div class="expr-hints">
                <span class="hint-chip" @click="insertExpr('age >= 18')">age >= 18</span>
                <span class="hint-chip" @click="insertExpr('income > 50000')">income > 50000</span>
                <span class="hint-chip" @click="insertExpr('score >= 700')">score >= 700</span>
                <span class="hint-chip" @click="insertExpr('status == &quot;active&quot;')">
                  status == "active"
                </span>
              </div>
            </div>
          </div>

          <!-- Expression validator -->
          <div v-if="form.expression" class="expr-preview">
            <div class="expr-preview-label">Preview</div>
            <div class="expr-parsed">
              <span v-if="exprValid" class="expr-ok">✓ Valid expression</span>
              <span v-else class="expr-err">⚠ Check expression syntax</span>
              <code>{{ form.expression }}</code>
            </div>
          </div>

          <div class="field">
            <label>Created By (User ID) *</label>
            <input
              v-model="form.created_by"
              placeholder="00000000-0000-0000-0000-000000000001"
              class="uuid-input"
            />
            <span class="hint">UUID of the user creating this rule</span>
          </div>

          <div v-if="error" class="form-error">{{ error }}</div>
          <div v-if="successMsg" class="form-success">{{ successMsg }}</div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeModal">Cancel</button>
          <button class="btn-primary" :disabled="submitting" @click="submitForm">
            {{ submitting ? 'Saving…' : editing ? 'Update Rule' : 'Create Rule' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirm Modal -->
    <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
      <div class="modal modal-sm">
        <div class="modal-header">
          <h2>Delete Rule</h2>
          <button class="modal-close" @click="deleteTarget = null">✕</button>
        </div>
        <div class="modal-body">
          <p>
            Delete rule <strong>{{ deleteTarget.name }}</strong
            >?
            <span v-if="deleteTarget.group_count" class="warn-text">
              ⚠ This rule is used in {{ deleteTarget.group_count }} group(s).
            </span>
          </p>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="deleteTarget = null">Cancel</button>
          <button class="btn-danger" :disabled="submitting" @click="deleteRule">
            {{ submitting ? 'Deleting…' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdminApi } from 'src/composables/useAdminApi'

defineOptions({ name: 'AdminRulesPage' })

const { apiFetch } = useAdminApi()

const rules = ref([])
const loading = ref(true)
const showModal = ref(false)
const editing = ref(false)
const deleteTarget = ref(null)
const submitting = ref(false)
const error = ref('')
const successMsg = ref('')
const search = ref('')
const sortKey = ref('created_at')
const sortDir = ref('desc')

const emptyForm = () => ({
  name: '',
  expression: '',
  created_by: '00000000-0000-0000-0000-000000000001',
})
const form = ref(emptyForm())
let editingId = null

// ── Mock seed data ──────────────────────────────────────────────────────────
function seedRules() {
  return [
    {
      id: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
      name: 'adult',
      expression: 'age >= 18',
      created_by: '00000000-0000-0000-0000-000000000001',
      created_by_name: 'Admin',
      created_at: new Date(2026, 4, 10).toISOString(),
      group_count: 2,
    },
    {
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      name: 'high_income',
      expression: 'income > 50000',
      created_by: '00000000-0000-0000-0000-000000000001',
      created_by_name: 'Admin',
      created_at: new Date(2026, 4, 12).toISOString(),
      group_count: 1,
    },
    {
      id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
      name: 'good_credit',
      expression: 'credit_score >= 700',
      created_by: '00000000-0000-0000-0000-000000000001',
      created_by_name: 'Admin',
      created_at: new Date(2026, 4, 15).toISOString(),
      group_count: 1,
    },
    {
      id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
      name: 'employed',
      expression: 'employment_status == "employed"',
      created_by: '00000000-0000-0000-0000-000000000001',
      created_by_name: 'Admin',
      created_at: new Date(2026, 5, 1).toISOString(),
      group_count: 0,
    },
  ]
}

async function loadRules() {
  loading.value = true
  try {
    const res = await apiFetch('/admin/rules')
    rules.value = res || seedRules()
  } catch {
    rules.value = seedRules()
  }
  loading.value = false
}

// ── Computed ─────────────────────────────────────────────────────────────────
const exprValid = computed(() => {
  const e = form.value.expression.trim()
  if (!e) return false
  return /^[a-zA-Z_][a-zA-Z0-9_.]*\s*(>=|<=|==|!=|>|<)\s*.+/.test(e)
})

const filteredRules = computed(() => {
  let r = rules.value
  if (search.value) {
    const q = search.value.toLowerCase()
    r = r.filter((x) => x.name.toLowerCase().includes(q) || x.expression.toLowerCase().includes(q))
  }
  return r.slice().sort((a, b) => {
    const av = a[sortKey.value] ?? ''
    const bv = b[sortKey.value] ?? ''
    return sortDir.value === 'asc'
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av))
  })
})

// ── CRUD ──────────────────────────────────────────────────────────────────────
function openCreate() {
  editing.value = false
  editingId = null
  form.value = emptyForm()
  error.value = ''
  successMsg.value = ''
  showModal.value = true
}

function openEdit(rule) {
  editing.value = true
  editingId = rule.id
  form.value = { name: rule.name, expression: rule.expression, created_by: rule.created_by }
  error.value = ''
  successMsg.value = ''
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function submitForm() {
  if (!form.value.name || !form.value.expression || !form.value.created_by) {
    error.value = 'All fields are required.'
    return
  }
  submitting.value = true
  error.value = ''
  try {
    const payload = {
      name: form.value.name,
      expression: form.value.expression,
      created_by: form.value.created_by,
    }
    if (editing.value) {
      await apiFetch(`/admin/rules/${editingId}`, 'PUT', payload)
      successMsg.value = 'Rule updated!'
    } else {
      await apiFetch('/admin/rules', 'POST', payload)
      successMsg.value = 'Rule created!'
    }
    await loadRules()
    setTimeout(closeModal, 700)
  } catch (e) {
    error.value = e.message || 'Something went wrong.'
  }
  submitting.value = false
}

function confirmDelete(rule) {
  deleteTarget.value = rule
}

async function deleteRule() {
  submitting.value = true
  try {
    await apiFetch(`/admin/rules/${deleteTarget.value.id}`, 'DELETE')
    await loadRules()
    deleteTarget.value = null
  } catch (e) {
    error.value = e.message
  }
  submitting.value = false
}

// ── Helpers ───────────────────────────────────────────────────────────────────
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
function initials(s) {
  return String(s)[0]?.toUpperCase() || 'A'
}
function shortUUID(u) {
  return u ? u.split('-')[0] + '…' : '—'
}
function formatDate(d) {
  return d
    ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—'
}
function insertExpr(val) {
  form.value.expression = val
}

onMounted(loadRules)
</script>

<style scoped>
.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  gap: 12px;
}
.search-input {
  flex: 1;
  max-width: 340px;
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
  gap: 12px;
}
.result-count {
  font-size: 13px;
  color: var(--ink-mute);
}
.mt-16 {
  margin-top: 16px;
}

/* Table */
.rule-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
}
.rule-id {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: var(--ink-faint);
  margin-top: 2px;
}

.expr-tag {
  font-family: 'JetBrains Mono', monospace;
  background: var(--bg-soft);
  border: 1px solid var(--rule);
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 13px;
  color: var(--accent);
  font-weight: 500;
  white-space: nowrap;
}
[data-theme='night'] .expr-tag {
  color: var(--gold);
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}
.avatar {
  width: 26px;
  height: 26px;
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
.creator-name {
  font-size: 13px;
  color: var(--ink-soft);
}
.date-cell {
  font-size: 12px;
  color: var(--ink-mute);
  white-space: nowrap;
}

.group-count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--bg-soft);
  border: 1px solid var(--rule);
  font-size: 11px;
  font-weight: 700;
  color: var(--ink-mute);
}

/* Expression input */
.expr-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.expr-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--rule-strong);
  border-radius: 8px;
  background: var(--bg-soft);
  color: var(--accent);
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s;
}
.expr-input:focus {
  border-color: var(--brand);
}
[data-theme='night'] .expr-input {
  color: var(--gold);
}

.expr-hints {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.hint-chip {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 6px;
  background: var(--bg-soft);
  border: 1px solid var(--rule);
  color: var(--ink-mute);
  cursor: pointer;
  transition: all 0.15s;
}
.hint-chip:hover {
  background: var(--brand);
  color: var(--bg);
  border-color: var(--brand);
}
[data-theme='night'] .hint-chip:hover {
  background: var(--gold);
  color: #0a0f1f;
}

.expr-preview {
  background: var(--bg-soft);
  border: 1px solid var(--rule);
  border-radius: 8px;
  padding: 10px 14px;
}
.expr-preview-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ink-faint);
  margin-bottom: 6px;
}
.expr-parsed {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.expr-ok {
  font-size: 12px;
  color: var(--green);
  font-weight: 600;
}
.expr-err {
  font-size: 12px;
  color: var(--gold);
  font-weight: 600;
}
.expr-parsed code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: var(--accent);
}
[data-theme='night'] .expr-parsed code {
  color: var(--gold);
}

.uuid-input {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
}

.warn-text {
  color: var(--gold);
  font-weight: 600;
  font-size: 13px;
  display: block;
  margin-top: 8px;
}

.btn-icon.edit:hover {
  border-color: var(--brand);
  background: var(--gold-bg);
}
</style>
