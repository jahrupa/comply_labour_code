<template>
  <div>
    <div class="card mb24">
      <div class="card-header">
        <div>
          <div class="card-title">Step 1: Upload Salary Data</div>
          <div class="card-sub">
            Upload your existing salary structures as CSV or Excel. Max
            {{ authStore.trialLimit - authStore.trialUsed }} employees on current plan.
          </div>
        </div>
        <button class="btn btn-gold btn-sm" @click="downloadSample">⬇ Download Sample CSV</button>
      </div>

      <div
        class="upload-zone"
        :class="{ drag: isDragging }"
        @click="triggerUpload"
        @dragover.prevent="isDragging = true"
        @drop.prevent="handleDrop"
        @dragleave="isDragging = false"
      >
        <div class="upload-icon">📁</div>

        <h3>Click to upload or drag &amp; drop</h3>

        <p>
          CSV or Excel files (.csv, .xlsx, .xls) · Max
          {{ authStore.trialLimit - authStore.trialUsed }}
          employees on free trial
        </p>
        <input
          ref="fileInputRef"
          type="file"
          accept=".csv,.xlsx,.xls"
          style="display: none"
          @change="handleFileUpload"
        />
      </div>

      <div v-if="uploadedFile" class="uploaded-info">
        <span style="font-size: 20px">✅</span>
        <div style="flex: 1">
          <p class="upload-filename">{{ uploadedFile.name }}</p>
          <p class="upload-fileinfo">{{ uploadedFile.rows }} employee records detected</p>
        </div>
        <button class="btn btn-accent btn-sm" @click="$emit('go-generate')">
          Generate Report →
        </button>
      </div>
    </div>

    <!-- Sample Format -->
    <div class="card">
      <div class="card-title mb8">📋 Sample Data Format</div>
      <p class="card-sub mb16">Your CSV or Excel file should have these columns:</p>
      <div style="overflow-x: auto">
        <table class="result-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Basic</th>
              <th>HRA</th>
              <th>Conveyance</th>
              <th>Special Allowance</th>
              <th>Gross CTC</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in sampleRows" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.name }}</td>
              <td>{{ row.basic }}</td>
              <td>{{ row.hra }}</td>
              <td>{{ row.conv }}</td>
              <td>{{ row.special }}</td>
              <td>{{ row.gross }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useAppStore } from '../../stores/app'

const authStore = useAuthStore()
const appStore = useAppStore()
const emit = defineEmits(['go-generate', 'file-loaded'])

const fileInputRef = ref(null)
const isDragging = ref(false)
const uploadedFile = ref(null)

const sampleRows = [
  {
    id: 'EMP001',
    name: 'Priya Sharma',
    basic: '₹25,000',
    hra: '₹10,000',
    conv: '₹3,200',
    special: '₹11,800',
    gross: '₹50,000',
  },
  {
    id: 'EMP002',
    name: 'Rahul Verma',
    basic: '₹18,000',
    hra: '₹7,200',
    conv: '₹2,400',
    special: '₹12,400',
    gross: '₹40,000',
  },
  {
    id: 'EMP003',
    name: 'Anjali Patel',
    basic: '₹30,000',
    hra: '₹12,000',
    conv: '₹3,600',
    special: '₹14,400',
    gross: '₹60,000',
  },
]

function triggerUpload() {
  fileInputRef.value?.click()
}

function handleDrop(e) {
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  if (file) processFile(file)
}

function handleFileUpload(e) {
  const file = e.target.files[0]
  if (file) processFile(file)
}

function processFile(file) {
  const allowed = ['.csv', '.xlsx', '.xls']
  const ext = '.' + file.name.split('.').pop().toLowerCase()
  if (!allowed.includes(ext)) {
    appStore.showNotif('Please upload a CSV or Excel file.', 'warn')
    return
  }
  // Simulate parsing
  const rows = Math.min(authStore.trialRemaining, 3)
  uploadedFile.value = { name: file.name, rows }
  emit('file-loaded', { file, rows })
}

function downloadSample() {
  const csv = [
    'Employee ID,Name,Basic,HRA,Conveyance,Special Allowance,Gross CTC',
    'EMP001,Priya Sharma,25000,10000,3200,11800,50000',
    'EMP002,Rahul Verma,18000,7200,2400,12400,40000',
    'EMP003,Anjali Patel,30000,12000,3600,14400,60000',
  ].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'complymgmt_sample.csv'
  a.click()
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  gap: 16px;
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

.uploaded-info {
  margin-top: 16px;
  background: var(--green-bg);
  border: 1px solid var(--green);
  border-radius: 8px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.upload-filename {
  font-weight: 700;
  color: var(--green);
  font-size: 14px;
}

.upload-fileinfo {
  font-size: 12px;
  color: var(--ink-mute);
}

.upload-zone {
  margin-top: 16px;
  border: 1px dashed #d8cfc0;
  border-radius: 12px;
  background: #faf9f7;
  height: 165px;
  padding: 40px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  text-align: center;
  cursor: pointer;
  transition: all 0.25s ease;
}

.upload-zone:hover,
.upload-zone.drag {
  background: #f6f3ee;
  border-color: #c9b28a;
}

.upload-icon {
  font-size: 42px;
  margin-bottom: 12px;
}

.upload-zone h3 {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
}

.upload-zone p {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
}
</style>
