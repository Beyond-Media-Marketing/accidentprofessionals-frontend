<template>
  <footer class="footer">
    <div class="footer__bg" aria-hidden="true" />
    <div class="footer__inner">
      <div class="footer__top">
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
        </div>

        <div class="footer__contact">
          <p class="footer__nav-heading">Contact</p>
          <p class="footer__available">Available 24/7</p>
          <a
            :href="config.public.phoneHref"
            class="footer__phone"
            @click="gtmPush({ event: 'phone_click', location: 'footer' })"
            >{{ config.public.phone }}</a
          >
          <p class="footer__lang">English &amp; Spanish supported</p>
        </div>
      </div>

      <div class="footer__bottom">
        <p class="footer__copy">
          © {{ year }} Accident Professionals. Connecting you with legal help in
          Georgia.
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
    grid-template-columns: 1fr auto 1fr;
    gap: 40px;
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

  &__nav {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__nav-heading {
    font-size: 18px;
    font-weight: 600;
    color: var(--color-cream);
    font-family: var(--font-secondary);
    margin-bottom: 4px;
  }

  &__nav-link {
    font-size: 14px;
    color: var(--color-muted);
    letter-spacing: -0.01em;
    transition: color var(--transition-base);

    &:hover {
      color: var(--color-accent);
    }
  }

  &__contact {
    display: flex;
    flex-direction: column;
    gap: 12px;
    grid-column: 3;
    justify-self: end;

    @include tablet-down {
      grid-column: auto;
      justify-self: auto;
    }
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

  &__lang {
    font-size: 14px;
    color: var(--color-muted);
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
  }
}
</style>
