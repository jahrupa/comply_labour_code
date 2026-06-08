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
    text: `As an HR consultant managing 12 clients, the bulk upload feature saves me days every quarter. The statutory citations in the advisory report make client presentations much easier.`,
    name: 'Priyanka Desai',
    role: 'Independent HR Consultant · Pune',
    initials: 'PD',
    avatarBg: 'var(--green)',
    stars: 5,
  },
  {
    text: `The OSH Code earned leave provisions are genuinely confusing — the tool's distinction between the 180-day OSH provision and the 240-day gratuity qualifying period saved us from a serious error.`,
    name: 'Pooja Mehta',
    role: 'Labour Law Counsel, Desai & Associates · Pune',
    initials: 'PM',
    avatarBg: 'var(--gold)',
    stars: 5,
  },
  {
    text: `We were about to restructure salaries based on incorrect state notifications. Karma's live code library caught the discrepancy — our state had a different effective date than the central notification.`,
    name: 'Sunita Joshi',
    role: 'Finance Controller, Apex Textiles · Ahmedabad',
    initials: 'SJ',
    avatarBg: 'var(--accent)',
    stars: 5,
  },
  {
    text: `The expert consultation add-on was worth every rupee. We got a Karma-signed letterhead report that we used directly in our due diligence disclosure to a PE investor. Closed a Series B because of it.`,
    name: 'Rahul Banerjee',
    role: 'Co-founder & CEO, GreenMile Logistics · Delhi',
    initials: 'RB',
    avatarBg: '#7c3aed',
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
  margin-top: 48px;
}

.testimonial-card {
  position: relative;
  background: var(--bg-card);
  border: 1px solid var(--rule);
  border-radius: 24px;
  padding: 32px;

  display: flex;
  flex-direction: column;

  min-height: 320px;

  transition: all 0.3s ease;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
}

.testimonial-card:hover {
  transform: translateY(-14px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
}

.testimonial-card.featured {
  background: var(--brand);
  border-color: var(--brand);

  transform: translateY(-10px);
}

.stars {
  font-size: 14px;
  letter-spacing: 2px;
}

.testimonial-text {
  font-size: 15px;
  line-height: 1.75;
  color: var(--ink-soft);

  margin: 16px 0 24px;

  flex-grow: 1;
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
  width: 48px;
  height: 48px;
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
.featured .avatar {
  background: rgba(255, 255, 255, 0.2) !important;
}

@media (max-width: 1024px) {
  .testimonials-grid {
    grid-template-columns: 1fr;
  }
}
</style>
