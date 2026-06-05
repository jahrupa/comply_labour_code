<template>
  <section class="hero-v2">
    <div class="container">
      <div class="hero-grid hero-text-only">
        <div class="hero-left">
          <h1>
            India's Labour Codes<br />
            have <em>arrived.</em><br />
            Are you <em>compliant?</em>
          </h1>

          <p class="hero-sub">
            Section 2(y) wage redefinition. OSH Code earned leave. IR Code thresholds. Social
            Security gratuity. Diagnose your entire workforce and get a restructured,
            legally-defensible salary in minutes — not weeks.
          </p>

          <div class="hero-ctas">
            <q-btn class="btn-hero-primary" @click="openSignup">
              Run free diagnostic on 3 employees
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </q-btn>

            <q-btn class="btn-hero-ghost" @click="openExpertModal">Talk to an expert</q-btn>

            <q-btn class="btn-hero-ghost" @click="openWebinarModal">Register for Webinar</q-btn>
          </div>

          <div class="trust-strip">
            <div class="trust-item">
              <span class="trust-num">20+</span>
              <span class="trust-label">Years Practice</span>
            </div>

            <div class="trust-divider"></div>

            <div class="trust-item">
              <span class="trust-num">1000+</span>
              <span class="trust-label">Lifetime Clients</span>
            </div>

            <div class="trust-divider"></div>

            <div class="trust-item">
              <span class="trust-num">36</span>
              <span class="trust-label">Jurisdictions</span>
            </div>

            <div class="trust-divider"></div>

            <div class="trust-item">
              <span class="trust-num">12,400+</span>
              <span class="trust-label">Compliance Checks</span>
            </div>
          </div>
        </div>

        <!-- Right Animation -->
        <div v-if="showAnimation" class="hero-right">
          <div class="scene-3d">
            <svg
              viewBox="0 0 500 500"
              xmlns="http://www.w3.org/2000/svg"
              style="width: 100%; height: 100%"
            >
              <!-- SVG Content -->
            </svg>
          </div>
        </div>
      </div>
    </div>
    <ExpertModal
      v-model="showExpertModal"
      :title="expertModalData.title"
      :description="expertModalData.description"
      :experts="expertModalData.experts"
      :topics="expertModalData.topics"
      :meetingTimes="expertModalData.meetingTimes"
      @submitted="onExpertSubmitted"
    />
    <WebinarRegistration v-model="showWebinarModal" @submitted="onWebinarSubmitted" />
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ExpertModal from '../models/ExpertModal.vue'
import WebinarRegistration from '../models/WebinarRegistration.vue'

const router = useRouter()

const showAnimation = ref(false)

const openSignup = () => {
  router.push('/auth?tab=signup')
}

const showExpertModal = ref(false)

const expertModalData = {
  title: 'Book a Consultation',

  description:
    'Speak with a Karma Management senior practitioner. Responses within 24 working hours.',

  experts: [
    {
      name: 'Anand Verma',
      icon: '👨‍⚖️',
      statusColor: '#22c55e',
    },
    {
      name: 'Priya Pillai',
      icon: '👩‍⚖️',
      statusColor: '#22c55e',
    },
    {
      name: 'Rohan Desai',
      icon: '👨‍💼',
      statusColor: '#fbbf24',
    },
  ],

  topics: [
    'Wage code restructuring (50+ employees)',
    'Multi-state compliance review',
    'PE / investor due diligence',
    'Labour inspector defence',
    'Board advisory report (signed letterhead)',
    'Custom training for HR/Legal team',
    'Other / custom engagement',
  ],

  meetingTimes: [
    'Morning (9am – 12pm IST)',
    'Afternoon (12pm – 4pm IST)',
    'Evening (4pm – 7pm IST)',
    'No preference',
  ],
}

const openExpertModal = () => {
  showExpertModal.value = true
}

const onExpertSubmitted = (payload) => {
  console.log(payload)

  // API Call
  // await submitConsultation(payload)
}
const showWebinarModal = ref(false)
console.log(showWebinarModal, 'showWebinarModal')
const onWebinarSubmitted = (payload) => {
  console.log(payload)

  // API Call
  // await submitWebinarRegistration(payload)
}
const openWebinarModal = () => {
  showWebinarModal.value = true
}
</script>

<style scoped>
.container {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 32px;
}

.hero-left {
  max-width: 760px;
  width: 100%;
}

.btn-hero-primary {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 24px;
  border: none;
  border-radius: 12px;
  background: #e85230;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
  white-space: nowrap;
}

.btn-hero-primary:hover {
  transform: translateY(-2px);
}

.btn-hero-ghost {
  padding: 14px 24px;
  border-radius: 12px;
  border: 1px solid #d6d6d6;
  background: white;
  cursor: pointer;
  white-space: nowrap;
}

.trust-divider {
  width: 1px;
  height: 34px;
  background: #e5e7eb;
}
.hero-v2 {
  position: relative;
  padding: 80px 0 100px;
  overflow: hidden;
  background:
    radial-gradient(ellipse 1200px 600px at 20% -10%, rgba(232, 82, 48, 0.09), transparent 60%),
    radial-gradient(ellipse 800px 500px at 90% 10%, rgba(27, 58, 92, 0.07), transparent 55%);
}

.hero-grid {
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-text-only {
  align-items: center;
}

.hero h1,
.hero-v2 h1 {
  font-size: clamp(48px, 5.5vw);
  line-height: 0.96;
  letter-spacing: -0.035em;
  margin-bottom: 24px;
}

.hero-v2 h1 em {
  font-style: italic;
  color: #e85230;
}

.hero-sub {
  font-size: 18px;
  line-height: 1.7;
  max-width: 640px;
  margin-bottom: 34px;
}

.hero-ctas {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: nowrap;
  margin-bottom: 42px;
}

.trust-strip {
  display: flex;
  align-items: center;
  gap: 28px;
  border-top: 1px solid #e5e7eb;
  padding-top: 34px;
}

.trust-item {
  display: flex;
  flex-direction: column;
}

.trust-num {
  font-family: 'Fraunces', serif;
  color: var(--brand);
  font-size: 28px;
  font-weight: 700;
}

.trust-label {
  font-size: 12px;
  text-transform: uppercase;
}

.hero-right {
  height: 500px;
}

.scene-3d {
  width: 100%;
  height: 100%;
}

:deep(.btn-hero-primary .q-btn__content) {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  justify-content: center;
  gap: 8px;
  flex-wrap: nowrap;
}

@media (max-width: 1024px) {
  .hero-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .hero-right {
    height: 360px;
  }
}

@media (max-width: 768px) {
  .hero-v2 {
    padding: 60px 0 40px;
  }

  .hero-right {
    display: none;
  }

  .trust-strip {
    gap: 20px;
  }
}
</style>
