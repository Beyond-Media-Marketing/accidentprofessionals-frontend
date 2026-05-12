<template>
  <div>
    <HeroSection :data="hero" />
    <HowItWorksSection :data="howItWorks" />
    <CaseTypesSection :data="caseTypes" />
    <WhyUsSection :data="whyUs" />
    <TeamSection :data="team" />
    <CtaBanner :data="ctaBanner" />
    <StepsSection :data="steps" />
    <FaqSection :data="faq" />
    <ContactSection :data="ctaBanner" />
  </div>
</template>

<script setup lang="ts">
import {
  heroData as hero,
  howItWorksData as howItWorks,
  caseTypesData as caseTypes,
  whyUsData as whyUs,
  teamData as team,
  stepsData as steps,
  faqData as faq,
  ctaBannerData as ctaBanner,
} from '~/data/workplace-accidents'

// ── SEO meta ──────────────────────────────────────────────────────────────────
useSeoMeta({
  title: 'Workplace Accident Attorney Georgia | Free Consultation',
  description: `Injured at work in Georgia? Get connected with a workplace accident attorney today. Workers' comp, third-party claims, and more. Free consultation. No upfront fees.`,
  ogTitle: 'Workplace Accident Attorney Georgia | Free Consultation',
  ogDescription: `Injured at work in Georgia? Get connected with a workplace accident attorney today. Free consultation. No upfront fees.`,
  ogType: 'website',
  ogUrl: 'https://accidentprofessionals.com/workplace-accidents/',
  ogImage: '/services-page/auto-accidents/hero-bg.png',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Workplace Accident Attorney Georgia | Free Consultation',
  twitterDescription: `Injured at work in Georgia? Free consultation. No upfront fees.`,
  robots: 'index, follow',
})

// ── Canonical + JSON-LD schemas ───────────────────────────────────────────────
useHead({
  link: [
    { rel: 'canonical', href: 'https://accidentprofessionals.com/workplace-accidents/' },
  ],
  script: [
    // 1. WebPage
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Workplace Accident Attorney Georgia | Free Consultation',
        description: `Injured at work in Georgia? Get connected with a workplace accident attorney today. Free consultation. No upfront fees.`,
        url: 'https://accidentprofessionals.com/workplace-accidents/',
        inLanguage: 'en-US',
        isPartOf: {
          '@type': 'WebSite',
          name: 'Accident Professionals',
          url: 'https://accidentprofessionals.com',
        },
      }),
    },
    // 2. LegalService
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'LegalService',
        name: 'Accident Professionals',
        description: `Accident Professionals connects workplace injury victims in Georgia with vetted personal injury and workers' compensation attorneys. No upfront fees. Available 24/7.`,
        url: 'https://accidentprofessionals.com',
        telephone: '+14704072800',
        areaServed: {
          '@type': 'State',
          name: 'Georgia',
          sameAs: 'https://en.wikipedia.org/wiki/Georgia_(U.S._state)',
        },
        priceRange: '$0 upfront — contingency fee',
        openingHours: 'Mo-Su 00:00-23:59',
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Workplace Injury Legal Services',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: `Workers' Compensation Attorney Referral` } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Third-Party Workplace Injury Attorney Referral' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Construction Accident Attorney Referral' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'On-the-Road Work Injury Attorney Referral' } },
          ],
        },
      }),
    },
    // 3. BreadcrumbList
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://accidentprofessionals.com/' },
          { '@type': 'ListItem', position: 2, name: 'Workplace Accidents', item: 'https://accidentprofessionals.com/workplace-accidents/' },
        ],
      }),
    },
    // 4. FAQPage
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      }),
    },
  ],
})

useScrollReveal()
</script>
