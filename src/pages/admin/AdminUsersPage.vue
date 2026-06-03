<template>
  <div class="admin-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Users</h1>
        <p class="page-sub">Manage all registered users</p>
      </div>
      <button class="btn-primary" @click="openCreate">+ New User</button>
    </div>

    <!-- Users Table -->
    <div class="card">
      <div v-if="loading" class="empty-state">Loading users…</div>
      <div v-else-if="users.length === 0" class="empty-state">No users found.</div>
      <table v-else class="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Organisation</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>
              <div class="user-cell">
                <div class="avatar">{{ initials(user) }}</div>
                <span>{{ fullName(user) }}</span>
              </div>
            </td>
            <td>{{ user.email }}</td>
            <td>{{ user.org_name || '—' }}</td>
            <td class="actions">
              <button class="btn-icon edit" @click="openEdit(user)" title="Edit">✏️</button>
              <button class="btn-icon delete" @click="confirmDelete(user)" title="Delete">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create / Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h2>{{ editing ? 'Update User' : 'Create User' }}</h2>
          <button class="modal-close" @click="closeModal">✕</button>
        </div>
        <div class="modal-body">
          <div class="field-row">
            <div class="field">
              <label>First Name *</label>
              <input v-model="form.fname" placeholder="Aarav" />
            </div>
            <div class="field">
              <label>Middle Name</label>
              <input v-model="form.mname" placeholder="Kumar" />
            </div>
            <div class="field">
              <label>Last Name *</label>
              <input v-model="form.lname" placeholder="Shah" />
            </div>
          </div>
          <div class="field">
            <label>Email *</label>
            <input v-model="form.email" type="email" placeholder="user@example.com" />
          </div>
          <div class="field">
            <label>Organisation</label>
            <input v-model="form.org_name" placeholder="Acme Corp" />
          </div>
          <template v-if="!editing">
            <div class="field">
              <label>Password *</label>
              <input v-model="form.password" type="password" placeholder="Min 6 characters" />
            </div>
            <div class="field">
              <label>Created By (UUID)</label>
              <input v-model="form.created_by" placeholder="00000000-0000-0000-0000-000000000001" />
            </div>
          </template>
          <template v-else>
            <div class="field">
              <label>Updated By (UUID)</label>
              <input v-model="form.updated_by" placeholder="00000000-0000-0000-0000-000000000001" />
            </div>
          </template>
          <div v-if="error" class="form-error">{{ error }}</div>
          <div v-if="successMsg" class="form-success">{{ successMsg }}</div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeModal">Cancel</button>
          <button class="btn-primary" :disabled="submitting" @click="submitForm">
            {{ submitting ? 'Saving…' : editing ? 'Update User' : 'Create User' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirm -->
    <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
      <div class="modal modal-sm">
        <div class="modal-header">
          <h2>Delete User</h2>
          <button class="modal-close" @click="deleteTarget = null">✕</button>
        </div>
        <div class="modal-body">
          <p>Delete <strong>{{ fullName(deleteTarget) }}</strong> ({{ deleteTarget.email }})?<br>This action cannot be undone.</p>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="deleteTarget = null">Cancel</button>
          <button class="btn-danger" :disabled="submitting" @click="deleteUser">
            {{ submitting ? 'Deleting…' : 'Delete User' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAdminApi } from 'src/composables/useAdminApi'

defineOptions({ name: 'AdminUsersPage' })

const { apiFetch } = useAdminApi()

const users = ref([])
const loading = ref(true)
const showModal = ref(false)
const editing = ref(null)
const deleteTarget = ref(null)
const submitting = ref(false)
const error = ref('')
const successMsg = ref('')

const ADMIN_UUID = '00000000-0000-0000-0000-000000000001'
const emptyForm = () => ({ fname: '', mname: '', lname: '', email: '', org_name: '', password: '', created_by: ADMIN_UUID, updated_by: ADMIN_UUID })
const form = ref(emptyForm())

const fullName = (u) => [u.fname, u.mname, u.lname].filter(Boolean).join(' ')
const initials = (u) => ((u.fname?.[0] || '') + (u.lname?.[0] || '')).toUpperCase() || '?'

async function loadUsers() {
  loading.value = true
  const res = await apiFetch('/admin/users')
  users.value = res || []
  loading.value = false
}

function openCreate() {
  editing.value = null
  form.value = emptyForm()
  error.value = ''; successMsg.value = ''
  showModal.value = true
}

function openEdit(user) {
  editing.value = user
  form.value = { fname: user.fname, mname: user.mname || '', lname: user.lname, email: user.email, org_name: user.org_name || '', updated_by: ADMIN_UUID }
  error.value = ''; successMsg.value = ''
  showModal.value = true
}

function closeModal() { showModal.value = false; editing.value = null }

async function submitForm() {
  if (!form.value.fname || !form.value.lname || !form.value.email) { error.value = 'First name, last name, and email are required.'; return }
  submitting.value = true; error.value = ''
  try {
    if (editing.value) {
      const { fname, mname, lname, email, org_name, updated_by } = form.value
      await apiFetch(`/admin/users/${editing.value.id}`, 'PUT', { fname, mname, lname, email, org_name, updated_by })
      successMsg.value = 'User updated!'
    } else {
      await apiFetch('/admin/users', 'POST', form.value)
      successMsg.value = 'User created!'
    }
    await loadUsers()
    setTimeout(closeModal, 800)
  } catch (e) { error.value = e.message || 'Something went wrong.' }
  submitting.value = false
}

function confirmDelete(user) { deleteTarget.value = user }

async function deleteUser() {
  submitting.value = true
  try {
    await apiFetch(`/admin/users/${deleteTarget.value.id}`, 'DELETE')
    await loadUsers()
    deleteTarget.value = null
  } catch (e) { error.value = e.message }
  submitting.value = false
}

onMounted(loadUsers)
</script>

<style scoped>
.user-cell { display: flex; align-items: center; gap: 10px; }
.avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: var(--brand); color: var(--bg-card);
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700; flex-shrink: 0;
}
[data-theme='night'] .avatar { background: var(--gold); color: #0a0f1f; }
.field-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
@media (max-width: 600px) { .field-row { grid-template-columns: 1fr; } }
</style>
