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
} from '~/data/premises-liability'

// ── SEO meta ──────────────────────────────────────────────────────────────────
useSeoMeta({
  title: 'Premises Liability Attorney Georgia | Free Consultation',
  description: 'Injured on someone else\'s property in Georgia? Get connected with a premises liability attorney today. Slip & fall, negligent security, dog bites, and more. Free consultation. No upfront fees.',
  ogTitle: 'Premises Liability Attorney Georgia | Free Consultation',
  ogDescription: 'Injured on someone else\'s property in Georgia? Get connected with a premises liability attorney today. Free consultation. No upfront fees.',
  ogType: 'website',
  ogUrl: 'https://accidentprofessionals.com/premises-liability/',
  ogImage: '/services-page/auto-accidents/hero-bg.png',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Premises Liability Attorney Georgia | Free Consultation',
  twitterDescription: 'Injured on someone else\'s property in Georgia? Free consultation. No upfront fees.',
  robots: 'index, follow',
})

// ── Canonical + JSON-LD schemas ───────────────────────────────────────────────
useHead({
  link: [
    { rel: 'canonical', href: 'https://accidentprofessionals.com/premises-liability/' },
  ],
  script: [
    // 1. WebPage
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Premises Liability Attorney Georgia | Free Consultation',
        description: 'Injured on someone else\'s property in Georgia? Get connected with a premises liability attorney today. Free consultation. No upfront fees.',
        url: 'https://accidentprofessionals.com/premises-liability/',
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
        description: 'Accident Professionals connects premises liability victims in Georgia with vetted personal injury attorneys. No upfront fees. Available 24/7.',
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
          name: 'Premises Liability Legal Services',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Slip & Fall Attorney Referral' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Negligent Security Attorney Referral' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Dog Bite Attorney Referral' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Property Hazard Attorney Referral' } },
          ],
        },
      }),
    },
    // 3. LocalBusiness
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': 'https://accidentprofessionals.com',
        name: 'Accident Professionals',
        url: 'https://accidentprofessionals.com',
        telephone: '+14704072800',
        openingHours: 'Mo-Su 00:00-23:59',
        areaServed: {
          '@type': 'State',
          name: 'Georgia',
        },
        priceRange: '$0 upfront',
      }),
    },
    // 4. BreadcrumbList
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://accidentprofessionals.com/' },
          { '@type': 'ListItem', position: 2, name: 'Premises Liability', item: 'https://accidentprofessionals.com/premises-liability/' },
        ],
      }),
    },
    // 5. FAQPage
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
