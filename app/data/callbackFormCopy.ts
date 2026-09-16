/**
 * EN/ES copy for the rep call-back form (/forms/callback/[rep]).
 *
 * Transcribed from the two existing ClickUp forms so the wording — especially the
 * consent and "not a law firm" disclosures — stays identical to what legal approved.
 * Keep both locales in sync: every key must exist in both.
 */
export type Locale = 'en' | 'es'

export interface CallbackCopy {
  langLabel: string
  title: string
  intro: string
  nameLabel: string
  namePlaceholder: string
  detailsLabel: string
  detailsPlaceholder: string
  bestTimeLabel: string
  bestTimePlaceholder: string
  bestTimeOptions: { value: string; label: string }[]
  specificTimeLabel: string
  specificTimePlaceholder: string
  emailLabel: string
  emailPlaceholder: string
  phoneLabel: string
  phonePlaceholder: string
  consentLabel: string
  consentText: string
  disclaimer: string
  submit: string
  submitting: string
  success: string
  errorGeneric: string
  errorConsent: string
  errorRequired: string
  optional: string
}

/** Stable option values — these are what get sent to ClickUp, independent of locale. */
export const BEST_TIME_VALUES = {
  asap: 'asap',
  endOfDay: 'end-of-day',
  specific: 'specific',
} as const

export const CALLBACK_COPY: Record<Locale, CallbackCopy> = {
  en: {
    langLabel: 'EN',
    title: 'Accident Professionals — Call Back Form',
    intro:
      'Hello, thank you for reaching out to us. Please fill this form, and our team will reach out to you as soon as possible!',
    nameLabel: 'Your Full Name',
    namePlaceholder: 'Enter text',
    detailsLabel: 'What happened? How can we assist?',
    detailsPlaceholder: 'Enter text',
    bestTimeLabel: 'Best Time To Call?',
    bestTimePlaceholder: 'Select option...',
    bestTimeOptions: [
      { value: BEST_TIME_VALUES.asap, label: 'As soon as possible' },
      { value: BEST_TIME_VALUES.endOfDay, label: 'By end of day' },
      { value: BEST_TIME_VALUES.specific, label: 'Specific date & time' },
    ],
    specificTimeLabel: 'What date & time works best?',
    specificTimePlaceholder: 'e.g. Tomorrow at 3pm',
    emailLabel: 'Your Email',
    emailPlaceholder: 'Enter email',
    phoneLabel: 'Your Phone Number',
    phonePlaceholder: 'Enter phone',
    consentLabel: 'Contact Consent',
    consentText:
      'I consent to be contacted by Accident Professionals and its partners regarding my inquiry, including by phone, text message, and/or email. Consent is not a condition of any commitment. Message and data rates may apply. Reply STOP to opt out of text messages.',
    disclaimer:
      'Accident Professionals is not a law firm. We are a marketing service that connects individuals with independent third-party attorneys and professionals. We do not provide legal or medical advice. Submitting this form does not create an attorney-client relationship.',
    submit: 'Submit',
    submitting: 'Sending…',
    success: "Thank you! We've received your request and our team will call you shortly.",
    errorGeneric: 'Something went wrong. Please try again, or call us directly.',
    errorConsent: 'Please agree to the contact consent to continue.',
    errorRequired: 'Please fill in all required fields.',
    optional: 'optional',
  },
  es: {
    langLabel: 'ES',
    title: 'Accident Professionals — Formulario de Llamada',
    intro:
      'Hola, gracias por contactarnos. Por favor complete este formulario y nuestro equipo se comunicará con usted lo antes posible.',
    nameLabel: 'Nombre y Apellido',
    namePlaceholder: 'Escriba aquí',
    detailsLabel: '¿Qué ocurrió? ¿Cómo podemos ayudarle?',
    detailsPlaceholder: 'Escriba aquí',
    bestTimeLabel: '¿Cuál es el mejor momento para llamar?',
    bestTimePlaceholder: 'Seleccione una opción...',
    bestTimeOptions: [
      { value: BEST_TIME_VALUES.asap, label: 'Lo antes posible' },
      { value: BEST_TIME_VALUES.endOfDay, label: 'Antes de que termine el día' },
      { value: BEST_TIME_VALUES.specific, label: 'Fecha y hora específica' },
    ],
    specificTimeLabel: '¿Qué fecha y hora le conviene?',
    specificTimePlaceholder: 'ej. Mañana a las 3pm',
    emailLabel: 'Correo electrónico',
    emailPlaceholder: 'Escriba su correo',
    phoneLabel: 'Número de teléfono',
    phonePlaceholder: 'Escriba su teléfono',
    consentLabel: 'Consentimiento de Contacto',
    consentText:
      'Autorizo a Accident Professionals y a sus socios a comunicarse conmigo respecto a mi consulta, incluso por teléfono, mensaje de texto y/o correo electrónico. Esta autorización no es una condición de ningún compromiso. Pueden aplicarse tarifas de mensajes y datos. Responda STOP para dejar de recibir mensajes de texto.',
    disclaimer:
      'Accident Professionals no es un bufete de abogados. Somos un servicio de publicidad que conecta a personas con abogados y profesionales independientes de terceros. No proporcionamos asesoramiento legal ni médico. El envío de este formulario no crea una relación abogado-cliente.',
    submit: 'Enviar',
    submitting: 'Enviando…',
    success: 'Gracias. Hemos recibido su solicitud y nuestro equipo le llamará en breve.',
    errorGeneric: 'Algo salió mal. Inténtelo de nuevo o llámenos directamente.',
    errorConsent: 'Por favor acepte el consentimiento de contacto para continuar.',
    errorRequired: 'Por favor complete todos los campos obligatorios.',
    optional: 'opcional',
  },
}
