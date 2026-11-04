/**
 * Fallback case-type options for forms whose CMS block has none. Values stay
 * English (they land in the sales inbox); labels follow the visitor's language.
 */
export const defaultCaseOptions = (t: (key: string) => string) => [
  { value: 'car', label: t('caseTypes.car') },
  { value: 'truck', label: t('caseTypes.truck') },
  { value: 'rideshare', label: t('caseTypes.rideshare') },
  { value: 'slip-fall', label: t('caseTypes.slipFall') },
  { value: 'workplace', label: t('caseTypes.workplace') },
  { value: 'motorcycle', label: t('caseTypes.motorcycle') },
  { value: 'other', label: t('caseTypes.other') },
]
