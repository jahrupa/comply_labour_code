<template>
  <div>
    <HeroSection />
    <FeaturesSection />
    <Testimonials />
    <AboutKarma />
    <PricingSection />
    <!-- <AboutPage /> -->
    <FAQSection />
    <!-- Expert CTA -->
    <!-- <section style="padding: 80px 0; background: var(--brand)">
      <div class="app-container" style="text-align: center">
        <h2
          style="
            font-size: clamp(36px, 5vw, 56px);
            color: var(--bg);
            margin-bottom: 20px;
            line-height: 1.05;
          "
        >
          Ready to become
          <br />
          <em style="color: var(--gold-soft)">compliant?</em>
        </h2>

        <p
          style="
            font-size: 18px;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 36px;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
          "
        >
          Join 500+ HR teams and legal professionals who trust complymgmt.ai for New Wage Code
          compliance.
        </p>

        <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap">
          <a href="#/auth?tab=signup" class="btn btn-accent btn-lg"> Start free — 3 employees → </a>

          <a
            href="#pricing-section"
            class="btn btn-lg"
            style="
              background: rgba(255, 255, 255, 0.15);
              color: var(--bg);
              border: 1px solid rgba(255, 255, 255, 0.3);
            "
          >
            View pricing
          </a>
        </div>
      </div>
    </section> -->
  </div>
</template>

<script setup>
defineOptions({
  name: 'IndexPageView',
})

import HeroSection from 'src/components/landing/HeroSection.vue'
import FeaturesSection from 'src/components/landing/FeaturesSection.vue'
import Testimonials from 'src/components/landing/Testimonials.vue'
import PricingSection from 'src/components/landing/PricingSection.vue'
import FAQSection from 'src/components/landing/FAQSection.vue'
import AboutKarma from 'src/components/landing/AboutKarma.vue'
</script>

<style scoped></style>
