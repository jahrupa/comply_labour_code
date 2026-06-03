import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('cm_user') || 'null'))
  const theme = ref(localStorage.getItem('cm_theme') || 'day')
  const activePlan = ref(null)
  const trialUsed = ref(0)
  const trialLimit = ref(30)
  const paymentHistory = ref([])

  const isLoggedIn = computed(() => !!user.value)
  const userName = computed(() => (user.value ? `${user.value.first} ${user.value.last}` : ''))
  const planLabel = computed(() => (activePlan.value ? activePlan.value.name : 'Free Trial'))
  const trialRemaining = computed(() => Math.max(0, trialLimit.value - trialUsed.value))
  const router = useRouter()

  function login(email, password) {
    // demo credentials
    if (email === 'demo@complymgmt.ai' && password === 'Demo@2026') {
      const u = { first: 'Demo', last: 'User', email, company: 'Demo Corp' }
      user.value = u
      localStorage.setItem('cm_user', JSON.stringify(u))
      return true
    }
    // accept any credentials for demo
    if (email && password.length >= 6) {
      const parts = email.split('@')
      const u = { first: parts[0], last: '', email, company: '' }
      user.value = u
      localStorage.setItem('cm_user', JSON.stringify(u))
      return true
    }
    return false
  }

  function signup(data) {
    const u = { first: data.first, last: data.last, email: data.email, company: data.company }
    user.value = u
    localStorage.setItem('cm_user', JSON.stringify(u))
    return true
  }

  function logout() {
    user.value = null
    localStorage.removeItem('cm_user')
    router.push('/')
  }

  function toggleTheme() {
    theme.value = theme.value === 'day' ? 'night' : 'day'
    document.documentElement.setAttribute('data-theme', theme.value)
    localStorage.setItem('cm_theme', theme.value)
  }

  function initTheme() {
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  function useCredit() {
    if (trialRemaining.value > 0) {
      trialUsed.value += 1
    }
  }

  function activatePlan(planKey, planName, credits, coupon) {
    const txnId = `TXN-${Date.now()}`
    activePlan.value = { key: planKey, name: planName, credits, coupon }
    trialLimit.value = credits
    trialUsed.value = 0
    paymentHistory.value.unshift({
      txnId,
      date: new Date().toLocaleDateString('en-IN'),
      plan: planName,
      amount: '',
    })
    return txnId
  }

  return {
    user,
    theme,
    isLoggedIn,
    userName,
    activePlan,
    trialUsed,
    trialLimit,
    paymentHistory,
    planLabel,
    trialRemaining,
    login,
    signup,
    logout,
    toggleTheme,
    initTheme,
    useCredit,
    activatePlan,
  }
})
