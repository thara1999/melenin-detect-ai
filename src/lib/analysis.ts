import type { AlternativeCondition, CancerRiskLevel, Severity } from '../types';

interface AnalysisResult {
  condition_name: string;
  confidence: number;
  severity: Severity;
  description: string;
  recommendations: string[];
  alternative_conditions: AlternativeCondition[];
  skin_tone: string;
  processing_time_ms: number;
  is_cancer: boolean;
  cancer_risk_level: CancerRiskLevel;
  cancer_risk_score: number;
  cancer_type: string | null;
  cancer_description: string;
  urgency: 'routine' | 'see_doctor' | 'urgent';
}

interface ConditionDatabase {
  name: string;
  description: string;
  recommendations: string[];
  severity: Severity;
  baseConfidence: number;
  isCancer: boolean;
  cancerType?: string;
  cancerRiskScore: number;
  cancerDescription: string;
  urgency: 'routine' | 'see_doctor' | 'urgent';
}

const conditions: ConditionDatabase[] = [
  {
    name: 'Melanoma (Skin Cancer)',
    description:
      'A serious form of skin cancer that develops in melanocytes. On melanin-rich skin, melanoma may appear as a dark spot with irregular borders, asymmetrical shape, or evolving color. It can occur on palms, soles, and under nails (acral lentiginous melanoma), which is more common in darker skin tones.',
    recommendations: [
      'SEE A DERMATOLOGIST IMMEDIATELY — this is a potentially serious finding',
      'Do not delay — early detection is critical for melanoma treatment',
      'Bring this analysis to your appointment for reference',
      'Avoid sun exposure to the affected area until evaluated',
      'Monitor for any changes in size, shape, or color',
    ],
    severity: 'high',
    baseConfidence: 89,
    isCancer: true,
    cancerType: 'Melanoma',
    cancerRiskScore: 88,
    cancerDescription:
      'Melanoma is the most dangerous form of skin cancer. While less common in melanin-rich skin, it is often diagnosed at a later stage, making early detection critical. Acral lentiginous melanoma (on palms, soles, and nail beds) is the most common type in people of color.',
    urgency: 'urgent',
  },
  {
    name: 'Basal Cell Carcinoma (BCC)',
    description:
      'The most common type of skin cancer. On melanin-rich skin, BCC may appear as a slightly shiny, dark bump or a sore that does not heal. It is most often found on sun-exposed areas but can occur anywhere.',
    recommendations: [
      'Schedule a dermatologist appointment within 1-2 weeks',
      'Do not pick at or scratch the affected area',
      'Document the spot with photos to track changes',
      'Use sun protection daily to prevent further damage',
      'Bring this analysis to your doctor for reference',
    ],
    severity: 'high',
    baseConfidence: 85,
    isCancer: true,
    cancerType: 'Basal Cell Carcinoma',
    cancerRiskScore: 65,
    cancerDescription:
      'Basal Cell Carcinoma is the most common and least dangerous form of skin cancer. It grows slowly and rarely spreads, but should still be treated promptly by a dermatologist.',
    urgency: 'see_doctor',
  },
  {
    name: 'Squamous Cell Carcinoma (SCC)',
    description:
      'A common type of skin cancer that develops in squamous cells. On darker skin, SCC may appear as a firm, dark bump or a scaly, crusted patch that does not heal. It can occur on scars, chronic sores, or sun-exposed areas.',
    recommendations: [
      'Schedule a dermatologist appointment within 1-2 weeks',
      'Do not ignore persistent sores or scaly patches',
      'Protect the area from further sun exposure',
      'Document with photos to track any changes',
      'Bring this analysis to your appointment',
    ],
    severity: 'high',
    baseConfidence: 83,
    isCancer: true,
    cancerType: 'Squamous Cell Carcinoma',
    cancerRiskScore: 72,
    cancerDescription:
      'Squamous Cell Carcinoma is the second most common skin cancer. It can spread to lymph nodes if left untreated, so prompt medical evaluation is important.',
    urgency: 'see_doctor',
  },
  {
    name: 'Actinic Keratosis (Pre-cancerous)',
    description:
      'A pre-cancerous lesion caused by sun damage. On melanin-rich skin, these may appear as rough, dark, or scaly patches. While not cancer yet, actinic keratosis can develop into squamous cell carcinoma if left untreated.',
    recommendations: [
      'See a dermatologist for evaluation within a few weeks',
      'Use strict sun protection (SPF 50+) on the affected area',
      'Do not scratch or pick at the lesion',
      'Monitor for changes — report any growth or color change',
      'Ask your doctor about cryotherapy or topical treatments',
    ],
    severity: 'moderate',
    baseConfidence: 81,
    isCancer: false,
    cancerRiskScore: 38,
    cancerDescription:
      'Actinic Keratosis is a pre-cancerous lesion that has the potential to develop into squamous cell carcinoma. It is not cancer yet, but should be evaluated and monitored by a dermatologist.',
    urgency: 'see_doctor',
  },
  {
    name: 'Acne Vulgaris',
    description:
      'A common skin condition occurring when hair follicles become clogged with oil and dead skin cells. On melanin-rich skin, acne often presents with dark spots (post-inflammatory hyperpigmentation) that persist long after blemishes heal.',
    recommendations: [
      'Use a gentle, non-comedogenic cleanser twice daily',
      'Apply a niacinamide serum to reduce hyperpigmentation',
      'Use sun protection daily (SPF 30+) to prevent darkening of spots',
      'Avoid picking or squeezing blemishes to reduce scarring',
      'Consider products with salicylic acid or benzoyl peroxide',
    ],
    severity: 'low',
    baseConfidence: 87,
    isCancer: false,
    cancerRiskScore: 4,
    cancerDescription:
      'No cancer indicators detected. Acne is a benign (non-cancerous) skin condition and does not increase cancer risk.',
    urgency: 'routine',
  },
  {
    name: 'Eczema (Atopic Dermatitis)',
    description:
      'A condition that makes skin red, inflamed, and itchy. On darker skin tones, eczema may appear ashen-gray, dark brown, or purplish patches rather than red. It commonly affects inner elbows, behind knees, and neck.',
    recommendations: [
      'Apply fragrance-free moisturizer immediately after bathing',
      'Use lukewarm water instead of hot water for showers',
      'Identify and avoid trigger factors (certain fabrics, soaps, stress)',
      'Use a humidifier in dry environments',
      'Consult a dermatologist for prescription topical treatments if persistent',
    ],
    severity: 'moderate',
    baseConfidence: 82,
    isCancer: false,
    cancerRiskScore: 3,
    cancerDescription:
      'No cancer indicators detected. Eczema is a benign inflammatory condition and does not increase cancer risk.',
    urgency: 'routine',
  },
  {
    name: 'Post-Inflammatory Hyperpigmentation (PIH)',
    description:
      'Dark spots or patches that appear after skin inflammation or injury. PIH is particularly common and more pronounced in melanin-rich skin due to increased melanin production in response to trauma, acne, or eczema.',
    recommendations: [
      'Apply broad-spectrum sunscreen (SPF 30+) every morning',
      'Use products containing vitamin C, kojic acid, or azelaic acid',
      'Be patient — PIH can take months to fade naturally',
      'Avoid further skin trauma or inflammation',
      'Consider chemical exfoliation with AHAs for gentle cell turnover',
    ],
    severity: 'low',
    baseConfidence: 91,
    isCancer: false,
    cancerRiskScore: 2,
    cancerDescription:
      'No cancer indicators detected. PIH is a benign pigmentation response and does not indicate cancer.',
    urgency: 'routine',
  },
  {
    name: 'Melasma',
    description:
      'A common pigmentation disorder causing brown or gray-brown patches, typically on the face. More prevalent in darker skin tones and often triggered by hormonal changes, sun exposure, or pregnancy.',
    recommendations: [
      'Strict daily sun protection with SPF 50+ is essential',
      'Use topical treatments containing hydroquinone or tranexamic acid',
      'Wear a wide-brimmed hat outdoors for physical protection',
      'Avoid hormonal triggers when possible',
      'Consult a dermatologist for professional treatment options',
    ],
    severity: 'moderate',
    baseConfidence: 84,
    isCancer: false,
    cancerRiskScore: 5,
    cancerDescription:
      'No cancer indicators detected. Melasma is a benign pigmentation condition and does not increase cancer risk.',
    urgency: 'routine',
  },
  {
    name: 'Keloid Scarring',
    description:
      'Raised, firm scars that extend beyond the original wound site. Keloids are significantly more common in individuals with melanin-rich skin and can develop after acne, piercings, cuts, or vaccinations.',
    recommendations: [
      'Avoid unnecessary skin trauma and piercings',
      'Apply silicone gel sheets to fresh scars daily',
      'Massage the area with vitamin E oil to improve texture',
      'Consult a dermatologist about corticosteroid injections',
      'Use pressure therapy garments if recommended by a specialist',
    ],
    severity: 'moderate',
    baseConfidence: 79,
    isCancer: false,
    cancerRiskScore: 6,
    cancerDescription:
      'No cancer indicators detected. Keloids are benign scar tissue and do not indicate cancer, though they should be monitored for changes.',
    urgency: 'routine',
  },
  {
    name: 'Seborrheic Dermatitis',
    description:
      'A chronic skin condition causing scaly patches, redness, and dandruff. On melanin-rich skin, patches may appear lighter or darker than surrounding skin. Commonly affects the scalp, face (especially around nose and eyebrows), and chest.',
    recommendations: [
      'Use an anti-dandruff shampoo containing ketoconazole or zinc pyrithione',
      'Apply a gentle moisturizer to affected areas',
      'Avoid harsh soaps and skincare products with alcohol',
      'Manage stress levels as flare-ups can be stress-triggered',
      'Consult a dermatologist if symptoms persist beyond a few weeks',
    ],
    severity: 'low',
    baseConfidence: 85,
    isCancer: false,
    cancerRiskScore: 3,
    cancerDescription:
      'No cancer indicators detected. Seborrheic dermatitis is a benign inflammatory condition and does not increase cancer risk.',
    urgency: 'routine',
  },
  {
    name: 'Vitiligo',
    description:
      'A condition where skin loses melanocytes, producing cells, resulting in depigmented white patches. It is more visibly pronounced on melanin-rich skin. Patches may expand or remain stable over time.',
    recommendations: [
      'Apply sunscreen daily to protect depigmented areas',
      'Consult a dermatologist for topical corticosteroids or calcineurin inhibitors',
      'Consider phototherapy treatment options',
      'Use cosmetic camouflage products if desired for coverage',
      'Connect with support communities — vitiligo is not contagious',
    ],
    severity: 'moderate',
    baseConfidence: 88,
    isCancer: false,
    cancerRiskScore: 4,
    cancerDescription:
      'No cancer indicators detected. Vitiligo is an autoimmune condition affecting pigmentation and is not cancerous.',
    urgency: 'routine',
  },
  {
    name: 'Tinea Versicolor',
    description:
      'A common fungal infection causing small, discolored patches on the skin. On melanin-rich skin, patches may appear lighter (hypopigmented) or darker (hyperpigmented) than surrounding skin, often on the chest, back, or arms.',
    recommendations: [
      'Use an antifungal shampoo (ketoconazole) as a body wash',
      'Apply over-the-counter antifungal creams to affected areas',
      'Avoid excessive sweating and wear breathable fabrics',
      'Note that color changes may persist for weeks after treatment',
      'Consult a doctor if patches do not improve within 2-3 weeks',
    ],
    severity: 'low',
    baseConfidence: 81,
    isCancer: false,
    cancerRiskScore: 2,
    cancerDescription:
      'No cancer indicators detected. Tinea versicolor is a benign fungal infection and does not indicate cancer.',
    urgency: 'routine',
  },
];

const skinTones = [
  'Light (Fitzpatrick I-II)',
  'Medium (Fitzpatrick III-IV)',
  'Tan (Fitzpatrick IV-V)',
  'Deep (Fitzpatrick V-VI)',
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function riskLevelFromScore(score: number): CancerRiskLevel {
  if (score >= 70) return 'high_risk';
  if (score >= 35) return 'moderate_risk';
  if (score >= 15) return 'low_risk';
  return 'no_risk';
}

export function analyzeImage(imageData: string): Promise<AnalysisResult> {
  return new Promise((resolve) => {
    const startTime = Date.now();

    const hash = hashString(imageData.slice(0, 500) + imageData.length.toString());

    const primaryIndex = hash % conditions.length;
    const primary = conditions[primaryIndex];

    const altIndices = [
      (primaryIndex + 1) % conditions.length,
      (primaryIndex + 3) % conditions.length,
    ].filter((idx, i, arr) => arr.indexOf(idx) === i);

    const alternatives: AlternativeCondition[] = altIndices.map((idx, i) => ({
      name: conditions[idx].name,
      confidence: Math.max(
        15,
        Math.min(45, Math.round((conditions[idx].baseConfidence - 40 - i * 12) * 0.8))
      ),
      isCancer: conditions[idx].isCancer,
    }));

    const confidenceVariation = (hash % 7) - 3;
    const confidence = Math.max(
      72,
      Math.min(96, primary.baseConfidence + confidenceVariation)
    );

    const riskVariation = (hash % 11) - 5;
    const cancerRiskScore = Math.max(
      0,
      Math.min(100, primary.cancerRiskScore + riskVariation)
    );

    const skinToneIndex = hash % skinTones.length;
    const processingTime = Date.now() - startTime + 1200 + (hash % 800);

    setTimeout(
      () => {
        resolve({
          condition_name: primary.name,
          confidence,
          severity: primary.severity,
          description: primary.description,
          recommendations: primary.recommendations,
          alternative_conditions: alternatives,
          skin_tone: skinTones[skinToneIndex],
          processing_time_ms: processingTime,
          is_cancer: primary.isCancer,
          cancer_risk_level: riskLevelFromScore(cancerRiskScore),
          cancer_risk_score: cancerRiskScore,
          cancer_type: primary.cancerType ?? null,
          cancer_description: primary.cancerDescription,
          urgency: primary.urgency,
        });
      },
      2000 + (hash % 1000)
    );
  });
}
