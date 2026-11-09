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
  stateLabel: string
  statePlaceholder: string
  accidentDateLabel: string
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
  // Out-of-state fields (state ≠ Georgia)
  hospitalLabel: string
  injuriesLabel: string
  policeReportLabel: string
  policeReportPlaceholder: string
  addressLabel: string
  languageLabel: string
  languagePlaceholder: string
  languageOptions: { value: string; label: string }[]
  attachmentsLabel: string
  attachmentsDrop: string
  attachmentsBrowse: string
  attachmentsHint: string
  attachmentsRemove: string
  additionalInfoLabel: string
  additionalInfoHelp: string
  errorFile: string
  errorTooManyFiles: string
  attachmentsPartial: string
}

/** Stable option values — these are what get sent to ClickUp, independent of locale. */
export const BEST_TIME_VALUES = {
  asap: 'asap',
  endOfDay: 'end-of-day',
  specific: 'specific',
} as const

/** Stable Primary Language values — mapped to ClickUp option ids on the server. */
export const LANGUAGE_VALUES = ['english', 'spanish', 'portuguese', 'russian', 'other'] as const

export const MAX_ATTACHMENTS = 10

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
    stateLabel: 'State Where the Accident Happened',
    statePlaceholder: 'Select a state...',
    accidentDateLabel: 'Date of Accident',
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
    hospitalLabel: 'Hospital',
    injuriesLabel: 'Injuries',
    policeReportLabel: 'Police Report (Yes/No)',
    policeReportPlaceholder: 'Yes / No',
    addressLabel: 'Address',
    languageLabel: 'Language',
    languagePlaceholder: 'Select a language...',
    languageOptions: [
      { value: 'english', label: 'English' },
      { value: 'spanish', label: 'Spanish' },
      { value: 'portuguese', label: 'Portuguese' },
      { value: 'russian', label: 'Russian' },
      { value: 'other', label: 'Other' },
    ],
    attachmentsLabel: 'Attachments',
    attachmentsDrop: 'Drag & drop files here, or',
    attachmentsBrowse: 'browse',
    attachmentsHint: 'Photos, PDF or Word documents, up to 10 files.',
    attachmentsRemove: 'Remove',
    additionalInfoLabel: 'Additional Info',
    additionalInfoHelp:
      'At-Fault Party Information, PIP (Personal Injury Protection), Commercial Case / Rideshare / Amazon, Uber/Lyft Driver',
    errorFile: 'Some files were skipped: only photos, PDF or Word documents under 4 MB are accepted.',
    errorTooManyFiles: 'You can attach up to 10 files.',
    attachmentsPartial:
      "We received your request, but some files didn't upload. Our team may ask you to send them again.",
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
    stateLabel: 'Estado donde ocurrió el accidente',
    statePlaceholder: 'Seleccione un estado...',
    accidentDateLabel: 'Fecha del accidente',
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
    hospitalLabel: 'Hospital',
    injuriesLabel: 'Lesiones',
    policeReportLabel: 'Reporte policial (Sí/No)',
    policeReportPlaceholder: 'Sí / No',
    addressLabel: 'Dirección',
    languageLabel: 'Idioma',
    languagePlaceholder: 'Seleccione un idioma...',
    languageOptions: [
      { value: 'english', label: 'Inglés' },
      { value: 'spanish', label: 'Español' },
      { value: 'portuguese', label: 'Portugués' },
      { value: 'russian', label: 'Ruso' },
      { value: 'other', label: 'Otro' },
    ],
    attachmentsLabel: 'Archivos adjuntos',
    attachmentsDrop: 'Arrastre y suelte archivos aquí, o',
    attachmentsBrowse: 'búsquelos en su dispositivo',
    attachmentsHint: 'Fotos, documentos PDF o Word, hasta 10 archivos.',
    attachmentsRemove: 'Quitar',
    additionalInfoLabel: 'Información adicional',
    additionalInfoHelp:
      'Información de la parte culpable, PIP (Protección por Lesiones Personales), caso comercial / Rideshare / Amazon, conductor de Uber/Lyft',
    errorFile: 'Algunos archivos no se agregaron: solo se aceptan fotos, documentos PDF o Word de menos de 4 MB.',
    errorTooManyFiles: 'Puede adjuntar hasta 10 archivos.',
    attachmentsPartial:
      'Recibimos su solicitud, pero algunos archivos no se pudieron subir. Es posible que nuestro equipo le pida enviarlos de nuevo.',
  },
}
