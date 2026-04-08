export type LanguageCode =
  | "en"
  | "ta"
  | "hi"
  | "te"
  | "ml"
  | "kn"
  | "ar"
  | "fr"
  | "de"
  | "es";

export type TranslationKey =
  | "language.label"
  | "language.searchPlaceholder"
  | "language.noResults"
  | "nav.home"
  | "nav.about"
  | "nav.services"
  | "nav.courses"
  | "nav.caseStudies"
  | "nav.portfolio"
  | "nav.contact"
  | "cta.freeAudit"
  | "cta.whatsapp"
  | "chat.title"
  | "chat.subtitle"
  | "chat.open"
  | "chat.close"
  | "chat.placeholder"
  | "chat.send"
  | "chat.thinking"
  | "chat.greeting"
  | "chat.quick.services"
  | "chat.quick.start"
  | "chat.quick.bundle"
  | "chat.limitNotice"
  | "chat.error.generic"
  | "chat.error.network"
  | "payment.title"
  | "payment.subtitle"
  | "payment.accountDetails"
  | "payment.verifyTitle"
  | "payment.amount"
  | "payment.paymentMethod"
  | "payment.reference"
  | "payment.description"
  | "payment.start"
  | "payment.future";

export const LANGUAGES: Array<{ code: LanguageCode; name: string; nativeName: string }> = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "es", name: "Spanish", nativeName: "Español" },
];

type Dictionary = Record<TranslationKey, string>;

const ENGLISH: Dictionary = {
  "language.label": "Language",
  "language.searchPlaceholder": "Search language...",
  "language.noResults": "No language found",
  "nav.home": "Home",
  "nav.about": "About",
  "nav.services": "Services",
  "nav.courses": "Courses",
  "nav.caseStudies": "Case Studies",
  "nav.portfolio": "Portfolio",
  "nav.contact": "Contact",
  "cta.freeAudit": "Get a free AI audit",
  "cta.whatsapp": "Chat on WhatsApp",
  "chat.title": "IgniteCore Q&A Desk",
  "chat.subtitle": "Quick answers before you decide",
  "chat.open": "Open",
  "chat.close": "Close",
  "chat.placeholder": "Ask about services, timelines, or pricing direction...",
  "chat.send": "Send",
  "chat.thinking": "Thinking...",
  "chat.greeting": "Hi, I am here to answer quick client questions. Tell me your situation and I will suggest the best next step.",
  "chat.quick.services": "What should I start with for my business?",
  "chat.quick.start": "How soon can a project go live?",
  "chat.quick.bundle": "What budget range should I expect?",
  "chat.limitNotice": "This assistant handles quick Q&A. For full project planning or implementation, use the Contact form.",
  "chat.error.generic": "I could not process that right now. Please try again, or use the Contact page and we will help directly.",
  "chat.error.network": "Network issue. Please retry in a moment, or use the Contact page.",
  "payment.title": "Direct Payment",
  "payment.subtitle": "Pay by bank transfer or UPI now. Razorpay and Stripe can be enabled later when accounts are ready.",
  "payment.accountDetails": "Bank and UPI details",
  "payment.verifyTitle": "Payment verification",
  "payment.amount": "Amount",
  "payment.paymentMethod": "Payment method",
  "payment.reference": "UTR / transaction reference",
  "payment.description": "Description",
  "payment.start": "Submit payment proof",
  "payment.future": "Razorpay and Stripe will be added later as optional checkout providers.",
};

const TA: Partial<Dictionary> = {
  "language.label": "மொழி",
  "language.searchPlaceholder": "மொழியைத் தேடுங்கள்...",
  "language.noResults": "மொழி கிடைக்கவில்லை",
  "nav.home": "முகப்பு",
  "nav.about": "எங்களை பற்றி",
  "nav.services": "சேவைகள்",
  "nav.courses": "பாடங்கள்",
  "nav.caseStudies": "விளைவு உதாரணங்கள்",
  "nav.portfolio": "திட்டங்கள்",
  "nav.contact": "தொடர்பு",
  "cta.freeAudit": "இலவச AI ஆய்வு பெறுங்கள்",
  "cta.whatsapp": "WhatsApp-ல் பேசுங்கள்",
  "payment.title": "நேரடி கட்டணம்",
  "payment.subtitle": "இப்போது வங்கி மாற்றம் அல்லது UPI மூலம் பணம் செலுத்துங்கள். பின்னர் Razorpay மற்றும் Stripe சேர்க்கலாம்.",
  "payment.accountDetails": "வங்கி மற்றும் UPI விவரங்கள்",
  "payment.verifyTitle": "கட்டண சரிபார்ப்பு",
  "payment.amount": "தொகை",
  "payment.paymentMethod": "கட்டண முறை",
  "payment.reference": "UTR / பரிமாற்ற குறிப்பு",
  "payment.description": "விளக்கம்",
  "payment.start": "கட்டண ஆதாரத்தை சமர்ப்பிக்கவும்",
  "payment.future": "Razorpay மற்றும் Stripe பின்னர் விருப்ப checkout providers ஆக சேர்க்கப்படும்.",
  "chat.open": "திறக்க",
  "chat.send": "அனுப்பு",
  "chat.placeholder": "உங்கள் கேள்வியை கேளுங்கள்...",
};

const HI: Partial<Dictionary> = {
  "language.label": "भाषा",
  "language.searchPlaceholder": "भाषा खोजें...",
  "language.noResults": "कोई भाषा नहीं मिली",
  "nav.home": "होम",
  "nav.about": "हमारे बारे में",
  "nav.services": "सेवाएँ",
  "nav.courses": "कोर्स",
  "nav.caseStudies": "केस स्टडी",
  "nav.portfolio": "पोर्टफोलियो",
  "nav.contact": "संपर्क",
  "cta.freeAudit": "फ्री AI ऑडिट लें",
  "cta.whatsapp": "WhatsApp पर बात करें",
  "payment.title": "सीधा भुगतान",
  "payment.subtitle": "अभी बैंक ट्रांसफर या UPI से भुगतान करें। बाद में Razorpay और Stripe जोड़े जा सकते हैं।",
  "payment.accountDetails": "बैंक और UPI विवरण",
  "payment.verifyTitle": "भुगतान सत्यापन",
  "payment.amount": "राशि",
  "payment.paymentMethod": "भुगतान विधि",
  "payment.reference": "UTR / लेनदेन संदर्भ",
  "payment.description": "विवरण",
  "payment.start": "भुगतान प्रमाण जमा करें",
  "payment.future": "Razorpay और Stripe को बाद में वैकल्पिक checkout providers के रूप में जोड़ा जाएगा.",
  "chat.open": "खोलें",
  "chat.send": "भेजें",
  "chat.placeholder": "अपना सवाल पूछें...",
};

const TE: Partial<Dictionary> = {
  "language.label": "భాష",
  "nav.home": "హోమ్",
  "nav.services": "సేవలు",
  "nav.contact": "సంప్రదించండి",
};

const ML: Partial<Dictionary> = {
  "language.label": "ഭാഷ",
  "nav.home": "ഹോം",
  "nav.services": "സേവനങ്ങൾ",
  "nav.contact": "ബന്ധപ്പെടുക",
};

const KN: Partial<Dictionary> = {
  "language.label": "ಭಾಷೆ",
  "nav.home": "ಮುಖಪುಟ",
  "nav.services": "ಸೇವೆಗಳು",
  "nav.contact": "ಸಂಪರ್ಕ",
};

const AR: Partial<Dictionary> = {
  "language.label": "اللغة",
  "nav.home": "الرئيسية",
  "nav.services": "الخدمات",
  "nav.contact": "اتصل",
};

const FR: Partial<Dictionary> = {
  "language.label": "Langue",
  "nav.home": "Accueil",
  "nav.services": "Services",
  "nav.contact": "Contact",
};

const DE: Partial<Dictionary> = {
  "language.label": "Sprache",
  "nav.home": "Start",
  "nav.services": "Leistungen",
  "nav.contact": "Kontakt",
};

const ES: Partial<Dictionary> = {
  "language.label": "Idioma",
  "nav.home": "Inicio",
  "nav.services": "Servicios",
  "nav.contact": "Contacto",
};

const DICTIONARIES: Record<LanguageCode, Partial<Dictionary>> = {
  en: ENGLISH,
  ta: TA,
  hi: HI,
  te: TE,
  ml: ML,
  kn: KN,
  ar: AR,
  fr: FR,
  de: DE,
  es: ES,
};

export function translate(language: LanguageCode, key: TranslationKey) {
  return DICTIONARIES[language][key] ?? ENGLISH[key];
}
