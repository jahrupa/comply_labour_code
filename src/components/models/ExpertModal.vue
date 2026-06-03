<template>
  <div v-if="modelValue" class="modal-overlay" @click.self="close">
    <div class="modal-card">
      <button class="close-btn" @click="close">✕</button>

      <template v-if="!submitted">
        <h2>Book a Consultation</h2>

        <p class="modal-subtitle">Speak with one of our labour law experts.</p>

        <div class="expert-list">
          <div
            v-for="expert in experts"
            :key="expert"
            class="expert-chip"
            :class="{ selected: selectedExpert === expert }"
            @click="selectedExpert = expert"
          >
            {{ expert }}
          </div>
        </div>

        <input v-model="form.name" class="form-input" placeholder="Your Name" />

        <input v-model="form.email" type="email" class="form-input" placeholder="Work Email" />

        <select v-model="form.topic" class="form-input">
          <option value="">Choose Topic</option>
          <option>Wage Code Restructuring</option>
          <option>Multi-State Compliance Review</option>
          <option>PE / Investor Due Diligence</option>
          <option>Labour Inspector Defence</option>
          <option>Board Advisory Report</option>
        </select>

        <button class="submit-btn" @click="submit">Request Consultation</button>
      </template>

      <template v-else>
        <h2>Request Submitted 🎉</h2>

        <p>Consultation request sent successfully.</p>

        <p>
          Reference ID:
          <strong>{{ confirmationId }}</strong>
        </p>

        <button class="submit-btn" @click="close">Close</button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  modelValue: Boolean,
})

const emit = defineEmits(['update:modelValue', 'submitted'])

const experts = ['Anand Verma', 'Priya Pillai', 'Rohan Desai']

const selectedExpert = ref('Anand Verma')

const form = ref({
  name: '',
  email: '',
  topic: '',
})

const submitted = ref(false)
const confirmationId = ref('')

const close = () => {
  emit('update:modelValue', false)
}

const submit = () => {
  if (!form.value.name || !form.value.email || !form.value.topic) {
    return
  }

  confirmationId.value = 'KM-' + Math.floor(Math.random() * 90000 + 10000)

  submitted.value = true

  emit('submitted', {
    ...form.value,
    expert: selectedExpert.value,
    id: confirmationId.value,
  })
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-card {
  width: 100%;
  max-width: 600px;
  background: white;
  border-radius: 16px;
  padding: 24px;
  position: relative;
}

.close-btn {
  position: absolute;
  right: 16px;
  top: 16px;
  border: none;
  background: none;
  cursor: pointer;
}

.expert-list {
  display: flex;
  gap: 10px;
  margin: 20px 0;
  flex-wrap: wrap;
}

.expert-chip {
  padding: 8px 14px;
  border: 1px solid #ddd;
  border-radius: 999px;
  cursor: pointer;
}

.expert-chip.selected {
  background: #e85230;
  color: white;
}

.form-input {
  width: 100%;
  margin-bottom: 12px;
  padding: 12px;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  cursor: pointer;
}
</style>
