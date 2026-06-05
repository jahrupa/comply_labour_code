<template>
  <div v-if="modelValue" class="expert-modal-overlay" @click="closeOnBg">
    <div class="expert-modal" @click.stop>
      <button class="em-close" @click="emit('update:modelValue', false)">✕</button>

      <div style="margin-bottom: 24px">
        <div class="sec-eyebrow" style="margin-bottom: 10px">Live Webinar</div>

        <h3 style="font-size: 26px; margin-bottom: 8px">Register for the Webinar</h3>

        <p style="font-size: 14px; color: #6b7280">
          Practical guidance on New Wage Code restructuring, Net Neutral implementation, and payroll
          readiness.
        </p>
      </div>

      <div class="form-group">
        <label class="form-label">Your name *</label>

        <input v-model="form.name" class="form-input" type="text" placeholder="Priya Sharma" />
      </div>

      <div class="form-group">
        <label class="form-label">Work email *</label>

        <input v-model="form.email" class="form-input" type="email" placeholder="you@company.com" />
      </div>

      <div class="form-group">
        <label class="form-label">Company name</label>

        <input v-model="form.company" class="form-input" type="text" placeholder="Acme Pvt Ltd" />
      </div>

      <div class="form-group">
        <label class="form-label">Role</label>

        <select v-model="form.role" class="form-input">
          <option>HR / People Operations</option>
          <option>Payroll / Finance</option>
          <option>Legal / Compliance</option>
          <option>Founder / Leadership</option>
          <option>Consultant / Advisor</option>
        </select>
      </div>

      <q-btn
        label="Reserve my seat →"
        class="btn btn-accent btn-block btn-lg"
        @click="submitWebinarRegistration"
        style="margin-top: 8px"
      />

      <p style="text-align: center; font-size: 11px; margin-top: 10px">
        Registration confirmation will be sent to your work email.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'submitted'])

const form = ref({
  name: '',
  email: '',
  company: '',
  role: 'HR / People Operations',
})

const closeOnBg = (e) => {
  if (e.target.classList.contains('expert-modal-overlay')) {
    emit('update:modelValue', false)
  }
}

const submitWebinarRegistration = () => {
  const payload = {
    ...form.value,
  }

  console.log(payload)

  emit('submitted', payload)

  emit('update:modelValue', false)
}
</script>

<style scoped>
.expert-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;

  display: flex;
  align-items: center;
  justify-content: center;

  backdrop-filter: blur(6px);
  padding: 24px;
}

.expert-modal {
  background: #ffffff;
  width: min(100%, 560px);

  max-height: 90vh;
  overflow-y: auto;

  border-radius: 20px;
  padding: 40px;

  position: relative;

  border: 1px solid #e5e7eb;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
}

.em-close {
  position: absolute;
  top: 16px;
  right: 16px;

  width: 32px;
  height: 32px;

  border-radius: 50%;
  border: 1px solid #e5e7eb;

  background: #f8f8f8;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
}

.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: 600;
}

.form-input {
  width: 100%;
  height: 48px;

  border: 1px solid #d9d9d9;
  border-radius: 10px;

  padding: 0 14px;
  font-size: 14px;

  outline: none;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: #c9972f;
}

.sec-eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #b8860b;
}

.btn-accent {
  width: 100%;
}
</style>
