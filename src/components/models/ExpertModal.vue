<template>
  <div v-if="modelValue" class="expert-modal-overlay" @click="closeOnBg">
    <div class="expert-modal" @click.stop>
      <button class="em-close" @click="emit('update:modelValue', false)">✕</button>

      <div style="margin-bottom: 24px">
        <div class="sec-eyebrow" style="margin-bottom: 10px">Expert Advisory</div>

        <h3 style="font-size: 26px; margin-bottom: 8px">
          {{ title }}
        </h3>
        <p style="font-size: 14px; color: #6b7280">
          {{ description }}
        </p>
      </div>

      <div class="expert-experts" style="margin-bottom: 20px">
        <div
          v-for="expert in experts"
          :key="expert.name"
          class="expert-chip"
          :class="{ selected: selectedExpert === expert.name }"
          @click="selectedExpert = expert.name"
        >
          <span class="expert-chip-avatar">
            {{ expert.icon }}
          </span>

          {{ expert.name }}

          <span class="avail-dot" :style="{ background: expert.statusColor }"></span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Your name *</label>
        <input class="form-input" v-model="form.name" type="text" placeholder="Priya Sharma" />
      </div>

      <div class="form-group">
        <label class="form-label">Work email *</label>
        <input class="form-input" v-model="form.email" type="email" placeholder="you@company.com" />
      </div>

      <div class="form-group">
        <label class="form-label">Phone number</label>
        <input class="form-input" v-model="form.phone" type="tel" placeholder="+91 98000 00000" />
      </div>

      <div class="form-group">
        <label class="form-label">Company & employee count</label>
        <input
          class="form-input"
          v-model="form.company"
          type="text"
          placeholder="Acme Pvt Ltd · ~250 employees"
        />
      </div>

      <div class="form-group">
        <label class="form-label">What do you need help with? *</label>

        <select class="form-input" v-model="form.topic">
          <option value="">Choose a topic...</option>

          <option v-for="topic in topics" :key="topic" :value="topic">
            {{ topic }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Preferred meeting time</label>
        <select class="form-input" v-model="form.meetingTime">
          <option v-for="time in meetingTimes" :key="time" :value="time">
            {{ time }}
          </option>
        </select>
      </div>

      <q-btn
        label="Request consultation →"
        class="btn btn-gold btn-block btn-lg"
        @click="submitExpertModal"
        style="margin-top: 8px"
      />

      <p style="text-align: center; font-size: 11px; margin-top: 10px">
        No commitment required · First consultation complimentary for new clients
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

  experts: {
    type: Array,
    default: () => [],
  },

  topics: {
    type: Array,
    default: () => [],
  },

  title: {
    type: String,
    default: '',
  },

  description: {
    type: String,
    default: '',
  },

  meetingTimes: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue', 'submitted'])

const selectedExpert = ref('Anand Verma')

const form = ref({
  name: '',
  email: '',
  phone: '',
  company: '',
  topic: '',
  meetingTime: 'No preference',
})

const closeOnBg = (e) => {
  if (e.target.classList.contains('expert-modal-overlay')) {
    emit('update:modelValue', false)
  }
}

const submitExpertModal = () => {
  const payload = {
    expert: selectedExpert.value,
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

  font-size: 16px;
  color: #6b7280;

  transition: all 0.2s;
}

.em-close:hover {
  border-color: #c9972f;
  color: #c9972f;
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
}

.form-input:focus {
  border-color: #c9972f;
}

.btn-gold {
  width: 100%;
  height: 50px;

  border: none;
  border-radius: 10px;

  background: #b8860b;
  color: white;

  font-weight: 600;
  cursor: pointer;
}

.btn-gold:hover {
  opacity: 0.9;
}

.sec-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;

  color: #b8860b;
}

.sec-eyebrow::before {
  content: '';
  width: 16px;
  height: 1px;
  background: #b8860b;
}

.expert-experts {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.expert-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  padding: 8px 14px;

  border: 1px solid #e5e7eb;
  border-radius: 999px;

  background: #fff;

  cursor: pointer;

  font-size: 13px;
  font-weight: 600;

  transition: all 0.2s ease;
}

.expert-chip:hover {
  border-color: #c9972f;
}

.expert-chip.selected {
  border-color: #c9972f;
  background: #fffaf0;
}

.expert-chip-avatar {
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 12px;
}

.avail-dot {
  width: 7px;
  height: 7px;

  border-radius: 50%;

  margin-left: 2px;

  display: inline-block;
}

.btn-gold {
  width: 100%;
}

.btn-gold :deep(.q-btn__content) {
  color: #fff;
}
</style>
