<template>
  <footer class="footer-v2">
    <div class="app-container">
      <div class="footer-grid">
        <!-- Brand -->
        <div>
          <div class="logo footer-logo">
            <span class="logo-cm">complymgmt</span>
            <span class="logo-dot">.</span>
            <span class="logo-ai">ai</span>
            <span class="logo-badge">LABOUR CODES</span>
          </div>

          <p class="footer-tagline">
            India's most trusted New Wage Code compliance engine. Built by Karma Management Global
            Consulting Solutions — 20 years of labour law practice.
          </p>

          <p class="footer-quote">
            Command the chaos. Lead with intelligence.<br />
            Govern with integrity.
          </p>
        </div>

        <!-- Platform -->
        <div>
          <p class="footer-col-title">PLATFORM</p>

          <ul class="footer-links">
            <li><a href="#">Start Free Trial</a></li>
            <li><a href="#">Pricing</a></li>
            <li><a href="#">Expert Consultation</a></li>
          </ul>
        </div>

        <!-- Legal -->
        <div>
          <p class="footer-col-title">LEGAL</p>

          <ul class="footer-links">
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Use</a></li>
            <li><a href="#">DPDP Compliance</a></li>
            <li><a href="#">Cookie Policy</a></li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <p class="footer-col-title">CONTACT</p>

          <ul class="footer-links">
            <li><a href="#">info@karmamgmt.com</a></li>
            <li><a href="#">+91 22 4000 0000</a></li>
            <li><a href="#">Mumbai · Bengaluru · Delhi</a></li>
          </ul>

          <div class="certifications">
            <p class="cert-title">CERTIFICATIONS</p>

            <div class="cert-badges">
              <span>ISO 27001</span>
              <span>DPDP 2023</span>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© 2026 Karma Management Global Consulting Solutions Pvt Ltd. All rights reserved.</p>

        <div class="footer-bottom-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-v2 {
  background: #0d1530;
  padding: 72px 0 28px;
  color: #fff;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.8fr 1fr 1fr 1fr;
  gap: 60px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 22px;
}

.logo-cm {
  color: #fff;
  font-size: 24px;
  font-weight: 800;
}

.logo-dot {
  color: #ff6b2c;
  font-size: 34px;
  font-weight: 800;
}

.logo-ai {
  color: #ff6b2c;
  font-size: 34px;
  font-weight: 800;
}

.logo-badge {
  margin-left: 10px;
  padding: 5px 12px;
  border: 1px solid #c68b29;
  border-radius: 999px;
  font-size: 10px;
  color: #c68b29;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.footer-tagline {
  color: rgba(255, 255, 255, 0.7);
  font-size: 15px;
  line-height: 1.8;
  max-width: 320px;
}

.footer-quote {
  margin-top: 22px;
  color: #c68b29;
  font-style: italic;
  font-size: 14px;
  line-height: 1.7;
}

.footer-col-title {
  font-size: 12px;
  letter-spacing: 0.12em;
  color: rgba(255, 255, 255, 0.45);
  margin-bottom: 24px;
  font-weight: 700;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 18px;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.88);
  text-decoration: none;
  font-size: 15px;
  transition: 0.2s;
}

.footer-links a:hover {
  color: #c68b29;
}

.certifications {
  margin-top: 28px;
}

.cert-title {
  font-size: 11px;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.35);
  margin-bottom: 10px;
}

.cert-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.cert-badges span {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.6);
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
}

.footer-bottom {
  margin-top: 55px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);

  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-bottom p {
  margin: 0;
  color: rgba(255, 255, 255, 0.4);
  font-size: 12px;
}

.footer-bottom-links {
  display: flex;
  gap: 24px;
}

.footer-bottom-links a {
  color: rgba(255, 255, 255, 0.4);
  text-decoration: none;
  font-size: 12px;
}

@media (max-width: 992px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }

  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
}
</style>
