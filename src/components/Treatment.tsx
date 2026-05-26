import { useState, useMemo } from 'react';
import {
  ArrowUpRight, ArrowLeft, Search, Clock, Calendar, Stethoscope,
  CheckCircle2, Sparkles, ArrowRight, ChevronDown, AlertTriangle,
  ClipboardCheck, Heart, Activity,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { StickyCTA } from './StickyCTA';
import { BottomInquiry } from './BottomInquiry';

// ════════════════════════════════════════════════════════════════════════════
// DATA — categories + treatments with full descriptions
// ════════════════════════════════════════════════════════════════════════════

interface Treatment {
  slug: string;
  title: string;
  price: number;
  recovery: string;
  duration: string;
  hospitalStay: string;
  description: string;
  benefits: string[];
  whatToExpect: string[];
  preparation: string[];
  postCare: string[];
  risks: string[];
  faqs: { q: string; a: string }[];
}

interface Category {
  key: string;
  title: string;
  desc: string;
  image: string;
}

const categories: Category[] = [
  { key: 'cardiac',         title: 'Cardiac Sciences',  desc: 'Advanced cardiovascular interventions.', image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?q=80&w=1000&auto=format&fit=crop' },
  { key: 'orthopaedics',    title: 'Orthopaedics',      desc: 'Joint replacement & sports medicine.',    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1000&auto=format&fit=crop' },
  { key: 'neuro',           title: 'Neuro Sciences',    desc: 'Brain & spine surgical excellence.',      image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=1000&auto=format&fit=crop' },
  { key: 'general',         title: 'General Surgery',   desc: 'Minimally invasive laparoscopy.',         image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=1000&auto=format&fit=crop' },
  { key: 'ent',             title: 'ENT',               desc: 'Sinus, nasal & throat care.',             image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=1000&auto=format&fit=crop' },
  { key: 'gynae',           title: 'Gynaecology',       desc: "Women's reproductive health.",            image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1000&auto=format&fit=crop' },
  { key: 'urology',         title: 'Urology',           desc: 'Kidney & prostate treatments.',           image: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?q=80&w=1000&auto=format&fit=crop' },
  { key: 'gastro',          title: 'Gastroenterology',  desc: 'Digestive & GI treatments.',              image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=1000&auto=format&fit=crop' },
  { key: 'ophthalmology',   title: 'Ophthalmology',     desc: 'Eye care & vision restoration.',          image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?q=80&w=1000&auto=format&fit=crop' },
  { key: 'infertility',     title: 'Infertility',       desc: 'IUI, IVF & fertility care.',              image: 'https://images.unsplash.com/photo-1612531385446-f7e6d131e1d0?q=80&w=1000&auto=format&fit=crop' },
  { key: 'oncology',        title: 'Radiation Oncology', desc: 'Advanced cancer therapies.',              image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=1000&auto=format&fit=crop' },
  { key: 'cosmetic',        title: 'Cosmetic & Plastic', desc: 'Aesthetic & reconstructive procedures.', image: 'https://images.unsplash.com/photo-1512462615634-82a9d8a59489?q=80&w=1000&auto=format&fit=crop' },
  { key: 'dental',          title: 'Dental Care',       desc: 'Implants, veneers & rehabilitation.',     image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1000&auto=format&fit=crop' },
];

// Generic content used as a sensible default — overridden per-treatment where it matters
const defaultExpect = [
  'Pre-operative consultation with your specialist and anaesthesiologist',
  'Admission, anaesthesia and the procedure itself in a modern operating theatre',
  'Recovery in a dedicated post-op suite with continuous monitoring',
  'Discharge with detailed home-care instructions and a follow-up schedule',
];
const defaultPrep = [
  'Fasting for 6–8 hours before the procedure',
  'Stop blood-thinning medications 5–7 days prior (only on doctor advice)',
  'Complete pre-op investigations: blood work, ECG, imaging',
  'Arrange a companion for the day of the procedure',
];
const defaultPostCare = [
  'Take prescribed medications exactly as directed',
  'Keep the surgical area clean and dry — follow dressing instructions',
  'Light walking within 24 hours unless told otherwise',
  'Attend all follow-up appointments and call your coordinator if anything feels off',
];
const defaultRisks = [
  'Mild bleeding, bruising or temporary swelling at the site',
  'Reaction to anaesthesia (rare with modern protocols)',
  'Infection (minimised with sterile technique and antibiotics)',
  'Slow healing in patients with diabetes or immune conditions',
];
const defaultFaqs = [
  { q: 'Is this procedure safe?', a: 'It is performed routinely at MediVoyage-partnered hospitals with strong safety records. Your specialist will discuss any individual risk factors during consultation.' },
  { q: 'Will I need someone to accompany me?', a: 'Yes, we strongly recommend a family member or attendant for the day of the procedure and the first 24 hours afterwards.' },
  { q: 'Does the quoted price include everything?', a: 'The package includes the procedure, hospital stay, medication and follow-up. Travel and accommodation are quoted separately by our concierge.' },
  { q: 'How soon can I travel back home?', a: 'Most patients can fly within the recovery window listed on this page. Your doctor will give you a clearance certificate before discharge.' },
];

const defaultBenefits = [
  'Performed by world-class specialists',
  'JCI-accredited hospital partners',
  'Transparent, fixed pricing',
  'End-to-end concierge support',
];

// Helper to create a Treatment with sensible defaults — keeps the data table concise
function t(slug: string, title: string, price: number, duration: string, recovery: string, hospitalStay: string, description: string, benefits?: string[]): Treatment {
  return {
    slug, title, price, duration, recovery, hospitalStay, description,
    benefits: benefits || defaultBenefits,
    whatToExpect: defaultExpect,
    preparation: defaultPrep,
    postCare: defaultPostCare,
    risks: defaultRisks,
    faqs: defaultFaqs,
  };
}

const treatmentsByCategory: Record<string, Treatment[]> = {

  // ── Cardiac Sciences ─────────────────────────────────────────────────────
  cardiac: [
    t('angiography',                       'Angiography (with Non-ionic Contrast)',         431,  '30–45 min',    '1 Day',     'Day care (4–6 hrs)', "A test that uses a special dye and X-rays to see how blood is flowing through your heart's arteries. Helps doctors spot blockages."),
    t('angioplasty',                       'Angioplasty',                                   1668, '1–2 hrs',      '2 Days',    '2 nights',           "A non-surgical way to open blocked heart arteries using a tiny balloon and a small mesh tube (stent)."),
    t('arterial-switch-surgery',           'Arterial Switch Surgery',                       6900, '4–6 hrs',      '6 Weeks',   '10–14 nights',       "A complex newborn heart surgery for babies born with their two main heart arteries connected the wrong way around."),
    t('asd',                                'Atrial Septal Defect (ASD) Repair',             4600, '2–4 hrs',      '4 Weeks',   '5–7 nights',         "Surgery to close a hole between the upper chambers of the heart, usually present from birth."),
    t('balloon-valvuloplasty',              'Balloon Valvuloplasty',                         1668, '1–2 hrs',      '2 Days',    '2 nights',           "Opens up a stiffened heart valve using a tiny balloon, restoring smooth blood flow."),
    t('balloon-angioplasty',                'Balloon Angioplasty',                           1035, '1 hr',         '2 Days',    '1–2 nights',         "Opens narrowed blood vessels with a small balloon — no stent placement."),
    t('balloon-atrial-septostomy',          'Balloon Atrial Septostomy',                     1035, '30–60 min',    '1 Week',    '2–3 nights',         "Creates an opening between heart chambers in newborns to improve oxygen flow."),
    t('balloon-mitral-valvotomy',           'Balloon Mitral Valvotomy',                      1518, '1–2 hrs',      '3 Days',    '2 nights',           "Opens up a narrowed mitral valve in the heart using a balloon."),
    t('bentall-procedure',                  'Bentall Procedure',                             6900, '4–6 hrs',      '6 Weeks',   '7–10 nights',        "Replaces the aortic valve and the start of the aorta together in a single complex surgery."),
    t('cabg-redo',                          'CABG (Redo)',                                   4169, '4–6 hrs',      '4 Weeks',   '7–10 nights',        "A repeat bypass surgery for patients who had a previous bypass that now needs revision."),
    t('cardiac-ablation',                   'Cardiac Ablation',                              1121, '2–4 hrs',      '1 Week',    '1–2 nights',         "A minimally invasive procedure that fixes irregular heart rhythms by targeting problem areas in the heart's electrical system."),
    t('cardiac-catheterization',            'Cardiac Catheterization',                       334,  '30–60 min',    '1 Day',     'Day care',           "A thin tube is passed into the heart to measure pressures and assess function."),
    t('cardiac-valve-replacement',          'Cardiac Valve Replacement',                     4169, '3–5 hrs',      '5 Weeks',   '7–10 nights',        "Replaces a damaged heart valve with an artificial or biological one."),
    t('closed-heart-surgery',               'Closed Heart Surgery',                          2473, '2–4 hrs',      '3 Weeks',   '5–7 nights',         "Heart surgery done without fully opening the chest — less invasive than traditional bypass."),
    t('cabg',                               'CABG (Coronary Artery Bypass Grafting)',        4169, '3–6 hrs',      '3 Weeks',   '5–7 nights',         "Heart bypass surgery that creates new routes for blood to flow around blocked arteries, using healthy vessels from elsewhere in your body."),
    t('crt-p',                              'CRT-P (Pacemaker Resynchronisation)',           4169, '2–3 hrs',      '1 Week',    '2–3 nights',         "A pacemaker that synchronises both sides of the heart for patients with heart failure."),
    t('crt-d',                              'CRT-D (Resynchronisation + Defibrillator)',     5750, '2–4 hrs',      '1 Week',    '2–3 nights',         "Combines heart-synchronisation with a defibrillator that can restart the heart if it stops."),
    t('device-closure-asd',                 'Device Closure of ASD',                         4169, '1–2 hrs',      '1 Week',    '1–2 nights',         "Closes a hole in the heart using a small device — no open-chest surgery needed."),
    t('dual-chamber-pacemaker',             'Dual Chamber Pacemaker',                        5750, '1–2 hrs',      '1 Week',    '1–2 nights',         "A pacemaker that helps both upper and lower heart chambers beat in proper rhythm."),
    t('ep-study-rfa',                       'EP Study & RFA',                                1121, '2–4 hrs',      '1 Week',    '1–2 nights',         "Maps your heart's electrical system and then heats the problem spots to fix abnormal rhythms."),
    t('glenn-procedure',                    'Glenn Procedure',                               4169, '3–5 hrs',      '4 Weeks',   '5–7 nights',         "A staged heart surgery for babies born with single-ventricle heart defects."),
    t('double-valve-replacement',           'Double Valve Replacement',                      8338, '5–7 hrs',      '6 Weeks',   '10–14 nights',       "Replaces two damaged heart valves during a single surgery."),
    t('icd-combo-device',                   'ICD Combo Device',                              6900, '2–4 hrs',      '1 Week',    '2–3 nights',         "A combined pacemaker and defibrillator implanted to prevent sudden cardiac death."),
    t('impella-implantation',               'Impella Implantation',                          4169, '1–2 hrs',      '2 Weeks',   '3–5 nights',         "A tiny pump implanted to support a weakened heart while it recovers."),
    t('intra-aortic-balloon-pump',          'Intra-aortic Balloon Pump',                     4169, '1–2 hrs',      '2 Weeks',   '3–5 nights',         "A balloon device that helps the heart pump blood while it heals."),
    t('lv-restoration-surgery',             'Left Ventricular Restoration Surgery',          4456, '4–6 hrs',      '6 Weeks',   '7–10 nights',        "Reshapes a damaged heart's left chamber to improve its pumping ability."),
    t('pacemaker-single-chamber',           'Pacemaker Implant (Single Chamber)',            4169, '1–2 hrs',      '1 Week',    '1–2 nights',         "A small device implanted to keep your heart beating at a steady rhythm."),
    t('pda-closure',                        'PDA Closure',                                   2473, '1–2 hrs',      '1 Week',    '1–2 nights',         "Closes a small blood-vessel connection that was supposed to close at birth but didn't."),
    t('pediatric-cardiomyopathy',           'Pediatric Cardiomyopathy with Implant',         4801, '3–5 hrs',      '4 Weeks',   '5–7 nights',         "Treatment for children whose heart muscles are weakened — includes implant support."),
    t('ross-procedure',                     'Ross Procedure',                                6900, '5–7 hrs',      '6 Weeks',   '7–10 nights',        "A valve replacement that uses the patient's own pulmonary valve instead of an artificial one."),
    t('tapvc-repair',                       'TAPVC Repair',                                  6900, '4–6 hrs',      '6 Weeks',   '7–10 nights',        "Surgery to fix a heart defect where pulmonary veins drain into the wrong place."),
    t('tof-repair',                         'Tetralogy of Fallot (TOF) Repair',              5750, '4–6 hrs',      '6 Weeks',   '7–10 nights',        "Surgery that corrects four combined heart defects babies are sometimes born with."),
    t('vsd-closure',                        'VSD Closure Repair',                            4169, '2–4 hrs',      '4 Weeks',   '5–7 nights',         "Closes a hole in the wall between the two lower chambers of the heart."),
    t('fontan-procedure',                   'Fontan Procedure',                              9315, '4–6 hrs',      '6 Weeks',   '10–14 nights',       "The final stage of heart surgery for children born with single-ventricle heart defects."),
    t('atherectomy',                        'Atherectomy',                                   2473, '1–2 hrs',      '1 Week',    '2 nights',           "Removes hard plaque buildup from arteries to restore healthy blood flow."),
    t('norwood-surgery',                    'Norwood Surgery',                               9315, '5–7 hrs',      '6 Weeks',   '14+ nights',         "The first of three surgeries for babies born with hypoplastic left heart syndrome."),
  ],

  // ── Orthopaedics ─────────────────────────────────────────────────────────
  orthopaedics: [
    t('ac-joint-separation',           'AC Joint Separation Repair',                  1081, '1–2 hrs',  '6 Weeks',   '1–2 nights', "Surgery to repair a separated shoulder joint between the collarbone and shoulder blade."),
    t('ankle-arthrodesis',             'Ankle Arthrodesis',                           863,  '2–3 hrs',  '8 Weeks',   '2–3 nights', "Fuses the ankle bones together to relieve pain from severe arthritis."),
    t('acl-reconstruction',            'ACL Reconstruction',                          2645, '1.5–2 hrs','4 Months',  'Day care',   "Rebuilds a torn ACL ligament in the knee — common sports injury surgery."),
    t('carpal-tunnel-release',         'Carpal Tunnel Release',                       1116, '30 min',   '2 Weeks',   'Day care',   "Releases a pinched nerve in the wrist to fix numbness, tingling and weakness in the hand."),
    t('corrective-osteotomy',          'Corrective Osteotomy with Bone Graft',        667,  '2–3 hrs',  '8 Weeks',   '2–3 nights', "Cuts and realigns a bone to correct deformity or improve joint function."),
    t('achilles-debridement',          'Debridement of the Achilles Tendon',          667,  '1 hr',     '6 Weeks',   'Day care',   "Removes damaged tissue from the Achilles tendon to relieve chronic pain."),
    t('disc-replacement',              'Disc Replacement (Cervical/Lumbar)',          1668, '2–3 hrs',  '6 Weeks',   '2–3 nights', "Replaces a damaged spinal disc with an artificial one while preserving normal motion."),
    t('high-tibial-osteotomy',         'High Tibial Osteotomy (HTO)',                 1794, '1–2 hrs',  '8 Weeks',   '2–3 nights', "Reshapes the shinbone to take pressure off a worn-out part of the knee — alternative to replacement."),
    t('total-hip-replacement-bl',      'Total Hip Replacement (Both Sides)',          6038, '3–5 hrs',  '6 Weeks',   '5–7 nights', "Replaces both hip joints with artificial ones in a single hospital stay."),
    t('total-hip-replacement-ul',      'Total Hip Replacement (One Side)',            3019, '1.5–3 hrs','5 Weeks',   '3–5 nights', "Replaces a worn or damaged hip joint with an artificial one so you can walk pain-free again."),
    t('total-knee-replacement-bl',     'Total Knee Replacement (Both Sides)',         6613, '3–4 hrs',  '6 Weeks',   '5–7 nights', "Replaces both knee joints with artificial ones in a single hospital stay."),
    t('total-knee-replacement-ul',     'Total Knee Replacement (One Side)',           3306, '1.5–2 hrs','4 Weeks',   '3–5 nights', "Replaces a worn-out knee joint with a smooth artificial one so you can walk without pain."),
    t('limb-lengthening',              'Limb Lengthening / Shortening Surgery',       3145, '3–5 hrs',  '6 Months',  '5–7 nights', "Gradually lengthens or shortens a limb to correct a deformity or leg-length difference."),
  ],

  // ── Neuro Sciences ───────────────────────────────────────────────────────
  neuro: [
    t('aneurysm-clipping',             'Aneurysm Clipping',                           3312, '3–5 hrs',  '6 Weeks',   '5–7 nights', "Places a tiny clip on a weak spot of a brain blood vessel to prevent it from rupturing."),
    t('anterior-cervical-discectomy',  'Anterior Cervical Discectomy',                1668, '1–2 hrs',  '4 Weeks',   '2–3 nights', "Removes a damaged disc in the neck to relieve pinched-nerve pain."),
    t('acdf',                          'Anterior Cervical Discectomy & Fusion (ACDF)', 3312, '2–3 hrs',  '6 Weeks',   '2–3 nights', "Removes a damaged neck disc and fuses the vertebrae together for stability."),
    t('brachial-plexus',               'Brachial Plexus / Stereotactic Procedure',    3312, '4–6 hrs',  '8 Weeks',   '5–7 nights', "Repairs a network of nerves controlling the arm — often after a serious injury."),
    t('brain-tumour',                  'Brain Tumour Surgery',                        3019, '4–8 hrs',  '6 Weeks',   '7–10 nights', "Removes a brain tumour using advanced navigation and minimally invasive techniques."),
    t('carotid-endarterectomy',        'Carotid Endarterectomy',                      4025, '2–3 hrs',  '3 Weeks',   '2–3 nights', "Removes plaque from the carotid artery in the neck to lower stroke risk."),
    t('cerebral-angiogram',            'Cerebral Angiogram',                          288,  '30–90 min','1 Day',     'Day care',   "An imaging test that uses dye and X-rays to look at blood vessels in the brain."),
    t('carotid-angioplasty',           'Carotid Angioplasty',                         4025, '2–3 hrs',  '1 Week',    '2 nights',   "Opens up a narrowed carotid artery with a balloon and stent to prevent stroke."),
    t('cervical-corpectomy',           'Cervical Corpectomy',                         3019, '3–4 hrs',  '6 Weeks',   '3–5 nights', "Removes a damaged vertebra in the neck to relieve pressure on the spinal cord."),
    t('craniotomy',                    'Craniotomy',                                  3312, '3–6 hrs',  '6 Weeks',   '5–7 nights', "A precise brain surgery used to remove tumours, treat aneurysms or repair injury."),
    t('endovascular-avm',              'Endovascular Embolisation of AVM',            4169, '3–5 hrs',  '4 Weeks',   '3–5 nights', "Treats abnormal brain blood vessels by sealing them off from inside the artery."),
    t('endo-surgery-avm',              'Endovascular Surgery for AVM',                3019, '3–5 hrs',  '4 Weeks',   '3–5 nights', "Surgically treats abnormal brain blood vessels using minimally invasive techniques."),
    t('epilepsy-surgery',              'Epilepsy Surgery',                            3312, '4–8 hrs',  '6 Weeks',   '5–7 nights', "Removes the small brain area causing seizures when medications no longer control them."),
    t('external-vent-drainage',        'External Ventricular Drainage',               2645, '1–2 hrs',  '2 Weeks',   '3–5 nights', "Drains excess fluid from the brain to relieve dangerous pressure."),
    t('kyphoplasty',                   'Kyphoplasty',                                 2645, '30–90 min','1 Week',    '1 night',    "Fixes spinal compression fractures with a small balloon and bone cement."),
    t('microdiscectomy',               'Microdiscectomy',                             4456, '1–2 hrs',  '4 Weeks',   '1–2 nights', "Removes part of a herniated disc through a small incision to relieve nerve pain."),
    t('spina-bifida',                  'Spina Bifida Surgery',                        3019, '2–4 hrs',  '4 Weeks',   '5–7 nights', "Corrects a birth defect of the spine to prevent further nerve damage."),
  ],

  // ── General Surgery ──────────────────────────────────────────────────────
  general: [
    t('appendectomy',                 'Appendectomy',                                  1668, '45–60 min', '2 Weeks',   '1–2 nights', "Keyhole surgery to remove an inflamed appendix. Only three small cuts and most people go home in 1–2 days."),
    t('abdominal-hysterectomy',       'Abdominal Hysterectomy',                       1984, '2–3 hrs',   '3 Weeks',   '3–5 nights', "Removes the uterus through an abdominal incision — done for fibroids, prolapse or cancer."),
    t('kasai-procedure',              'Kasai Procedure',                              4169, '4–6 hrs',   '6 Weeks',   '7–10 nights', "Restores bile flow in newborns born with blocked bile ducts (biliary atresia)."),
    t('lap-gallbladder',              'Laparoscopic Gallbladder Removal',             1668, '1–2 hrs',   '2 Weeks',   '1–2 nights', "Keyhole surgery to remove a problematic gallbladder — usually because of gallstones."),
    t('hernia-repair',                'Hernia Repair',                                1668, '1–2 hrs',   '2 Weeks',   '1–2 nights', "Repairs a hernia (a weakness in the abdominal wall) using a small mesh patch."),
    t('rectal-polyp-removal',         'Rectal Polyp Removal',                         506,  '30 min',    '1 Week',    'Day care',   "Removes growths (polyps) from the rectum during a colonoscopy to prevent cancer."),
    t('thyroidectomy',                'Thyroidectomy',                                995,  '2–3 hrs',   '2 Weeks',   '1–2 nights', "Removes part or all of the thyroid gland — done for nodules, goitre or cancer."),
    t('varicose-vein',                'Varicose Vein Treatment',                      1668, '1–2 hrs',   '1 Week',    'Day care',   "Treats bulging, painful veins in the legs using minimally invasive techniques."),
    t('whipple-procedure',            'Whipple Procedure',                            4169, '6–10 hrs',  '8 Weeks',   '10–14 nights', "A complex surgery for pancreatic cancer that removes the pancreas head and parts of nearby organs."),
    t('haemorrhoids',                 'Haemorrhoid Surgery',                          1668, '30–60 min', '2 Weeks',   '1–2 nights', "Treats severe haemorrhoids that don't respond to home remedies or medications."),
  ],

  // ── ENT ──────────────────────────────────────────────────────────────────
  ent: [
    t('cochlear-implant',             'Cochlear Implant',                             14375, '2–3 hrs',   '4 Weeks',   '1–2 nights', "An electronic device implanted to restore hearing in people with severe hearing loss."),
    t('laryngectomy',                 'Laryngectomy',                                 4169, '4–6 hrs',   '6 Weeks',   '7–10 nights', "Removes the voice box — usually performed for advanced laryngeal cancer."),
    t('septoplasty',                  'Septoplasty',                                  506,  '30–90 min', '1 Week',    'Day care',   "Straightens the wall inside your nose so you can breathe more easily through both nostrils."),
    t('tympanoplasty',                'Tympanoplasty',                                667,  '1–2 hrs',   '2 Weeks',   'Day care',   "Repairs a hole in the eardrum to restore hearing and prevent infections."),
    t('tonsillectomy',                'Tonsillectomy',                                995,  '30–45 min', '1 Week',    'Day care',   "Removes the tonsils to stop recurrent throat infections or breathing problems."),
    t('adenoidectomy',                'Adenoidectomy',                                506,  '20–30 min', '1 Week',    'Day care',   "Removes enlarged adenoids that cause breathing or ear problems in children."),
    t('parotidectomy',                'Parotidectomy',                                1668, '2–3 hrs',   '2 Weeks',   '2–3 nights', "Removes part or all of the parotid (salivary) gland — usually for tumours."),
    t('anterior-skull-base',          'Anterior Skull Base Surgery',                  1668, '3–5 hrs',   '4 Weeks',   '3–5 nights', "Removes tumours at the base of the skull using endoscopic, minimally invasive techniques."),
    t('lateral-skull-base',           'Advanced Lateral Skull Base Surgery',          3019, '4–6 hrs',   '6 Weeks',   '5–7 nights', "Complex surgery to remove tumours at the side of the skull near critical nerves."),
    t('nasopharyngeal-tumour',        'Resection of Nasopharyngeal Tumour',           2645, '3–4 hrs',   '4 Weeks',   '3–5 nights', "Removes a tumour from the upper part of the throat behind the nose."),
    t('orif-face',                    'ORIF — Maxilla / Mandible / Zygoma',           995,  '2–3 hrs',   '4 Weeks',   '2–3 nights', "Repairs facial fractures by realigning the bones and securing them with small plates."),
    t('canaloplasty-eac',             'Canaloplasty for EAC Atresia',                 506,  '2–3 hrs',   '2 Weeks',   'Day care',   "Rebuilds the ear canal in patients born without one (or with a closed canal)."),
    t('stapedectomy',                 'Stapedectomy / Tympanotomy',                   667,  '1–2 hrs',   '2 Weeks',   'Day care',   "Replaces a small bone in the middle ear to restore hearing in otosclerosis."),
    t('open-sinus-surgery',           'Open Sinus Surgery',                           667,  '1–2 hrs',   '2 Weeks',   '1 night',    "Treats complex sinus conditions through a traditional surgical approach."),
    t('fess',                         'Functional Endoscopic Sinus Surgery (FESS)',   667,  '1–2 hrs',   '1 Week',    'Day care',   "Uses a tiny camera to open blocked sinuses — relieves chronic sinusitis."),
  ],

  // ── Gynaecology ──────────────────────────────────────────────────────────
  gynae: [
    t('c-section',                    'C-Section',                                    1668, '30–60 min', '4 Weeks',   '3–5 nights', "A surgical birth where the baby is delivered through an incision in the abdomen."),
    t('vaginal-myomectomy',           'Vaginal Myomectomy',                           667,  '1–2 hrs',   '2 Weeks',   '1–2 nights', "Removes uterine fibroids through the vagina — no abdominal incision needed."),
    t('vulvectomy',                   'Vulvectomy with Reconstruction',               1984, '2–4 hrs',   '4 Weeks',   '3–5 nights', "Removes part of the vulva (usually for cancer) and reconstructs the area."),
    t('vvf-repair',                   'Vaginal Repair for Vesico-vaginal Fistula',    1254, '2–3 hrs',   '3 Weeks',   '2–3 nights', "Repairs an abnormal opening between the bladder and the vagina."),
    t('laparotomy-hematoma',          'Laparotomy for Broad Ligament Hematoma',       1254, '1–2 hrs',   '2 Weeks',   '2–3 nights', "Emergency surgery to drain a serious blood collection in the broad ligament."),
    t('burst-abdomen-closure',        'Closure of Burst Abdomen',                     667,  '1–2 hrs',   '3 Weeks',   '3–5 nights', "Re-closes the abdominal wall after a surgical wound has opened up."),
    t('uterine-fistula-repair',       'Uretero-vaginal / Uterine Fistula Repair',     995,  '2–3 hrs',   '3 Weeks',   '2–3 nights', "Repairs an abnormal opening between the urinary tract and the uterus or vagina."),
    t('sterilisation-reversal',       'Reversal of Sterilisation / Tuboplasty',       1254, '2–3 hrs',   '2 Weeks',   '1–2 nights', "Reverses a previous tubal ligation to allow natural pregnancy."),
    t('sling-prolapse',               'Sling Surgery for Prolapse',                   1254, '1–2 hrs',   '3 Weeks',   '1–2 nights', "Supports a prolapsed pelvic organ using a mesh sling."),
    t('salpingoophorectomy',          'Salpingo-oophorectomy',                        3019, '2–3 hrs',   '3 Weeks',   '2–3 nights', "Removes the ovaries and fallopian tubes — sometimes done for cancer or genetic risk."),
    t('burch-procedure',              'Burch Procedure',                              1254, '1–2 hrs',   '3 Weeks',   '1–2 nights', "Treats stress urinary incontinence by lifting and supporting the bladder."),
    t('rectovaginal-fistula',         'Rectovaginal Fistula Repair',                  995,  '2–3 hrs',   '3 Weeks',   '2–3 nights', "Repairs an abnormal opening between the rectum and the vagina."),
    t('hysteroscopic-myomectomy',     'Hysteroscopic Myomectomy',                     667,  '1 hr',      '1 Week',    'Day care',   "Removes fibroids from inside the uterus using a thin camera through the cervix."),
    t('urethrovaginal-fistula',       'Urethrovaginal Fistula Repair',                506,  '1–2 hrs',   '2 Weeks',   '1–2 nights', "Repairs an abnormal opening between the urethra and the vagina."),
  ],

  // ── Urology ──────────────────────────────────────────────────────────────
  urology: [
    t('eswl',                         'ESWL (Shock Wave Lithotripsy)',                506,  '45–60 min', '2 Days',    'Day care',   "A non-surgical way to break up kidney stones using focused sound waves. No cuts, no anaesthesia."),
    t('hypospadias',                  'Hypospadias Surgery',                          1254, '1–3 hrs',   '2 Weeks',   '1–2 nights', "Corrects a birth defect where the urethra opening is on the underside of the penis."),
    t('kidney-stone-removal',         'Kidney Stone Removal',                         1984, '1–2 hrs',   '1 Week',    '1–2 nights', "Removes larger kidney stones that can't pass naturally — usually keyhole surgery."),
    t('nephrectomy',                  'Nephrectomy',                                  1984, '2–4 hrs',   '4 Weeks',   '3–5 nights', "Removes a kidney — usually for tumours, severe damage or as part of a donor surgery."),
    t('turbt',                        'TURBT (Bladder Tumour Resection)',             1668, '1–2 hrs',   '1 Week',    '1–2 nights', "Removes a tumour from the bladder lining through the urethra — no external cuts."),
    t('turp',                         'TURP (Prostate Resection)',                    1668, '1–2 hrs',   '2 Weeks',   '2–3 nights', "Trims an enlarged prostate to improve urinary flow — done through the urethra."),
    t('vasectomy',                    'Vasectomy',                                    506,  '20–30 min', '1 Week',    'Day care',   "A simple permanent male sterilisation procedure done under local anaesthesia."),
  ],

  // ── Gastroenterology ─────────────────────────────────────────────────────
  gastro: [
    t('ercp',                         'ERCP (Diagnostic)',                            995,  '30–90 min', '2 Days',    'Day care',   "Combines endoscopy and X-rays to diagnose and treat problems of the bile ducts and pancreas."),
    t('capsule-endoscopy',            'Capsule Endoscopy',                            506,  '20 min',    '1 Day',     'Outpatient', "You swallow a tiny camera in a pill that takes pictures of your entire digestive tract."),
    t('endoscopy',                    'UGI Endoscopy',                                69,   '15–30 min', '1 Day',     'Outpatient', "A thin camera examines your oesophagus, stomach and upper small intestine."),
    t('choledochoduodenostomy',       'Choledochoduodenostomy',                       1984, '3–4 hrs',   '4 Weeks',   '5–7 nights', "Creates a new connection between the bile duct and small intestine to bypass blockages."),
    t('porto-caval-anastomosis',      'Porto Caval Anastomosis',                      1984, '4–6 hrs',   '6 Weeks',   '7–10 nights', "Reroutes blood flow around the liver to treat severe portal hypertension."),
    t('gastrectomy',                  'Gastrectomy',                                  3019, '3–5 hrs',   '6 Weeks',   '7–10 nights', "Removes part or all of the stomach — usually for cancer or severe ulcers."),
    t('oesophagectomy',               'Oesophagectomy',                               995,  '4–6 hrs',   '6 Weeks',   '7–10 nights', "Removes part of the oesophagus — usually for cancer."),
    t('heller-myotomy',               'Heller Myotomy',                               506,  '1–2 hrs',   '2 Weeks',   '1–2 nights', "Loosens the muscle at the bottom of the oesophagus to treat achalasia (swallowing difficulty)."),
    t('sigmoid-resection',            'Sigmoid Resection',                            1254, '2–4 hrs',   '4 Weeks',   '5–7 nights', "Removes a diseased portion of the lower colon — for diverticulitis or cancer."),
    t('gastrojejunostomy',            'Gastrojejunostomy',                            1668, '2–3 hrs',   '4 Weeks',   '5–7 nights', "Creates a connection between the stomach and small intestine to bypass blockages."),
    t('hiatus-hernia',                'Hiatus Hernia Repair',                         1668, '1–2 hrs',   '2 Weeks',   '1–2 nights', "Repairs a hernia where part of the stomach pushes up into the chest."),
  ],

  // ── Ophthalmology ────────────────────────────────────────────────────────
  ophthalmology: [
    t('cornea-transplant',            'Cornea Transplant',                            2300, '1–2 hrs',   '4 Weeks',   '1 night',   "Replaces a damaged cornea with healthy donor tissue to restore vision."),
    t('cataract',                     'Cataract Surgery',                             1380, '20–30 min', '1 Week',    'Day care',  "Removes a cloudy lens and replaces it with a clear artificial one — restores sharp vision quickly."),
  ],

  // ── Infertility ──────────────────────────────────────────────────────────
  infertility: [
    t('iui',                          'Intrauterine Insemination (IUI)',              575,  '15 min',    '1 Day',     'Outpatient', "Sperm is placed directly into the uterus around ovulation to improve chances of pregnancy."),
    t('ivf',                          'In Vitro Fertilisation (IVF)',                 4600, '2–3 weeks', '1 Cycle',   'Outpatient', "Eggs are fertilised in a lab and the embryo is then placed into the uterus."),
  ],

  // ── Radiation Oncology ───────────────────────────────────────────────────
  oncology: [
    t('imrt',                         'Intensity-Modulated Radiotherapy (IMRT)',      3019, '30 min/session', 'Per protocol', 'Outpatient', "Precise radiation that shapes the beam to the tumour, sparing healthy tissue around it."),
  ],

  // ── Cosmetic & Plastic Surgery ───────────────────────────────────────────
  cosmetic: [
    t('rhinoplasty',                  'Rhinoplasty',                                  1800, '1.5–3 hrs', '1 Week',    'Day care',   "A nose-reshaping surgery that improves how your nose looks and can fix breathing problems too."),
    t('liposuction',                  'Liposuction',                                  1200, '1–3 hrs',   '4 Days',    'Day care',   "Removes stubborn fat from areas that don't respond to diet and exercise."),
    t('hair-transplant',              'Hair Transplant',                              1500, '6–8 hrs',   '5 Days',    'Day care',   "Moves healthy hair follicles to thinning or bald patches — no visible scars, natural results."),
    t('cleft-lip-palate',             'Cleft Lip and Palate Repair',                  1254, '2–3 hrs',   '2 Weeks',   '2–3 nights', "Reconstructs a cleft lip or palate to restore normal appearance and function."),
  ],

  // ── Dental Care ──────────────────────────────────────────────────────────
  dental: [
    t('dental-implants',              'Dental Implants',                              450,  '1–2 hrs per implant', '2 Days', 'Outpatient', "A permanent way to replace missing teeth using a titanium post that acts like a natural tooth root."),
    t('full-mouth-veneers',           'Full Mouth Veneers',                           3500, '2 visits', '1 Week',     'Outpatient', "Thin porcelain shells bonded to the front of your teeth for a brighter, more even smile."),
  ],
};

// ════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ════════════════════════════════════════════════════════════════════════════

interface TreatmentProps {
  onHomeClick?: () => void;
  onTreatmentClick?: () => void;
  onAboutClick?: () => void;
  onWellnessClick?: () => void;
  onAIClick?: () => void;
  onSecondOpinionClick?: () => void;
  onTravelClick?: () => void;
  onDoctorsClick?: () => void;
  onSignOutClick?: () => void;
  onLoginClick?: () => void;
  userEmail?: string;
}

type View = 'categories' | 'list' | 'detail';

export default function Treatment(props: TreatmentProps) {
  const [view, setView] = useState<View>('categories');
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string | null>(null);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedCategory = useMemo(
    () => categories.find((c) => c.key === selectedCategoryKey) || null,
    [selectedCategoryKey]
  );

  const filteredCategories = useMemo(
    () => categories.filter(
      (c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             c.desc.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [searchQuery]
  );

  const openCategory = (key: string) => {
    setSelectedCategoryKey(key);
    setView('list');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const openTreatment = (t: Treatment) => {
    setSelectedTreatment(t);
    setView('detail');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const backToCategories = () => {
    setView('categories');
    setSelectedCategoryKey(null);
    setSelectedTreatment(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const backToList = () => {
    setView('list');
    setSelectedTreatment(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const scrollToForm = () => {
    document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col font-manrope bg-white text-black selection:bg-black selection:text-white">

      <Navbar {...props} />

      <div className="flex-grow pt-28 pb-0 font-manrope">

        <AnimatePresence mode="wait">
          {view === 'categories' && (
            <motion.div key="categories" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <CategoriesView
                categories={filteredCategories}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSelect={openCategory}
              />
            </motion.div>
          )}

          {view === 'list' && selectedCategory && (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <CategoryListView
                category={selectedCategory}
                treatments={treatmentsByCategory[selectedCategory.key] || []}
                onBack={backToCategories}
                onSelectTreatment={openTreatment}
              />
            </motion.div>
          )}

          {view === 'detail' && selectedTreatment && selectedCategory && (
            <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <TreatmentDetailView
                category={selectedCategory}
                treatment={selectedTreatment}
                onBack={backToList}
                onAIClick={props.onAIClick}
                onEnquireClick={scrollToForm}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* INQUIRY FORM — always at the bottom of the page */}
        <div id="inquiry-form">
          <BottomInquiry />
        </div>
      </div>

      <StickyCTA />
      <Footer />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// VIEW 1 — CATEGORIES GRID (image-only cards, title underneath)
// ════════════════════════════════════════════════════════════════════════════
interface CategoriesViewProps {
  categories: Category[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSelect: (key: string) => void;
}

function CategoriesView({ categories, searchQuery, setSearchQuery, onSelect }: CategoriesViewProps) {
  return (
    <div className="max-w-[1480px] mx-auto px-6 sm:px-10 lg:px-14 mb-24 font-manrope">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b-2 border-black pb-8 mb-12">
        <div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[0.9] mb-4">
            TREATMENT<br />CATEGORIES.
          </h1>
          <p className="text-sm md:text-base font-medium text-gray-500 max-w-md leading-relaxed">
            Browse by specialty. Transparent fixed pricing across JCI-accredited hospitals.
          </p>
        </div>

        <div className="w-full md:w-auto min-w-[300px]">
          <div className="relative border-b-2 border-gray-200 focus-within:border-black transition-colors">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
            <input
              type="text"
              placeholder="SEARCH CATEGORIES..."
              className="w-full pl-8 py-3 text-sm font-bold uppercase tracking-widest outline-none bg-transparent placeholder:text-gray-300 font-manrope"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Image-card grid — image is the card, title sits below outside */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
        {categories.map((cat) => {
          const count = treatmentsByCategory[cat.key]?.length || 0;
          return (
            <button
              key={cat.key}
              onClick={() => onSelect(cat.key)}
              className="group text-left"
            >
              {/* The card IS the image */}
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-white text-gray-900 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full font-manrope">
                  {count} {count === 1 ? 'Procedure' : 'Procedures'}
                </span>
              </div>

              {/* Title (single line) sits BELOW the card, outside it */}
              <div className="mt-4 flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-brand-blue transition-colors">
                  {cat.title}
                </h3>
                <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-brand-blue shrink-0 transition-colors" />
              </div>
            </button>
          );
        })}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No categories matched "{searchQuery}".
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// VIEW 2 — TREATMENTS UNDER A CATEGORY (text-only cards, no images)
// ════════════════════════════════════════════════════════════════════════════
interface CategoryListViewProps {
  category: Category;
  treatments: Treatment[];
  onBack: () => void;
  onSelectTreatment: (t: Treatment) => void;
}

function CategoryListView({ category, treatments, onBack, onSelectTreatment }: CategoryListViewProps) {
  return (
    <div className="max-w-[1480px] mx-auto px-6 sm:px-10 lg:px-14 mb-24 font-manrope">

      {/* Back */}
      <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-black mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> All categories
      </button>

      {/* Category header (no image) */}
      <div className="mb-12 border-b border-gray-200 pb-10">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-blue mb-3 block">Category</span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-3 leading-[1]">{category.title}</h1>
        <p className="text-base text-gray-600 max-w-2xl">{category.desc}</p>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-4">
          {treatments.length} {treatments.length === 1 ? 'Procedure' : 'Procedures'} available
        </p>
      </div>

      {/* Treatment cards — text only */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {treatments.map((t) => (
          <button
            key={t.slug}
            onClick={() => onSelectTreatment(t)}
            className="group text-left bg-[#f7f1e8] hover:bg-[#f0e9dc] rounded-lg p-8 min-h-[320px] flex flex-col transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between mb-5">
              <h3 className="text-xl font-extrabold text-gray-900 leading-tight">{t.title}</h3>
              <div className="w-11 h-11 rounded-full bg-brand-blue text-white flex items-center justify-center shrink-0 group-hover:bg-[#1565c0] transition-colors">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>

            <p className="text-base text-gray-600 leading-relaxed line-clamp-3 mb-6">{t.description}</p>

            <div className="flex flex-wrap items-center gap-2 mb-6 mt-auto">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-white px-3 py-1.5 rounded-full">
                <Clock className="w-3.5 h-3.5" /> {t.duration}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-white px-3 py-1.5 rounded-full">
                <Calendar className="w-3.5 h-3.5" /> {t.recovery} recovery
              </span>
            </div>

            <div className="flex items-end justify-between pt-5 border-t border-gray-300/60">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Starting from</p>
                <p className="text-3xl font-extrabold text-gray-900">${t.price.toLocaleString()}</p>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-blue">View details →</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// VIEW 3 — TREATMENT DETAIL (no image, lots of content)
// ════════════════════════════════════════════════════════════════════════════
interface TreatmentDetailViewProps {
  category: Category;
  treatment: Treatment;
  onBack: () => void;
  onAIClick?: () => void;
  onEnquireClick: () => void;
}

function TreatmentDetailView({ category, treatment, onBack, onAIClick, onEnquireClick }: TreatmentDetailViewProps) {
  return (
    <div className="max-w-[1480px] mx-auto px-6 sm:px-10 lg:px-14 mb-24 font-manrope">

      {/* Back */}
      <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-black mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to {category.title}
      </button>

      {/* Hero — text only, no image */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12 pb-12 border-b border-gray-200">

        <div className="lg:col-span-2 flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-blue mb-4">{category.title}</span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-[1.02]">{treatment.title}</h1>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-8 max-w-3xl">{treatment.description}</p>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <StatPill icon={<Stethoscope className="w-3.5 h-3.5" />} label="Starting from" value={`$${treatment.price.toLocaleString()}`} />
            <StatPill icon={<Clock className="w-3.5 h-3.5" />} label="Duration" value={treatment.duration} />
            <StatPill icon={<Calendar className="w-3.5 h-3.5" />} label="Hospital stay" value={treatment.hospitalStay} />
            <StatPill icon={<Calendar className="w-3.5 h-3.5" />} label="Recovery" value={treatment.recovery} />
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <button
              onClick={onAIClick}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-white border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white font-bold text-sm px-6 py-3.5 rounded-lg transition-all"
            >
              <Sparkles className="w-4 h-4" /> Ask AI
            </button>
            <button
              onClick={onEnquireClick}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-blue hover:bg-[#1565c0] text-white font-bold text-sm px-6 py-3.5 rounded-lg transition-all shadow-md shadow-brand-blue/30"
            >
              Enquire / Know more <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sidebar concierge card */}
        <aside className="lg:col-span-1">
          <div className="bg-brand-navy text-white rounded-lg p-8 sticky top-32">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-teal mb-3">Concierge included</p>
            <h3 className="text-2xl font-extrabold mb-3 leading-tight">All-inclusive package</h3>
            <ul className="space-y-2.5 mb-6 text-sm text-gray-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-teal shrink-0" /> Procedure + hospital stay</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-teal shrink-0" /> Medication & follow-up</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-teal shrink-0" /> Airport transfers</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-teal shrink-0" /> Accommodation help</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-teal shrink-0" /> 24/7 patient coordinator</li>
            </ul>
            <button
              onClick={onEnquireClick}
              className="w-full bg-brand-teal hover:bg-brand-teal/90 text-brand-navy font-bold text-xs uppercase tracking-widest py-3 rounded-lg transition-all"
            >
              Get a custom quote
            </button>
          </div>
        </aside>
      </div>

      {/* ── BENEFITS ──────────────────────────────────────────────────── */}
      <section className="mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Why this might help you</h2>
        <p className="text-base text-gray-500 mb-8 max-w-2xl">The main reasons patients choose this procedure at a MediVoyage hospital.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {treatment.benefits.map((b) => (
            <div key={b} className="bg-[#f7f1e8] rounded-lg p-6">
              <div className="w-10 h-10 rounded-full bg-brand-blue/15 text-brand-blue flex items-center justify-center mb-4">
                <Heart className="w-5 h-5" />
              </div>
              <p className="text-base text-gray-800 leading-relaxed">{b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">How it works, step by step</h2>
        <p className="text-base text-gray-500 mb-8 max-w-2xl">Here's exactly what will happen on the day of your procedure.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {treatment.whatToExpect.map((step, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 relative">
              <span className="absolute -top-3 -left-3 w-9 h-9 rounded-full bg-brand-blue text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-brand-blue/30">
                {i + 1}
              </span>
              <p className="text-sm text-gray-700 leading-relaxed mt-3">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BEFORE & AFTER (two columns) ──────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900">What to do before</h3>
          </div>
          <ul className="space-y-3">
            {treatment.preparation.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm text-gray-700 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-brand-teal mt-0.5 shrink-0" /> {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-brand-teal/15 text-brand-teal flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900">What to do after</h3>
          </div>
          <ul className="space-y-3">
            {treatment.postCare.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm text-gray-700 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-brand-teal mt-0.5 shrink-0" /> {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── RISKS & CONSIDERATIONS ─────────────────────────────────────── */}
      <section className="mb-16">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-8">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-1.5">Things to be aware of</h3>
              <p className="text-sm text-gray-600 max-w-2xl">Every procedure has some small risks. Your specialist will go through these with you personally during your consultation.</p>
            </div>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-5">
            {treatment.risks.map((r) => (
              <li key={r} className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed">
                <span className="text-amber-600 font-bold mt-0.5">•</span> {r}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────── */}
      <section className="mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Common questions</h2>
        <p className="text-base text-gray-500 mb-8 max-w-2xl">Quick answers to the questions patients ask us most often.</p>
        <div className="space-y-3 max-w-4xl">
          {treatment.faqs.map((faq, i) => (
            <FaqItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA STRIP ──────────────────────────────────────────── */}
      <section className="bg-[#f7f1e8] rounded-lg p-10 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">Ready to talk about {treatment.title}?</h3>
          <p className="text-base text-gray-600 max-w-xl">Chat with our medical AI for a quick understanding, or send us your case for a personalised quote and timeline.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <button
            onClick={onAIClick}
            className="inline-flex items-center justify-center gap-2 bg-white border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white font-bold text-sm px-6 py-3.5 rounded-lg transition-all"
          >
            <Sparkles className="w-4 h-4" /> Ask AI
          </button>
          <button
            onClick={onEnquireClick}
            className="inline-flex items-center justify-center gap-2 bg-brand-blue hover:bg-[#1565c0] text-white font-bold text-sm px-6 py-3.5 rounded-lg transition-all shadow-md shadow-brand-blue/30"
          >
            Enquire / Know more <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}

// ── FAQ accordion item ───────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-base font-bold text-gray-900">{q}</span>
        <ChevronDown className={`w-5 h-5 text-gray-500 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-sm text-gray-600 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Reusable stat pill ───────────────────────────────────────────────────────
function StatPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-lg px-5 py-4">
      <div className="flex items-center gap-1.5 text-gray-500 mb-1.5">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-base font-extrabold text-gray-900">{value}</p>
    </div>
  );
}
