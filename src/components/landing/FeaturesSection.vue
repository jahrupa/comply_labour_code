<template>
  <section id="features" class="how-section">
    <div class="app-container">
      <div class="sec-eyebrow">How it works</div>

      <h2 class="sec-title">Three steps from <em>chaos</em> to compliance.</h2>

      <p class="sec-lede">
        Upload your salary data, compare Gross Neutral, Net Neutral, and CTC Neutral restructuring
        outcomes, then download a compliant salary sheet and advisory report — in under 5 minutes.
      </p>

      <div class="steps-grid">
        <div v-for="step in steps" :key="step.num" class="how-step">
          <div class="step-number">
            {{ step.num }}
          </div>

          <div class="step-icon">
            {{ step.icon }}
          </div>

          <h3 class="step-title">
            {{ step.title }}
          </h3>

          <p class="step-desc">
            {{ step.desc }}
          </p>

          <span class="step-tag">
            {{ step.tag }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const steps = [
  {
    num: '01.',
    icon: '📂',
    title: 'Upload Your Data',
    desc: 'Download our sample CSV template. Fill in your existing salary structures for each employee. Upload it back to our compliance engine — no formatting headaches.',
    tag: '⬇ CSV / Excel · Drag & Drop',
  },
  {
    num: '02.',
    icon: '⚙️',
    title: 'Compare All 3 Variants',
    desc: 'Review Gross Neutral, Net Neutral, and CTC Neutral outputs to understand payroll, employee take-home, and employer-cost impact before implementation.',
    tag: '⚖️ Gross · Net · CTC Neutral',
  },
  {
    num: '03.',
    icon: '📄',
    title: 'Download & Implement',
    desc: 'Get a restructured salary sheet ready for implementation, plus an advisory report citing primary statutory authority — defensible in court and before labour inspectors.',
    tag: '✅ Legally Citable Advisory',
  },
]
</script>

<style scoped>
.how-section {
  padding: 100px 0;
  background: var(--bg-soft);
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
  background: var(--rule);
  border-radius: 20px;
  overflow: hidden;
}

.how-step {
  background: var(--bg-card);
  padding: 48px 36px;
  transition: background 0.3s;
}

.how-step:hover {
  background: var(--bg-hover);
}

.step-number {
  font-family: 'Fraunces', serif;
  font-size: 72px;
  font-weight: 300;
  font-style: italic;
  line-height: 1;
  margin-bottom: 24px;
  background: linear-gradient(135deg, var(--gold), transparent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.step-icon {
  font-size: 36px;
  margin-bottom: 16px;
}

.step-title {
  font-family: 'Fraunces', serif;
  font-size: 26px;
  font-weight: 500;
  margin-bottom: 14px;
  color: var(--ink);
}

.step-desc {
  font-size: 14px;
  color: var(--ink-soft);
  line-height: 1.7;
}

.step-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 20px;
  padding: 5px 12px;
  background: var(--gold-bg);
  border: 1px solid var(--gold);
  border-radius: 100px;
  font-size: 11px;
  font-weight: 700;
  color: var(--gold);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

@media (max-width: 1024px) {
  .steps-grid {
    grid-template-columns: 1fr;
  }
}
</style>
