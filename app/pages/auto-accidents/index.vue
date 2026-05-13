<template>
  <div>
    <HeroSection />
    <HowItWorksSection />
    <CaseTypesSection />
    <WhyUsSection />
    <TeamSection />
    <CtaBanner />
    <StepsSection />
    <FaqSection />
    <ContactSection />
  </div>
</template>

<script setup lang="ts">
import { faqData } from "~/data/auto-accidents";

// ── SEO meta ──────────────────────────────────────────────────────────────────
useSeoMeta({
  title: "Auto Accident Attorney Georgia | Free Consultation",
  description:
    "Injured in a car, truck, motorcycle, or rideshare accident in Georgia? Get connected with an attorney today. Free consultation. No upfront fees.",
  ogTitle: "Auto Accident Attorney Georgia | Free Consultation",
  ogDescription:
    "Injured in a car, truck, motorcycle, or rideshare accident in Georgia? Get connected with an attorney today. Free consultation. No upfront fees.",
  ogType: "website",
  ogUrl: "https://accidentprofessionals.com/auto-accidents/",
  ogImage: "/services-page/auto-accidents/hero-bg.webp",
  twitterCard: "summary_large_image",
  twitterTitle: "Auto Accident Attorney Georgia | Free Consultation",
  twitterDescription:
    "Injured in a car, truck, motorcycle, or rideshare accident in Georgia? Free consultation. No upfront fees.",
  robots: "index, follow",
});

// ── Canonical + JSON-LD schemas ───────────────────────────────────────────────
useHead({
  link: [
    {
      rel: "canonical",
      href: "https://accidentprofessionals.com/auto-accidents/",
    },
  ],
  script: [
    // 1. WebPage
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Auto Accident Attorney Georgia | Free Consultation",
        description:
          "Injured in a car, truck, motorcycle, or rideshare accident in Georgia? Get connected with an attorney today. Free consultation. No upfront fees.",
        url: "https://accidentprofessionals.com/auto-accidents/",
        inLanguage: "en-US",
        isPartOf: {
          "@type": "WebSite",
          name: "Accident Professionals",
          url: "https://accidentprofessionals.com",
        },
      }),
    },
    // 2. LegalService
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LegalService",
        name: "Accident Professionals",
        description:
          "Accident Professionals connects auto accident victims in Georgia with vetted personal injury attorneys. No upfront fees. Available 24/7.",
        url: "https://accidentprofessionals.com",
        telephone: "+14704072800",
        areaServed: {
          "@type": "State",
          name: "Georgia",
          sameAs: "https://en.wikipedia.org/wiki/Georgia_(U.S._state)",
        },
        priceRange: "$0 upfront — contingency fee",
        openingHours: "Mo-Su 00:00-23:59",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Auto Accident Legal Services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Car Accident Attorney Referral",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Truck Accident Attorney Referral",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Motorcycle Accident Attorney Referral",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Rideshare Accident Attorney Referral",
              },
            },
          ],
        },
      }),
    },
    // 3. BreadcrumbList
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://accidentprofessionals.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Auto Accidents",
            item: "https://accidentprofessionals.com/auto-accidents/",
          },
        ],
      }),
    },
    // 4. FAQPage
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqData.items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }),
    },
  ],
});

// ── Init scroll reveal ────────────────────────────────────────────────────────
useScrollReveal();
</script>
