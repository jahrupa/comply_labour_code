<template>
  <section id="about-section">
    <div style="padding: 80px 0">
      <div class="app-container">
        <div class="sec-eyebrow">About Us</div>

        <h1 class="sec-title">
          Built by practitioners,
          <em>for practitioners.</em>
        </h1>

        <p class="sec-lede">
          complymgmt.ai is a product of Karma Management — India's specialist labour law advisory
          firm.
        </p>

        <div
          style="
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 48px;
            align-items: start;
            margin-top: 48px;
          "
        >
          <div>
            <h2 style="font-size: 32px; margin-bottom: 20px">Why we built this</h2>

            <p
              style="font-size: 16px; color: var(--ink-soft); line-height: 1.8; margin-bottom: 16px"
            >
              The four New Labour Codes — Code on Wages 2019, Industrial Relations Code 2020, OSH
              Code 2020, and Code on Social Security 2020 — represent the most significant
              restructuring of Indian labour law in decades.
            </p>

            <p
              style="font-size: 16px; color: var(--ink-soft); line-height: 1.8; margin-bottom: 16px"
            >
              Section 2(y) of the Code on Wages alone has created immense confusion. Most
              practitioners are still computing the 50% test against Gross CTC rather than Total
              Employer Cost. This error results in non-compliant salary structures that expose
              companies to statutory risk.
            </p>

            <p style="font-size: 16px; color: var(--ink-soft); line-height: 1.8">
              We built complymgmt.ai to encode the correct interpretation into a reliable engine —
              one that produces defensible outputs every time.
            </p>
          </div>

          <div>
            <div
              style="
                background: var(--gold-bg);
                border: 1px solid var(--gold);
                border-radius: 16px;
                padding: 32px;
              "
            >
              <h3 style="font-size: 22px; margin-bottom: 20px">Our Credentials</h3>

              <div
                v-for="item in credentials"
                :key="item"
                style="
                  display: flex;
                  gap: 10px;
                  padding: 8px 0;
                  border-bottom: 1px solid var(--gold);
                  font-size: 14px;
                  color: var(--ink-soft);
                "
              >
                <span style="color: var(--gold); font-weight: 700; flex-shrink: 0"> ✓ </span>
                {{ item }}
              </div>
            </div>
          </div>
        </div>

        <div
          style="
            background: var(--bg-soft);
            border: 1px solid var(--rule);
            border-radius: 16px;
            padding: 48px;
            text-align: center;
            margin-top: 64px;
          "
        >
          <h2 style="font-size: 36px; margin-bottom: 16px">Data security commitment</h2>

          <p style="font-size: 16px; color: var(--ink-soft); max-width: 640px; margin: 0 auto 24px">
            Data residency is Azure India South and Central. No data ever leaves India. Compliant
            with DPDP Act 2023.
          </p>

          <div style="display: flex; gap: 24px; justify-content: center; flex-wrap: wrap">
            <div
              v-for="badge in badges"
              :key="badge"
              style="
                background: var(--bg-card);
                border: 1px solid var(--rule);
                border-radius: 100px;
                padding: 8px 20px;
                font-size: 13px;
                font-weight: 600;
                color: var(--ink-mute);
              "
            >
              🔒 {{ badge }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineOptions({
  name: 'AboutPageView',
})

const credentials = [
  '15+ years of labour law advisory practice',
  'Clients across 28 states and 8 UTs',
  '500+ companies restructured',
  'Empanelled with DPIIT for startup compliance',
  'Authors of the first Karma Section 2(y) practice note',
  'Formal representation to Ministry on Section 2(y) clarification',
]

const badges = ['Azure India', 'DPDP Act 2023', 'GDPR Ready', 'AES-256 Encrypted']
</script>

<style scoped></style>
