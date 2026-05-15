<template>
  <footer class="footer">
    <div class="footer__bg" aria-hidden="true" />
    <div class="footer__inner">
      <div class="footer__top">

        <!-- Column 1: Brand -->
        <div class="footer__brand">
          <a
            href="https://accidentprofessionals.com"
            target="_blank"
            rel="noopener"
            class="footer__logo"
            aria-label="Accident Professionals"
          >
            <img
              src="/brand/footer-logo.png"
              alt="Accident Professionals"
              width="178"
              height="37"
            />
          </a>
          <p class="footer__tagline">
            Connecting accident victims with vetted auto accident attorneys in
            Georgia. No upfront fees. Available 24/7.
          </p>
          <div class="footer__socials">
            <a
              href="https://www.facebook.com/accidentprofessionals.es/"
              target="_blank"
              rel="noopener"
              class="footer__social"
              aria-label="Facebook"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/company/accident-professionals/posts/?feedView=all"
              target="_blank"
              rel="noopener"
              class="footer__social"
              aria-label="LinkedIn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            <a
              href="https://www.instagram.com/accidentprofessionals/"
              target="_blank"
              rel="noopener"
              class="footer__social"
              aria-label="Instagram"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a
              href="https://www.youtube.com/@accident-professionals"
              target="_blank"
              rel="noopener"
              class="footer__social"
              aria-label="YouTube"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="var(--color-dark)"/>
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@.accidentprofessionals"
              target="_blank"
              rel="noopener"
              class="footer__social"
              aria-label="TikTok"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Column 2: Contact -->
        <div class="footer__contact">
          <p class="footer__nav-heading">Contact</p>
          <p class="footer__available">English &amp; Spanish supported</p>
          <p class="footer__available">Available 24/7</p>
          <a
            :href="config.public.phoneHref"
            class="footer__phone"
            @click="gtmPush({ event: 'phone_click', location: 'footer' })"
            >{{ config.public.phone }}</a
          >
          <a href="mailto:info@accidentprofessionals.com" class="footer__email">
            info@accidentprofessionals.com
          </a>
        </div>

        <!-- Column 3: Address -->
        <div class="footer__address">
          <p class="footer__nav-heading">Address</p>
          <a
            href="https://maps.google.com/?q=1+Glenlake+Pkwy+NE+Suite+650,+Sandy+Springs,+GA+30328"
            target="_blank"
            rel="noopener"
            class="footer__map-wrap"
            aria-label="View on Google Maps"
          >
            <iframe
              src="https://maps.google.com/maps?q=1+Glenlake+Pkwy+NE+Suite+650+Sandy+Springs+GA+30328&output=embed"
              width="100%"
              height="110"
              style="border:0;border-radius:8px;pointer-events:none;"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              aria-hidden="true"
              tabindex="-1"
            />
          </a>
          <p class="footer__address-text">
            1 Glenlake Pkwy NE Suite 650,<br />
            Sandy Springs, GA 30328, United States
          </p>
        </div>

      </div>

      <div class="footer__bottom">
        <p class="footer__copy">
          Copyright {{ year }} – Accident Professionals LLC – Connecting you with legal help in Georgia.
        </p>
        <p class="footer__copy footer__copy--small">
          Designed &amp; Built by
          <a
            href="https://beyondmediamarketing.com/"
            target="_blank"
            rel="noopener"
            class="footer__copy-link"
            >BMM</a
          >
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useDataLayer } from "../../composables/useDataLayer";
const config = useRuntimeConfig();
const year = new Date().getFullYear();
const { push: gtmPush } = useDataLayer();
</script>

<style lang="scss" scoped>
.footer {
  position: relative;
  overflow: hidden;
  border-radius: 32px 32px 0 0;

  &__bg {
    position: absolute;
    inset: 0;
    background-image: url("/services-page/auto-accidents/footer-bg.webp");
    background-size: cover;
    background-position: center;
  }

  &__inner {
    position: relative;
    z-index: 1;
    @include container;
    padding-top: 70px;
    padding-bottom: 37px;
  }

  &__top {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr;
    gap: 48px;
    margin-bottom: 48px;

    @include tablet-down {
      grid-template-columns: 1fr 1fr;
    }

    @include mobile {
      grid-template-columns: 1fr;
    }
  }

  &__brand {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__logo img {
    height: 37px;
    width: auto;
  }

  &__tagline {
    font-size: 14px;
    color: var(--color-muted);
    line-height: 1.65;
    max-width: 374px;
    letter-spacing: -0.01em;
  }

  &__socials {
    display: flex;
    gap: 10px;
    margin-top: 4px;
  }

  &__social {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid rgba(248, 246, 244, 0.2);
    color: var(--color-muted);
    transition: color var(--transition-base), border-color var(--transition-base);

    &:hover {
      color: var(--color-accent);
      border-color: var(--color-accent);
    }
  }

  &__nav-heading {
    font-size: 18px;
    font-weight: 600;
    color: var(--color-cream);
    font-family: var(--font-secondary);
    margin-bottom: 4px;
  }

  &__contact {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__available {
    font-size: 14px;
    color: var(--color-muted);
  }

  &__phone {
    font-size: 20px;
    font-weight: 600;
    color: var(--color-accent);
    letter-spacing: -0.03em;
    transition: opacity var(--transition-base);

    &:hover {
      opacity: 0.85;
    }
  }

  &__email {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-accent);
    letter-spacing: -0.01em;
    transition: opacity var(--transition-base);

    &:hover {
      opacity: 0.85;
    }
  }

  &__address {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__map-wrap {
    display: block;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid rgba(248, 246, 244, 0.1);
  }

  &__address-text {
    font-size: 13px;
    color: var(--color-muted);
    line-height: 1.6;
    letter-spacing: -0.01em;
  }

  &__bottom {
    border-top: 1px solid rgba(248, 246, 244, 0.1);
    padding-top: 32px;
    text-align: center;
  }

  &__copy {
    font-size: 14px;
    color: var(--color-muted);
    letter-spacing: -0.01em;

    &--small {
      font-size: 12px;
      margin-top: 6px;
      opacity: 0.7;
    }
  }

  &__copy-link {
    color: var(--color-muted);
    text-decoration: underline;
    text-underline-offset: 2px;
    transition: color var(--transition-base);

    &:hover {
      color: var(--color-accent);
    }
  }
}
</style>
