export const heroData = {
  heroBg: '/services-page/premises-liability/premise-liability-hero.webp',
  badge: 'Available 24/7 · No Upfront Fees',
  h1: 'One Hazard Changes Everything. Speak With a Premises Liability Attorney in Georgia Today.',
  h1Part1: 'One Hazard Changes',
  h1Accent: 'Everything.',
  h1Subtitle: 'Speak With a Premises Liability Attorney in Georgia Today.',
  heroBody: `Whether you slipped on an unmarked wet floor at a grocery store, tripped on a broken staircase at an apartment complex, were assaulted in a parking lot with inadequate security, or bitten by a dog on someone else's property—a property owner's negligence can turn your life upside down in an instant. The property owner's insurance company will start building their case immediately—you deserve someone in your corner just as fast.`,
  description: `Whether you slipped on an unmarked wet floor at a grocery store, tripped on a broken staircase at an apartment complex, were assaulted in a parking lot with inadequate security, or bitten by a dog on someone else's property—a property owner's negligence can turn your life upside down in an instant.\n\nAccident Professionals connects you with a vetted premises liability attorney in Georgia at no cost to you. No upfront fees. No gimmicks. Just real help when you need it most.`,
  phone: '(470) 407-2800',
  phoneHref: 'tel:4704072800',
  cta: 'Get Your Free Consultation',
  stats: [
    { value: '85', label: 'Closed Cases Assisted' },
    { value: '$2.39M+', label: 'in Total Recovery' },
    { value: '$28K+', label: 'Average Settlement' },
  ],
  urgencyBullets: [
    'Property owners build their case immediately',
    'Incident reports can waive your rights',
    'Evidence disappears quickly',
  ],
  clientCount: '100+ Clients Helped',
  caseOptions: [
    { value: 'slip-fall', label: 'Slip & Fall' },
    { value: 'negligent-security', label: 'Negligent Security' },
    { value: 'dog-bite', label: 'Dog Bite' },
    { value: 'property-hazard', label: 'Other Property Hazard' },
    { value: 'other', label: 'Other' },
  ],
  routeCaseTypeMap: {
    '/slip-and-fall': 'slip-fall',
    '/negligent-security': 'negligent-security',
    '/dog-bites': 'dog-bite',
    '/property-hazards': 'property-hazard',
  } as Record<string, string>,
  formSubject: 'New Premises Liability Consultation Request — Accident Professionals',
}

export const howItWorksData = {
  heading: 'How We Help After a Property Injury in Georgia',
  subheading: `We're not a law firm—we're the bridge between you and one. When you call Accident Professionals, you're not navigating premises liability law alone. We connect you with a vetted local premises liability attorney in Georgia, and stay alongside you to answer all your questions and provide guidance throughout your case.`,
  image: '/services-page/premises-liability/premise-liability-image.webp',
  imageAlt: 'Accident Professionals attorney consultation',
  steps: [
    {
      number: '01',
      title: 'Tell us about your injury',
      description: 'Free call, no pressure, no jargon. Just tell us what happened, where it occurred, and what conditions caused your injury.',
    },
    {
      number: '02',
      title: 'We match you with a local Georgia attorney',
      description: 'Based on your injury type, property type, and location—not a random assignment.',
    },
    {
      number: '03',
      title: 'We stay in your corner',
      description: `Communication support from consultation to settlement so you always know what's happening next.`,
    },
  ],
}

export const caseTypesData = {
  heading: 'Types of Premises Liability Cases We Handle in Georgia',
  subheading: 'Our Personal Injury Services',
  cta: 'Get Free Consultation',
  cases: [
    {
      icon: '/services-page/premises-liability/slip-and-fall.png',
      title: 'Slip & Fall',
      description: `Wet floors, uneven surfaces, broken stairs, and poor lighting are among the most common causes of serious injuries in Georgia. We connect you with a slip and fall attorney in Georgia who knows how to prove negligence and fight insurance carriers.`,
      link: '/slip-and-fall',
      linkText: 'Slip & Fall Help',
      linkAnchor: 'slip and fall attorney Georgia',
    },
    {
      icon: '/services-page/premises-liability/negligent-security.png',
      title: 'Negligent Security',
      description: `Assaults, robberies, and crimes in parking lots, hotels, apartment buildings, or retail settings can give rise to a premises liability claim when a property owner failed to provide adequate security. We connect you with a negligent security attorney in Georgia who handles these cases.`,
      link: '/negligent-security',
      linkText: 'Negligent Security Help',
      linkAnchor: 'negligent security attorney Georgia',
    },
    {
      icon: '/services-page/premises-liability/dog-bites.png',
      title: 'Dog Bites',
      description: `Property owners in Georgia may be liable for injuries caused by dogs on their premises. If you were bitten or attacked, you may have a claim. We connect you with a dog bite attorney in Georgia who understands Georgia's liability rules for animal attacks.`,
      link: '/dog-bites',
      linkText: 'Dog Bite Help',
      linkAnchor: 'dog bite attorney Georgia',
    },
    {
      icon: '/services-page/premises-liability/other-property-hazards.png',
      title: 'Other Property Hazards',
      description: `Swimming pool accidents, falling merchandise, broken railings, unmarked construction zones, and more. We match you with a premises liability attorney in Georgia who handles the full range of property injury cases.`,
      link: '/property-hazards',
      linkText: 'Property Injury Help',
      linkAnchor: 'premises liability attorney Georgia',
    },
  ],
}

export const whyUsData = {
  heading: `Why Injury Victims Choose Us Over Calling the Property Owner's Insurance First`,
  headingAccent: `Calling the Property Owner's Insurance First`,
  body1: `Here's something most people don't realize: the moment you're injured on someone else's property, their insurance carrier begins building a defense. Claims adjusters are trained to minimize payouts—and anything you say early can be used to reduce or deny your claim entirely.`,
  body2: `Accident Professionals connects you with a premises liability attorney in Georgia before you give any recorded statements, sign any incident reports, or accept any settlement offers. That changes everything.`,
  body3: `And unlike most services, we don't disappear after the introduction—we stay connected, answer your questions, and make sure you're never left guessing.`,
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
      description: `Accidents don't happen on business hours.`,
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
      description: 'Attorneys who know Georgia premises liability law and Georgia courts.',
    },
  ],
}

export const teamData = {
  heading: 'Our Attorneys',
  subheading: 'Meet our dedicated team of attorneys, committed to providing expert legal guidance and support tailored to your needs.',
}

export const stepsData = {
  heading: "What to Do After an Injury on Someone Else's Property in Georgia",
  subheading: `The steps you take—and avoid—in the hours and days after a property injury can directly affect your health, your claim, and your ability to recover full compensation. What you do matters more than most people realize.`,
  cta: 'Get Free Consultation',
  steps: [
    {
      number: '01',
      icon: '/services-page/auto-accidents/attention-icon.png',
      title: 'Get Medical Attention Right Away',
      description: `Even if your injury seems minor, see a doctor as soon as possible. Some injuries—like concussions from a fall—don't show full symptoms immediately. A medical record created close to the date of the incident is one of the strongest pieces of evidence in a premises liability case.`,
    },
    {
      number: '02',
      icon: '/services-page/auto-accidents/camera-icon.png',
      title: 'Document the Scene and the Hazard',
      description: `Take photos of everything: the wet floor, the broken step, the cracked sidewalk, the poor lighting. Get the names and contact information of any witnesses. Evidence gathered at the scene is evidence that can't disappear later.`,
    },
    {
      number: '03',
      icon: '/services-page/auto-accidents/statement-icon.png',
      title: 'Report the Incident to the Property Owner or Manager',
      description: `Make sure the property owner or manager knows what happened and documents it in writing. If they offer you a form to sign, read it carefully—some incident reports include language that could limit your rights. Don't sign anything before speaking with an attorney.`,
    },
    {
      number: '04',
      icon: '/services-page/auto-accidents/dollar-sign.svg',
      title: "Don't Accept a Quick Settlement",
      description: `Property owners and their insurance companies may offer a fast settlement before you've had time to understand the full extent of your injuries. Don't accept anything without speaking to an attorney first. A quick offer is almost always less than what you're actually owed.`,
    },
    {
      number: '05',
      icon: '/services-page/auto-accidents/arrow-next-icon.png',
      title: 'Call Accident Professionals for a Free Consultation',
      description: 'The sooner you act, the better your chances of preserving evidence and protecting your claim. Call (470) 407-2800 or get your free consultation to be connected with a vetted Georgia premises liability attorney.',
    },
  ],
}

export const faqData = {
  heading: 'Frequently Asked Questions About Premises Liability in Georgia',
  subheading: 'Common questions about premises liability in Georgia',
  items: [
    {
      question: 'What should I do immediately after being injured on someone else\'s property in Georgia?',
      answer: 'Seek medical attention, document the scene and hazard with photos, report the incident to the property owner or manager, and avoid signing anything before speaking with an attorney. Then contact Accident Professionals for a free consultation.',
    },
    {
      question: 'How long do I have to file a premises liability claim in Georgia?',
      answer: 'In most cases, two years from the date of your injury. If the property is owned by a government entity—a public school, city building, or municipal facility—the deadline can be much shorter, sometimes as little as 12 months. Acting promptly protects your rights.',
    },
    {
      question: 'What if I was partially at fault for my injury?',
      answer: 'Under Georgia\'s modified comparative fault rule, you can still recover compensation as long as you are found less than 50% responsible for your injury.',
    },
    {
      question: 'Does Accident Professionals handle all types of premises liability cases, not just slip and falls?',
      answer: 'Yes. Our network handles the full range of premises liability cases in Georgia—including slip and fall accidents, negligent security claims, dog bites, and other property hazard injuries. If you were injured on someone else\'s property, we can help.',
    },
    {
      question: 'How much does it cost to get legal help through Accident Professionals?',
      answer: `Nothing upfront. The attorneys in our network work on contingency—meaning they only get paid if you win your case or reach a settlement.`,
    },
    {
      question: 'How do I know if I actually have a premises liability case?',
      answer: 'Generally, you may have a case if you were legally on someone else\'s property, a hazardous condition existed, the owner knew or should have known about it, and you were injured as a result. The best way to know for sure is to call us—our consultations are always free and come with no obligation.',
    },
  ],
}

export const ctaBannerData = {
  heading: `Injured on Someone Else's Property? Let's Talk.`,
  headingMain: `Injured on Someone Else's Property?`,
  headingAccent: ` Let's Talk.`,
  subheading: `No pressure. No jargon. Just an honest conversation about whether you have a case.`,
  phone: '(470) 407-2800',
  phoneHref: 'tel:4704072800',
  cta: 'Get Your Free Consultation',
  formSubject: 'New Premises Liability Consultation Request — Accident Professionals',
  caseOptions: [
    { value: 'slip-fall', label: 'Slip & Fall' },
    { value: 'negligent-security', label: 'Negligent Security' },
    { value: 'dog-bite', label: 'Dog Bite' },
    { value: 'property-hazard', label: 'Other Property Hazard' },
    { value: 'other', label: 'Other' },
  ],
}
