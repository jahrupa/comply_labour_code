<template>
  <section id="pricing-section" class="pricing-section">
    <div class="app-container">
      <div class="sec-eyebrow">Transparent pricing</div>

      <h2 class="sec-title">Start free. Upgrade when <em>ready.</em></h2>

      <p class="sec-lede">Project-based packs, not opaque retainers. Pay once, download forever.</p>

      <div class="pricing-grid">
        <div
          v-for="plan in plans"
          :key="plan.name"
          :class="['pricing-card', { featured: plan.featured }]"
        >
          <span v-if="plan.badge" class="plan-badge">
            {{ plan.badge }}
          </span>

          <p class="plan-name">
            {{ plan.name }}
          </p>

          <p class="plan-desc">
            {{ plan.desc }}
          </p>

          <p class="plan-price">
            {{ plan.price }}
          </p>

          <p class="plan-unit">
            {{ plan.unit }}
          </p>

          <div class="divider"></div>

          <ul class="feature-list">
            <li v-for="feature in plan.features" :key="feature" class="feature-item">
              <span class="check-icon">✓</span>
              {{ feature }}
            </li>
          </ul>

          <button :class="`btn ${plan.btnClass} btn-block`" @click="goSignup(plan.tab)">
            {{ plan.btnLabel }}
          </button>
        </div>
      </div>

      <div class="expert-box">
        <div>
          <p class="expert-title">Need more than 500 employees or a custom engagement?</p>

          <p class="expert-desc">
            Karma Management advisors handle multi-entity, multi-state, and listed company mandates.
          </p>
        </div>

        <button class="btn btn-gold btn-lg">Talk to an Expert →</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goSignup = (tab) => {
  router.push({
    name: 'auth',
    query: { tab },
  })
}

const plans = [
  {
    name: 'Free Trial',
    desc: 'Try the engine on your real employee data before committing.',
    price: '₹0',
    unit: '3 employees · No card required',
    features: [
      '3 salary restructures',
      'All 3 variant types',
      'Compliant CSV output',
      'Advisory report with citations',
    ],
    btnClass: 'btn-ghost',
    btnLabel: 'Start free trial →',
    tab: 'signup',
  },
  {
    name: 'Starter',
    desc: 'For SMEs restructuring their full workforce.',
    price: '₹4,000',
    unit: 'Up to 50 employees · One-time',
    features: [
      'Up to 50 employees',
      'All 3 variant types',
      'Bulk CSV upload',
      'Advisory report per employee',
      'Priority email support',
    ],
    btnClass: 'btn-gold',
    btnLabel: 'Get Starter →',
    tab: 'signup',
    featured: true,
    badge: 'Most Popular',
  },
  {
    name: 'Professional',
    desc: 'For growing companies with larger workforces and board-level needs.',
    price: '₹10,000',
    unit: '50–500 employees · One-time',
    features: [
      'Up to 500 employees',
      'Advisory reports + defense brief',
      'Karma advisor review',
      'Signed letterhead deliverable',
      'PE / board-ready format',
      '3-person sign-off chain',
    ],
    btnClass: 'btn-primary',
    btnLabel: 'Get Professional →',
    tab: 'signup',
  },
]
</script>

<style scoped>
.pricing-section {
  padding: 80px 0;
  background: var(--bg);
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 48px;
}

.pricing-card {
  position: relative;
  background: var(--bg-card);
  border: 1px solid var(--rule);
  border-radius: 16px;
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
}

.pricing-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--sh-lg);
}

.pricing-card.featured {
  background: var(--brand);
  border-color: var(--brand);
  transform: translateY(-8px);
}

.pricing-card.featured:hover {
  transform: translateY(-8px);
}

.plan-badge {
  position: absolute;
  top: -12px;
  right: 24px;
  background: var(--accent);
  color: #fff;
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.plan-name {
  font-family: 'Fraunces', serif;
  font-size: 22px;
  font-weight: 500;
  margin-bottom: 6px;
}

.plan-desc {
  font-size: 13px;
  margin-bottom: 20px;
  min-height: 36px;
  color: var(--ink-mute);
}

.featured .plan-name,
.featured .plan-price {
  color: var(--bg);
}

.featured .plan-desc,
.featured .plan-unit {
  color: rgba(255, 255, 255, 0.8);
}

.plan-price {
  font-family: 'Fraunces', serif;
  font-size: 36px;
  font-weight: 500;
  line-height: 1;
  margin-bottom: 4px;
}

.plan-unit {
  font-size: 12px;
  margin-bottom: 20px;
  color: var(--ink-mute);
}

.divider {
  height: 1px;
  background: var(--rule);
  margin-bottom: 20px;
}

.featured .divider {
  background: rgba(255, 255, 255, 0.2);
}

.feature-list {
  list-style: none;
  margin-bottom: 24px;
  flex: 1;
}

.feature-item {
  display: flex;
  gap: 10px;
  padding: 6px 0;
  font-size: 13px;
  color: var(--ink-soft);
}

.featured .feature-item {
  color: rgba(255, 255, 255, 0.9);
}

.check-icon {
  color: var(--gold);
  font-weight: 700;
}

.expert-box {
  margin-top: 40px;
  background: var(--gold-bg);
  border: 1px solid var(--gold);
  border-radius: 16px;
  padding: 28px 36px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.expert-title {
  font-weight: 700;
  font-size: 17px;
  color: var(--ink);
  margin-bottom: 6px;
}

.expert-desc {
  font-size: 14px;
  color: var(--ink-soft);
}

@media (max-width: 1024px) {
  .pricing-grid {
    grid-template-columns: 1fr;
  }
}
</style>
