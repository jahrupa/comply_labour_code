<template>
  <div class="auth-page">
    <div class="auth-card">
      <!-- Logo -->
      <div class="logo-wrapper">
        <div class="logo">
          <span class="logo-cm">complymgmt</span>
          <span class="logo-dot">.</span>
          <span class="logo-ai">ai</span>
        </div>
      </div>

      <p class="auth-subtitle">New Wage Code Compliance Engine</p>

      <!-- Tabs -->
      <div class="auth-tabs">
        <div
          v-for="tab in ['login', 'signup']"
          :key="tab"
          class="auth-tab"
          :class="{ active: activeTab === tab }"
          @click="setTab(tab)"
        >
          {{ tab === 'login' ? 'Log in' : 'Sign up' }}
        </div>
      </div>

      <!-- Error -->
      <div v-if="error" class="error-box">
        {{ error }}
      </div>

      <!-- LOGIN -->
      <div v-if="activeTab === 'login'">
        <div class="form-group">
          <label class="form-label">Email address</label>
          <input
            v-model="loginEmail"
            class="form-input"
            type="email"
            placeholder="you@company.com"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Password</label>
          <input
            v-model="loginPassword"
            class="form-input"
            type="password"
            placeholder="••••••••"
          />
        </div>

        <button
          class="btn btn-primary btn-block btn-lg"
          style="margin-top: 8px"
          :disabled="loading"
          @click="doLogin"
        >
          {{ loading ? 'Logging in…' : 'Log in to dashboard' }}
        </button>

        <div class="divider">
          <span>or use demo credentials</span>
        </div>

        <div class="demo-box">
          <p class="demo-title">🎯 Board Demo Account</p>

          <span class="demo-cred"> demo@complymgmt.ai · Demo@2026 </span>

          <button class="btn btn-gold btn-sm demo-btn" @click="fillDemo">
            Use demo credentials
          </button>
        </div>
      </div>

      <!-- SIGNUP -->
      <div v-else>
        <div class="two-col">
          <div class="form-group">
            <label class="form-label">First name</label>
            <input v-model="signupFirst" class="form-input" type="text" placeholder="Priya" />
          </div>

          <div class="form-group">
            <label class="form-label">Last name</label>
            <input v-model="signupLast" class="form-input" type="text" placeholder="Sharma" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Work email</label>
          <input
            v-model="signupEmail"
            class="form-input"
            type="email"
            placeholder="you@company.com"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Company name</label>
          <input
            v-model="signupCompany"
            class="form-input"
            type="text"
            placeholder="Acme Pvt Ltd"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Password</label>
          <input
            v-model="signupPassword"
            class="form-input"
            type="password"
            placeholder="Min. 8 characters"
          />

          <p class="form-hint">Your free trial includes 3 salary restructures. No card required.</p>
        </div>

        <button
          class="btn btn-accent btn-block btn-lg"
          style="margin-top: 8px"
          :disabled="loading"
          @click="doSignup"
        >
          {{ loading ? 'Creating account…' : 'Create account & start free trial' }}
        </button>
      </div>

      <!-- Footer -->
      <div class="auth-footer">
        <template v-if="activeTab === 'login'">
          Don't have an account?

          <a @click="setTab('signup')"> Sign up free </a>
        </template>

        <template v-else>
          Already have an account?

          <a @click="setTab('login')"> Log in </a>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
import { useAppStore } from 'src/stores/app'

defineOptions({
  name: 'AuthPage',
})

const router = useRouter()
const route = useRoute()

const auth = useAuthStore()
const app = useAppStore()

const activeTab = ref(route.query.tab === 'signup' ? 'signup' : 'login')

const loginEmail = ref('demo@complymgmt.ai')
const loginPassword = ref('Demo@2026')

const signupFirst = ref('')
const signupLast = ref('')
const signupEmail = ref('')
const signupCompany = ref('')
const signupPassword = ref('')

const loading = ref(false)
const error = ref('')

const setTab = (tab) => {
  activeTab.value = tab
  error.value = ''
}

const fillDemo = () => {
  loginEmail.value = 'demo@complymgmt.ai'
  loginPassword.value = 'Demo@2026'
}

const doLogin = async () => {
  error.value = ''

  if (!loginEmail.value || !loginPassword.value) {
    error.value = 'Please fill in all fields.'
    return
  }

  loading.value = true

  await new Promise((r) => setTimeout(r, 600))

  const ok = auth.login(loginEmail.value, loginPassword.value)

  loading.value = false

  if (ok) {
    app.showNotif('Welcome back! 👋', 'success')
    router.push('/dashboard')
  } else {
    error.value = 'Invalid credentials. Try demo@complymgmt.ai / Demo@2026'
  }
}

const doSignup = async () => {
  error.value = ''

  if (!signupFirst.value || !signupEmail.value || !signupPassword.value) {
    error.value = 'Please fill in all required fields.'
    return
  }

  if (signupPassword.value.length < 6) {
    error.value = 'Password must be at least 6 characters.'
    return
  }

  loading.value = true

  await new Promise((r) => setTimeout(r, 800))

  auth.signup({
    first: signupFirst.value,
    last: signupLast.value,
    email: signupEmail.value,
    company: signupCompany.value,
  })

  loading.value = false

  app.showNotif('Account created! Free trial activated 🎉', 'success')

  router.push('/dashboard')
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-soft);
  padding: 40px 20px;
}

.auth-card {
  width: 100%;
  max-width: 460px;
  background: var(--bg-card);
  border: 1px solid var(--rule);
  border-radius: 20px;
  padding: 48px 44px;
  box-shadow: var(--sh-lg);
}

.logo-wrapper {
  text-align: center;
  margin-bottom: 8px;
}

.logo {
  font-size: 22px;
  font-weight: 800;
  justify-content: center;
}

.auth-subtitle {
  text-align: center;
  font-size: 13px;
  color: var(--ink-mute);
  margin-bottom: 32px;
}

.auth-tabs {
  display: flex;
  background: var(--bg-soft);
  border-radius: 10px;
  padding: 4px;
  margin-bottom: 28px;
}

.auth-tab {
  flex: 1;
  padding: 9px;
  text-align: center;
  cursor: pointer;
  border-radius: 7px;
  font-size: 14px;
  font-weight: 600;
  color: var(--ink-mute);
  transition: all 0.2s;
}

.auth-tab.active {
  background: var(--bg-card);
  color: var(--ink);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.error-box {
  background: #feeeed;
  border: 1px solid #c0392b;
  color: #c0392b;
  padding: 10px 14px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 13px;
}

.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.divider {
  text-align: center;
  margin: 16px 0;
  position: relative;
  color: var(--ink-faint);
  font-size: 13px;
}

.divider::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  border-top: 1px solid var(--rule);
}

.divider span {
  position: relative;
  z-index: 1;
  padding: 0 12px;
  background: var(--bg-card);
}

.demo-box {
  background: var(--gold-bg);
  border: 1px solid var(--gold);
  border-radius: 10px;
  padding: 14px 16px;
}

.demo-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--gold);
  margin-bottom: 4px;
}

.demo-cred {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
}

.demo-btn {
  width: 100%;
  justify-content: center;
  margin-top: 10px;
}

.auth-footer {
  text-align: center;
  margin-top: 20px;
  font-size: 13px;
  color: var(--ink-mute);
}

.auth-footer a {
  color: var(--brand);
  font-weight: 600;
  cursor: pointer;
}
</style>
