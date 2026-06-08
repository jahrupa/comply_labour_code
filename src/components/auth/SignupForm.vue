<template>
  <div class="signup-form">
    <div class="payment-row">
      <div class="form-group">
        <label class="form-label">First name</label>
        <input class="form-input" type="text" v-model="form.firstName" placeholder="Priya" />
      </div>
      <div class="form-group">
        <label class="form-label">Last name</label>
        <input class="form-input" type="text" v-model="form.lastName" placeholder="Sharma" />
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Work email</label>
      <input class="form-input" type="email" v-model="form.email" placeholder="you@company.com" />
    </div>
    <div class="form-group">
      <label class="form-label">Company name</label>
      <input class="form-input" type="text" v-model="form.company" placeholder="Acme Pvt Ltd" />
    </div>
    <div class="form-group">
      <label class="form-label">Password</label>
      <input
        class="form-input"
        type="password"
        v-model="form.password"
        placeholder="Min. 8 characters"
      />
      <p class="form-hint">Your free trial includes 3 salary restructures. No card required.</p>
    </div>

    <p v-if="error" class="form-error">{{ error }}</p>

    <button
      class="btn btn-accent btn-block btn-lg"
      style="margin-top: 8px"
      @click="submit"
      :disabled="loading"
    >
      {{ loading ? 'Creating account…' : 'Create account & start free trial' }}
    </button>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useAppStore } from '../../stores/app'

const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()

const form = reactive({ firstName: '', lastName: '', email: '', company: '', password: '' })
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  if (!form.firstName || !form.email || !form.password) {
    error.value = 'Please fill in all required fields.'
    return
  }
  if (form.password.length < 6) {
    error.value = 'Password must be at least 6 characters.'
    return
  }
  loading.value = true
  await new Promise((r) => setTimeout(r, 600))
  authStore.signup(form)
  loading.value = false
  appStore.showNotif('🎉 Account created! Free trial activated.', 'success')
  router.push('/wage-calculator')
}
</script>

<style scoped>
.payment-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.form-error {
  font-size: 13px;
  color: var(--accent);
  margin-top: 4px;
}
</style>
