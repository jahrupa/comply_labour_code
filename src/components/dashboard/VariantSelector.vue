<template>
  <div>
    <div class="variant-grid">
      <div
        class="variant-card"
        v-for="v in variants"
        :key="v.key"
        :class="{ selected: selectedVariant === v.key }"
        @click="selectedVariant = v.key"
      >
        <div class="variant-name">{{ v.name }}</div>
        <div class="variant-desc">{{ v.desc }}</div>
        <span class="variant-tag">{{ v.tag }}</span>
      </div>
    </div>

    <div style="display: flex; gap: 12px; margin-top: 24px">
      <button class="btn btn-ghost" @click="$emit('back')">← Back</button>
      <button class="btn btn-primary" @click="$emit('continue', selectedVariant)">
        Continue with {{ currentVariant.name }} →
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['back', 'continue'])

const selectedVariant = ref('net')

const variants = [
  {
    key: 'net',
    name: 'Net Neutral',
    desc: 'Preserves employee in-hand (take-home) salary. Statutory contributions increase; employer cost increases slightly.',
    tag: '👤 Employee-friendly',
  },
  {
    key: 'gross',
    name: 'Gross Neutral',
    desc: 'Maintains gross salary. Restructures components for compliance. Take-home may change marginally.',
    tag: '⚖️ Balanced',
  },
  {
    key: 'ctc',
    name: 'CTC Neutral',
    desc: 'Keeps total employer cost unchanged. Take-home may reduce as statutory contributions increase.',
    tag: '🏢 Employer-friendly',
  },
]

const currentVariant = computed(() => variants.find((v) => v.key === selectedVariant.value))
</script>

<style scoped>
.variant-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin: 20px 0;
}

.variant-card {
  border: 2px solid var(--rule);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.25s;
  background: var(--bg-card);
}

.variant-card:hover {
  border-color: var(--brand-soft);
}

.variant-card.selected {
  border-color: var(--brand);
  background: color-mix(in srgb, var(--brand) 6%, var(--bg));
}

[data-theme='night'] .variant-card.selected {
  border-color: var(--gold);
  background: var(--gold-bg);
}

.variant-name {
  font-weight: 700;
  font-size: 15px;
  margin-bottom: 6px;
  color: var(--ink);
}
.variant-desc {
  font-size: 12px;
  color: var(--ink-mute);
  line-height: 1.5;
}

.variant-tag {
  display: inline-block;
  margin-top: 10px;
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 600;
  background: var(--gold-bg);
  color: var(--gold);
}

.variant-card.selected .variant-tag {
  background: var(--brand);
  color: var(--bg);
}

[data-theme='night'] .variant-card.selected .variant-tag {
  background: var(--gold);
  color: #0a0f1f;
}

@media (max-width: 768px) {
  .variant-grid {
    grid-template-columns: 1fr;
  }
}
</style>
