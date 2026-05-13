export const heroData = {
  heroBg: '/services-page/workplace-accidents/workplace-injury-hero.webp',
  badge: 'Available 24/7 · No Upfront Fees',
  h1: 'A Workplace Injury Changes Everything. Speak With a Workplace Accident Attorney in Georgia Today.',
  h1Part1: 'A Workplace Injury Changes',
  h1Accent: 'Everything.',
  h1Subtitle: 'Speak With a Workplace Accident Attorney in Georgia Today.',
  heroBody: `Whether it was a fall on a construction site, a warehouse forklift accident, an injury from defective equipment, or a vehicle accident while on the clock, a serious workplace injury can upend your finances, your health, and your future. Your employer's insurance company will start building their case immediately—you deserve someone in your corner just as fast.`,
  description: `Whether it was a fall on a construction site, a warehouse forklift accident, an injury from defective equipment, or a vehicle accident while on the clock, a serious workplace injury can upend your finances, your health, and your future.\n\nAccident Professionals connects you with a vetted workplace accident attorney in Georgia at no cost to you. No upfront fees. No gimmicks. Just real help when you need it most.`,
  phone: '(470)-407-2800',
  phoneHref: 'tel:+14704072800',
  cta: 'Get Your Free Consultation',
  stats: [
    { value: '85', label: 'Closed Cases Assisted' },
    { value: '$2.39M+', label: 'in Total Recovery' },
    { value: '$28K+', label: 'Average Settlement' },
  ],
  urgencyBullets: [
    `Employer's insurer builds their case immediately`,
    'Early statements can limit your benefits',
    'Filing deadlines are strict in Georgia',
  ],
  clientCount: '100+ Clients Helped',
  caseOptions: [
    { value: 'workers-comp', label: `Workers' Compensation` },
    { value: 'third-party', label: 'Third-Party Injury Claim' },
    { value: 'construction', label: 'Construction / Job Site Injury' },
    { value: 'on-road', label: 'On-the-Road Work Injury' },
    { value: 'other', label: 'Other' },
  ],
  routeCaseTypeMap: {
    '/workers-compensation': 'workers-comp',
    '/construction-accidents': 'construction',
  } as Record<string, string>,
  formSubject: 'New Workplace Accident Consultation Request — Accident Professionals',
}

export const howItWorksData = {
  heading: 'How We Help After a Workplace Injury in Georgia',
  subheading: `We're not a law firm—we're the bridge between you and one. When you call Accident Professionals, you're not navigating the workers' compensation system or the legal process alone. We connect you with a vetted local workplace accident attorney in Georgia, and stay alongside you to answer all your questions and provide guidance.`,
  image: '/services-page/workplace-accidents/workplace-injury-image.webp',
  imageAlt: 'Accident Professionals attorney consultation',
  steps: [
    {
      number: '01',
      title: 'Tell us about your injury',
      description: `Free call, no pressure, no jargon. Just tell us what happened, where, and whether your employer has been notified.`,
    },
    {
      number: '02',
      title: 'We match you with a local Georgia attorney',
      description: `Based on your injury type, industry, and location—whether you need a workers' comp specialist, a personal injury attorney, or both.`,
    },
    {
      number: '03',
      title: 'We stay in your corner',
      description: `Communication support from consultation to resolution, so you always know what's happening next.`,
    },
  ],
}

export const caseTypesData = {
  heading: 'Types of Workplace Injury Cases We Handle in Georgia',
  subheading: 'Our Personal Injury Services',
  cta: 'Get Free Consultation',
  cases: [
    {
      icon: '/services-page/workplace-accidents/workers-compensation-claims.png',
      title: `Workers' Compensation Claims`,
      description: `Georgia requires most employers to carry workers' comp insurance. If you're injured on the job, you're generally entitled to benefits regardless of fault. We connect you with a workers' compensation attorney in Georgia who knows how to protect your claim.`,
      link: '/workers-compensation',
      linkText: `Workers' Comp Help`,
      linkAnchor: 'workers compensation attorney Georgia',
    },
    {
      icon: '/services-page/workplace-accidents/third-party-personal-injury-claims.png',
      title: 'Third-Party Personal Injury Claims',
      description: `If a contractor, equipment manufacturer, or property owner contributed to your injury, you may have a claim beyond workers' comp. We connect you with an on-the-job injury lawyer in Georgia who can pursue full damages—including pain and suffering.`,
      link: '/third-party-workplace-injury',
      linkText: 'Personal Injury Help',
      linkAnchor: 'third party workplace injury claim Georgia',
    },
    {
      icon: '/services-page/workplace-accidents/construction-and-job-site-injuries.png',
      title: 'Construction & Job Site Injuries',
      description: `Falls, scaffolding collapses, heavy machinery injuries, and electrical incidents are among the most serious workplace injuries in Georgia. We connect you with a construction accident attorney in Georgia who understands site liability and contractor responsibility.`,
      link: '/construction-accidents',
      linkText: 'Construction Injuries Help',
      linkAnchor: 'construction accident attorney Georgia',
    },
    {
      icon: '/services-page/workplace-accidents/on-the-road-injuries.png',
      title: 'On-the-Road Work Injuries',
      description: `Delivery drivers, field workers, and anyone injured in a vehicle accident while on the clock may qualify for both workers' compensation and a personal injury claim. We match you with a workplace accident attorney in Georgia who handles dual-claim cases.`,
      link: '/on-road-work-injuries',
      linkText: 'On-the-Road Injuries Help',
      linkAnchor: 'on the job injury lawyer Georgia',
    },
  ],
}

export const whyUsData = {
  heading: `Why Injured Workers Choose Us Over Filing Alone`,
  headingAccent: `Filing Alone`,
  body1: `Here's something most injured workers don't realize: filing a workers' compensation claim without legal guidance can limit your recovery before it even begins. Insurance carriers and employers have claims adjusters whose job is to minimize payouts—and they move fast.`,
  body2: `Accident Professionals connects you with a workplace accident attorney in Georgia before you sign anything, record any statements, or accept any offers. That changes everything.`,
  body3: `And unlike most services, we don't disappear after the introduction—we stay connected, answer your questions, and make sure you're never left guessing where your case stands.`,
  features: [
    {
      iconGrey: '/services-page/why-us-icons/dollar-grey.svg',
      iconYellow: '/services-page/why-us-icons/dollar-yellow.svg',
      title: 'No upfront fees — ever',
      description: 'Attorneys work on contingency.',
    },
    {
      iconGrey: '/services-page/why-us-icons/clock-grey.svg',
      iconYellow: '/services-page/why-us-icons/clock-yellow.svg',
      title: '24/7 availability',
      description: `Injuries don't happen on business hours.`,
    },
    {
      iconGrey: '/services-page/why-us-icons/globe-grey.svg',
      iconYellow: '/services-page/why-us-icons/globe-yellow.svg',
      title: 'Multilingual support',
      description: 'English, Spanish.',
    },
    {
      iconGrey: '/services-page/why-us-icons/pin-grey.svg',
      iconYellow: '/services-page/why-us-icons/pin-yellow.svg',
      title: 'Local expertise',
      description: `Attorneys who know Georgia workers' comp law and Georgia courts.`,
    },
  ],
}

export const teamData = {
  heading: 'Our Attorneys',
  subheading: 'Meet our dedicated team of attorneys, committed to providing expert legal guidance and support tailored to your needs.',
}

export const stepsData = {
  heading: 'What to Do After a Workplace Injury in Georgia',
  subheading: `The steps you take—and avoid—in the hours after a workplace injury can directly affect your health, your workers' compensation benefits, and your ability to recover full compensation. Here's what matters most.`,
  cta: 'Get Free Consultation',
  steps: [
    {
      number: '01',
      icon: '/services-page/auto-accidents/phone-icon.png',
      title: 'Report the Injury to Your Employer Immediately',
      description: `Georgia law requires you to report a workplace injury within 30 days. Failing to do so can jeopardize your entire claim. Report it in writing and keep a copy.`,
    },
    {
      number: '02',
      icon: '/services-page/auto-accidents/attention-icon.png',
      title: 'Seek Medical Attention Right Away',
      description: `Some injuries don't show symptoms immediately. Getting evaluated promptly protects your health and creates a documented record—both of which are critical to your case.`,
    },
    {
      number: '03',
      icon: '/services-page/auto-accidents/camera-icon.png',
      title: 'Document Everything',
      description: `Take photos of the scene, your injuries, and any equipment involved. Collect the names of supervisors and coworkers who witnessed the incident. Evidence gathered early is evidence that can't disappear.`,
    },
    {
      number: '04',
      icon: '/services-page/auto-accidents/statement-icon.png',
      title: `Don't Sign Anything Without Speaking to an Attorney`,
      description: `Employers and insurance carriers may ask you to sign forms or recorded statements quickly. Don't—until you've spoken with an attorney. What you agree to early can limit what you're owed.`,
    },
    {
      number: '05',
      icon: '/services-page/auto-accidents/arrow-next-icon.png',
      title: 'Call Accident Professionals for a Free Consultation',
      description: `The sooner you act, the stronger your case. Call (470)-407-2800 or get your free consultation to be connected with a vetted Georgia workplace accident attorney who can protect your rights from day one.`,
    },
  ],
}

export const faqData = {
  heading: 'Frequently Asked Questions About Workplace Accidents in Georgia',
  subheading: 'Common questions about workplace injuries in Georgia',
  items: [
    {
      question: 'What should I do immediately after a workplace injury in Georgia?',
      answer: `Report the injury to your employer in writing, seek medical attention, document the scene, and avoid signing any forms before speaking with an attorney. Then contact Accident Professionals for a free consultation.`,
    },
    {
      question: `How long do I have to file a workers' compensation claim in Georgia?`,
      answer: `You must report your injury within 30 days and file a claim within one year from the date of injury or the last payment of benefits. Acting promptly protects your rights.`,
    },
    {
      question: 'Can I sue my employer after a workplace accident in Georgia?',
      answer: `In most cases, workers' compensation is your exclusive remedy against your employer. However, if a third party—such as a contractor, equipment manufacturer, or property owner—contributed to your injury, you may have a separate personal injury claim.`,
    },
    {
      question: 'Does Accident Professionals handle all types of workplace injuries, not just one industry?',
      answer: `Yes. Our network handles workplace injuries across all industries—construction, warehouse, healthcare, delivery, office, retail, and more. If you were injured on the job in Georgia, we can help.`,
    },
    {
      question: 'How much does it cost to get legal help through Accident Professionals?',
      answer: `Nothing upfront. The attorneys in our network work on contingency—meaning they only get paid if you win your case or reach a settlement.`,
    },
    {
      question: `What if my workers' compensation claim is denied?`,
      answer: `You can appeal. An attorney in our network can review your case, identify the reason for denial, and represent you through the Georgia State Board of Workers' Compensation appeals process.`,
    },
  ],
}

export const ctaBannerData = {
  heading: `Injured at Work? Let's Talk.`,
  headingMain: `Injured at Work?`,
  headingAccent: ` Let's Talk.`,
  subheading: `No pressure. No jargon. And no—your employer doesn't have to know you called.`,
  phone: '(470)-407-2800',
  phoneHref: 'tel:+14704072800',
  cta: 'Get Your Free Consultation',
  formSubject: 'New Workplace Accident Consultation Request — Accident Professionals',
}
