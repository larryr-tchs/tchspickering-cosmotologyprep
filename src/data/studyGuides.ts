import { StudyGuide, SubjectId } from '../types';

export const STUDY_GUIDES: Record<SubjectId, StudyGuide> = {
  'infection-control': {
    subjectId: 'infection-control',
    title: 'Infection Control & Safety Standards',
    subtitle: 'Principles of Prevention, Decontamination Levels, Pathogens & OSHA Standards',
    examWeightNotice: 'Represents approx. 18-20% of the written examination — The highest weighted scientific domain!',
    keyTakeaways: [
      'Understand the 3 levels of decontamination: Cleaning (Sanitation), Disinfection, Sterilization.',
      'Know the difference between EPA-registered Hospital disinfectants and Quats.',
      'Memorize bacterial classifications (Cocci, Bacilli, Spirilla) and their arrangements.',
      'Know the exact 10-step Blood Exposure Incident (blood spill) protocol cold.',
      'Single-use (porous) items MUST be discarded immediately; multi-use items MUST be cleaned then fully immersed in EPA disinfectant.',
    ],
    sections: [
      {
        id: 'decontamination-levels',
        heading: '1. The Three Levels of Decontamination',
        content: 'Decontamination is the removal of blood or other potentially infectious materials on an item\'s surface and the removal of visible debris or residue.',
        bulletPoints: [
          'Level 1: Cleaning (Sanitation) — Washing with soap and warm water, scrubbing with a clean brush. Removes visible dirt, organic matter, and reduces microbial count. Does NOT kill all pathogens. Cleaning must ALWAYS precede disinfection.',
          'Level 2: Disinfection (Salon Standard) — Destroys most harmful bacteria, viruses, and fungi on non-porous surfaces. Does NOT destroy bacterial spores. Salons must use an EPA-registered hospital-grade disinfectant.',
          'Level 3: Sterilization (Highest Level) — Completely destroys ALL microbial life, including tough bacterial spores. Requires an autoclave (steam under pressure) or dry heat. Used in medical and tattoo facilities; rarely practical in salons.',
        ],
        callout: {
          type: 'critical',
          title: 'State Board Traps to Avoid',
          text: 'Antiseptics are formulated for SKIN ONLY (chemical germicides). Disinfectants are formulated for NON-POROUS SURFACES ONLY and must NEVER be applied to human skin or nails.',
        },
      },
      {
        id: 'bacterial-pathogens',
        heading: '2. Microbiology: Bacterial Pathogens & Shapes',
        content: 'Pathogenic bacteria are harmful microorganisms that cause disease and infection when invading the body.',
        table: {
          headers: ['Pathogen Shape', 'Morphology (Look)', 'Arrangement / Subtype', 'Diseases / Conditions Caused'],
          rows: [
            ['Cocci', 'Round / Spherical', 'Staphylococci (Grape-like clusters)', 'Boils, abscesses, pustules, MRSA'],
            ['Cocci', 'Round / Spherical', 'Streptococci (Curved string of beads)', 'Strep throat, blood poisoning, impetigo'],
            ['Cocci', 'Round / Spherical', 'Diplococci (Pairs / grow in twos)', 'Pneumonia'],
            ['Bacilli', 'Short Rod-shaped', 'Most common form of bacteria', 'Tetanus (lockjaw), tuberculosis, typhoid fever'],
            ['Spirilla', 'Spiral / Corkscrew', 'Flexible / undulating spiral', 'Syphilis, Lyme disease, cholera'],
          ],
        },
        bulletPoints: [
          'Active (Vegetative) Stage: Bacteria grow and reproduce in warm, dark, damp environments via binary fission (splitting into two daughter cells).',
          'Inactive (Spore-forming) Stage: Under harsh conditions (dryness, disinfectants), certain bacilli coat themselves in a tough waxy outer shell. They can survive for months until favorable conditions return.',
        ],
      },
      {
        id: 'disinfectants-types',
        heading: '3. Salon Disinfectant Types & Contact Time',
        content: 'All salon disinfectants must be EPA-registered hospital-grade and proven bactericidal, virucidal, and fungicidal.',
        bulletPoints: [
          'Quaternary Ammonium Compounds (Quats): Modern, odorless, fast-acting disinfectants. Most disinfect tools within 10 minutes.',
          'Phenolic Disinfectants: Powerful tuberculocidal disinfectants with a very high pH; can rust shears and damage plastic or rubber.',
          'Sodium Hypochlorite (Household Bleach 5.25%): Effective disinfectant when properly diluted (10% bleach solution = 1 part bleach to 9 parts water). Fresh solution must be prepared every 24 hours.',
          'Contact Time: The required amount of time an implement must remain FULLY IMMERSED and saturated with the disinfectant solution to effectively destroy targeted organisms. Usually 10 minutes.',
        ],
        callout: {
          type: 'warning',
          title: 'Preparation Safety Rule',
          text: 'Always add disinfectant concentrate to water (A&W: Add disinfectant to Water), NEVER water to concentrate, to prevent chemical splashing.',
        },
      },
      {
        id: 'blood-exposure-protocol',
        heading: '4. OSHA Blood Exposure Incident (Blood Spill) Protocol',
        content: 'If an injury occurs where blood is drawn from either client or cosmetologist, follow this mandatory sequence:',
        bulletPoints: [
          'Step 1: STOP the service immediately.',
          'Step 2: Put on disposable gloves to protect against bloodborne pathogens.',
          'Step 3: Calmly explain to the client that you must treat the injury.',
          'Step 4: Clean the cut area with an antiseptic (e.g. alcohol wipe or antiseptic spray).',
          'Step 5: Apply a sterile adhesive bandage over the wound.',
          'Step 6: Remove contaminated gloves, dispose in biohazard bag, wash hands, and put on FRESH gloves.',
          'Step 7: Clean and disinfect all contaminated workstation surfaces, shears, or implements with an EPA-registered hospital tuberculocidal disinfectant.',
          'Step 8: Double-bag all contaminated single-use items (first bag sealed, inside a second biohazard-labeled bag).',
          'Step 9: Discard contaminated double-bag into a lined, covered trash container.',
          'Step 10: Remove gloves, thoroughly wash hands with soap and water, and resume the service.',
        ],
      },
    ],
    glossary: [
      { term: 'Asepsis', definition: 'The absence of pathogenic microorganisms.' },
      { term: 'Bloodborne Pathogens', definition: 'Disease-causing microorganisms carried in the body by blood or body fluids, such as Hepatitis B (HBV), Hepatitis C (HCV), and HIV.' },
      { term: 'Quats', definition: 'Quaternary ammonium compounds; safe, odorless salon disinfectants that work within 10 minutes.' },
      { term: 'Tinea Capitis', definition: 'A fungal ringworm infection of the scalp characterized by red papules or spots at the opening of hair follicles.' },
      { term: 'Pediculosis Capitis', definition: 'Infestation of the hair and scalp with head lice.' },
    ],
    quickReviewQuestions: [
      { question: 'What is the immediate first step if blood is drawn during a haircut?', answer: 'Stop the service immediately.' },
      { question: 'Can porous items like emery boards or wooden sticks be disinfected?', answer: 'No. They absorb liquids and must be discarded after a single client use.' },
      { question: 'What 3 pathogens must hospital-grade salon disinfectants be certified to destroy?', answer: 'Bacteria, viruses, and fungi (Bactericidal, Virucidal, Fungicidal).' },
    ],
  },

  'anatomy-physiology': {
    subjectId: 'anatomy-physiology',
    title: 'Anatomy, Histology & Physiology',
    subtitle: 'Skeletal, Muscular, Nervous, and Circulatory Systems for Cosmetologists',
    examWeightNotice: 'Accounts for approx. 12% of written exam questions. Crucial for haircutting guidelines and massage safety.',
    keyTakeaways: [
      'The adult skull contains 22 bones: 8 cranial and 14 facial bones.',
      'Massage strokes MUST always move from muscle INSERTION to muscle ORIGIN.',
      'The 5th cranial nerve (Trigeminal) is sensory for the face; 7th cranial (Facial) controls expressions.',
      'The radius is on the thumb side; the ulna is on the little finger side of the forearm.',
    ],
    sections: [
      {
        id: 'skeletal-system',
        heading: '1. Bones of the Head, Face, and Arms',
        content: 'Bones provide shape, structure, and attachment points for muscles.',
        table: {
          headers: ['Bone Name', 'Location / Count', 'Cosmetology Importance'],
          rows: [
            ['Occipital Bone', '1 bone; back / base of skull', 'Key anatomical reference for nape haircut guidelines'],
            ['Parietal Bones', '2 bones; crown and top sides of cranium', 'Forms the roof and sides of the head'],
            ['Frontal Bone', '1 bone; forehead', 'Extends from eye sockets to coronal suture'],
            ['Temporal Bones', '2 bones; temple areas near ears', 'Ear alignment and sideburn blending'],
            ['Mandible', '1 bone; lower jaw', 'Largest, strongest bone of the face; only movable facial bone'],
            ['Maxillae', '2 bones; upper jaw', 'Forms the upper jaw and boundaries of nasal cavities'],
            ['Zygomatic Bones', '2 bones; cheekbones', 'Facial contouring and cheekbone blush application'],
            ['Radius', '1 bone; lateral forearm', 'Located on the THUMB side of the forearm'],
            ['Ulna', '1 bone; medial forearm', 'Located on the LITTLE FINGER (pinky) side of the forearm'],
          ],
        },
      },
      {
        id: 'muscular-system',
        heading: '2. The Muscular System & Massage Dynamics',
        content: 'Muscles produce movement through contraction. Muscles consist of three parts: Origin (fixed attachment), Belly (middle fleshy part), and Insertion (movable attachment to bone).',
        bulletPoints: [
          'Direction of Massage: Pressure must ALWAYS be directed from the INSERTION to the ORIGIN. Massaging against this direction can cause muscle strain and damage.',
          'Epicranius (Occipitofrontalis): Broad muscle covering the top of the skull; consists of the occipitalis (back) and frontalis (forehead).',
          'Masseter & Temporalis: The chief chewing (mastication) muscles.',
          'Orbicularis Oculi: Ring muscle of the eye socket; closes the eye.',
          'Sternocleidomastoideus (SCM): Large muscle extending along the side of the neck from the ear to the collarbone; rotates the head.',
        ],
        callout: {
          type: 'critical',
          title: 'Exam Rule',
          text: 'Never reverse the direction of massage! Always stroke from the movable INSERTION toward the fixed ORIGIN.',
        },
      },
      {
        id: 'nervous-system',
        heading: '3. Nerves of the Face and Neck',
        content: 'The nervous system controls all body activities through motor and sensory pathways.',
        bulletPoints: [
          'Fifth Cranial Nerve (Trigeminal / Trifacial): Largest cranial nerve; chief sensory nerve of the face and motor nerve for chewing.',
          'Seventh Cranial Nerve (Facial Nerve): Chief motor nerve of the face; emerges near the lower ear and controls muscles of facial expression.',
          'Eleventh Cranial Nerve (Accessory Nerve): Motor nerve controlling the sternocleidomastoideus and trapezius muscles of the neck and shoulders.',
        ],
      },
    ],
    glossary: [
      { term: 'Origin', definition: 'The fixed, non-movable muscle attachment anchored to bone or another muscle.' },
      { term: 'Insertion', definition: 'The movable muscle attachment where movement is produced.' },
      { term: 'Trigeminal Nerve (5th)', definition: 'Chief sensory nerve of the entire face.' },
      { term: 'Radius', definition: 'Forearm bone on the thumb side.' },
      { term: 'Ulna', definition: 'Forearm bone on the pinky finger side.' },
    ],
    quickReviewQuestions: [
      { question: 'Which bone is on the thumb side of the forearm?', answer: 'The radius.' },
      { question: 'What is the direction of massage strokes?', answer: 'From muscle insertion toward the muscle origin.' },
      { question: 'What is the only movable bone of the facial skeleton?', answer: 'The mandible (lower jaw).' },
    ],
  },

  'chemistry-electricity': {
    subjectId: 'chemistry-electricity',
    title: 'Chemistry & Salon Electricity',
    subtitle: 'The pH Scale, Chemical Reactions, Redox, Electrical Currents & Safety',
    examWeightNotice: 'Represents approx. 10% of exam questions. Direct foundation for chemical texturizing and color.',
    keyTakeaways: [
      'The natural pH of hair and skin is 4.5 to 5.5 (slightly acidic).',
      'The pH scale is logarithmic: a jump of 1 unit equals a 10x change; 2 units equals 100x.',
      'Alkalis soften and swell the hair cuticle; acids harden and tighten the cuticle.',
      'Galvanic current is direct current (DC); Tesla High-Frequency is alternating thermal current.',
      'GFCI (Ground Fault Circuit Interrupter) outlets are mandatory near water sources.',
    ],
    sections: [
      {
        id: 'ph-scale',
        heading: '1. The Logarithmic pH Scale & Salon Chemistry',
        content: 'pH stands for potential hydrogen. The scale measures acidity and alkalinity of water-based solutions from 0 to 14. Pure water is neutral at 7.0.',
        table: {
          headers: ['pH Value', 'Chemical Classification', 'Common Salon Examples', 'Hair Shaft Action'],
          rows: [
            ['pH 0 - 3.0', 'Very Strongly Acidic', 'Hydrochloric acid, chemical peels', 'Hardens cuticle severely, corrosive'],
            ['pH 3.0 - 4.0', 'Acidic', 'Conditioning rinses, hydrogen peroxide (developer)', 'Contracts cuticle, stabilizes tone'],
            ['pH 4.5 - 5.5', 'Natural Acid Mantle', 'Healthy human hair, skin, and acid-balanced shampoos', 'Maintains natural moisture barrier'],
            ['pH 7.0', 'Pure Neutral', 'Distilled water', 'Neutral baseline (equal H+ and OH-)'],
            ['pH 7.8 - 8.2', 'Mildly Alkaline', 'Acid-balanced permanent waves (GMTG)', 'Gentle cuticle swelling, safe for porous hair'],
            ['pH 9.0 - 9.6', 'Alkaline', 'Cold waves / Alkaline perms (Ammonium Thioglycolate)', 'Swells cuticle, softens cortex'],
            ['pH 9.0 - 10.5', 'High Alkaline', 'Permanent hair color, ammonia lighteners', 'Opens cuticle wide, oxidizes melanin'],
            ['pH 12.5 - 14.0', 'Caustic / Very High Alkaline', 'Sodium Hydroxide (Lye) relaxers', 'Breaks disulfide bonds, softens cortex'],
          ],
        },
        callout: {
          type: 'formula',
          title: 'The 10x Logarithmic Rule',
          text: 'Because each unit represents 10-fold power: pH 8 is 10 times more alkaline than pH 7. pH 9 is 100 times (10 x 10) more alkaline than pH 7. pH 10 is 1,000 times (10 x 10 x 10) more alkaline than pH 7!',
        },
      },
      {
        id: 'electricity-basics',
        heading: '2. Salon Electrical Currents and Safety',
        content: 'Cosmetologists operate electrical thermal tools and facial machines requiring fundamental knowledge of current and safety.',
        bulletPoints: [
          'Volt (V): Measures electrical pressure or force that pushes electric current through a conductor.',
          'Ampere (Amp): Measures the amount / strength of electrical current flowing.',
          'Ohm (Ω): Measures electrical resistance to the flow of current.',
          'Watt (W): Measures electrical power and how much energy is consumed per second (e.g. a 1800W hair dryer).',
          'Galvanic Current: Constant Direct Current (DC) with positive (anode) and negative (cathode) poles. Uses: Desincrustation (anode softens sebum) and Iontophoresis (pushes water-soluble product into skin).',
          'Tesla High-Frequency (Violet Ray): Thermal alternating current with high frequency. Stimulates blood circulation, produces ozone for a germicidal effect, and relieves congestion.',
        ],
      },
    ],
    glossary: [
      { term: 'Acid Mantle', definition: 'The natural protective barrier on skin and hair maintaining a pH of 4.5 to 5.5.' },
      { term: 'Redox', definition: 'Oxidation-reduction reaction where oxidation and reduction occur simultaneously.' },
      { term: 'Emulsion', definition: 'An unstable physical mixture of two immiscible substances held together with an emulsifier.' },
      { term: 'GFCI', definition: 'Ground Fault Circuit Interrupter; trips circuit in milliseconds when sensing moisture or overload.' },
    ],
    quickReviewQuestions: [
      { question: 'What is the natural pH range of hair and skin?', answer: '4.5 to 5.5.' },
      { question: 'How much more alkaline is pH 9 compared to neutral pH 7?', answer: '100 times more alkaline (10 x 10).' },
      { question: 'What electrical current is direct current used for iontophoresis?', answer: 'Galvanic current.' },
    ],
  },

  'trichology-scalp': {
    subjectId: 'trichology-scalp',
    title: 'Trichology & Scalp Disorders',
    subtitle: 'Hair Shaft Histology, Growth Cycles, Structural Bonds & Scalp Pathology',
    examWeightNotice: 'Accounts for approx. 12% of exam questions. Critical for consultation, porosity, and elasticity analysis.',
    keyTakeaways: [
      'The hair shaft has 3 layers: Cuticle (protective shingle), Cortex (90% weight, strength, melanin), Medulla (innermost core).',
      'The 3 hair growth cycles are Anagen (active growth), Catagen (transition), and Telogen (resting/shedding).',
      'Disulfide bonds are strong chemical bonds broken only by perms, relaxers, and chemical treatments.',
      'Wet hair stretches up to 50% without breaking; dry hair stretches up to 20%.',
      'Never perform services if contagious scalp conditions (Tinea, Pediculosis, Scabies) are present.',
    ],
    sections: [
      {
        id: 'hair-shaft-layers',
        heading: '1. Hair Shaft Histology & Structure',
        content: 'Trichology is the scientific study of hair, its diseases, and its care.',
        bulletPoints: [
          'Cuticle: Outermost layer made of overlapping scale-like shingle cells. Protects inner cortex. Healthy cuticles lie flat and reflect light (shine). Swelled by alkalis, tightened by acids.',
          'Cortex: Fibrous middle protein layer comprising roughly 90% of total hair weight. Contains melanin pigment, elasticity, and protein chains. All chemical restructuring takes place in the cortex.',
          'Medulla: Innermost core consisting of round cells. Often completely absent in naturally fine or blonde hair. Has no known functional role in cosmetology chemical services.',
        ],
      },
      {
        id: 'hair-side-bonds',
        heading: '2. The Three Types of Hair Side Bonds',
        content: 'Cross-links that connect polypeptide chains within the hair cortex:',
        table: {
          headers: ['Bond Type', 'Relative Strength', 'How It Is Broken', 'How It Is Reformed'],
          rows: [
            ['Hydrogen Bond', 'Weak physical bond (1/3 of strength)', 'Broken easily by water or heat', 'Reformed as hair cools or dries'],
            ['Salt Bond', 'Weak physical bond (1/3 of strength)', 'Broken by pH changes (strong acids/alkalis)', 'Reformed when pH is normalized'],
            ['Disulfide Bond', 'Strong chemical covalent bond (1/3 of strength)', 'Broken only by reducing agents (perms/relaxers) or extreme bleach oxidation', 'Reformed by chemical oxidizer (neutralizer) or destroyed permanently (lanthionization)'],
          ],
        },
      },
      {
        id: 'growth-cycle-disorders',
        heading: '3. Hair Growth Phases & Scalp Disorders',
        content: 'Hair grows in cyclical phases and is susceptible to specific conditions:',
        bulletPoints: [
          'Anagen (Active Growing Phase): Lasts 2 to 6 years. About 90% of scalp hair is in anagen at any given time.',
          'Catagen (Transitional Phase): Brief 1 to 2 week period where the hair follicle shrinks and the bulb separates from the dermal papilla.',
          'Telogen (Resting / Shedding Phase): Lasts 3 to 6 months before the hair sheds and the cycle starts again. Normal daily shedding is 50 to 100 hairs.',
          'Alopecia Areata: Sudden patchy bald spots caused by autoimmune response.',
          'Androgenetic Alopecia: Hereditary miniaturization of terminal hair into vellus hair (male/female pattern baldness).',
          'Pityriasis: Medical term for dandruff. Caused by the fungus Malassezia.',
          'Tinea: Ringworm caused by a fungal infection. Contraindication for all salon services.',
        ],
      },
    ],
    glossary: [
      { term: 'Porosity', definition: 'The hair\'s ability to absorb liquids and moisture, determined by cuticle condition.' },
      { term: 'Elasticity', definition: 'The hair\'s ability to stretch and return to its original length without breaking.' },
      { term: 'Trichoptilosis', definition: 'The technical term for split ends.' },
      { term: 'Canities', definition: 'The technical term for gray or unpigmented hair.' },
    ],
    quickReviewQuestions: [
      { question: 'Which layer of the hair shaft contains 90% of hair weight and melanin pigment?', answer: 'The cortex.' },
      { question: 'What percentage can normal healthy wet hair stretch without breaking?', answer: 'Up to 50%.' },
      { question: 'What is the active growth phase called?', answer: 'The Anagen phase.' },
    ],
  },

  'chemical-texture': {
    subjectId: 'chemical-texture',
    title: 'Chemical Texture Services (Perms & Relaxers)',
    subtitle: 'Permanent Waving, Chemical Hair Relaxers, and Curl Re-forming',
    examWeightNotice: 'Accounts for approx. 14% of exam questions. High failure rate on state boards due to chemistry specifics.',
    keyTakeaways: [
      'Alkaline perms use Ammonium Thioglycolate (ATG, pH 9.0-9.6) and process at room temperature without heat.',
      'True acid perms use Glyceryl Monothioglycolate (GMTG, pH 4.5-7.0) and require heat (endothermic).',
      'Hydroxide relaxers (sodium, potassium, lithium, guanidine) are NOT compatible with thio relaxers or thio perms.',
      'Virgin relaxer application begins in the midshaft (1/4" to 1/2" from scalp, avoiding ends until last).',
    ],
    sections: [
      {
        id: 'permanent-waving-types',
        heading: '1. Comparison of Permanent Wave Solutions',
        content: 'Permanent waving changes the hair structure by breaking disulfide bonds with a reducing agent and rebuilding them around rods with an oxidizer (neutralizer).',
        table: {
          headers: ['Wave Type', 'Active Reducing Agent', 'pH Range', 'Heat Source', 'Recommended Hair Type'],
          rows: [
            ['Alkaline / Cold Wave', 'Ammonium Thioglycolate (ATG)', '9.0 - 9.6', 'Room temperature (no heat)', 'Coarse, thick, or resistant hair'],
            ['True Acid Wave', 'Glyceryl Monothioglycolate (GMTG)', '4.5 - 7.0', 'Endothermic (dryer heat required)', 'Extremely porous, fragile, or color-treated hair'],
            ['Acid-Balanced Wave', 'GMTG + ATG', '7.8 - 8.2', 'Room temperature / mild heat', 'Normal, fine, or tinted hair; produces firm curls'],
            ['Exothermic Wave', 'ATG + Oxidizer additive', '9.0 - 9.6', 'Self-heating (chemical reaction)', 'Resistant hair needing fast processing'],
            ['Thio-Free Wave', 'Cysteamine or Mercaptamine', '7.0 - 9.0', 'Room temperature', 'Damaged or compromised hair'],
          ],
        },
      },
      {
        id: 'relaxers-comparison',
        heading: '2. Hydroxide vs. Thio Relaxers',
        content: 'Relaxers straighten curly hair by permanently altering cortical disulfide bonds.',
        bulletPoints: [
          'Sodium Hydroxide (Lye) Relaxer: pH 12.5 - 14.0. Highly caustic and fast-acting. Melts hair quickly if overprocessed. Requires protective base cream applied to scalp and hairline.',
          'Guanidine Hydroxide (No-Lye) Relaxer: pH 13.0 - 13.5. Requires mixing a relaxer cream with an activator. Gentler on scalp but causes more hair shaft dryness over time.',
          'Lanthionization: The chemical process where hydroxide relaxers permanently remove one sulfur atom from a disulfide bond, turning it into a lanthionine bond. This reaction is IRREVERSIBLE.',
          'CRITICAL RULE: NEVER apply thio perm solution to hair previously treated with sodium hydroxide (or any hydroxide relaxer). It will cause extreme breakage, gummy consistency, and hair loss.',
        ],
        callout: {
          type: 'critical',
          title: 'Absolute Incompatibility',
          text: 'Hydroxide + Thio = Total disaster! Never perm hair that has had a hydroxide relaxer, and never apply a hydroxide relaxer over thio-relaxed or thio-permed hair.',
        },
      },
    ],
    glossary: [
      { term: 'Lanthionization', definition: 'The process by which hydroxide relaxers permanently convert disulfide bonds to lanthionine bonds.' },
      { term: 'Endothermic', definition: 'Chemical reaction requiring an outside heat source (hood dryer).' },
      { term: 'Exothermic', definition: 'Chemical reaction producing its own heat internally when mixed.' },
      { term: 'Base Control', definition: 'The angle at which the hair is elevated relative to its base section while wrapping.' },
    ],
    quickReviewQuestions: [
      { question: 'What is the active reducing agent in cold wave alkaline perms?', answer: 'Ammonium Thioglycolate (ATG).' },
      { question: 'Can hair relaxed with sodium hydroxide be permed with ammonium thioglycolate?', answer: 'NO. The chemical incompatibility causes severe breakage.' },
      { question: 'What type of perm produces its own chemical heat?', answer: 'An exothermic perm.' },
    ],
  },

  'hair-coloring': {
    subjectId: 'hair-coloring',
    title: 'Hair Coloring & Lightening',
    subtitle: 'Color Theory, Level System, Developers, Formulations & Safety Regulations',
    examWeightNotice: 'Accounts for approx. 14% of the exam. Heavily tested on patch testing laws, levels, and formulation.',
    keyTakeaways: [
      'A Patch / Predisposition test is mandated by the FDA 24-48 hours prior to aniline derivative colors.',
      'The Level System measures lightness to darkness from 1 (Black) to 10 (Lightest Blonde).',
      'Complementary colors neutralize: Yellow & Violet, Orange & Blue, Red & Green.',
      '20 Volume developer (6% H2O2) is the standard for gray coverage and 1-2 levels of lift.',
      'Never apply powder lighteners directly on the scalp.',
    ],
    sections: [
      {
        id: 'color-wheel-theory',
        heading: '1. Color Wheel, Primaries & Neutralizing Tones',
        content: 'Hair coloring is governed by the laws of color theory.',
        table: {
          headers: ['Category', 'Colors', 'Relationship / Action in Formulations'],
          rows: [
            ['Primary Colors', 'Red, Yellow, Blue', 'Cannot be created by mixing other colors. Blue is coolest and darkest; Yellow is lightest.'],
            ['Secondary Colors', 'Orange (R+Y), Green (Y+B), Violet (R+B)', 'Formed by mixing equal parts of two primaries.'],
            ['Tertiary Colors', 'Red-Orange, Yellow-Orange, Yellow-Green, Blue-Green, Blue-Violet, Red-Violet', 'Formed by mixing a primary with its adjacent secondary.'],
            ['Complementary (Neutralizing)', 'Violet neutralizes Yellow\nBlue neutralizes Orange\nGreen neutralizes Red', 'Opposite each other on the color wheel; cancel each other out to create neutral brown/gray.'],
          ],
        },
      },
      {
        id: 'color-categories-developers',
        heading: '2. Four Categories of Hair Color & Developers',
        content: 'Different color categories penetrate hair to different depths based on molecular size and oxidation.',
        bulletPoints: [
          'Temporary Color: Large pigment molecules coat the cuticle only; no developer required. Washes out in 1 shampoo.',
          'Semi-Permanent Color: Smaller molecules partially penetrate cuticle; no developer required. Fades gradually over 4 to 6 shampoos.',
          'Demi-Permanent Color: Small molecules enter cortex and deposit tone; mixed with low-volume developer (5-10 vol). Deposits only (does NOT lift natural pigment). Lasts 4 to 6 weeks.',
          'Permanent Color: Tiny uncolored aniline derivative precursors enter cortex, oxidize with hydrogen peroxide developer, expand, and trap color permanently. Can lift natural pigment and deposit simultaneously.',
          '10 Volume (3%): Deposits tone, minimal lift (0-1 level).',
          '20 Volume (6%): Standard for permanent gray coverage and 1-2 levels of lift.',
          '30 Volume (9%): 2-3 levels of lift.',
          '40 Volume (12%): Maximum 3-4 levels of lift (never use on delicate/bleached hair).',
        ],
        callout: {
          type: 'warning',
          title: 'Federal Law: The Predisposition Test',
          text: 'The US Food, Drug, and Cosmetic Act requires a patch test (behind the ear or inner elbow) 24 to 48 hours prior to every application of hair color containing aniline derivatives.',
        },
      },
    ],
    glossary: [
      { term: 'Aniline Derivatives', definition: 'Small uncolored dye precursors in permanent hair color that oxidize and expand in the cortex.' },
      { term: 'Tone', definition: 'The warmth or coolness of a color (ash, golden, copper, violet).' },
      { term: 'Predisposition Test', definition: 'Skin test to detect client sensitivity or allergies to aniline hair color.' },
      { term: 'Contributing Pigment', definition: 'The underlying warm pigment exposed when hair is lightened.' },
    ],
    quickReviewQuestions: [
      { question: 'What color neutralizes unwanted brassy orange tones in lightened hair?', answer: 'Blue.' },
      { question: 'How long before an aniline color service must a patch test be performed?', answer: '24 to 48 hours prior.' },
      { question: 'What volume developer is standard for permanent color and gray coverage?', answer: '20 Volume (6%).' },
    ],
  },

  'haircutting-styling': {
    subjectId: 'haircutting-styling',
    title: 'Haircutting & Thermal Hairstyling',
    subtitle: 'Elevation Angles, Shear Ergonomics, Cutting Tools & Thermal Iron Safety',
    examWeightNotice: 'Accounts for approx. 8% of exam questions. Direct practical crossover to written exam.',
    keyTakeaways: [
      'Elevation angles: 0° = Blunt/bob; 45° = Graduated (stacked); 90° = Uniform layers; 180° = Long layers.',
      'Only the thumb moves the movable blade of haircutting shears.',
      'Always cut hair damp/wet when using a razor; cutting dry hair tears the cuticle.',
      'Test thermal curling irons and pressing combs on white tissue paper before touching hair.',
    ],
    sections: [
      {
        id: 'elevation-angles',
        heading: '1. Haircutting Elevations & Guidelines',
        content: 'Elevation is the angle or degree at which a subsection of hair is held from the head when cutting.',
        table: {
          headers: ['Elevation Degree', 'Resulting Haircut Silhouette', 'Weight Line Distribution'],
          rows: [
            ['0° Elevation', 'Blunt / One-length / Bob', 'Maximum weight line at the lowest perimeter guideline'],
            ['45° Elevation', 'Graduated (wedge or stacked)', 'Builds weight stacking upward from the perimeter'],
            ['90° Elevation', 'Uniform layers', 'All hair is cut to the same length from the scalp; removes weight evenly'],
            ['180° Elevation', 'Long layers', 'Shorter layers at the crown, preserving length and perimeter at the bottom'],
          ],
        },
      },
      {
        id: 'tool-ergonomics-safety',
        heading: '2. Shears, Razors & Thermal Tool Safety',
        content: 'Mastery of tools prevents musculoskeletal injuries and client burns.',
        bulletPoints: [
          'Shear Control: Thumb controls the moving blade. Ring finger stays in the finger grip. Pinky rests on the finger tang. Index and middle fingers steady the still blade.',
          'Palming the Shears: Curl shears into palm while holding comb to ensure safety and prevent accidental cuts.',
          'Razor Cutting Rule: Hair must be kept evenly damp to wet. Never use a dull blade. Discard used razor blades in a puncture-proof sharps container.',
          'Thermal Testing: Place heated curling iron or pressing comb against a piece of white tissue paper or neck strip for 5 seconds. If paper turns yellow, scorches, or burns, the tool is too hot.',
        ],
      },
    ],
    glossary: [
      { term: 'Guideline', definition: 'A subsection of hair that determines the length hair will be cut.' },
      { term: 'Traveling Guideline', definition: 'A guideline that moves as the haircut progresses, used often in layered haircuts.' },
      { term: 'Stationary Guideline', definition: 'A guideline that does not move; all subsequent hair sections are combed to this single guide.' },
      { term: 'Overdirection', definition: 'Combing a section away from its natural falling position to create length increases.' },
    ],
    quickReviewQuestions: [
      { question: 'What elevation produces a blunt one-length haircut?', answer: '0 degrees.' },
      { question: 'Which finger controls the movable blade of shears?', answer: 'The thumb.' },
      { question: 'How is the temperature of a thermal iron tested before touching hair?', answer: 'On a piece of white tissue paper.' },
    ],
  },

  'esthetics-skincare': {
    subjectId: 'esthetics-skincare',
    title: 'Skin Care & Esthetics',
    subtitle: 'Skin Histology, 5 Massage Strokes, Contraindications & Hair Removal',
    examWeightNotice: 'Accounts for approx. 6% of the exam. Critical for understanding skin layers and facial safety.',
    keyTakeaways: [
      'Epidermis layers from surface to base: Corneum, Lucidum, Granulosum, Spinosum, Basale (Germinativum).',
      'The 5 classic massage movements: Effleurage, Petrissage, Friction, Tapotement, Vibration.',
      'Accutane (Isotretinoin) within 6 months is an absolute contraindication for waxing.',
      'Apply soft wax in the direction of hair growth; pull strip off against hair growth.',
    ],
    sections: [
      {
        id: 'skin-layers',
        heading: '1. Layers of the Skin & Epidermis',
        content: 'Skin is the largest organ of the human body, composed of the Epidermis (outer protective layer) and Dermis (inner living corium layer containing collagen, elastin, and capillaries).',
        bulletPoints: [
          'Stratum Corneum (Horny Layer): Surface layer of dead keratinized scale cells constantly shedding.',
          'Stratum Lucidum: Clear, transparent layer found only on the palms of hands and soles of feet.',
          'Stratum Granulosum: Granular layer where keratin production accelerates.',
          'Stratum Spinosum: Spiny layer where desmosomes connect cells.',
          'Stratum Basale (Germinativum): Deepest epidermal layer where active cell division (mitosis) occurs and melanocytes produce melanin.',
        ],
        callout: {
          type: 'tip',
          title: 'Memory Mnemonic',
          text: 'Come, Let\'s Get Sun Burned: Corneum, Lucidum, Granulosum, Spinosum, Basale.',
        },
      },
      {
        id: 'massage-manipulations',
        heading: '2. The Five Classic Facial Massage Movements',
        content: 'Massage increases circulation, relaxes muscles, and stimulates glandular activity.',
        table: {
          headers: ['Movement', 'Technique Description', 'Primary Physiological Benefit'],
          rows: [
            ['Effleurage', 'Light, continuous, gliding stroking with fingers or palms', 'Soothes nerves, begins and ends every facial'],
            ['Petrissage', 'Kneading movement; lifting, squeezing, and pressing muscle tissue', 'Stimulates underlying tissues and muscle tone'],
            ['Friction', 'Deep rubbing movements applying pressure across skin', 'Stimulates glandular activity and circulation'],
            ['Tapotement (Percussion)', 'Short, quick tapping, slapping, or hacking movements', 'Most stimulating movement; tones sluggish muscles'],
            ['Vibration', 'Rapid shaking movement using fingers or electric vibrator', 'Highly relaxing and stimulating to nerve endings'],
          ],
        },
      },
    ],
    glossary: [
      { term: 'Sebum', definition: 'Oily secretion from sebaceous glands that lubricates skin and hair.' },
      { term: 'Melanocytes', definition: 'Cells in the stratum basale producing melanin pigment.' },
      { term: 'Effleurage', definition: 'Soothing gliding massage stroke that begins and ends treatments.' },
    ],
    quickReviewQuestions: [
      { question: 'Which layer of the epidermis is found ONLY on the palms and soles?', answer: 'Stratum Lucidum.' },
      { question: 'What facial massage movement uses continuous, light gliding strokes?', answer: 'Effleurage.' },
      { question: 'What is the absolute contraindication for waxing relating to acne medications?', answer: 'Use of oral Accutane / Isotretinoin within the last 6 months.' },
    ],
  },

  'nail-technology': {
    subjectId: 'nail-technology',
    title: 'Nail Technology & Disorders',
    subtitle: 'The Natural Nail Unit Anatomy, Onychosis, Diseases vs. Disorders & Enhancements',
    examWeightNotice: 'Accounts for approx. 6% of the exam. Focuses on matrix anatomy and distinguishing contagious diseases from disorders.',
    keyTakeaways: [
      'The Matrix produces the nail plate cells; damage to the matrix causes permanent deformity.',
      'Never cut the eponychium (living skin at base of plate); only push back and remove dead cuticle.',
      'Onychosis = Any nail disease or disorder. Onychomycosis = Fungal nail infection (NEVER service!).',
      'Leukonychia (white spots) and hangnails are safe to service.',
      'MMA (Methyl Methacrylate) monomer is illegal and banned in nail salons.',
    ],
    sections: [
      {
        id: 'nail-unit-anatomy',
        heading: '1. Anatomy of the Natural Nail Unit (Onyx)',
        content: 'The natural nail is an appendage of the skin composed of tough keratin protein.',
        table: {
          headers: ['Nail Part', 'Location / Structure', 'Function & Examiner Notes'],
          rows: [
            ['Matrix', 'Beneath the eponychium at nail base', 'The growth center where nail plate cells are generated. Contains blood vessels and nerves.'],
            ['Nail Plate', 'Hard keratinized plate covering nail bed', 'Most visible part of the nail unit; consists of about 100 layers of dead cells.'],
            ['Nail Bed', 'Living skin supporting the nail plate', 'Rich in blood vessels and nerves; supplied with nutrients as plate moves forward.'],
            ['Cuticle', 'Dead, colorless tissue attached to nail plate', 'Must be gently removed during manicure; seals area between skin and plate.'],
            ['Eponychium', 'Living skin at the base of the nail plate', 'LIVING TISSUE. Never cut or nip with cuticle nippers!'],
            ['Hyponychium', 'Slightly thickened skin under the free edge', 'Forms protective seal preventing microorganisms from invading the nail bed.'],
            ['Lunula', 'Whitish, half-moon shape at base of plate', 'The visible part of the matrix bed under the plate.'],
          ],
        },
      },
      {
        id: 'nail-diseases-disorders',
        heading: '2. Nail Diseases (No Service) vs. Disorders (Service Allowed)',
        content: 'State boards demand that cosmetologists recognize when to refuse a nail service and refer to a doctor.',
        bulletPoints: [
          'NO SERVICE (Infectious Diseases - Refer to Physician):',
          '• Onychomycosis: Fungal infection of the nail plate (thickened, yellow, crumbly).',
          '• Paronychia: Bacterial inflammation of the tissues surrounding the nail (red, pus, swollen).',
          '• Onychia: Inflammation of the nail matrix followed by shedding of the plate.',
          '• Pseudomonas Aeruginosa: Bacterial infection (often mistakenly called "mold") appearing green under enhancements.',
          'SERVICE ALLOWED WITH CARE (Non-Infectious Disorders):',
          '• Leukonychia: White spots caused by minor micro-trauma to the matrix.',
          '• Hangnail (Agnail): Living skin around plate splits and tears. Can be clipped if not infected.',
          '• Beau\'s Lines: Visible horizontal depressions across nail caused by major illness or surgery.',
          '• Onychorrhexis: Split or brittle nails with lengthwise ridges.',
        ],
      },
    ],
    glossary: [
      { term: 'Onyx', definition: 'The technical term for the natural nail.' },
      { term: 'Matrix', definition: 'The area where nail plate cells are created; the mother of the nail.' },
      { term: 'Onychomycosis', definition: 'Fungal infection of the natural nail plate.' },
      { term: 'MMA', definition: 'Methyl Methacrylate; hazardous, illegal monomer substance banned by FDA and state boards.' },
    ],
    quickReviewQuestions: [
      { question: 'Where does natural nail growth originate?', answer: 'The matrix.' },
      { question: 'What is the living skin at the base of the nail plate that should NEVER be cut?', answer: 'The eponychium.' },
      { question: 'What causes leukonychia (white spots on nails)?', answer: 'Minor micro-injury or trauma to the matrix.' },
    ],
  },

  'laws-ethics': {
    subjectId: 'laws-ethics',
    title: 'State Laws, Ethics & Licensing Regulations',
    subtitle: 'Scope of Practice, Board Governance, Disciplinary Actions & Prohibited Items',
    examWeightNotice: 'Accounts for approx. 4-6% of the exam. Easy points if memorized!',
    keyTakeaways: [
      'Cosmetology licenses must be displayed conspicuously at the workstation with photo attached.',
      'Credo blades (callus shavers) and MMA monomer are strictly prohibited and illegal in salons.',
      'License renewal requirements typically involve fee payment and approved continuing education hours.',
      'Practicing outside your licensed scope of practice (e.g. performing medical peels or Botox) is a criminal infraction.',
    ],
    sections: [
      {
        id: 'license-display-renewal',
        heading: '1. Professional Licensing & Salon Operations',
        content: 'State boards of cosmetology exist to protect the public health, safety, and welfare.',
        bulletPoints: [
          'License Display: Every licensed cosmetologist must display their individual license in a conspicuous location at their workstation or in client reception area.',
          'Prohibited Tools & Products: Credo blades (razor callus blades), alum styptic pencils (reusable sticks spread pathogens; only disposable powder/liquid styptic is permitted), methyl methacrylate (MMA) acrylic liquid, and animals in salons (except certified service animals).',
          'Sanitary Salon Environment: Covered trash cans, separate clean and soiled implement containers properly labeled, and clean towels stored in closed cabinets.',
          'Inspections: State board inspectors have the legal authority to enter and inspect licensed salons during normal business hours without prior notice.',
        ],
      },
    ],
    glossary: [
      { term: 'Scope of Practice', definition: 'The legal boundaries and procedures permitted by a cosmetologist\'s license in that jurisdiction.' },
      { term: 'Credo Blade', definition: 'A razor-type callus shaver prohibited in salons due to risk of surgical cuts and deep infection.' },
      { term: 'Reciprocity', definition: 'Agreement between state boards allowing a licensee from one state to obtain a license in another without retesting.' },
    ],
    quickReviewQuestions: [
      { question: 'Why are reusable styptic pencils prohibited in salons?', answer: 'They contact blood and cannot be sanitized, spreading bloodborne pathogens.' },
      { question: 'Where must a cosmetologist\'s active license be displayed?', answer: 'Conspicuously at the primary workstation or reception area.' },
      { question: 'What is the purpose of the State Board of Cosmetology?', answer: 'To protect the health, safety, and welfare of the consuming public.' },
    ],
  },
};

export function getStudyGuide(id: SubjectId): StudyGuide | undefined {
  return STUDY_GUIDES[id];
}
