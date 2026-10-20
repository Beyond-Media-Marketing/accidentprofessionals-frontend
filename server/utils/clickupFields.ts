/**
 * ClickUp custom-field IDs and option IDs for the All Leads list.
 *
 * GENERATED from the live list definition (GET /list/<id>/field) — do not hand-edit
 * the UUIDs. Regenerate if the AP team adds options or renames fields.
 *
 * Field types matter: ClickUp rejects or silently ignores a wrongly-shaped value.
 *   short_text / text / email / phone → plain string
 *   date                              → Unix epoch MILLISECONDS (number)
 *   checkbox                          → boolean
 *   drop_down                         → the OPTION's uuid (not its label)
 *   labels                            → ARRAY of option uuids (not labels)
 */

export const CF = {
  firstName: 'c2c3e3fe-7596-4cda-9ece-42d1fe5d9fd6',      // short_text
  lastName: '230e91a8-f830-4cc9-a8b4-ad8050d0a994',       // short_text
  consentGivenOn: 'fdf740f5-db24-4f5f-87c5-e860dd6c0952', // date  (epoch ms)
  consentCheckbox: 'c838d9fb-b86c-44c6-bf71-fc9ff6ee21cd',// checkbox
  dateOfAccident: 'dfef8751-72e9-47e1-927f-934c17bcb204', // date  (epoch ms)
  description: '8816d37f-5c05-4479-ac1c-6562682a47d8',    // text
  bestTimeToCall: '39076185-674f-4f32-8f56-6d5c73136bc5', // short_text
  bestDateTime: '3430e964-8dfc-413e-8b3d-290b5368028d',   // short_text
  email: 'a7dcf824-ac25-4d39-8801-054093c5ab57',          // email
  phone: 'cafd9a97-7e48-40eb-80d3-00cbd1958f5b',          // phone
  originator: 'cc4b9fce-8e3e-4431-9679-2b161aa63902',     // labels (array of ids)
  accidentState: 'f4ae277d-4b86-4dbe-9c30-6752cc8c8e37',  // drop_down (single id)
} as const

/** Accident State drop_down — option label → option id. 50 states + Puerto Rico. */
export const STATE_OPTION_IDS: Record<string, string> = {
  "Alabama": "becbe03a-aadf-4f57-999d-76e553b9c88c",
  "Alaska": "f260b63c-1502-40db-84b6-d88c9883ffe7",
  "Arizona": "d89f2b93-f759-45a7-9b9b-6e3437384d92",
  "Arkansas": "d2d6b6c6-cb62-42e4-a4eb-2723413c025b",
  "California": "316ec29e-4ab5-47e2-9e40-3ccd40efd655",
  "Colorado": "c6325216-6805-41c1-97e1-ebe693f0795e",
  "Connecticut": "ffeedee8-b379-4381-ac9d-2710eeac521a",
  "Delaware": "1ace0dcf-4a8e-45a3-a9f4-166de87d2122",
  "Florida": "ad67f07a-3cad-4da5-80c6-876e5f9dd760",
  "Georgia": "e3296f9c-cdc5-4408-a365-3d71ad381853",
  "Hawaii": "42f25930-90de-46d1-814f-9f7e10f5d969",
  "Idaho": "8fd9a63e-f58e-480d-9e8b-72e07433f8bd",
  "Illinois": "d23db04a-1f4c-45ca-9b4b-072920be663b",
  "Indiana": "8b126141-41f8-4840-b558-26970625e9df",
  "Iowa": "ad56542c-a74c-4c0e-96dc-61120aeb2edf",
  "Kansas": "6cbf36f6-a608-4e63-ae0d-b3a88c72c7f2",
  "Kentucky": "c163085a-a758-4174-ab2a-9a006a69e278",
  "Louisiana": "1da2ff60-06bf-4601-a804-613fb1332c65",
  "Maine": "e5f3d586-b552-48dd-8dca-98749484d0f1",
  "Maryland": "f3e66d66-a8aa-4292-ae3e-0eeaea4d1639",
  "Massachusetts": "1139c44d-3ce7-46ae-bc5e-45d04a6d0764",
  "Michigan": "389b6110-3cbf-4179-8a54-1316fb8e7511",
  "Minnesota": "a2881d51-8437-4084-9f7f-544da5d67e43",
  "Mississippi": "af49aece-64e6-442d-aa7e-78a58c73ae81",
  "Missouri": "442a22f5-6c0e-45fa-b0d6-1cf63883ca4a",
  "Montana": "438bcf2f-065c-46ff-b9fb-bd960fd2453d",
  "Nebraska": "22aded09-e96c-44d7-bb42-fadbf1981e6e",
  "Nevada": "02173449-48c4-40a3-b93b-116163b9b85f",
  "New Hampshire": "4a566559-7ac5-4ef6-a81d-3a122a5a1331",
  "New Jersey": "4fd60d24-fdb2-4808-a876-3ed384238676",
  "New Mexico": "dadaf38c-66e0-4828-8d66-0a1cce91b263",
  "New York": "04362e1f-f73e-4d91-aa59-f35f5be69236",
  "North Carolina": "b79fd84f-678d-431a-8d21-7ce506c0c73c",
  "North Dakota": "08075c75-36ed-4c15-bbaa-43f439460174",
  "Ohio": "457895cf-1d5d-4ec8-bd5f-6acf1cfb0cc3",
  "Oklahoma": "e0df5f28-3ba5-453b-b437-e27e12fa7239",
  "Oregon": "2d2fff54-db20-4a2f-a3e8-9a2d84bf9460",
  "Pennsylvania": "8320f921-e646-4151-ab8e-338f2bdd4844",
  "Rhode Island": "2c1f3a7c-fc06-43c6-8f24-828b4d8c18b4",
  "South Carolina": "97facee5-b7ed-4de1-afb0-b054954b2661",
  "South Dakota": "5b3a79bd-d64d-463e-9d1d-5c3ebdd05241",
  "Tennessee": "1c484cfc-c028-4b66-b772-99f64b134353",
  "Texas": "96dcf2c8-177c-438e-b59a-ce42fffa1eab",
  "Utah": "a1c132c6-ac10-4bbb-9bea-d0d2169ba47d",
  "Vermont": "beaf40b6-4ad6-44f2-b955-c9f0ac5b3c9d",
  "Virginia": "9d997c41-bcbf-40ec-a2bf-0a2fbf4265b6",
  "Washington": "b68bdcfa-388c-491b-a367-79fe0df1fad1",
  "West Virginia": "0cbe6dc8-fe37-4cc3-a681-eb9ac55660aa",
  "Wisconsin": "ea396a78-d46f-40a3-9a43-78e07667ec5b",
  "Wyoming": "99d55a05-3518-489b-a96e-59fc6224162d",
  "Puerto Rico": "7636f648-82e5-4173-8a23-b7090a1d5016"
}

/**
 * Originator(s) Name `labels` field — our rep slug → ClickUp option id.
 *
 * Only reps with an UNAMBIGUOUS match are listed. ClickUp does not create new
 * label options via the API, so a rep missing here still gets the rep TAG (and
 * therefore full attribution) but leaves this custom field unset — rather than
 * being silently attributed to the wrong person.
 *
 * Three were confirmed by the AP team against differently-spelled ClickUp options
 * (Azpiazu/Aspiazu, "Eliana", "Ingris Vargas"). Still unmapped: Martha Cordoba —
 * she has no option in ClickUp and the API cannot create one; add her in the
 * Custom Field Manager, then paste her option id here.
 */
export const ORIGINATOR_OPTION_IDS: Record<string, string> = {
  "anabel-pire": "390714b5-3faf-4284-8632-49b6591aae81",
  "chris-orellana": "8297ef42-bf2c-4b72-8685-1dd36d4edbd0",
  "dainery-rivero": "e0e85dba-14b2-410c-b88f-b05c3bb30718",
  "daniela-de-jongh": "82700418-f46d-4012-a846-ff4faf4d8888",
  "elaine-diaz": "2e4558bc-b997-4b60-a2df-29e8097ace32",
  "emil-escuela": "77fedc13-fc2e-460a-ac1c-75f6db791f52",
  "evelin-vargas": "7992bb6d-abc1-4f6f-bd4a-46debba79d2d",
  "kevin-morales": "bd8a7d9e-efb4-4761-9bb5-c7af9adde7bf",
  "lorena-cabrera": "fc9bb0dc-c286-479e-bbe4-947fd1db6a9c",
  "maloa-morales": "3d076319-295f-4e36-a6e1-b3b667662f07",
  "michelle-escuela": "b6706c6e-50ea-4153-aea9-4dbe46b44eec",
  "rita-finol": "d25a84ff-f4ec-4a76-856a-24ed1d599b7c",
  "yessika-paez": "b63ab70d-17f3-4008-92e1-f895e3c95605",
  "valeria-medina": "869e56bb-5f31-46f9-aaf9-75cc397511cb",
  "carina-aspiazu": "4456f27a-0209-48ca-98f8-0c2a358dd44d",  // ClickUp option: Carina (Marta) Azpiazu
  "eliana-azuaje": "0006d5d4-e438-4bb1-8615-21dcd576e3f7",  // ClickUp option: Eliana
  "ingris-ariza": "c8aa0e14-68ac-4639-9a9f-69a20dcf8785",  // ClickUp option: Ingris Vargas
  "jenny-de-faria": "8fbf41d8-0d24-4120-a350-b2752329102e"
}
