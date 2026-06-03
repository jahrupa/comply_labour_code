<template>
  <div class="card mb24">
    <div class="card-title mb16">📋 Restructured Salary Preview</div>
    <div style="overflow-x: auto">
      <table class="result-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Old Basic</th>
            <th>New Basic</th>
            <th>Old HRA</th>
            <th>New HRA</th>
            <th>Compliance</th>
            <th>Change</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>
              <strong>{{ row.name }}</strong
              ><br /><small style="color: var(--ink-faint)">{{ row.id }}</small>
            </td>
            <td>{{ row.oldBasic }}</td>
            <td>{{ row.newBasic }}</td>
            <td>{{ row.oldHRA }}</td>
            <td>{{ row.newHRA }}</td>
            <td>
              <span class="badge" :class="row.compliant ? 'badge-green' : 'badge-red'">
                {{ row.compliant ? '✓ Compliant' : '⚠ Risk' }}
              </span>
            </td>
            <td>
              <span :class="row.changePositive ? 'change-positive' : 'change-negative'">
                {{ row.change }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Variant Toggle -->
    <div class="variant-preview">
      <div class="variant-preview-head">
        <div>
          <div class="card-title" style="margin-bottom: 6px">Preview and Download a Variant</div>
          <p class="variant-preview-note">{{ variantDescriptions[activeVariant] }}</p>
        </div>
        <div class="variant-toggle">
          <button
            type="button"
            class="btn btn-sm"
            :class="{ active: activeVariant === 'net' }"
            @click="activeVariant = 'net'"
          >
            Net Neutral
          </button>
          <button
            type="button"
            class="btn btn-sm"
            :class="{ active: activeVariant === 'gross' }"
            @click="activeVariant = 'gross'"
          >
            Gross Neutral
          </button>
          <button
            type="button"
            class="btn btn-sm"
            :class="{ active: activeVariant === 'ctc' }"
            @click="activeVariant = 'ctc'"
          >
            CTC Neutral
          </button>
        </div>
      </div>

      <div class="variant-preview-actions">
        <button class="btn btn-green btn-sm" @click="$emit('download', activeVariant)">
          ⬇ Download {{ variantLabels[activeVariant] }} CSV
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({ rows: Array })
defineEmits(['download'])

const activeVariant = ref('net')

const variantDescriptions = {
  net: 'Net Neutral preserves employee in-hand salary as far as possible while computing compliant statutory contributions.',
  gross:
    'Gross Neutral maintains the gross salary while restructuring individual components for compliance.',
  ctc: 'CTC Neutral keeps total employer cost unchanged while restructuring the salary into a compliant format.',
}

const variantLabels = {
  net: 'Net Neutral',
  gross: 'Gross Neutral',
  ctc: 'CTC Neutral',
}
</script>

<style scoped>
.mb16 {
  margin-bottom: 16px;
}
.mb24 {
  margin-bottom: 24px;
}

.change-positive {
  color: var(--green);
  font-weight: 700;
}
.change-negative {
  color: #c0392b;
  font-weight: 700;
}

.variant-preview {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid var(--rule);
  border-radius: 10px;
  background: var(--bg-soft);
}

.variant-preview-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.variant-toggle {
  display: flex;
  gap: 4px;
  padding: 4px;
  background: var(--bg-card);
  border: 1px solid var(--rule);
  border-radius: 8px;
}

.variant-toggle .btn {
  border: 0;
  padding: 8px 14px;
  background: transparent;
  color: var(--ink-mute);
}

.variant-toggle .btn.active {
  background: var(--brand);
  color: var(--bg);
}

[data-theme='night'] .variant-toggle .btn.active {
  background: var(--gold);
  color: #0a0f1f;
}

.variant-preview-note {
  font-size: 13px;
  color: var(--ink-mute);
  max-width: 560px;
}

.variant-preview-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
