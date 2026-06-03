<template>
  <div style="padding-top: 48px">
    <div class="app-container" style="text-align: center; padding-bottom: 0">
      <div class="sec-eyebrow">Pricing</div>

      <h1 style="font-size: clamp(40px, 5vw, 64px); margin-bottom: 16px">
        Simple,
        <em>transparent</em>
        pricing
      </h1>

      <p style="font-size: 18px; color: var(--ink-soft); max-width: 560px; margin: 0 auto">
        Pay per project. No recurring fees. No hidden charges.
      </p>
    </div>

    <PricingSection />
    <FAQSection />
  </div>
</template>

<script setup>
defineOptions({
  name: 'PricingPageView',
})

import PricingSection from 'src/components/landing/PricingSection.vue'
import FAQSection from 'src/components/landing/FAQSection.vue'
</script>

<style scoped></style>
