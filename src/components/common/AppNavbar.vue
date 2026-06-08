<template>
  <nav class="nav" id="mainNav">
    <div class="nav-inner">
      <!-- Logo -->
      <div class="logo" @click="goHome">
        <span class="logo-cm">complymgmt</span>
        <span class="logo-dot">.</span>
        <span class="logo-ai">ai</span>
        <span class="logo-badge">Labour Codes</span>
      </div>

      <!-- Navigation Links -->
      <div class="nav-links">
        <span class="nav-link" @click="scrollToSection('features')"> How it works </span>

        <span class="nav-link" @click="scrollToSection('pricing-section')"> Pricing </span>

        <span class="nav-link" @click="scrollToSection('about-section')"> About Karma </span>

        <span class="nav-link" @click="scrollToSection('contact-section')"> Contact us </span>
      </div>

      <!-- Actions -->
      <div class="nav-actions">
        <button class="theme-btn" @click="auth.toggleTheme" title="Toggle theme">
          {{ auth.theme === 'day' ? '🌙' : '☀️' }}
        </button>

        <!-- Guest User -->
        <template v-if="!auth.isLoggedIn">
          <button
            class="btn btn-primary btn-sm"
            style="background: #e85231; color: #fff"
            @click="goAuth('signup')"
          >
            Get Started

            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </template>

        <!-- Logged In User -->
        <template v-else>
          <div class="user-badge" @click="goDash">
            <span>⚡</span>
            <span>{{ auth.user?.firstName || auth.user?.name || 'User' }}</span>
            <span style="font-size: 11px; opacity: 0.7">▾</span>
          </div>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'

const router = useRouter()
const auth = useAuthStore()
console.log(auth.isLoggedIn, 'auth.isLoggedIn')
const goHome = () => {
  router.push('/')
}

const goAuth = (tab = 'signup') => {
  router.push({
    name: 'auth',
    query: { tab },
  })
}

const goDash = () => {
  router.push('/wage-calculator')
}

const scrollToSection = (id) => {
  console.log(id)
  console.log(document.getElementById(id))

  document.getElementById(id)?.scrollIntoView({
    behavior: 'smooth',
  })
}
</script>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 200;
  backdrop-filter: blur(20px);
  background: color-mix(in srgb, var(--bg) 85%, transparent);
  border-bottom: 1px solid var(--rule);
  transition: all 0.3s;
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 68px;
  /* max-width: 1200px; */
  margin: 0 auto;
  padding: 0 32px;
}

.logo {
  display: flex;
  align-items: baseline;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 800;
  font-size: 20px;
  letter-spacing: -0.03em;
  cursor: pointer;
}

.logo-cm {
  color: var(--brand);
}

.logo-dot {
  color: var(--ink-faint);
  margin: 0 1px;
}

.logo-ai {
  color: var(--accent);
}

.logo-badge {
  font-size: 10px;
  font-weight: 700;
  margin-left: 10px;
  padding: 3px 9px;
  border: 1px solid var(--gold);
  color: var(--gold);
  border-radius: 100px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.nav-links {
  display: flex;
  gap: 28px;
  align-items: center;
}

.nav-link {
  font-size: 14px;
  font-weight: 500;
  color: var(--ink-soft);
  transition: color 0.2s;
  cursor: pointer;
}

.nav-link:hover {
  color: var(--brand);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.theme-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--rule-strong);
  background: var(--bg-soft);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.2s;
}

.theme-btn:hover {
  border-color: var(--brand);
}

.user-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 14px;
  background: var(--gold-bg);
  border: 1px solid var(--gold);
  border-radius: 100px;
  font-size: 13px;
  font-weight: 600;
  color: var(--gold);
  cursor: pointer;
}
</style>
