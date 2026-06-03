<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    backdrop-filter="saturate(80%)"
  >
    <q-card style="min-width: 500px">
      <q-card-section class="row items-center">
        <div class="text-h6">Register Webinar</div>

        <q-space />

        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section> Your modal content here </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Close" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
defineOptions({
  name: 'ModalPageView',
})
defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'submitted'])
</script>
