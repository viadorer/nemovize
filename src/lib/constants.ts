export const PROPERTY_TYPES = [
  { value: "byt", label: "Byt" },
  { value: "dum", label: "D\u016Fm" },
  { value: "pozemek", label: "Pozemek" },
  { value: "komercni", label: "Komer\u010Dn\u00ED" },
] as const

export const TRANSACTION_TYPES = [
  { value: "prodej", label: "Prodej" },
  { value: "pronajem", label: "Pron\u00E1jem" },
] as const

export const PROPERTY_STATUSES = [
  { value: "draft", label: "Koncept" },
  { value: "active", label: "Aktivn\u00ED" },
  { value: "reserved", label: "Rezervov\u00E1no" },
  { value: "sold", label: "Prod\u00E1no" },
] as const

export const CLIENT_STATUSES = [
  { value: "lead", label: "Lead" },
  { value: "active", label: "Aktivn\u00ED" },
  { value: "closed", label: "Uzav\u0159en\u00FD" },
] as const

export const CLIENT_SOURCES = [
  { value: "web", label: "Web" },
  { value: "referral", label: "Doporu\u010Den\u00ED" },
  { value: "ad", label: "Reklama" },
  { value: "direct", label: "P\u0159\u00EDm\u00FD kontakt" },
] as const

export const CONSTRUCTION_TYPES = [
  { value: "brick", label: "Cihla" },
  { value: "panel", label: "Panel" },
  { value: "wood", label: "D\u0159evo" },
  { value: "mixed", label: "Sm\u00ED\u0161en\u00E1" },
  { value: "other", label: "Jin\u00E9" },
] as const

export const CONDITION_TYPES = [
  { value: "new", label: "Novostavba" },
  { value: "excellent", label: "V\u00FDborn\u00FD" },
  { value: "good", label: "Dobr\u00FD" },
  { value: "fair", label: "P\u0159ed rekonstrukc\u00ED" },
  { value: "poor", label: "Vy\u017Eaduje rekonstrukci" },
] as const

export const ENERGY_RATINGS = ["A", "B", "C", "D", "E", "F", "G"] as const

export const OWNERSHIP_TYPES = [
  { value: "personal", label: "Osobn\u00ED" },
  { value: "cooperative", label: "Dru\u017Estevn\u00ED" },
  { value: "municipal", label: "Obecn\u00ED" },
] as const

export const USER_ROLES = [
  { value: "owner", label: "Vlastn\u00EDk" },
  { value: "admin", label: "Administr\u00E1tor" },
  { value: "consultant", label: "Konzultant" },
  { value: "viewer", label: "N\u00E1hled" },
] as const
