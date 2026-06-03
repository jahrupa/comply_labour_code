<template>
  <section id="faq-section" class="faq-section">
    <div class="app-container">
      <div class="faq-header">
        <div>
          <div class="sec-eyebrow">FAQs</div>

          <p class="faq-subtitle">Common questions</p>

          <h2 class="sec-title">
            Specific positions.
            <em> Specific citations.</em>
          </h2>
        </div>

        <p class="sec-lede faq-lede">
          These are the questions our advisory team answers most often. Every answer ties to a
          primary source.
        </p>
      </div>

      <div class="faq-list">
        <div
          v-for="(faq, index) in faqs"
          :key="index"
          :class="['faq-card', { active: openIndex === index }]"
        >
          <div class="faq-question" @click="toggle(index)">
            <span>{{ faq.q }}</span>

            <span class="faq-icon">
              {{ openIndex === index ? '−' : '+' }}
            </span>
          </div>

          <div v-if="openIndex === index" class="faq-answer">
            <p class="answer-text">
              {{ faq.a }}
            </p>

            <div v-if="faq.note" class="practice-note">
              <strong class="note-title"> Karma Practice Note </strong>

              <p class="note-text">
                {{ faq.note }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const openIndex = ref(0)

const toggle = (index) => {
  openIndex.value = openIndex.value === index ? -1 : index
}

const faqs = [
  {
    q: 'What does Section 2(y) of Code on Wages actually require?',
    a: `Section 2(y) read with its first proviso establishes that wages excluded from the definition (HRA, conveyance allowance, bonus, employer PF contributions, gratuity contributions, OT, commission) cannot together exceed 50 percent of the total remuneration. If they do, the excess is added back to wages for statutory contributions.`,
    note: `Setting Basic at 50 percent of CTC fails the 50 percent test in most cases. The correct approach sets Basic at 50 percent of Total Employer Cost (TEC) which includes Non CTC components.`,
  },
  {
    q: 'What is the gratuity qualifying service under OSH Code?',
    a: 'The gratuity qualifying service is 240 days throughout India per Section 2A read with Section 4 of the Payment of Gratuity Act 1972. This applies in every state without exception.',
    note: 'Cross application of OSH Code Section 76 to gratuity has been a common error in industry. Our calculator engine enforces 240 days for gratuity computation regardless of state.',
  },
  {
    q: 'How does the Income Tax Act 2025 affect payroll compliance?',
    a: 'The Income Tax Act 2025 became effective 01.04.2026 and replaces the 1961 Act. Substantive rates and slabs for FY 2026-27 are unchanged. However section numbering is comprehensive renumbering: 80C becomes Section 123, 80D becomes 126, 87A becomes 157.',
    note: 'The transition is purely structural for FY 2026-27. Rates and substantive provisions are unchanged. The risk is in stale references in legacy SOPs and templates.',
  },
  {
    q: 'Is my workforce data secure and what is the legal framework?',
    a: 'Data residency is Azure India South and Central with no data ever leaving India for storage or compute. The platform complies with the Digital Personal Data Protection Act 2023 and offers GDPR commitments for international customers.',
    note: null,
  },
]
</script>

<style scoped>
.faq-section {
  padding: 100px 0;
  background: var(--bg);
}

.faq-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 40px;
  margin-bottom: 48px;
  flex-wrap: wrap;
}

.faq-subtitle {
  font-size: 13px;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: 0.02em;
  margin-bottom: 8px;
}

.faq-lede {
  margin-bottom: 0;
  max-width: 500px;
}

.faq-list {
  display: grid;
  gap: 16px;
}

.faq-card {
  background: var(--bg-card);
  border: 1px solid var(--rule);
  border-radius: 14px;
  overflow: hidden;
  transition: all 0.2s ease;
}

.faq-card.active {
  border-color: var(--brand);
}

.faq-question {
  cursor: pointer;
  padding: 24px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  font-size: 17px;
  font-weight: 800;
  color: var(--ink);
}

.faq-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid var(--rule-strong);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--gold);
  font-size: 20px;
  transition: all 0.2s ease;
}

.active .faq-icon {
  background: var(--gold-bg);
  border-color: var(--gold);
}

.faq-answer {
  padding: 0 28px 28px;
  display: grid;
  gap: 14px;
}

.answer-text {
  font-size: 14px;
  color: var(--ink-soft);
  line-height: 1.75;
}

.practice-note {
  background: var(--gold-bg);
  border-left: 3px solid var(--gold);
  border-radius: 10px;
  padding: 14px 16px;
}

.note-title {
  display: block;
  font-size: 12px;
  font-weight: 800;
  color: var(--gold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.note-text {
  font-size: 14px;
  color: var(--ink-soft);
  line-height: 1.75;
}

@media (max-width: 768px) {
  .faq-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .faq-question {
    font-size: 15px;
    padding: 20px;
  }

  .faq-answer {
    padding: 0 20px 20px;
  }
}
</style>
