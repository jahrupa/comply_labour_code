<template>
  <div class="modal-overlay">
    <div class="modal">
      <button class="modal-close" @click="emit('close')">✕</button>

      <h3>Complete Payment</h3>

      <p class="payment-subtitle">Secure payment powered by Razorpay (demo)</p>

      <div class="modal-plan-badge">🔐 {{ plan }}</div>

      <!-- Order Summary -->
      <div class="order-summary">
        <div class="order-row">
          <span>Base Amount</span>
          <span>₹{{ baseAmount }}</span>
        </div>

        <div class="order-row">
          <span>GST (18%)</span>
          <span>₹{{ gstAmount }}</span>
        </div>

        <div v-if="discountAmount > 0" class="order-row discount">
          <span>Discount</span>
          <span>-₹{{ discountAmount }}</span>
        </div>

        <div class="order-row total">
          <span>Total</span>
          <span>₹{{ totalAmount }}</span>
        </div>
      </div>

      <!-- Coupon -->
      <div class="form-group">
        <label class="form-label">Coupon Code</label>

        <div class="coupon-box">
          <input
            :value="couponInput"
            class="form-input"
            placeholder="Try KARMA50"
            @input="emit('update:couponInput', $event.target.value)"
          />

          <button class="btn btn-sm" @click="emit('apply-coupon')">Apply</button>
        </div>

        <p v-if="couponMsg" :class="couponMsgClass">
          {{ couponMsg }}
        </p>
      </div>

      <!-- Card Preview -->
      <div class="card-preview">
        <div class="card-chip"></div>

        <div class="card-num-preview">
          {{ cardNumDisplay }}
        </div>

        <div class="card-details-row">
          <div>
            <div class="label">CARD HOLDER</div>
            <div>YOUR NAME</div>
          </div>

          <div>
            <div class="label">EXPIRES</div>
            <div>MM/YY</div>
          </div>
        </div>
      </div>
      <!-- Payment Fields -->
      <div class="form-group">
        <label class="form-label">Card Number</label>
        <input
          class="form-input"
          placeholder="4111 1111 1111 1111"
          @input="emit('update:cardNumber', $event.target.value)"
        />
      </div>

      <div class="payment-row">
        <div class="form-group">
          <label class="form-label">Card Holder Name</label>
          <input
            class="form-input"
            placeholder="Priya Sharma"
            @input="emit('update:cardHolder', $event.target.value)"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Expiry</label>
          <input
            class="form-input"
            placeholder="MM/YY"
            @input="emit('update:cardExpiry', $event.target.value)"
          />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">CVV</label>
        <input
          class="form-input"
          type="password"
          maxlength="3"
          placeholder="•••"
          @input="emit('update:cvv', $event.target.value)"
        />
      </div>

      <p class="form-hint">🔒 This is a demo payment — no real charges will be made</p>

      <div class="form-group">
        <label class="form-label">UPI ID (optional)</label>
        <input
          class="form-input"
          placeholder="yourname@okicici"
          @input="emit('update:upiId', $event.target.value)"
        />
      </div>

      <!-- Pay Button -->
      <button class="btn btn-accent btn-block btn-lg" @click="emit('process-payment')">
        Pay ₹{{ totalAmount }} Securely
      </button>

      <p style="text-align: center; margin-top: 10px; font-size: 12px; color: #94a3b8">
        🔒 256-bit SSL encrypted • Demo mode — no real charge
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  plan: {
    type: String,
    default: '',
  },
  baseAmount: {
    type: Number,
    default: 0,
  },
  gstAmount: {
    type: Number,
    default: 0,
  },
  discountAmount: {
    type: Number,
    default: 0,
  },
  totalAmount: {
    type: Number,
    default: 0,
  },
  cardNumDisplay: {
    type: String,
    default: '•••• •••• •••• ••••',
  },
  couponInput: {
    type: String,
    default: '',
  },
  couponMsg: {
    type: String,
    default: '',
  },
  couponMsgClass: {
    type: String,
    default: '',
  },
  payState: {
    type: String,
    default: 'form',
  },
})

const emit = defineEmits([
  'close',
  'apply-coupon',
  'format-card',
  'format-expiry',
  'process-payment',
  'update:couponInput',
  'update:cardNumber',
  'update:cardHolder',
  'update:cardExpiry',
  'update:cvv',
  'update:upiId',
])
</script>

<style scoped>
/* =========================
   PAYMENT MODAL OVERLAY
========================= */

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 20px;

  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
}

/* =========================
   MODAL BOX
========================= */

.modal {
  width: min(100%, 720px);
  max-height: calc(100vh - 48px);

  background: #ffffff;
  border-radius: 18px;

  padding: 24px;

  position: relative;

  max-height: 90vh;
  overflow-y: auto;

  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.18);

  animation: modalSlide 0.3s ease;
}

@keyframes modalSlide {
  from {
    opacity: 0;
    transform: translateY(15px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* =========================
   CLOSE BUTTON
========================= */

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;

  width: 32px;
  height: 32px;

  border: 1px solid #ddd;
  border-radius: 50%;

  background: #f7f7f7;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  font-size: 14px;

  transition: 0.2s;
}

.modal-close:hover {
  background: #efefef;
}

/* =========================
   HEADING
========================= */

.modal h3 {
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 6px;
  color: #0f172a;
}

.payment-subtitle {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 16px;
}

/* =========================
   PLAN BADGE
========================= */

.modal-plan-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  padding: 6px 14px;

  border-radius: 999px;

  background: #fff7e6;
  border: 1px solid #d8a33a;

  color: #b7791f;
  font-size: 12px;
  font-weight: 600;

  margin-bottom: 18px;
}

/* =========================
   ORDER SUMMARY
========================= */

.order-summary {
  background: #f5f3ef;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 18px;
}

.order-row {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 6px 0;

  font-size: 14px;
  color: #334155;
}

.order-row.total {
  margin-top: 10px;
  padding-top: 12px;

  border-top: 1px solid #dcdcdc;

  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.order-row.discount {
  color: #16a34a;
  font-weight: 600;
}

/* =========================
   FORM
========================= */

.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;

  margin-bottom: 8px;
  color: #0f172a;
}

.form-input {
  width: 100%;
  height: 42px;

  padding: 0 14px;

  border: 1px solid #d6d3d1;
  border-radius: 8px;

  background: #fff;
  font-size: 14px;

  transition: 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #1d4676;
}

/* =========================
   COUPON
========================= */

.coupon-box {
  display: flex;
  gap: 8px;
}

.coupon-box .form-input {
  flex: 1;
}

.coupon-msg {
  margin-top: 8px;
  font-size: 12px;
}

.coupon-msg.ok {
  color: #16a34a;
  font-weight: 600;
}

.coupon-msg.warn {
  color: #dc2626;
  font-weight: 600;
}

/* =========================
   CARD PREVIEW
========================= */

.card-preview {
  background: linear-gradient(135deg, #1e4775, #284f80);
  border-radius: 12px;
  padding: 16px;
  color: #fff;
  margin-bottom: 18px;
  position: relative;
  overflow: hidden;

  min-height: 140px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-preview::after {
  content: '';

  position: absolute;
  top: -30px;
  right: -30px;

  width: 120px;
  height: 120px;

  border-radius: 50%;

  background: rgba(255, 255, 255, 0.08);
}

.card-chip {
  width: 30px;
  height: 24px;

  background: #d7af55;
  border-radius: 4px;

  margin-bottom: 14px;
}

.card-num-preview {
  font-size: 18px;
  letter-spacing: 3px;
  font-weight: 600;
  margin: 20px 0;
}

.card-details-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.card-details-row .label {
  font-size: 9px;
  opacity: 0.7;
  margin-bottom: 3px;
  text-transform: uppercase;
}

.card-details-row div {
  font-size: 11px;
}

/* =========================
   CARD HOLDER + EXPIRY
========================= */

.payment-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

/* =========================
   HINT
========================= */

.form-hint {
  margin-top: 6px;
  font-size: 12px;
  color: #64748b;
}

/* =========================
   BUTTONS
========================= */

.btn {
  border: none;
  cursor: pointer;
}

.btn-sm {
  height: 42px;
  padding: 0 16px;

  border-radius: 8px;

  background: #fff;
  border: 1px solid #d6d3d1;

  font-size: 14px;
}

.btn-block {
  width: 100%;
}

.btn-lg {
  height: 48px;
}

.btn-accent {
  background: #ef552b;
  color: white;

  font-size: 16px;
  font-weight: 700;

  border-radius: 8px;
}

.btn-accent:hover {
  opacity: 0.95;
}

/* =========================
   SUCCESS SCREEN
========================= */

.pay-success {
  text-align: center;
  padding: 20px 0;
}

.pay-success-icon {
  display: block;
  font-size: 60px;
  margin-bottom: 12px;
}

.pay-success h3 {
  font-size: 24px;
  margin-bottom: 8px;
}

/* =========================
   SCROLLBAR
========================= */

.modal::-webkit-scrollbar {
  width: 6px;
}

.modal::-webkit-scrollbar-thumb {
  background: #d4d4d4;
  border-radius: 10px;
}

/* =========================
   MOBILE
========================= */

@media (max-width: 480px) {
  .modal {
    max-width: 100%;
    padding: 18px;
  }

  .payment-row {
    grid-template-columns: 1fr;
  }

  .modal h3 {
    font-size: 24px;
  }
}
</style>
