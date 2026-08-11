/**
 * Condition Mapping Table
 *
 * Maps condition names from SCIN and DDI datasets to the app's unified
 * vocabulary. Each entry specifies whether the condition is cancerous,
 * the cancer risk score (0-100), cancer type, severity, and urgency level.
 *
 * This is the single source of truth for condition → cancer metadata.
 * Both the training pipeline and the inference module import this table.
 */

export type Severity = 'low' | 'moderate' | 'high' | 'none';
export type CancerRiskLevel = 'no_risk' | 'low_risk' | 'moderate_risk' | 'high_risk';
export type Urgency = 'routine' | 'see_doctor' | 'urgent';

export interface ConditionEntry {
  /** Canonical name used in the app */
  canonical: string;
  /** Whether this condition is cancer */
  isCancer: boolean;
  /** Cancer risk score 0-100 */
  cancerRiskScore: number;
  /** Cancer type if cancerous, null otherwise */
  cancerType: string | null;
  /** Severity level */
  severity: Severity;
  /** Urgency level */
  urgency: Urgency;
  /** Cancer description shown to user */
  cancerDescription: string;
  /** All known aliases from source datasets */
  aliases: string[];
}

export const CONDITION_MAP: ConditionEntry[] = [
  // ===== CANCERS =====
  {
    canonical: 'Melanoma',
    isCancer: true,
    cancerRiskScore: 88,
    cancerType: 'Melanoma',
    severity: 'high',
    urgency: 'urgent',
    cancerDescription:
      'Melanoma is the most dangerous form of skin cancer. While less common in melanin-rich skin, ' +
      'it is often diagnosed at a later stage, making early detection critical. Acral lentiginous ' +
      'melanoma (on palms, soles, and nail beds) is the most common type in people of color.',
    aliases: [
      'melanoma',
      'malignant melanoma',
      'nodular melanoma',
      'superficial spreading melanoma',
      'acral lentiginous melanoma',
      'lentigo maligna melanoma',
    ],
  },
  {
    canonical: 'Basal Cell Carcinoma',
    isCancer: true,
    cancerRiskScore: 65,
    cancerType: 'Basal Cell Carcinoma',
    severity: 'high',
    urgency: 'see_doctor',
    cancerDescription:
      'Basal Cell Carcinoma is the most common and least dangerous form of skin cancer. ' +
      'It grows slowly and rarely spreads, but should still be treated promptly by a dermatologist.',
    aliases: [
      'basal cell carcinoma',
      'bcc',
      'basal cell epithelioma',
      'nodular basal cell carcinoma',
      'superficial basal cell carcinoma',
    ],
  },
  {
    canonical: 'Squamous Cell Carcinoma',
    isCancer: true,
    cancerRiskScore: 72,
    cancerType: 'Squamous Cell Carcinoma',
    severity: 'high',
    urgency: 'see_doctor',
    cancerDescription:
      'Squamous Cell Carcinoma is the second most common skin cancer. It can spread to lymph ' +
      'nodes if left untreated, so prompt medical evaluation is important.',
    aliases: [
      'squamous cell carcinoma',
      'scc',
      'squamous cell carcinoma in situ',
      'bowen disease',
      "bowen's disease",
    ],
  },
  {
    canonical: 'Merkel Cell Carcinoma',
    isCancer: true,
    cancerRiskScore: 82,
    cancerType: 'Merkel Cell Carcinoma',
    severity: 'high',
    urgency: 'urgent',
    cancerDescription:
      'Merkel Cell Carcinoma is a rare, aggressive skin cancer that grows quickly and can spread ' +
      'rapidly. Immediate medical evaluation is essential.',
    aliases: ['merkel cell carcinoma', 'mcc', 'neuroendocrine carcinoma of skin'],
  },
  {
    canonical: 'Dermatofibrosarcoma Protuberans',
    isCancer: true,
    cancerRiskScore: 70,
    cancerType: 'Dermatofibrosarcoma Protuberans',
    severity: 'high',
    urgency: 'see_doctor',
    cancerDescription:
      'A rare, slow-growing soft tissue cancer that develops in the dermis. ' +
      'Surgical excision is the primary treatment.',
    aliases: ['dermatofibrosarcoma protuberans', 'dfsp'],
  },
  {
    canonical: 'Atypical Fibroxanthoma',
    isCancer: true,
    cancerRiskScore: 60,
    cancerType: 'Atypical Fibroxanthoma',
    severity: 'high',
    urgency: 'see_doctor',
    cancerDescription:
      'A rare skin tumor that typically occurs on sun-damaged skin of older individuals. ' +
      'Usually low-grade but requires surgical excision.',
    aliases: ['atypical fibroxanthoma', 'afx'],
  },

  // ===== PRE-CANCEROUS =====
  {
    canonical: 'Actinic Keratosis',
    isCancer: false,
    cancerRiskScore: 38,
    cancerType: null,
    severity: 'moderate',
    urgency: 'see_doctor',
    cancerDescription:
      'Actinic Keratosis is a pre-cancerous lesion that has the potential to develop into ' +
      'squamous cell carcinoma. It is not cancer yet, but should be evaluated and monitored ' +
      'by a dermatologist.',
    aliases: [
      'actinic keratosis',
      'solar keratosis',
      'actinic keratoses',
      'hypertrophic actinic keratosis',
    ],
  },
  {
    canonical: 'Dysplastic Nevus',
    isCancer: false,
    cancerRiskScore: 30,
    cancerType: null,
    severity: 'moderate',
    urgency: 'see_doctor',
    cancerDescription:
      'An atypical mole that is not cancer but has abnormal features. Some dysplastic nevi ' +
      'can develop into melanoma over time, so regular dermatological monitoring is recommended.',
    aliases: [
      'dysplastic nevus',
      'atypical nevus',
      'atypical mole',
      'dysplastic nevi',
      'atypical melanocytic nevus',
      'clark nevus',
    ],
  },

  // ===== BENIGN NEVI / MOLES =====
  {
    canonical: 'Benign Nevus',
    isCancer: false,
    cancerRiskScore: 8,
    cancerType: null,
    severity: 'low',
    urgency: 'routine',
    cancerDescription:
      'No cancer indicators detected. This is a common, benign mole. Regular self-monitoring ' +
      'is recommended but no treatment is needed unless changes occur.',
    aliases: [
      'nevus',
      'melanocytic nevus',
      'intradermal nevus',
      'compound nevus',
      'junctional nevus',
      'congenital nevus',
      'halo nevus',
      'spitz nevus',
      'blue nevus',
      'common acquired nevus',
      'benign melanocytic nevus',
    ],
  },
  {
    canonical: 'Seborrheic Keratosis',
    isCancer: false,
    cancerRiskScore: 5,
    cancerType: null,
    severity: 'low',
    urgency: 'routine',
    cancerDescription:
      'No cancer indicators detected. Seborrheic keratosis is a common, harmless, benign ' +
      'skin growth that does not require treatment unless cosmetically bothersome.',
    aliases: [
      'seborrheic keratosis',
      'seborrheic keratoses',
      'senile wart',
      'stucco keratosis',
      'inverted follicular keratosis',
    ],
  },

  // ===== INFLAMMATORY / DERMATITIS =====
  {
    canonical: 'Eczema',
    isCancer: false,
    cancerRiskScore: 3,
    cancerType: null,
    severity: 'moderate',
    urgency: 'routine',
    cancerDescription:
      'No cancer indicators detected. Eczema is a benign inflammatory condition and does ' +
      'not increase cancer risk.',
    aliases: [
      'eczema',
      'atopic dermatitis',
      'nummular eczema',
      'eczematous dermatitis',
      'acute and chronic dermatitis',
      'contact dermatitis',
      'seborrheic dermatitis',
      'stasis dermatitis',
      'neurodermatitis',
      'dyshidrotic eczema',
      'pompholyx',
    ],
  },
  {
    canonical: 'Psoriasis',
    isCancer: false,
    cancerRiskScore: 3,
    cancerType: null,
    severity: 'moderate',
    urgency: 'routine',
    cancerDescription:
      'No cancer indicators detected. Psoriasis is a benign autoimmune condition and does ' +
      'not increase cancer risk.',
    aliases: [
      'psoriasis',
      'psoriasis vulgaris',
      'plaque psoriasis',
      'guttate psoriasis',
      'pustular psoriasis',
      'erythrodermic psoriasis',
      'inverse psoriasis',
    ],
  },

  // ===== ACNE / FOLLICULAR =====
  {
    canonical: 'Acne Vulgaris',
    isCancer: false,
    cancerRiskScore: 4,
    cancerType: null,
    severity: 'low',
    urgency: 'routine',
    cancerDescription:
      'No cancer indicators detected. Acne is a benign (non-cancerous) skin condition and ' +
      'does not increase cancer risk.',
    aliases: ['acne', 'acne vulgaris', 'acne rosacea', 'rosacea', 'folliculitis'],
  },

  // ===== PIGMENTATION =====
  {
    canonical: 'Post-Inflammatory Hyperpigmentation',
    isCancer: false,
    cancerRiskScore: 2,
    cancerType: null,
    severity: 'low',
    urgency: 'routine',
    cancerDescription:
      'No cancer indicators detected. PIH is a benign pigmentation response and does not ' +
      'indicate cancer.',
    aliases: [
      'post-inflammatory hyperpigmentation',
      'post inflammatory hyperpigmentation',
      'pih',
      'postinflammatory hyperpigmentation',
    ],
  },
  {
    canonical: 'Melasma',
    isCancer: false,
    cancerRiskScore: 5,
    cancerType: null,
    severity: 'moderate',
    urgency: 'routine',
    cancerDescription:
      'No cancer indicators detected. Melasma is a benign pigmentation condition and does ' +
      'not increase cancer risk.',
    aliases: ['melasma', 'chloasma', 'mask of pregnancy'],
  },
  {
    canonical: 'Vitiligo',
    isCancer: false,
    cancerRiskScore: 4,
    cancerType: null,
    severity: 'moderate',
    urgency: 'routine',
    cancerDescription:
      'No cancer indicators detected. Vitiligo is an autoimmune condition affecting ' +
      'pigmentation and is not cancerous.',
    aliases: ['vitiligo', 'segmental vitiligo', 'non-segmental vitiligo'],
  },

  // ===== INFECTIONS =====
  {
    canonical: 'Tinea Versicolor',
    isCancer: false,
    cancerRiskScore: 2,
    cancerType: null,
    severity: 'low',
    urgency: 'routine',
    cancerDescription:
      'No cancer indicators detected. Tinea versicolor is a benign fungal infection and ' +
      'does not indicate cancer.',
    aliases: ['tinea versicolor', 'pityriasis versicolor', 'tinea', 'fungal infection'],
  },
  {
    canonical: 'Tinea Corporis',
    isCancer: false,
    cancerRiskScore: 2,
    cancerType: null,
    severity: 'low',
    urgency: 'routine',
    cancerDescription:
      'No cancer indicators detected. Ringworm is a benign fungal infection and does not ' +
      'indicate cancer.',
    aliases: ['tinea corporis', 'ringworm', 'tinea cruris', 'tinea pedis'],
  },

  // ===== SCARRING / FIBROTIC =====
  {
    canonical: 'Keloid Scarring',
    isCancer: false,
    cancerRiskScore: 6,
    cancerType: null,
    severity: 'moderate',
    urgency: 'routine',
    cancerDescription:
      'No cancer indicators detected. Keloids are benign scar tissue and do not indicate ' +
      'cancer, though they should be monitored for changes.',
    aliases: ['keloid', 'keloid scarring', 'keloids', 'hypertrophic scar'],
  },

  // ===== VASCULAR =====
  {
    canonical: 'Hemangioma',
    isCancer: false,
    cancerRiskScore: 4,
    cancerType: null,
    severity: 'low',
    urgency: 'routine',
    cancerDescription:
      'No cancer indicators detected. Hemangiomas are benign blood vessel growths and do ' +
      'not indicate cancer.',
    aliases: ['hemangioma', 'cherry angioma', 'angioma', 'pyogenic granuloma', 'venous lake'],
  },

  // ===== OTHER BENIGN =====
  {
    canonical: 'Lentigo',
    isCancer: false,
    cancerRiskScore: 10,
    cancerType: null,
    severity: 'low',
    urgency: 'routine',
    cancerDescription:
      'No cancer indicators detected. Lentigines (sun spots / age spots) are benign ' +
      'pigmented lesions. Solar lentigo can rarely progress, so monitoring is advised.',
    aliases: ['lentigo', 'solar lentigo', 'lentigo simplex', 'labial lentigo'],
  },
  {
    canonical: 'Wart',
    isCancer: false,
    cancerRiskScore: 3,
    cancerType: null,
    severity: 'low',
    urgency: 'routine',
    cancerDescription:
      'No cancer indicators detected. Warts are benign viral growths caused by HPV and ' +
      'do not indicate cancer.',
    aliases: ['wart', 'common wart', 'plantar wart', 'verruca', 'verruca vulgaris', 'flat wart'],
  },
  {
    canonical: 'Milia',
    isCancer: false,
    cancerRiskScore: 1,
    cancerType: null,
    severity: 'low',
    urgency: 'routine',
    cancerDescription:
      'No cancer indicators detected. Milia are benign tiny cysts filled with keratin and ' +
      'do not indicate cancer.',
    aliases: ['milia', 'milia cyst', 'epidermal cyst'],
  },
  {
    canonical: 'Other Benign',
    isCancer: false,
    cancerRiskScore: 5,
    cancerType: null,
    severity: 'low',
    urgency: 'routine',
    cancerDescription:
      'No cancer indicators detected. This appears to be a benign skin finding. ' +
      'Regular self-monitoring is recommended.',
    aliases: [
      'other',
      'other benign',
      'benign',
      'normal',
      'non-lesional',
      'unclassified',
      'unspecified',
    ],
  },
];

// ===== Lookup index built from the table =====

const aliasIndex = new Map<string, ConditionEntry>();

function normalize(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/['']/g, '')
    .replace(/\s+/g, ' ');
}

for (const entry of CONDITION_MAP) {
  aliasIndex.set(normalize(entry.canonical), entry);
  for (const alias of entry.aliases) {
    aliasIndex.set(normalize(alias), entry);
  }
}

/**
 * Look up a condition by any name from the source datasets.
 * Falls back to 'Other Benign' if no match is found.
 */
export function lookupCondition(name: string): ConditionEntry {
  const normalized = normalize(name);
  // Try exact alias match
  const exact = aliasIndex.get(normalized);
  if (exact) return exact;

  // Try partial match — check if any alias is a substring of the input or vice versa
  for (const entry of CONDITION_MAP) {
    for (const alias of entry.aliases) {
      const a = normalize(alias);
      if (normalized.includes(a) || a.includes(normalized)) {
        return entry;
      }
    }
  }

  // Default fallback
  return CONDITION_MAP.find((e) => e.canonical === 'Other Benign')!;
}

/**
 * Get the canonical list of condition class names for model training.
 * This defines the output classes of the classification model.
 */
export function getTrainingClasses(): string[] {
  // Group into fewer classes for training reliability.
  // We train a 2-class model: cancer vs non-cancer,
  // plus a multi-class model for specific conditions.
  return CONDITION_MAP.map((e) => e.canonical);
}

/**
 * Cancer risk level derived from the numeric risk score.
 */
export function riskLevelFromScore(score: number): CancerRiskLevel {
  if (score >= 70) return 'high_risk';
  if (score >= 35) return 'moderate_risk';
  if (score >= 15) return 'low_risk';
  return 'no_risk';
}
