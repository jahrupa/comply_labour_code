<template>
  <section class="why-section" id="about-section">
    <div class="container">
      <div class="sec-eyebrow">Why Karma Management</div>

      <h2 class="sec-title">
        20 years of labour law,
        <em>built into product.</em>
      </h2>

      <p class="sec-lede">
        Every algorithm reviewed by a senior practitioner. Every position carries a Karma-backed
        interpretation citing primary statutory authority.
      </p>

      <div class="why-grid">
        <div v-for="(card, index) in whyCards" :key="index" class="why-card">
          <div class="why-icon">
            {{ card.icon }}
          </div>

          <h3 class="why-title">
            {{ card.title }}
          </h3>

          <p class="why-desc">
            {{ card.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const whyCards = ref([
  {
    icon: '⚖️',
    title: 'Legally Defensible',
    description:
      'Every recommendation cites the underlying section, notification, or court judgment — ready for labour inspectors, board review, or PE due diligence.',
  },
  {
    icon: '🔒',
    title: 'Enterprise-Grade Security',
    description:
      'Azure India data residency. DPDP Act 2023 compliant. 256-bit encryption at rest and in transit. Your employee data never leaves Indian soil.',
  },
  {
    icon: '🗓️',
    title: 'Always Current',
    description:
      'Authority Library refreshed weekly. 36 jurisdictions tracked with effective dating — catches state-level notifications that differ from central rules.',
  },
  {
    icon: '🏆',
    title: 'Big 4 Advisory Quality',
    description:
      'Karma Management has advised Fortune 500 Indian operations, PE-backed companies, and public-sector undertakings on complex labour law matters since 2004.',
  },
  {
    icon: '⚡',
    title: 'Minutes, Not Weeks',
    description:
      'What used to take 3 weeks and ₹80,000 in consulting fees now runs in under 5 minutes — with the same legal rigour, at a fraction of the cost.',
  },
  {
    icon: '🤝',
    title: 'Expert Escalation Path',
    description:
      'Start with self-service and scale to Karma-signed letterhead reports with advisor review — the same practitioners who wrote the software review your output.',
  },
])
</script>

<style scoped>
/* WHY KARMA SECTION */

.why-section {
  padding: 100px 0;
  background: var(--bg-soft);
}

.why-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 56px;
}

.why-card {
  background: #fafafa;
  border: 1px solid #ddd5ca;
  border-radius: 18px;
  padding: 30px 24px;
  min-height: 235px;
  transition: all 0.3s ease;
}

.why-card:hover {
  border-color: #163d7a;
  box-shadow: 0 8px 20px rgba(22, 61, 122, 0.12);
  transform: translateY(-2px);
}

[data-theme='night'] .why-card:hover {
  border-color: var(--gold);
}

.why-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #f8f0df;
  border: 1px solid #c79b45;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c79b45;
  font-size: 18px;
  margin-bottom: 26px;
}

.why-title {
  font-family: 'Fraunces', serif;
  font-size: 22px;
  line-height: 1.2;
  font-weight: 500;
  color: var(--ink);
  margin-bottom: 10px;
}

.why-desc {
  font-size: 14px;
  line-height: 1.8;
  color: #566476;
}

/* RESPONSIVE */

@media (max-width: 1024px) {
  .why-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .why-section {
    padding: 70px 0;
  }

  .why-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-top: 60px;
  }

  .why-card {
    background: #fcfcfc;
    border: 1px solid #ddd5ca;
    border-radius: 18px;
    padding: 34px 28px;
    min-height: 220px;
    transition: all 0.3s ease;
  }

  .why-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
    border-color: #c79b45;
  }

  .why-title {
    font-size: 20px;
  }
}

/* Section Heading */

.sec-eyebrow {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #b8872b;
  margin-bottom: 22px;
}

.sec-eyebrow::before {
  content: '';
  width: 24px;
  height: 1px;
  background: #b8872b;
}

.sec-title {
  max-width: 780px;
  font-family: 'Fraunces', serif;
  font-size: 64px;
  line-height: 1.05;
  font-weight: 600;
  /* 500 se 600 */
  color: #081b4b;
  letter-spacing: -0.03em;
}

.sec-title em {
  color: orangered;
  font-style: italic;
  font-weight: 600;
}

.sec-lede {
  max-width: 720px;
  font-size: 22px;
  line-height: 1.75;
  color: #455468;
  margin-bottom: 60px;
}

/* Container */

.container {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 24px;
}
</style>
