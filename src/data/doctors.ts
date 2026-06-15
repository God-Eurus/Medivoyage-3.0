// ── Shared doctor roster ──────────────────────────────────────────────────────
// Single source of truth used by the Doctors booking page and the AI chatbot's
// doctor-matchmaking. Replace calendlyUrl values with real Calendly event URLs.

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  filterTags: string[]; // for matching the filter chips + AI specialty matching
  years: number;
  qualifications: string;
  location: string;
  photo: string;
  about: string;
  hospital: string;
  calendlyUrl: string;
}

export const DOCTORS: Doctor[] = [
  {
    id: 'swaraj-maharwal',
    name: 'Dr. Swaraj Maharwal',
    specialty: 'General Surgery',
    filterTags: ['General Surgery'],
    years: 35,
    qualifications: 'MBBS, MS (General Surgery)',
    location: 'Jaipur',
    photo: '/tauji.png',
    hospital: 'Amar Jain Hospital',
    calendlyUrl: 'https://calendly.com/medivoyage-demo/consultation',
    about:
      'Dr. Swaraj Maharwal is a Senior General Surgeon at Amar Jain Hospital, Jaipur, with over 35 years of clinical and surgical experience. He has built a strong reputation for surgical precision, sound clinical judgement and consistent outcomes across both open and minimally invasive procedures.',
  },
  {
    id: 'gl-sharma',
    name: 'Dr. G L Sharma',
    specialty: 'Cardiology',
    filterTags: ['Cardiology'],
    years: 40,
    qualifications: 'MBBS, MD (Medicine), DM (Cardiology)',
    location: 'Jaipur',
    photo: '/Dr-G-L-Sharma.jpeg',
    hospital: 'Priyanka Hospital & Cardiac Centre',
    calendlyUrl: 'https://calendly.com/medivoyage-demo/consultation',
    about:
      'Dr. G L Sharma is a Senior Consultant Cardiologist at Priyanka Hospital & Cardiac Centre, Jaipur, with 40 years of practice. He brings deep expertise across interventional cardiology, angioplasty and the full spectrum of structural heart interventions.',
  },
  {
    id: 'gunjan-jain',
    name: 'Dr. Gunjan Jain',
    specialty: 'Obstetrics & Gynaecology',
    filterTags: ['Obstetrics & Gynaecology'],
    years: 35,
    qualifications: 'MBBS, MS (Obstetrics & Gynaecology)',
    location: 'Jaipur',
    photo: '/gunjanjain.jpeg',
    hospital: 'Jain Fertility & Mother Care Hospital',
    calendlyUrl: 'https://calendly.com/medivoyage-demo/consultation',
    about:
      'Dr. Gunjan Jain is a Senior Consultant Obstetrician and Gynaecologist with 35 years of experience at Jain Fertility & Mother Care Hospital, Jaipur. Her clinical focus spans high-risk pregnancy, laparoscopic gynaecology and reproductive health.',
  },
  {
    id: 'naresh-somani',
    name: 'Dr. Naresh Somani',
    specialty: 'Medical Oncology',
    filterTags: ['Medical Oncology'],
    years: 30,
    qualifications: 'MBBS, MD, DM (Medical Oncology)',
    location: 'Jaipur',
    photo: '/Dr-Naresh-Somani.jpeg',
    hospital: 'HCG Hospital',
    calendlyUrl: 'https://calendly.com/medivoyage-demo/consultation',
    about:
      'Dr. Naresh Somani is a Senior Medical Oncologist at HCG Hospital, Jaipur, with three decades of experience treating solid tumours and haematological cancers using the latest chemotherapy, targeted therapy and immunotherapy protocols.',
  },
  {
    id: 'manish-munjal',
    name: 'Dr. Manish Munjal',
    specialty: 'Anesthesia & Critical Care',
    filterTags: ['Anesthesia & Critical Care'],
    years: 35,
    qualifications: 'MBBS, MD (Anaesthesia), Fellowship in Critical Care',
    location: 'Jaipur',
    photo: '/Dr-Manish-Munjal.JPG',
    hospital: 'Priyanka Heart & Cardiac Centre',
    calendlyUrl: 'https://calendly.com/medivoyage-demo/consultation',
    about:
      'Dr. Manish Munjal is a Senior Consultant in Anaesthesia and Critical Care at Priyanka Heart & Cardiac Centre, Jaipur, with 35 years of experience. He has overseen anaesthesia for thousands of complex cardiac and surgical cases.',
  },
  {
    id: 'rajkumari-somani',
    name: 'Dr. Rajkumari Somani',
    specialty: 'Obstetrics & Gynaecology',
    filterTags: ['Obstetrics & Gynaecology'],
    years: 30,
    qualifications: 'MBBS, MS (Obstetrics & Gynaecology)',
    location: 'Jaipur',
    photo: '/Rajkumari_Somani.png',
    hospital: 'Somani Hospital',
    calendlyUrl: 'https://calendly.com/medivoyage-demo/consultation',
    about:
      'Dr. Rajkumari Somani is a Senior Obstetrician and Gynaecologist at Somani Hospital, Jaipur, with 30 years of clinical practice across high-risk pregnancy, infertility evaluation and minimally invasive gynaecologic surgery.',
  },
  {
    id: 'kanav-jain',
    name: 'Dr. Kanav Jain',
    specialty: 'Fertility & IVF',
    filterTags: ['Fertility & IVF'],
    years: 10,
    qualifications: 'MBBS, MS, Fellowship in Reproductive Medicine',
    location: 'Mumbai',
    photo: '/kanavjain.jpeg',
    hospital: 'Jain Fertility & Mother Care Hospital',
    calendlyUrl: 'https://calendly.com/medivoyage-demo/consultation',
    about:
      'Dr. Kanav Jain is a Fertility & IVF Specialist at Jain Fertility & Mother Care Hospital with 10 years of focused practice in assisted reproduction, IUI, IVF and advanced reproductive endocrinology.',
  },
  {
    id: 'bilal-mohammed',
    name: 'Dr. Bilal Mohammed',
    specialty: 'Orthopedics',
    filterTags: ['Orthopedics'],
    years: 5,
    qualifications: 'MBBS, MS (Orthopedics)',
    location: 'Jaipur',
    photo: '/Dr.BilalMohammed.jpeg',
    hospital: 'S K Soni Hospital',
    calendlyUrl: 'https://calendly.com/medivoyage-demo/consultation',
    about:
      'Dr. Bilal Mohammed is a Consultant Orthopaedic Surgeon at S K Soni Hospital, Jaipur, with five years of practice spanning joint preservation, sports injuries and arthroscopic procedures.',
  },
  {
    id: 'zoheb-naqvi',
    name: 'Dr. Zoheb Naqvi',
    specialty: 'Anesthesia & Critical Care',
    filterTags: ['Anesthesia & Critical Care'],
    years: 5,
    qualifications: 'MBBS, MD (Anaesthesia)',
    location: 'Jaipur',
    photo: '/drzohebnaqvi.jpeg',
    hospital: 'Mahatma Gandhi Hospital',
    calendlyUrl: 'https://calendly.com/medivoyage-demo/consultation',
    about:
      'Dr. Zoheb Naqvi is a Consultant in Anaesthesia and Critical Care at Mahatma Gandhi Hospital, Jaipur. He focuses on safe peri-operative care and ICU management for both elective and emergency cases.',
  },
  {
    id: 'prachi-mathur',
    name: 'Dr. Prachi Mathur',
    specialty: 'Anesthesia & Pain Management',
    filterTags: ['Anesthesia & Pain Management'],
    years: 10,
    qualifications: 'MBBS, MD (Anaesthesia), Fellowship in Pain Management',
    location: 'Jaipur',
    photo: '/prachimathur.jpeg',
    hospital: 'Jain Fertility & Mother Care Hospital',
    calendlyUrl: 'https://calendly.com/medivoyage-demo/consultation',
    about:
      'Dr. Prachi Mathur is a Consultant Anaesthesiologist and Pain Specialist at Jain Fertility & Mother Care Hospital with 10 years of practice. She specialises in interventional pain management and obstetric anaesthesia.',
  },
  {
    id: 'rita-munjal',
    name: 'Dr. Rita Munjal',
    specialty: 'Dentistry',
    filterTags: ['Dentistry'],
    years: 30,
    qualifications: 'BDS, MDS',
    location: 'Jaipur',
    photo: '/Dr-Rita-Munjal.JPG',
    hospital: 'Munjal Dental Clinic',
    calendlyUrl: 'https://calendly.com/medivoyage-demo/consultation',
    about:
      'Dr. Rita Munjal is the founder and lead dentist at Munjal Dental Clinic, Jaipur, with 30 years of practice across general, restorative and aesthetic dentistry.',
  },
  {
    id: 'shitanshu-shah',
    name: 'Dr. Shitanshu Shah',
    specialty: 'Dentistry (Prosthodontist & Implantologist)',
    filterTags: ['Dentistry'],
    years: 5,
    qualifications: 'BDS, MDS (Prosthodontics), Implantology Certification',
    location: 'Ahmedabad',
    photo: '/Dr-Shitanshu-Shah.jpg',
    hospital: 'Haasya Mantra Clinic & Implant Centre',
    calendlyUrl: 'https://calendly.com/medivoyage-demo/consultation',
    about:
      'Dr. Shitanshu Shah is a Prosthodontist and Implantologist at Haasya Mantra Clinic & Implant Centre, Ahmedabad. He specialises in dental implants, full-mouth rehabilitation and smile-design prosthodontics.',
  },
  {
    id: 'jhanvi-patel',
    name: 'Dr. Jhanvi Patel',
    specialty: 'Dentistry (Endodontist)',
    filterTags: ['Dentistry'],
    years: 5,
    qualifications: 'BDS, MDS (Endodontics)',
    location: 'Ahmedabad',
    photo: '/Dr-Jahanvi-Patel.jpg',
    hospital: 'Haasya Mantra Clinic & Implant Centre',
    calendlyUrl: 'https://calendly.com/medivoyage-demo/consultation',
    about:
      'Dr. Jhanvi Patel is a Consultant Endodontist at Haasya Mantra Clinic & Implant Centre, Ahmedabad, specialising in root canal therapy, microsurgical endodontics and saving compromised teeth.',
  },
];

// ── Specialty detection for the AI chatbot ────────────────────────────────────
// Maps a free-text health query to the filterTags used in the roster above.
// Order matters: more specific patterns are checked first.

export interface SpecialtyMatch {
  tags: string[];       // filterTags to match doctors against
  label: string;        // human-friendly name used in chat copy
}

const SPECIALTY_RULES: Array<{ pattern: RegExp; match: SpecialtyMatch }> = [
  {
    pattern: /ivf|fertility|infertil|conceiv|trying for a baby|iui|embryo/i,
    match: { tags: ['Fertility & IVF', 'Obstetrics & Gynaecology'], label: 'fertility' },
  },
  {
    pattern: /pregnan|period|menstrual|pms|pcos|pcod|menopause|hormonal|gynae|gynec|uterus|ovar|vaginal|breast pain|lactat/i,
    match: { tags: ['Obstetrics & Gynaecology', 'Fertility & IVF'], label: "women's health" },
  },
  {
    pattern: /bone|joint|knee|hip|shoulder|fracture|sprain|arthritis|ortho|spine|back pain|neck pain|ligament|acl|posture|wrist|ankle|elbow/i,
    match: { tags: ['Orthopedics'], label: 'orthopaedic' },
  },
  {
    pattern: /heart|cardiac|chest pain|palpitation|blood pressure|\bbp\b|hypertension|cholesterol|angina|breathless/i,
    match: { tags: ['Cardiology'], label: 'heart' },
  },
  {
    pattern: /cancer|tumor|tumour|oncolog|chemo|lump|biopsy|malignan/i,
    match: { tags: ['Medical Oncology'], label: 'cancer care' },
  },
  {
    pattern: /tooth|teeth|dental|gum|cavity|root canal|implant|braces|wisdom/i,
    match: { tags: ['Dentistry'], label: 'dental' },
  },
  {
    pattern: /chronic pain|nerve pain|pain management|sciatica|neuropath/i,
    match: { tags: ['Anesthesia & Pain Management'], label: 'pain management' },
  },
  // General fallback — fever, headache, stomach, diarrhea and other everyday issues
  {
    pattern: /headache|migraine|fever|cough|cold|flu|stomach|diarrhea|diarrhoea|nausea|vomit|fatigue|dizz|weak|infection|throat|acidity|constipat|piles|hernia|kidney stone|urin/i,
    match: { tags: ['General Surgery'], label: 'general medicine' },
  },
];

/** Detect which specialty a health query relates to, if any. */
export function detectSpecialty(query: string): SpecialtyMatch | null {
  for (const rule of SPECIALTY_RULES) {
    if (rule.pattern.test(query)) return rule.match;
  }
  return null;
}

/** Get doctors whose filterTags intersect the given specialty tags. */
export function doctorsForSpecialty(tags: string[]): Doctor[] {
  return DOCTORS.filter((d) => d.filterTags.some((t) => tags.includes(t)));
}
