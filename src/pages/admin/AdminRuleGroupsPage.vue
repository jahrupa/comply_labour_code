<template>
  <div class="admin-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Rule Groups</h1>
        <p class="page-sub">Combine multiple rules with logical operators</p>
      </div>
      <button class="btn-primary" @click="openCreate">+ New Group</button>
    </div>

    <!-- Search bar -->
    <div class="filter-bar card">
      <input v-model="search" class="search-input" placeholder="🔍  Search groups…" />
      <div class="filter-right">
        <span class="result-count"
          >{{ filteredGroups.length }} group{{ filteredGroups.length !== 1 ? 's' : '' }}</span
        >
      </div>
    </div>

    <!-- Groups Table -->
    <div class="card mt-16">
      <div v-if="loading" class="empty-state">Loading rule groups…</div>
      <div v-else-if="filteredGroups.length === 0" class="empty-state">No rule groups found.</div>
      <table v-else class="data-table">
        <thead>
          <tr>
            <th @click="sortBy('name')" class="sortable">
              Name <span class="sort-arrow">{{ sortArrow('name') }}</span>
            </th>
            <th>Operator</th>
            <th>Rules</th>
            <th>Created By</th>
            <th @click="sortBy('created_at')" class="sortable">
              Created <span class="sort-arrow">{{ sortArrow('created_at') }}</span>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="grp in filteredGroups" :key="grp.id">
            <td>
              <div class="rule-name">{{ grp.name }}</div>
              <div class="rule-id">{{ grp.id }}</div>
            </td>
            <td>
              <span :class="['op-badge', grp.operator?.toLowerCase()]">{{
                grp.operator || 'AND'
              }}</span>
            </td>
            <td>
              <div class="rule-chips">
                <span
                  v-for="ruleId in (grp.rule_ids || []).slice(0, 3)"
                  :key="ruleId"
                  class="rule-chip"
                  :title="ruleId"
                >
                  {{ getRuleName(ruleId) }}
                </span>
                <span v-if="(grp.rule_ids || []).length > 3" class="rule-chip more">
                  +{{ grp.rule_ids.length - 3 }}
                </span>
              </div>
            </td>
            <td>
              <div class="user-cell">
                <div class="avatar">{{ initials(grp.created_by_name || 'A') }}</div>
                <span class="creator-name">{{
                  grp.created_by_name || shortUUID(grp.created_by)
                }}</span>
              </div>
            </td>
            <td class="date-cell">{{ formatDate(grp.created_at) }}</td>
            <td class="actions">
              <button class="btn-icon edit" @click="openEdit(grp)" title="Edit">✏️</button>
              <button class="btn-icon delete" @click="confirmDelete(grp)" title="Delete">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create / Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal modal-lg">
        <div class="modal-header">
          <h2>{{ editing ? 'Edit Rule Group' : 'Create Rule Group' }}</h2>
          <button class="modal-close" @click="closeModal">✕</button>
        </div>
        <div class="modal-body">
          <!-- Name (optional) -->
          <div class="field">
            <label>Group Name <span class="opt-label">(optional)</span></label>
            <input v-model="form.name" placeholder="e.g. loan_approval" />
          </div>

          <!-- Operator (optional) -->
          <div class="field">
            <label>Logical Operator <span class="opt-label">(optional, default: AND)</span></label>
            <div class="op-toggle">
              <button
                v-for="op in ['AND', 'OR']"
                :key="op"
                :class="['op-btn', { active: form.operator === op }]"
                @click="form.operator = op"
                type="button"
              >
                <strong>{{ op }}</strong>
                <span>{{ op === 'AND' ? 'All rules must pass' : 'Any rule must pass' }}</span>
              </button>
            </div>
          </div>

          <!-- Rule IDs multi-select -->
          <div class="field">
            <label
              >Select Rules *
              <span class="sel-count">({{ form.rule_ids.length }} selected)</span></label
            >
            <div class="rules-picker">
              <div
                v-for="rule in availableRules"
                :key="rule.id"
                :class="['rule-pick-item', { selected: form.rule_ids.includes(rule.id) }]"
                @click="toggleRule(rule.id)"
              >
                <div class="rule-pick-left">
                  <span class="pick-check">{{ form.rule_ids.includes(rule.id) ? '✓' : '' }}</span>
                  <div>
                    <div class="pick-name">{{ rule.name }}</div>
                    <code class="pick-expr">{{ rule.expression }}</code>
                  </div>
                </div>
                <span class="pick-id">{{ shortUUID(rule.id) }}</span>
              </div>
              <div v-if="availableRules.length === 0" class="empty-state" style="padding: 16px">
                No rules available. Create rules first.
              </div>
            </div>
          </div>

          <!-- Selected order preview -->
          <div v-if="form.rule_ids.length >= 2" class="logic-preview">
            <div class="logic-label">Logic Preview</div>
            <div class="logic-expr">
              <template v-for="(id, i) in form.rule_ids" :key="id">
                <span class="logic-rule">{{ getRuleName(id) }}</span>
                <span
                  v-if="i < form.rule_ids.length - 1"
                  :class="['logic-op', form.operator?.toLowerCase()]"
                >
                  {{ form.operator || 'AND' }}
                </span>
              </template>
            </div>
          </div>

          <!-- Created By -->
          <div class="field">
            <label>Created By (User ID) *</label>
            <input
              v-model="form.created_by"
              class="uuid-input"
              placeholder="00000000-0000-0000-0000-000000000001"
            />
          </div>

          <div v-if="error" class="form-error">{{ error }}</div>
          <div v-if="successMsg" class="form-success">{{ successMsg }}</div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeModal">Cancel</button>
          <button class="btn-primary" :disabled="submitting" @click="submitForm">
            {{ submitting ? 'Saving…' : editing ? 'Update Group' : 'Create Group' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirm -->
    <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
      <div class="modal modal-sm">
        <div class="modal-header">
          <h2>Delete Rule Group</h2>
          <button class="modal-close" @click="deleteTarget = null">✕</button>
        </div>
        <div class="modal-body">
          <p>
            Delete group <strong>{{ deleteTarget.name || deleteTarget.id }}</strong
            >? This cannot be undone.
          </p>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="deleteTarget = null">Cancel</button>
          <button class="btn-danger" :disabled="submitting" @click="deleteGroup">
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

defineOptions({ name: 'AdminRuleGroupsPage' })

const { apiFetch } = useAdminApi()

const groups = ref([])
const availableRules = ref([])
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
  operator: 'AND',
  rule_ids: [],
  created_by: '00000000-0000-0000-0000-000000000001',
})
const form = ref(emptyForm())
let editingId = null

// ── Seed data ─────────────────────────────────────────────────────────────────
function seedRules() {
  return [
    { id: 'd290f1ee-6c54-4b01-90e6-d701748f0851', name: 'adult', expression: 'age >= 18' },
    {
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      name: 'high_income',
      expression: 'income > 50000',
    },
    {
      id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
      name: 'good_credit',
      expression: 'credit_score >= 700',
    },
    {
      id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
      name: 'employed',
      expression: 'employment_status == "employed"',
    },
  ]
}

function seedGroups() {
  return [
    {
      id: 'grp-001',
      name: 'loan_approval',
      operator: 'AND',
      rule_ids: ['d290f1ee-6c54-4b01-90e6-d701748f0851', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'],
      created_by: '00000000-0000-0000-0000-000000000001',
      created_by_name: 'Admin',
      created_at: new Date(2026, 5, 1).toISOString(),
    },
    {
      id: 'grp-002',
      name: 'premium_credit',
      operator: 'AND',
      rule_ids: [
        'd290f1ee-6c54-4b01-90e6-d701748f0851',
        'b2c3d4e5-f6a7-8901-bcde-f12345678901',
        'c3d4e5f6-a7b8-9012-cdef-123456789012',
      ],
      created_by: '00000000-0000-0000-0000-000000000001',
      created_by_name: 'Admin',
      created_at: new Date(2026, 4, 20).toISOString(),
    },
    {
      id: 'grp-003',
      name: 'income_or_credit',
      operator: 'OR',
      rule_ids: ['a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'b2c3d4e5-f6a7-8901-bcde-f12345678901'],
      created_by: '00000000-0000-0000-0000-000000000001',
      created_by_name: 'Admin',
      created_at: new Date(2026, 4, 25).toISOString(),
    },
  ]
}

async function loadAll() {
  loading.value = true
  try {
    const [ruleRes, grpRes] = await Promise.all([
      apiFetch('/admin/rules'),
      apiFetch('/admin/rule-groups'),
    ])
    availableRules.value = ruleRes || seedRules()
    groups.value = grpRes || seedGroups()
  } catch {
    availableRules.value = seedRules()
    groups.value = seedGroups()
  }
  loading.value = false
}

// ── Computed ──────────────────────────────────────────────────────────────────
const filteredGroups = computed(() => {
  let r = groups.value
  if (search.value) {
    const q = search.value.toLowerCase()
    r = r.filter((g) => g.name?.toLowerCase().includes(q))
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

function openEdit(grp) {
  editing.value = true
  editingId = grp.id
  form.value = {
    name: grp.name || '',
    operator: grp.operator || 'AND',
    rule_ids: [...(grp.rule_ids || [])],
    created_by: grp.created_by,
  }
  error.value = ''
  successMsg.value = ''
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function submitForm() {
  if (form.value.rule_ids.length < 1) {
    error.value = 'Select at least one rule.'
    return
  }
  if (!form.value.created_by) {
    error.value = 'Created By is required.'
    return
  }
  submitting.value = true
  error.value = ''
  try {
    const payload = {
      rule_ids: form.value.rule_ids,
      created_by: form.value.created_by,
    }
    if (form.value.name) payload.name = form.value.name
    if (form.value.operator) payload.operator = form.value.operator

    if (editing.value) {
      await apiFetch(`/admin/rule-groups/${editingId}`, 'PUT', payload)
      successMsg.value = 'Group updated!'
    } else {
      await apiFetch('/admin/rule-groups', 'POST', payload)
      successMsg.value = 'Group created!'
    }
    await loadAll()
    setTimeout(closeModal, 700)
  } catch (e) {
    error.value = e.message || 'Something went wrong.'
  }
  submitting.value = false
}

function confirmDelete(grp) {
  deleteTarget.value = grp
}

async function deleteGroup() {
  submitting.value = true
  try {
    await apiFetch(`/admin/rule-groups/${deleteTarget.value.id}`, 'DELETE')
    await loadAll()
    deleteTarget.value = null
  } catch (e) {
    error.value = e.message
  }
  submitting.value = false
}

function toggleRule(id) {
  const idx = form.value.rule_ids.indexOf(id)
  if (idx === -1) form.value.rule_ids.push(id)
  else form.value.rule_ids.splice(idx, 1)
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function getRuleName(id) {
  return availableRules.value.find((r) => r.id === id)?.name || id.slice(0, 8) + '…'
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

onMounted(loadAll)
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

.op-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
  letter-spacing: 0.06em;
}
.op-badge.and {
  background: var(--bg-soft);
  color: var(--brand);
  border: 1px solid var(--rule-strong);
}
.op-badge.or {
  background: var(--gold-bg);
  color: var(--gold);
  border: 1px solid var(--gold);
}
[data-theme='night'] .op-badge.and {
  color: var(--gold);
}

.rule-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  max-width: 260px;
}
.rule-chip {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 6px;
  background: var(--bg-soft);
  border: 1px solid var(--rule);
  color: var(--ink-soft);
}
.rule-chip.more {
  color: var(--ink-mute);
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

/* Modal */
.modal-lg {
  max-width: 640px;
}
.opt-label {
  font-weight: 400;
  color: var(--ink-faint);
  text-transform: none;
  letter-spacing: 0;
  font-size: 11px;
}
.sel-count {
  font-weight: 400;
  color: var(--brand);
}
[data-theme='night'] .sel-count {
  color: var(--gold);
}

/* Operator toggle */
.op-toggle {
  display: flex;
  gap: 10px;
}
.op-btn {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid var(--rule-strong);
  border-radius: 10px;
  background: var(--bg);
  color: var(--ink-soft);
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;
  font-family: inherit;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.op-btn strong {
  font-size: 14px;
  color: var(--ink);
}
.op-btn span {
  font-size: 11px;
  color: var(--ink-mute);
}
.op-btn.active {
  border-color: var(--brand);
  background: var(--gold-bg);
}
.op-btn.active strong {
  color: var(--brand);
}
[data-theme='night'] .op-btn.active {
  border-color: var(--gold);
}
[data-theme='night'] .op-btn.active strong {
  color: var(--gold);
}

/* Rules picker */
.rules-picker {
  border: 1px solid var(--rule-strong);
  border-radius: 10px;
  overflow: hidden;
  max-height: 250px;
  overflow-y: auto;
}
.rule-pick-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  cursor: pointer;
  transition: background 0.15s;
  border-bottom: 1px solid var(--rule);
}
.rule-pick-item:last-child {
  border-bottom: none;
}
.rule-pick-item:hover {
  background: var(--bg-soft);
}
.rule-pick-item.selected {
  background: var(--gold-bg);
}
[data-theme='night'] .rule-pick-item.selected {
  background: rgba(201, 162, 75, 0.1);
}

.rule-pick-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.pick-check {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 2px solid var(--rule-strong);
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: var(--brand);
  flex-shrink: 0;
  transition: all 0.15s;
}
.rule-pick-item.selected .pick-check {
  background: var(--brand);
  color: var(--bg);
  border-color: var(--brand);
}
[data-theme='night'] .rule-pick-item.selected .pick-check {
  background: var(--gold);
  color: #0a0f1f;
  border-color: var(--gold);
}
.pick-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
}
.pick-expr {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--ink-mute);
  display: block;
  margin-top: 2px;
}
.pick-id {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: var(--ink-faint);
  flex-shrink: 0;
}

/* Logic preview */
.logic-preview {
  background: var(--bg-soft);
  border: 1px solid var(--rule);
  border-radius: 8px;
  padding: 12px 16px;
}
.logic-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ink-faint);
  margin-bottom: 10px;
}
.logic-expr {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
.logic-rule {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 600;
  background: var(--bg-card);
  border: 1px solid var(--rule-strong);
  padding: 4px 10px;
  border-radius: 6px;
  color: var(--ink);
}
.logic-op {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
}
.logic-op.and {
  background: var(--bg-soft);
  color: var(--brand);
  border: 1px solid var(--rule-strong);
}
.logic-op.or {
  background: var(--gold-bg);
  color: var(--gold);
}
[data-theme='night'] .logic-op.and {
  color: var(--gold);
}

.uuid-input {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
}

.btn-icon.edit:hover {
  border-color: var(--brand);
  background: var(--gold-bg);
}

.sortable {
  cursor: pointer;
  user-select: none;
}
.sort-arrow {
  color: var(--ink-faint);
  font-size: 10px;
}
</style>
