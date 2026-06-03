<template>
  <section class="testimonials-section">
    <div class="app-container">
      <div class="sec-eyebrow">What our clients say</div>

      <h2 class="sec-title">Trusted by HR & <em>Legal teams</em> across India.</h2>

      <div class="testimonials-grid">
        <div
          v-for="testimonial in testimonials"
          :key="testimonial.name"
          :class="['testimonial-card', { featured: testimonial.featured }]"
        >
          <div class="quote-mark">"</div>

          <div class="stars">
            {{ '⭐'.repeat(testimonial.stars) }}
          </div>

          <p class="testimonial-text">
            {{ testimonial.text }}
          </p>

          <div class="author">
            <div class="avatar" :style="{ background: testimonial.avatarBg }">
              {{ testimonial.initials }}
            </div>

            <div>
              <div class="author-name">
                {{ testimonial.name }}
              </div>

              <div class="author-role">
                {{ testimonial.role }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
defineOptions({
  name: 'TestimonialsSection',
})

const testimonials = [
  {
    text: 'We ran our entire workforce of 340 employees through complymgmt.ai in under two hours. The advisory report was detailed enough that our CFO signed off without needing external counsel.',
    name: 'Riya Sharma',
    role: 'CHRO, Nexus Manufacturing Pvt Ltd · Mumbai',
    initials: 'RS',
    avatarBg: 'var(--brand)',
    stars: 5,
  },
  {
    text: 'The Section 2(y) analysis was exactly what our auditors needed. The calculator correctly handles the 50% test against Total Employer Cost, not just CTC — most consultants get this wrong.',
    name: 'Vikram Nair',
    role: 'CFO, Coastal Logistics Ltd · Kochi',
    initials: 'VN',
    avatarBg: 'var(--accent)',
    stars: 5,
    featured: true,
  },
  {
    text: 'As an HR consultant managing 12 clients, the bulk upload feature saves me days every quarter. The statutory citations in the advisory report make client presentations much easier.',
    name: 'Priyanka Desai',
    role: 'Independent HR Consultant · Pune',
    initials: 'PD',
    avatarBg: 'var(--green)',
    stars: 5,
  },
]
</script>

<style scoped>
.testimonials-section {
  padding: 100px 0;
  background: var(--bg);
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 56px;
}

.testimonial-card {
  position: relative;
  background: var(--bg-card);
  border: 1px solid var(--rule);
  border-radius: 16px;
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: all 0.3s ease;
}

.testimonial-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--sh-lg);
}

.testimonial-card.featured {
  background: var(--brand);
  border-color: var(--brand);
}

.quote-mark {
  position: absolute;
  top: 20px;
  right: 28px;
  font-family: 'Fraunces', serif;
  font-size: 80px;
  line-height: 1;
  color: var(--rule);
}

.featured .quote-mark {
  color: rgba(255, 255, 255, 0.15);
}

.stars {
  font-size: 14px;
  display: flex;
  gap: 3px;
}

.testimonial-text {
  font-size: 15px;
  line-height: 1.7;
  font-style: italic;
  flex: 1;
  color: var(--ink-soft);
}

.featured .testimonial-text {
  color: rgba(255, 255, 255, 0.95);
}

.author {
  display: flex;
  align-items: center;
  gap: 14px;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
  font-family: 'Fraunces', serif;
}

.author-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--ink);
}

.featured .author-name {
  color: #fff;
}

.author-role {
  font-size: 12px;
  margin-top: 2px;
  color: var(--ink-mute);
}

.featured .author-role {
  color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 1024px) {
  .testimonials-grid {
    grid-template-columns: 1fr;
  }
}
</style>
