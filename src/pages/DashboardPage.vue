<template>
  <div class="dash-main">
    <!-- Welcome Banner -->
    <DashboardCards @open-webinar="showWebinar = true" />

    <!-- Calculator Tab -->
    <div v-show="activeTab === 'calculator'" id="tab-calculator">
      <!-- Progress Bar -->
      <div class="progress-bar">
        <div class="progress-step" v-for="(s, i) in steps" :key="i">
          <div
            class="step-circle"
            :class="{
              done: currentStep > i + 1,
              active: currentStep === i + 1,
              todo: currentStep < i + 1,
            }"
          >
            {{ currentStep > i + 1 ? '✓' : i + 1 }}
          </div>
          <span
            class="step-name"
            :class="{
              done: currentStep > i + 1,
              active: currentStep === i + 1,
            }"
            >{{ s }}</span
          >
          <div
            v-if="i < steps.length - 1"
            class="step-line"
            :class="{ done: currentStep > i + 1 }"
          ></div>
        </div>
      </div>

      <!-- Step 1: Upload -->
      <div v-if="currentStep === 1">
        <UploadZone @go-generate="goToStep3" @file-loaded="onFileLoaded" />
      </div>

      <!-- Step 2: Processing -->
      <div v-if="currentStep === 2">
        <div class="card" style="text-align: center; padding: 60px">
          <div
            style="
              font-size: 56px;
              margin-bottom: 20px;
              display: inline-block;
              animation: spin 2s linear infinite;
            "
          >
            ⚙️
          </div>
          <h3 style="font-size: 22px; margin-bottom: 10px">Processing your salary data…</h3>
          <p style="color: var(--ink-mute)">
            Checking Section 2(y) wage definitions and computing restructured components
          </p>
          <div style="max-width: 400px; margin: 24px auto 0">
            <div
              style="height: 6px; background: var(--bg-soft); border-radius: 3px; overflow: hidden"
            >
              <div
                :style="{ width: processPercent + '%' }"
                style="
                  height: 100%;
                  background: linear-gradient(90deg, var(--brand), var(--accent));
                  border-radius: 3px;
                  transition: width 0.3s;
                "
              ></div>
            </div>
            <p style="font-size: 12px; color: var(--ink-faint); margin-top: 8px">
              {{ processPercent }}%
            </p>
          </div>
        </div>
      </div>

      <!-- Step 3: Download + Results -->
      <div v-if="currentStep === 3">
        <!-- Trial wall check -->
        <div v-if="authStore.trialRemaining <= 0 && !authStore.activePlan" class="upgrade-wall">
          <h3>🔒 Free Trial Complete</h3>
          <p>You've used all 3 free restructures. Upgrade to continue processing employees.</p>
          <div class="upgrade-plans">
            <div class="up-card highlight" @click="openPayment('starter')">
              <div class="up-plan">Starter</div>
              <div class="up-price">₹4,000</div>
              <div class="up-desc">Up to 50 employees · One-time</div>
              <ul class="up-features">
                <li>50 salary restructures</li>
                <li>All 3 variant types</li>
                <li>Advisory reports</li>
              </ul>
            </div>
            <div class="up-card" @click="openPayment('professional')">
              <div class="up-plan">Professional</div>
              <div class="up-price">₹10,000</div>
              <div class="up-desc">Up to 500 employees · One-time</div>
              <ul class="up-features">
                <li>500 salary restructures</li>
                <li>Advisor review</li>
                <li>Signed letterhead</li>
              </ul>
            </div>
          </div>
        </div>

        <template v-else>
          <!-- Success banner -->
          <div class="success-banner">
            <div class="success-banner-left">
              <span style="font-size: 28px">✅</span>
              <div>
                <p class="success-title">Restructuring complete!</p>
                <p class="success-sub">
                  {{ uploadedFile?.rows || 3 }} employees restructured using Net Neutral variant
                </p>
              </div>
            </div>
            <div>
              <span style="font-size: 13px; font-weight: 600; color: var(--green)">
                {{ authStore.trialRemaining }} credits remaining
              </span>
              <button
                class="btn btn-primary btn-sm"
                style="margin-left: 12px"
                @click="resetCalculator"
              >
                ⬆ Upload another file →
              </button>
            </div>
          </div>

          <!-- Download Cards -->
          <div class="grid-2 mb24">
            <div class="card">
              <div style="font-size: 32px; margin-bottom: 12px">📊</div>
              <div class="card-title">Net Neutral Salary Sheet</div>
              <p class="card-sub" style="margin: 8px 0">
                Your generated Net Neutral restructure, compliant with New Wage Code and ready to
                implement.
              </p>
              <button
                class="btn btn-green btn-sm"
                style="margin-top: 12px"
                @click="downloadResult('csv')"
              >
                ⬇ Download Net Neutral CSV
              </button>
            </div>
            <div class="card">
              <div style="font-size: 32px; margin-bottom: 12px">📄</div>
              <div class="card-title">Advisory Report</div>
              <p class="card-sub" style="margin: 8px 0">
                What was wrong with the old structure, what changed, and statutory citations.
              </p>
              <button
                class="btn btn-accent btn-sm"
                style="margin-top: 12px"
                @click="downloadResult('report')"
              >
                ⬇ Download Advisory Report
              </button>
            </div>
          </div>

          <!-- Results Table -->
          <ResultsTable :rows="resultRows" @download="downloadResult" />
        </template>
      </div>
    </div>

    <!-- Results Tab -->
    <div v-show="activeTab === 'results'" id="tab-results">
      <div class="card">
        <div class="card-title mb8">📊 My Results History</div>
        <p class="card-sub mb16">Your previously processed salary restructuring jobs.</p>
        <div
          v-if="resultRows.length === 0"
          style="text-align: center; padding: 48px 0; color: var(--ink-mute)"
        >
          <div style="font-size: 48px; margin-bottom: 16px">📂</div>
          <p>No results yet. Upload salary data in the Wage Calculator to get started.</p>
          <button
            class="btn btn-primary btn-sm"
            style="margin-top: 16px"
            @click="$emit('tab-change', 'calculator')"
          >
            Go to Calculator →
          </button>
        </div>
        <ResultsTable v-else :rows="resultRows" @download="downloadResult" />
      </div>
    </div>

    <!-- Tutorial Tab -->
    <div v-show="activeTab === 'tutorial'" id="tab-tutorial">
      <div class="tutorial-page">
        <div class="tutorial-header">
          <h2>Video Tutorial</h2>
          <p>Watch how to use the New Wage Code Calculator</p>
        </div>

        <div class="tutorial-grid">
          <!-- LEFT -->
          <div class="left-column">
            <div class="video-player">
              <div v-if="!isPlaying" class="video-thumb" @click="playVideo">
                <button class="play-btn">▶</button>

                <div class="video-info">
                  <h4>How to use complymgmt.ai</h4>
                  <p>Complete walkthrough · ~5 minutes</p>
                </div>
              </div>

              <div v-else class="video-content">
                <div class="video-icon">🎬</div>

                <p>Video playing... (demo mode)</p>

                <button class="stop-btn" @click="stopVideo">■ Stop</button>
              </div>
            </div>

            <div class="upload-card">
              <h3>Upload Your Tutorial Video</h3>

              <p class="upload-subtitle">
                Upload a custom walkthrough video for your team members.
              </p>

              <div class="upload-box">
                <div class="upload-icon">📹</div>

                <h4>Click to upload video</h4>

                <p>MP4, MOV, AVI · Max 500MB</p>

                <input
                  ref="fileInput"
                  type="file"
                  accept="video/*"
                  style="display: none"
                  @change="handleVideoUpload"
                />

                <button class="upload-btn" @click="fileInput.click()">Choose Video File</button>
              </div>
            </div>
          </div>

          <!-- RIGHT -->
          <div class="right-column">
            <div class="guide-card">
              <h3>📚 Quick Reference Guide</h3>

              <div class="guide-item">
                <span class="step-box">1</span>
                <div>
                  <h4>Download Sample Template</h4>
                  <p>Get the CSV template with correct column headers</p>
                </div>
              </div>

              <div class="guide-item">
                <span class="step-box">2</span>
                <div>
                  <h4>Fill in Employee Data</h4>
                  <p>Add current salary components per employee</p>
                </div>
              </div>

              <div class="guide-item">
                <span class="step-box">3</span>
                <div>
                  <h4>Upload & Generate Report</h4>
                  <p>Net Neutral is applied automatically</p>
                </div>
              </div>

              <div class="guide-item no-border">
                <span class="step-box">4</span>
                <div>
                  <h4>Download Results</h4>
                  <p>Get compliant CSV + advisory report</p>
                </div>
              </div>
            </div>

            <div class="legal-card">
              <h3>⚖️ Key Legal Points</h3>

              <p>
                Section 2(y) Code on Wages: Excluded allowances cannot exceed 50% of total
                remuneration.
              </p>

              <p>OSH Code Section 76: Earned leave accrual at 180 days in 5 notified states.</p>

              <p>
                Gratuity qualifying service remains 240 days across all states (PGA 1972 Section
                2A).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Billing Tab -->
    <div v-show="activeTab === 'billing'" id="tab-billing">
      <div class="card mb24">
        <div class="card-title mb8">Current Plan</div>
        <div
          style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap; margin-top: 16px"
        >
          <div
            style="
              background: var(--gold-bg);
              border: 1px solid var(--gold);
              border-radius: 12px;
              padding: 20px 28px;
            "
          >
            <p
              style="
                font-size: 11px;
                font-weight: 700;
                color: var(--gold);
                text-transform: uppercase;
                letter-spacing: 0.08em;
                margin-bottom: 4px;
              "
            >
              {{ authStore.planLabel }}
            </p>
            <p
              style="
                font-family: 'Fraunces', serif;
                font-size: 32px;
                font-weight: 600;
                color: var(--ink);
              "
            >
              {{ authStore.trialRemaining }}
            </p>
            <p style="font-size: 12px; color: var(--ink-mute)">
              credits remaining of {{ authStore.trialLimit }}
            </p>
          </div>
          <div style="flex: 1">
            <div
              style="
                height: 8px;
                background: var(--bg-soft);
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 8px;
              "
            >
              <div
                :style="{ width: authStore.trialPercent + '%' }"
                style="
                  height: 100%;
                  background: var(--gold-soft);
                  border-radius: 4px;
                  transition: width 0.5s;
                "
              ></div>
            </div>
            <p style="font-size: 13px; color: var(--ink-mute)">
              {{ authStore.trialUsed }} / {{ authStore.trialLimit }} employee restructures used
            </p>
          </div>
        </div>
      </div>

      <h3 style="font-size: 20px; margin-bottom: 20px">Upgrade Plan</h3>
      <div class="grid-2 mb24">
        <div class="up-card highlight" @click="openPayment('starter')" style="cursor: pointer">
          <div class="up-plan">Starter</div>
          <div class="up-price">₹4,000</div>
          <div class="up-desc">Up to 50 employees · One-time payment</div>
          <ul class="up-features">
            <li>50 employee restructures</li>
            <li>All 3 variant types</li>
            <li>Advisory reports</li>
            <li>Priority email support</li>
          </ul>
          <button
            class="btn btn-gold btn-block"
            style="margin-top: 20px"
            @click.stop="openPayment('starter')"
          >
            Get Starter →
          </button>
        </div>
        <div class="up-card" @click="openPayment('professional')" style="cursor: pointer">
          <div class="up-plan">Professional</div>
          <div class="up-price">₹10,000</div>
          <div class="up-desc">Up to 500 employees · One-time payment</div>
          <ul class="up-features">
            <li>500 employee restructures</li>
            <li>Karma advisor review</li>
            <li>Signed letterhead deliverable</li>
            <li>PE / board-ready format</li>
          </ul>
          <button
            class="btn btn-primary btn-block"
            style="margin-top: 20px"
            @click.stop="openPayment('professional')"
          >
            Get Professional →
          </button>
        </div>
      </div>

      <!-- Payment History -->
      <div class="card" v-if="authStore.paymentHistory?.length">
        <div class="card-title mb16">Payment History</div>
        <table class="result-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Plan</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in authStore.paymentHistory || []" :key="p.txnId">
              <td>{{ p.date }}</td>
              <td>{{ p.plan }}</td>
              <td>{{ p.amount || '—' }}</td>
              <td><span class="badge badge-green">Paid</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Payment Modal -->
    <UpgradePlaneModal
      v-if="showPayment"
      :plan="PLANS[payingFor].name"
      :base-amount="baseAmount"
      :gst-amount="gstAmount"
      :discount-amount="discountAmount"
      :total-amount="totalAmount"
      :card-num-display="cardNumDisplay"
      :coupon-input="couponInput"
      :coupon-msg="couponMsg"
      :coupon-msg-class="couponMsgClass"
      :pay-state="payState"
      @close="showPayment = false"
      @apply-coupon="applyCoupon"
      @process-payment="processPayment"
      @update:couponInput="couponInput = $event"
      @update:cardNumber="cardNum = $event"
      @update:cardHolder="cardHolder = $event"
      @update:cardExpiry="cardExp = $event"
      @update:upiId="upiId = $event"
      @format-card="formatCard"
      @format-expiry="formatExpiry"
    />

    <!-- Webinar Modal -->
    <div class="modal-overlay" v-if="showWebinar" @click.self="showWebinar = false">
      <div class="modal">
        <button class="modal-close" @click="showWebinar = false">✕</button>
        <div v-if="!webinarSuccess">
          <h3 style="margin-bottom: 8px">🎓 Reserve Your Webinar Seat</h3>
          <div class="form-group" style="margin-top: 20px">
            <label class="form-label">Full name</label>
            <input
              class="form-input"
              type="text"
              v-model="webinarName"
              placeholder="Priya Sharma"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Work email</label>
            <input
              class="form-input"
              type="email"
              v-model="webinarEmail"
              placeholder="you@company.com"
            />
          </div>
          <button
            class="btn btn-accent btn-block btn-lg"
            @click="submitWebinar"
            style="margin-top: 8px"
          >
            Register for free →
          </button>
        </div>
        <div v-else style="text-align: center; padding: 20px 0">
          <span style="font-size: 56px; display: block; margin-bottom: 16px">✅</span>
          <h3>Seat Reserved!</h3>
          <p style="color: var(--ink-mute); margin: 12px 0 24px">
            Check your inbox for the webinar link.
          </p>
          <button class="btn btn-primary btn-block" @click="showWebinar = false">Done</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useAppStore } from '../stores/app'
import DashboardCards from '../components/dashboard/DashboardCards.vue'
import UploadZone from '../components/dashboard/UploadZone.vue'
import ResultsTable from '../components/dashboard/ResultsTable.vue'
import UpgradePlaneModal from 'src/components/models/UpgradePlaneModal.vue'

const isPlaying = ref(false)
const fileInput = ref(null)

const playVideo = () => {
  isPlaying.value = true
}

const stopVideo = () => {
  isPlaying.value = false
}

const handleVideoUpload = (event) => {
  const file = event.target.files?.[0]

  if (!file) return

  appStore.showNotif(`📹 ${file.name} uploaded successfully`, 'success')
}

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  activeTab: {
    type: String,
    default: 'calculator',
  },
})
const emit = defineEmits(['tab-change'])

const authStore = useAuthStore()
const appStore = useAppStore()

// Calculator state
const currentStep = ref(1)
const processPercent = ref(0)
const uploadedFile = ref(null)

const steps = ['Upload', 'Processing', 'Download']

const resultRows = ref([
  {
    id: 'EMP001',
    name: 'Priya Sharma',
    oldBasic: '₹25,000',
    newBasic: '₹28,750',
    oldHRA: '₹10,000',
    newHRA: '₹8,625',
    compliant: true,
    change: '+₹3,750',
    changePositive: true,
  },
  {
    id: 'EMP002',
    name: 'Rahul Verma',
    oldBasic: '₹18,000',
    newBasic: '₹21,200',
    oldHRA: '₹7,200',
    newHRA: '₹6,360',
    compliant: true,
    change: '+₹3,200',
    changePositive: true,
  },
  {
    id: 'EMP003',
    name: 'Anjali Patel',
    oldBasic: '₹30,000',
    newBasic: '₹34,500',
    oldHRA: '₹12,000',
    newHRA: '₹10,350',
    compliant: false,
    change: '+₹4,500',
    changePositive: true,
  },
])

function onFileLoaded(data) {
  uploadedFile.value = data
}

function goToStep3() {
  currentStep.value = 2
  processPercent.value = 0
  let p = 0
  const iv = setInterval(() => {
    p += Math.random() * 20
    if (p >= 100) {
      p = 100
      processPercent.value = 100
      clearInterval(iv)
      setTimeout(() => {
        currentStep.value = 3
        authStore.useCredit()
        appStore.showNotif('✅ Report generated successfully!', 'success')
      }, 400)
    } else {
      processPercent.value = Math.round(p)
    }
  }, 300)
}

function resetCalculator() {
  currentStep.value = 1
  uploadedFile.value = null
}

function downloadResult(type) {
  const content =
    type === 'report'
      ? 'ADVISORY REPORT\n\nComplymgmt.ai New Wage Code Compliance Report\nDate: ' +
        new Date().toLocaleDateString('en-IN') +
        '\n\nSection 2(y) Analysis:\nAll employees restructured to meet 50% wage threshold requirement.'
      : 'Employee ID,Name,Old Basic,New Basic,Old HRA,New HRA,Status\nEMP001,Priya Sharma,25000,28750,10000,8625,Compliant\nEMP002,Rahul Verma,18000,21200,7200,6360,Compliant\nEMP003,Anjali Patel,30000,34500,12000,10350,Compliant'

  const blob = new Blob([content], { type: 'text/plain' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = type === 'report' ? 'advisory_report.txt' : 'restructured_salaries.csv'
  a.click()
  appStore.showNotif('⬇ Download started', 'success')
}

// Payment
const PLANS = {
  starter: { name: 'Starter', price: '₹4,000', base: 4000, credits: 50, empLabel: 'Up to 50' },
  professional: {
    name: 'Professional',
    price: '₹10,000',
    base: 10000,
    credits: 500,
    empLabel: '50–500',
  },
}

const COUPONS = {
  KARMA50: { percent: 50, label: 'KARMA50' },
  FREE100: { percent: 100, label: 'FREE100' },
  COMP25: { percent: 25, label: 'COMP25' },
}

const showPayment = ref(false)
const payingFor = ref('starter')
const payState = ref('form')
const couponInput = ref('')
const couponMsg = ref('')
const couponMsgClass = ref('')
const appliedCoupon = ref(null)
const cardNum = ref('')
const cardHolder = ref('')
const cardExp = ref('')
const upiId = ref('')
const txnId = ref('')
const successMsg = ref('')

const baseAmount = computed(() => PLANS[payingFor.value]?.base || 0)
const gstAmount = computed(() => Math.round(baseAmount.value * 0.18))
const discountAmount = computed(() =>
  appliedCoupon.value
    ? Math.round(((baseAmount.value + gstAmount.value) * appliedCoupon.value.percent) / 100)
    : 0,
)
const totalAmount = computed(() => baseAmount.value + gstAmount.value - discountAmount.value)

const cardNumDisplay = computed(() => cardNum.value || '•••• •••• •••• ••••')

function formatAmount(n) {
  return '₹' + n.toLocaleString('en-IN')
}

function formatCard() {
  let v = cardNum.value.replace(/\D/g, '').slice(0, 16)
  cardNum.value = v.match(/.{1,4}/g)?.join(' ') || v
}

function formatExpiry() {
  let v = cardExp.value.replace(/\D/g, '').slice(0, 4)
  if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2)
  cardExp.value = v
}

function applyCoupon() {
  const code = couponInput.value.trim().toUpperCase()
  couponInput.value = code
  if (!code) {
    couponMsg.value = 'Enter a coupon code.'
    couponMsgClass.value = 'text-warn'
    return
  }
  const c = COUPONS[code]
  if (!c) {
    appliedCoupon.value = null
    couponMsg.value = 'Invalid coupon code.'
    couponMsgClass.value = 'text-warn'
    return
  }
  appliedCoupon.value = c
  couponMsg.value = `${c.percent}% off applied. You saved ${formatAmount(discountAmount.value)}.`
  couponMsgClass.value = 'text-ok'
}

function openPayment(plan) {
  payingFor.value = plan
  payState.value = 'form'
  couponInput.value = ''
  couponMsg.value = ''
  appliedCoupon.value = null
  cardNum.value = ''
  cardHolder.value = ''
  cardExp.value = ''
  upiId.value = ''
  showPayment.value = true
}

async function processPayment() {
  payState.value = 'processing'

  await new Promise((r) => setTimeout(r, 2200))

  const p = PLANS[payingFor.value]

  txnId.value = authStore.activatePlan(
    payingFor.value,
    p.name,
    p.credits,
    appliedCoupon.value?.label,
  )

  successMsg.value = `Your ${p.name} is now active. You can now process ${p.credits} employees.`

  payState.value = 'success'

  appStore.showNotif(`🎉 Payment successful! ${p.name} is now active.`, 'success')

  closePaymentSuccess()
}

function closePaymentSuccess() {
  showPayment.value = false
  emit('tab-change', 'billing')
}

// Webinar
const showWebinar = ref(false)
const webinarSuccess = ref(false)
const webinarName = ref('')
const webinarEmail = ref('')

function submitWebinar() {
  if (!webinarName.value || !webinarEmail.value) {
    appStore.showNotif('Please fill in your name and email.', 'warn')
    return
  }
  webinarSuccess.value = true
  appStore.showNotif('✅ Webinar seat reserved.', 'success')
}
</script>

<style scoped>
.tutorial-page {
  padding: 24px;
  background: #f7f7f7;
  min-height: 100vh;
}

.tutorial-header {
  margin-bottom: 20px;
}

.tutorial-header h2 {
  font-family: 'Fraunces', serif;
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.tutorial-header p {
  margin-top: 6px;
  color: #64748b;
  font-size: 14px;
}

.tutorial-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  align-items: start;
}

.left-column,
.right-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.upload-card,
.guide-card,
.legal-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.video-player {
  height: 420px;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
}

/* Thumbnail State */

.video-thumb {
  width: 100%;
  height: 100%;
  position: relative;

  background: linear-gradient(135deg, #0d1530 0%, #1b3a5c 50%, #2c4f78 100%);

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
}

.play-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.7);

  background: rgba(255, 255, 255, 0.15);
  color: white;
  font-size: 22px;
  cursor: pointer;
}

.video-info {
  position: absolute;
  left: 18px;
  bottom: 18px;
  color: white;
}

.video-info h4 {
  font-family: 'Fraunces', serif;
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: white;
}

.video-info p {
  margin-top: 4px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 13px;
}

.video-content {
  background: #000;
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  color: white;
}

.video-icon {
  font-size: 42px;
  margin-bottom: 10px;
}

.stop-btn {
  margin-top: 12px;
  background: transparent;
  color: white;
  border: 1px solid #5b5b5b;
  border-radius: 6px;
  padding: 8px 18px;
  cursor: pointer;
}

.upload-card {
  padding: 20px;
}

.upload-card h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
}

.upload-subtitle {
  margin-top: 8px;
  color: #64748b;
  font-size: 14px;
}

.upload-box {
  margin-top: 20px;
  border: 1px dashed #d6d6d6;
  border-radius: 12px;
  padding: 45px 20px;
  text-align: center;
}

.upload-icon {
  font-size: 34px;
  margin-bottom: 12px;
}

.upload-box h4 {
  margin: 0;
  font-size: 22px;
}

.upload-box p {
  color: #64748b;
  margin-top: 10px;
}

.upload-btn {
  margin-top: 18px;
  background: #163d6d;
  color: white;
  border: none;
  padding: 12px 22px;
  border-radius: 8px;
  cursor: pointer;
}

.guide-card {
  padding: 20px;
}

.guide-card h3 {
  font-size: 19px;
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 18px;
}

.guide-item {
  display: flex;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 1px solid #e5e7eb;
}

.guide-item h4 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.3;
}

.no-border {
  border-bottom: none;
}

.step-box {
  width: 22px;
  height: 22px;
  background: #4a90ff;
  color: white;
  font-size: 12px;
  font-weight: 700;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.guide-item h4 {
  margin: 0;
  font-size: 15px;
}

.guide-item p {
  margin: 0;
  margin-top: 2px;
  color: #64748b;
  font-size: 16px;
  line-height: 1.4;
}

.legal-card {
  background: #fff8e8;
  border: 1px solid #e2bb63;
  padding: 20px;
}

.legal-card h3 {
  color: var(--ink);
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: 700;
}

.legal-card p {
  font-size: 13px;
  line-height: 1.7;
  color: #5c4d2a;
}

element.style {
  font-family: 'Fraunces', serif;
}

@media (max-width: 1024px) {
  .tutorial-grid {
    grid-template-columns: 1fr;
  }
}
.dash-main {
  flex: 1;
  padding: 36px 40px;
  min-width: 0;
}

.progress-bar {
  display: flex;
  align-items: center;
  margin-bottom: 32px;
  gap: 0;
}

.progress-step {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
}

.step-circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
  transition: all 0.3s;
}

.step-circle.done {
  background: var(--green);
  color: #fff;
}
.step-circle.active {
  background: var(--brand);
  color: var(--bg);
}
[data-theme='night'] .step-circle.active {
  background: var(--gold);
  color: #0a0f1f;
}
.step-circle.todo {
  background: var(--bg-soft);
  color: var(--ink-faint);
  border: 2px solid var(--rule);
}

.step-line {
  flex: 1;
  height: 2px;
  background: var(--rule);
  margin: 0 8px;
  min-width: 32px;
}
.step-line.done {
  background: var(--green);
}

.step-name {
  color: var(--ink-mute);
}
.step-name.active {
  color: var(--ink);
}
.step-name.done {
  color: var(--green);
}

.mb8 {
  margin-bottom: 8px;
}
.mb16 {
  margin-bottom: 16px;
}
.mb24 {
  margin-bottom: 24px;
}

.success-banner {
  background: var(--green-bg);
  border: 1px solid var(--green);
  border-radius: 12px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.success-banner-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.success-title {
  font-weight: 700;
  color: var(--green);
  font-size: 15px;
}

.success-sub {
  font-size: 13px;
  color: var(--ink-mute);
}

/* Upgrade Wall */
.upgrade-wall {
  text-align: center;
  padding: 48px 24px;
  background: var(--bg-card);
  border: 1px solid var(--rule);
  border-radius: 16px;
  position: relative;
  overflow: hidden;
}

.upgrade-wall h3 {
  font-size: 28px;
  margin-bottom: 10px;
}
.upgrade-wall > p {
  font-size: 15px;
  color: var(--ink-mute);
  max-width: 500px;
  margin: 0 auto 28px;
}

.upgrade-plans {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  max-width: 560px;
  margin: 0 auto;
}

.up-card {
  background: var(--bg-soft);
  border: 2px solid var(--rule);
  border-radius: 14px;
  padding: 28px;
  text-align: left;
  transition: all 0.25s;
}

.up-card:hover {
  border-color: var(--brand);
  transform: translateY(-2px);
  box-shadow: var(--sh-md);
}
.up-card.highlight {
  border-color: var(--gold);
}

.up-plan {
  font-size: 12px;
  font-weight: 700;
  color: var(--ink-mute);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 6px;
}
.up-price {
  font-family: 'Fraunces', serif;
  font-size: 32px;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 4px;
}
.up-desc {
  font-size: 13px;
  color: var(--ink-mute);
  margin-bottom: 16px;
}

.up-features {
  list-style: none;
}
.up-features li {
  font-size: 13px;
  padding: 4px 0;
  color: var(--ink-soft);
  display: flex;
  gap: 8px;
}
.up-features li::before {
  content: '✓';
  color: var(--gold);
  font-weight: 700;
}

/* Payment modal */
.modal-plan-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  background: var(--gold-bg);
  border: 1px solid var(--gold);
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
  color: var(--gold);
  margin-bottom: 16px;
}

.order-summary {
  background: var(--bg-soft);
  border: 1px solid var(--rule);
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 20px;
}

.order-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  padding: 6px 0;
  color: var(--ink-soft);
  border-bottom: 1px solid var(--rule);
}

.order-row:last-child {
  border-bottom: none;
}
.order-row.total {
  font-weight: 700;
  color: var(--ink);
  font-size: 15px;
}

.card-preview {
  background: linear-gradient(135deg, var(--brand), var(--brand-soft));
  border-radius: 14px;
  padding: 20px 22px;
  color: #fff;
  font-family: 'JetBrains Mono', monospace;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
}

.card-chip {
  width: 36px;
  height: 28px;
  background: var(--gold-soft);
  border-radius: 5px;
  margin-bottom: 20px;
}

.card-num-prev {
  font-size: 18px;
  letter-spacing: 0.12em;
  margin-bottom: 20px;
}

.text-warn {
  color: var(--gold);
}
.text-ok {
  color: var(--green);
}

@media (max-width: 768px) {
  .dash-main {
    padding: 20px 16px;
  }
  .upgrade-plans {
    grid-template-columns: 1fr;
  }
}
</style>
