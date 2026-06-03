<template>
  <footer class="footer">
    <div class="app-container">
      <div class="footer-top">
        <div class="footer-brand">
          <div class="logo">
            <span class="logo-cm">complymgmt</span>
            <span class="logo-dot">.</span>
            <span class="logo-ai">ai</span>
          </div>

          <p class="footer-description">
            India's most accurate New Wage Code compliance engine. Built by Karma Management
            advisors.
          </p>
        </div>

        <div class="footer-links">
          <div>
            <p class="footer-title">Product</p>

            <div class="footer-menu">
              <a v-for="item in productLinks" :key="item" href="#" class="footer-link">
                {{ item }}
              </a>
            </div>
          </div>

          <div>
            <p class="footer-title">Legal</p>

            <div class="footer-menu">
              <a v-for="item in legalLinks" :key="item" href="#" class="footer-link">
                {{ item }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© 2026 complymgmt.ai · A Karma Management product</p>

        <p>Data hosted on Azure India South & Central</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
const productLinks = ['Features', 'Pricing', 'About']

const legalLinks = ['Privacy Policy', 'Terms of Use', 'DPDP Act 2023']
</script>

<style scoped>
.footer {
  background: var(--bg-soft);
  border-top: 1px solid var(--rule);
  padding: 48px 0 32px;
}

.footer-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 40px;
  flex-wrap: wrap;
  margin-bottom: 40px;
}

.footer-brand {
  max-width: 320px;
}

.logo {
  margin-bottom: 12px;
  font-size: 20px;
  font-weight: 800;
}

.footer-description {
  font-size: 14px;
  color: var(--ink-mute);
  line-height: 1.6;
}

.footer-links {
  display: flex;
  gap: 64px;
  flex-wrap: wrap;
}

.footer-title {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--ink-faint);
  margin-bottom: 14px;
}

.footer-menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-link {
  font-size: 14px;
  color: var(--ink-mute);
  text-decoration: none;
  transition: 0.2s ease;
}

.footer-link:hover {
  color: var(--accent);
}

.footer-bottom {
  border-top: 1px solid var(--rule);
  padding-top: 24px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.footer-bottom p {
  font-size: 13px;
  color: var(--ink-faint);
  margin: 0;
}
</style>
