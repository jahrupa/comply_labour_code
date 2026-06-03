<template>
  <div class="admin-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Subscription Plans</h1>
        <p class="page-sub">Manage pricing plans available to users</p>
      </div>
      <button class="btn-primary" @click="openCreate">+ New Plan</button>
    </div>

    <!-- Plans Table -->
    <div class="card">
      <div v-if="loading" class="empty-state">Loading plans…</div>
      <div v-else-if="plans.length === 0" class="empty-state">No plans found.</div>
      <table v-else class="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
            <th>Billing Cycle</th>
            <th>Quota Limit</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="plan in plans" :key="plan.id">
            <td><span class="badge">{{ plan.name }}</span></td>
            <td>₹{{ (plan.amount_paise / 100).toFixed(2) }}</td>
            <td><span :class="['cycle-tag', plan.billing_cycle]">{{ plan.billing_cycle }}</span></td>
            <td>{{ plan.quota_limit }}</td>
            <td class="actions">
              <button class="btn-icon edit" @click="openEdit(plan)" title="Edit">✏️</button>
              <button class="btn-icon delete" @click="confirmDelete(plan)" title="Delete">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create / Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h2>{{ editing ? 'Update Plan' : 'Create Plan' }}</h2>
          <button class="modal-close" @click="closeModal">✕</button>
        </div>
        <div class="modal-body">
          <div class="field">
            <label>Name</label>
            <input v-model="form.name" placeholder="e.g. Starter" />
          </div>
          <div class="field">
            <label>Amount (paise)</label>
            <input v-model.number="form.amount_paise" type="number" placeholder="49900" />
            <span class="hint">₹{{ (form.amount_paise / 100).toFixed(2) }}</span>
          </div>
          <div class="field">
            <label>Billing Cycle</label>
            <select v-model="form.billing_cycle">
              <option value="monthly">Monthly</option>
              <option value="annually">Annually</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>
          <div class="field">
            <label>Quota Limit</label>
            <input v-model.number="form.quota_limit" type="number" placeholder="100" />
          </div>
          <div v-if="error" class="form-error">{{ error }}</div>
          <div v-if="successMsg" class="form-success">{{ successMsg }}</div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeModal">Cancel</button>
          <button class="btn-primary" :disabled="submitting" @click="submitForm">
            {{ submitting ? 'Saving…' : editing ? 'Update Plan' : 'Create Plan' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirm Modal -->
    <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
      <div class="modal modal-sm">
        <div class="modal-header">
          <h2>Delete Plan</h2>
          <button class="modal-close" @click="deleteTarget = null">✕</button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete <strong>{{ deleteTarget.name }}</strong>?</p>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="deleteTarget = null">Cancel</button>
          <button class="btn-danger" :disabled="submitting" @click="deletePlan">
            {{ submitting ? 'Deleting…' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAdminApi } from 'src/composables/useAdminApi'

defineOptions({ name: 'SubscriptionPlansPage' })

const { apiFetch } = useAdminApi()

const plans = ref([])
const loading = ref(true)
const showModal = ref(false)
const editing = ref(null)
const deleteTarget = ref(null)
const submitting = ref(false)
const error = ref('')
const successMsg = ref('')

const emptyForm = () => ({ name: '', amount_paise: 0, billing_cycle: 'monthly', quota_limit: 100 })
const form = ref(emptyForm())

async function loadPlans() {
  loading.value = true
  const res = await apiFetch('/admin/subscription-plans')
  plans.value = res || []
  loading.value = false
}

function openCreate() {
  editing.value = null
  form.value = emptyForm()
  error.value = ''
  successMsg.value = ''
  showModal.value = true
}

function openEdit(plan) {
  editing.value = plan
  form.value = { name: plan.name, amount_paise: plan.amount_paise, billing_cycle: plan.billing_cycle, quota_limit: plan.quota_limit }
  error.value = ''
  successMsg.value = ''
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editing.value = null
}

async function submitForm() {
  if (!form.value.name.trim()) { error.value = 'Name is required.'; return }
  submitting.value = true
  error.value = ''
  try {
    if (editing.value) {
      await apiFetch(`/admin/subscription-plans/${editing.value.id}`, 'PUT', form.value)
      successMsg.value = 'Plan updated!'
    } else {
      await apiFetch('/admin/subscription-plans', 'POST', form.value)
      successMsg.value = 'Plan created!'
    }
    await loadPlans()
    setTimeout(closeModal, 800)
  } catch (e) {
    error.value = e.message || 'Something went wrong.'
  }
  submitting.value = false
}

function confirmDelete(plan) {
  deleteTarget.value = plan
}

async function deletePlan() {
  submitting.value = true
  try {
    await apiFetch(`/admin/subscription-plans/${deleteTarget.value.id}`, 'DELETE')
    await loadPlans()
    deleteTarget.value = null
  } catch (e) {
    error.value = e.message
  }
  submitting.value = false
}

onMounted(loadPlans)
</script>

<style scoped>
.cycle-tag { font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 20px; text-transform: capitalize; }
.cycle-tag.monthly { background: var(--green-bg); color: var(--green); }
.cycle-tag.annually { background: var(--gold-bg); color: var(--gold); }
.cycle-tag.quarterly { background: #e8f0ff; color: #2563eb; }
</style>
