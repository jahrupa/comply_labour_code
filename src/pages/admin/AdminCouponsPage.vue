<template>
  <div class="admin-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Coupons</h1>
        <p class="page-sub">Manage discount coupons and promo codes</p>
      </div>
      <button class="btn-primary" @click="openCreate">+ New Coupon</button>
    </div>

    <!-- Coupons Table -->
    <div class="card">
      <div v-if="loading" class="empty-state">Loading coupons…</div>
      <div v-else-if="coupons.length === 0" class="empty-state">No coupons found.</div>
      <table v-else class="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Code</th>
            <th>Discount</th>
            <th>Valid From</th>
            <th>Valid To</th>
            <th>Usage Limit</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="coupon in coupons" :key="coupon.id">
            <td>
              <strong>{{ coupon.name }}</strong>
            </td>
            <td>
              <code class="code-tag">{{ coupon.code }}</code>
            </td>
            <td>
              <span v-if="coupon.discount_type === 'percent'">{{ coupon.percent_off }}% off</span>
              <span v-else>₹{{ (coupon.amount_off / 100).toFixed(2) }} off</span>
            </td>
            <td>{{ formatDate(coupon.valid_from) }}</td>
            <td>{{ formatDate(coupon.valid_to) }}</td>
            <td>{{ coupon.usage_limit }}</td>
            <td>
              <span :class="['status-tag', isActive(coupon) ? 'active' : 'expired']">{{
                isActive(coupon) ? 'Active' : 'Expired'
              }}</span>
            </td>
            <td class="actions">
              <button class="btn-icon delete" @click="confirmDelete(coupon)" title="Delete">
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h2>Create Coupon</h2>
          <button class="modal-close" @click="closeModal">✕</button>
        </div>
        <div class="modal-body">
          <div class="field-row">
            <div class="field">
              <label>Coupon Name *</label>
              <input v-model="form.name" placeholder="Summer Sale" />
            </div>
            <div class="field">
              <label>Code *</label>
              <input
                v-model="form.code"
                placeholder="SUMMER10"
                style="text-transform: uppercase"
                @input="form.code = form.code.toUpperCase()"
              />
            </div>
          </div>
          <div class="field-row">
            <div class="field">
              <label>Discount Type *</label>
              <select v-model="form.discount_type">
                <option value="percent">Percent Off</option>
                <option value="flat">Flat Amount Off</option>
              </select>
            </div>
            <div class="field">
              <label
                >{{
                  form.discount_type === 'percent' ? 'Percent Off (%)' : 'Amount Off (paise)'
                }}
                *</label
              >
              <input
                v-model.number="form.discount_value"
                type="number"
                :placeholder="form.discount_type === 'percent' ? '10' : '5000'"
              />
              <span v-if="form.discount_type === 'flat'" class="hint"
                >₹{{ (form.discount_value / 100).toFixed(2) }}</span
              >
            </div>
          </div>
          <div class="field-row">
            <div class="field">
              <label>Valid From *</label>
              <input v-model="form.valid_from" type="datetime-local" />
            </div>
            <div class="field">
              <label>Valid To *</label>
              <input v-model="form.valid_to" type="datetime-local" />
            </div>
          </div>
          <div class="field">
            <label>Usage Limit</label>
            <input v-model.number="form.usage_limit" type="number" placeholder="500" />
          </div>
          <div v-if="error" class="form-error">{{ error }}</div>
          <div v-if="successMsg" class="form-success">{{ successMsg }}</div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeModal">Cancel</button>
          <button class="btn-primary" :disabled="submitting" @click="submitForm">
            {{ submitting ? 'Creating…' : 'Create Coupon' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirm -->
    <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
      <div class="modal modal-sm">
        <div class="modal-header">
          <h2>Delete Coupon</h2>
          <button class="modal-close" @click="deleteTarget = null">✕</button>
        </div>
        <div class="modal-body">
          <p>
            Delete coupon <strong>{{ deleteTarget.name }}</strong> (<code>{{
              deleteTarget.code
            }}</code
            >)?
          </p>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="deleteTarget = null">Cancel</button>
          <button class="btn-danger" :disabled="submitting" @click="deleteCoupon">
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

defineOptions({ name: 'AdminCouponsPage' })

const { apiFetch } = useAdminApi()

const coupons = ref([])
const loading = ref(true)
const showModal = ref(false)
const deleteTarget = ref(null)
const submitting = ref(false)
const error = ref('')
const successMsg = ref('')

const emptyForm = () => ({
  name: '',
  code: '',
  discount_type: 'percent',
  discount_value: 10,
  valid_from: '',
  valid_to: '',
  usage_limit: 500,
})
const form = ref(emptyForm())

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—'
const isActive = (c) => new Date(c.valid_to) >= new Date()

async function loadCoupons() {
  loading.value = true
  const res = await apiFetch('/admin/coupons')
  coupons.value = res || []
  loading.value = false
}

function openCreate() {
  form.value = emptyForm()
  error.value = ''
  successMsg.value = ''
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function submitForm() {
  if (!form.value.name || !form.value.code || !form.value.valid_from || !form.value.valid_to) {
    error.value = 'Name, code, and validity dates are required.'
    return
  }
  submitting.value = true
  error.value = ''
  try {
    const payload = {
      name: form.value.name,
      code: form.value.code,
      discount_type: form.value.discount_type,
      valid_from: new Date(form.value.valid_from).toISOString(),
      valid_to: new Date(form.value.valid_to).toISOString(),
      usage_limit: form.value.usage_limit,
    }
    if (form.value.discount_type === 'percent') payload.percent_off = form.value.discount_value
    else payload.amount_off = form.value.discount_value

    await apiFetch('/admin/coupons', 'POST', payload)
    successMsg.value = 'Coupon created!'
    await loadCoupons()
    setTimeout(closeModal, 800)
  } catch (e) {
    error.value = e.message || 'Something went wrong.'
  }
  submitting.value = false
}

function confirmDelete(coupon) {
  deleteTarget.value = coupon
}

async function deleteCoupon() {
  submitting.value = true
  try {
    await apiFetch(`/admin/coupons/${deleteTarget.value.id}`, 'DELETE')
    await loadCoupons()
    deleteTarget.value = null
  } catch (e) {
    error.value = e.message
  }
  submitting.value = false
}

onMounted(loadCoupons)
</script>

<style scoped>
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
.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
@media (max-width: 600px) {
  .field-row {
    grid-template-columns: 1fr;
  }
}
</style>
