const knowledgeConfig = require("../data/chatbotKnowledge.json");
const { TIPS } = require("../data/recommendationTips");

const knowledgeBase = Array.isArray(knowledgeConfig) ? knowledgeConfig : knowledgeConfig.entries || [];
const KNOWLEDGE_SYNONYMS = Array.isArray(knowledgeConfig) ? {} : knowledgeConfig.synonyms || {};
const ENTITY_MAP = Array.isArray(knowledgeConfig) ? {} : knowledgeConfig.entity_map || {};
const DYNAMIC_RULES = Array.isArray(knowledgeConfig) ? {} : knowledgeConfig.dynamic_rules || {};
const RESPONSE_TEMPLATES = Array.isArray(knowledgeConfig) ? {} : knowledgeConfig.response_templates || {};

const STOP_WORDS = new Set([
  "yang", "dan", "atau", "di", "ke", "dari", "untuk", "apa", "itu", "saya",
  "aku", "ini", "ada", "dengan", "pada", "jika", "karena", "jadi", "gimana",
  "bagaimana", "tolong", "dong", "ya", "nih", "deh", "kah", "nya",
]);

const DISEASE_TERMS = {
  heart: ["heart", "jantung", "kardiovaskular", "nyeri dada"],
  diabetes: ["diabetes", "gula darah", "insulin", "glukosa"],
  cholesterol: ["cholesterol", "kolesterol", "ldl", "hdl", "trigliserida"],
};

const PAGE_DISEASE_MAP = {
  "/choice/jantung": "heart",
  "/choice/diabetes": "diabetes",
  "/choice/kolestrol": "cholesterol",
};

const DANGEROUS_SYMPTOM_PATTERNS = [
  "sesak napas",
  "nyeri dada hebat",
  "nyeri dada kiri",
  "pingsan",
  "tidak sadar",
  "lemah sebelah",
  "mulut mencong",
  "wajah miring",
  "keringat dingin",
];

const MEDICAL_GUARDRAIL_PATTERNS = [
  "obat",
  "dosis",
  "resep",
  "harus minum apa",
  "diagnosis pasti",
  "antibiotik",
  "insulin berapa",
];

const LIFESTYLE_PATTERNS = [
  "makanan sehat",
  "makan apa",
  "pola makan",
  "diet",
  "olahraga apa",
  "cara mencegah",
  "supaya gak terkena",
  "supaya tidak kena",
];

const SYMPTOM_TEST_PATTERNS = [
  "gejala",
  "tanda",
  "sakit dada",
  "tes darah",
  "cek gula darah puasa",
  "tes sederhana",
  "di rumah",
  "langsung ke dokter",
  "pusing",
];

const FOOD_PATTERNS = [
  "makanan",
  "makan",
  "buah",
  "snack",
  "gorengan",
  "junk food",
  "rendang",
  "sate",
  "ldl",
  "kolesterol jahat",
  "boba",
  "jus",
  "susu",
  "teh hijau",
  "matcha",
];

const EXERCISE_PATTERNS = [
  "olahraga",
  "gym",
  "lari",
  "jalan kaki",
  "jalan cepat",
  "yoga",
  "meditasi",
  "esports",
  "main game",
  "duduk terus",
  "laptop",
  "orang sibuk",
];

const DAILY_HABIT_PATTERNS = [
  "begadang",
  "main hp",
  "scroll hp",
  "scroll ig",
  "instagram",
  "scrolling instagram",
  "sosmed",
  "stres",
  "stress",
  "toxic",
  "alkohol",
  "party",
  "earphone",
  "cuci tangan",
  "kebersihan",
  "shift malam",
  "kerja shift",
  "pola tidur berantakan",
];

const SOFT_DRINK_PATTERNS = [
  "coca cola",
  "coca-cola",
  "fanta",
  "sprite",
  "pepsi",
  "minuman bersoda",
  "soft drink",
];

const LOCAL_FOOD_PATTERNS = [
  "nasi padang",
  "rendang",
  "gulai",
  "martabak",
  "terang bulan",
  "es campur",
  "mie ayam",
  "bakso",
  "soto",
  "sambal",
];

const DEADLINE_STRESS_PATTERNS = [
  "deadline",
  "tugas",
  "deadline tugas",
  "deadline kuliah",
  "deadline kerja",
  "nugas",
  "ngerjain tugas",
];

const SLEEP_PATTERNS = [
  "tidur 3 jam",
  "tidur cuma 5 jam",
  "tidur 5 jam",
  "tidur 7 jam",
  "tidur tiap malam",
  "kurang tidur",
  "tidur kurang",
  "begadang",
  "jam 3 pagi",
  "shift malam",
  "kerja shift",
  "pola tidur berantakan",
];

const SOCIAL_MEDIA_PATTERNS = [
  "scroll ig",
  "instagram",
  "scrolling instagram",
  "scroll tiktok",
  "scrolling tiktok",
  "sosmed",
];

const PREDICTION_HIGH_PATTERNS = [
  "hasil prediksi risiko",
  "hasil prediksi jantung tinggi",
  "hasil prediksi diabetes tinggi",
  "risiko jantung tinggi",
  "risiko diabetes tinggi",
  "harus ngapain sekarang",
  "langsung ke dokter apa tunggu",
];

const PRACTICAL_PATTERNS = [
  "bpjs",
  "puskesmas",
  "hamil",
  "gestasional",
  "rs terdekat",
  "rumah sakit terdekat",
  "jawa timur",
  "lokasi aku",
];

const AGE_INPUT_PATTERNS = [
  "umur 17",
  "usia 17",
  "input data umur",
  "input umur",
  "isi umur",
  "form menerima input umur",
];

const PCOS_PATTERNS = [
  "pcos",
];

const VAPE_QUIT_PATTERNS = [
  "berhenti vape",
  "stop vape",
  "cara berhenti vape",
];

const NOODLE_NIGHT_PATTERNS = [
  "mi setiap malam",
  "mie setiap malam",
  "makan mi setiap malam",
  "makan mie setiap malam",
  "selalu makan mi setiap malam",
  "selalu makan mie setiap malam",
  "mi malam",
  "mie malam",
  "mi tengah malam",
  "mie tengah malam",
];

const CHAT_NORMALIZATIONS = [
  [/\bsya\b/g, "saya"],
  [/\bsy\b/g, "saya"],
  [/\byg\b/g, "yang"],
  [/\bga\b/g, "tidak"],
  [/\bgak\b/g, "tidak"],
  [/\bnggak\b/g, "tidak"],
  [/\bngga\b/g, "tidak"],
  [/\btdk\b/g, "tidak"],
  [/\btrs\b/g, "terus"],
  [/\btrs\b/g, "terus"],
  [/\bgmn\b/g, "gimana"],
  [/\bgmna\b/g, "gimana"],
  [/\bkrn\b/g, "karena"],
  [/\bdgn\b/g, "dengan"],
  [/\bskrg\b/g, "sekarang"],
  [/\bskolah\b/g, "sekolah"],
  [/\bdr\b/g, "dari"],
  [/\butk\b/g, "untuk"],
  [/\baja\b/g, "saja"],
  [/\bkopikap\b/g, "kopi kemasan"],
  [/\bnugas\b/g, "tugas"],
  [/\bngerjain\b/g, "mengerjakan"],
  [/\bml\b/g, "mobile legend"],
  [/\bmlbb\b/g, "mobile legend"],
  [/\bgenshin\b/g, "genshin impact"],
  [/\bgojek food\b/g, "gofood"],
  [/\bes teh\b/g, "es teh manis"],
  [/\bes teh manis\b/g, "teh manis"],
  [/\bterlur\b/g, "telur"],
  [/\btelor\b/g, "telur"],
  [/\bmie\b/g, "mi"],
  [/\bmalem\b/g, "malam"],
];

function escapeRegex(value = "") {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const KNOWLEDGE_NORMALIZATIONS = Object.entries(KNOWLEDGE_SYNONYMS).map(([source, replacement]) => [
  new RegExp(`\\b${escapeRegex(source)}\\b`, "g"),
  replacement,
]);

function normalizeText(value = "") {
  let normalized = String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s/]/g, " ")
    .replace(/\s+/g, " ");

  for (const [pattern, replacement] of CHAT_NORMALIZATIONS) {
    normalized = normalized.replace(pattern, replacement);
  }

  for (const [pattern, replacement] of KNOWLEDGE_NORMALIZATIONS) {
    normalized = normalized.replace(pattern, replacement);
  }

  return normalized.replace(/\s+/g, " ").trim();
}

function tokenize(value = "") {
  return normalizeText(value)
    .split(" ")
    .filter((token) => token && token.length > 2 && !STOP_WORDS.has(token));
}

function getDiseaseLabel(disease) {
  return {
    heart: "jantung",
    diabetes: "diabetes",
    cholesterol: "kolesterol",
  }[disease] || disease;
}

function detectDisease(message, context = {}) {
  if (context.disease && DISEASE_TERMS[context.disease]) {
    return context.disease;
  }

  if (context.current_page && PAGE_DISEASE_MAP[context.current_page]) {
    return PAGE_DISEASE_MAP[context.current_page];
  }

  const normalized = normalizeText(message);
  return Object.entries(DISEASE_TERMS).find(([, terms]) => (
    terms.some((term) => normalized.includes(term))
  ))?.[0] || null;
}

function getRiskLevel(context = {}) {
  return context.risk_level || context.prediction_result?.risk_level || null;
}

function getTopFactors(context = {}) {
  return context.prediction_result?.top_factors || [];
}

function buildSuggestions(entry, fallback = []) {
  const suggestions = Array.isArray(entry?.follow_up) ? entry.follow_up : fallback;
  return suggestions.slice(0, 3);
}

function buildClarificationResponse({ topic, question, originalQuestion, missingField, suggestions = [] }) {
  return {
    answer: question,
    matched_topic: "clarification_request",
    confidence: 0.92,
    suggestions: suggestions.slice(0, 3),
    disclaimer: "Chatbot ini meminta info tambahan agar jawabannya lebih relevan.",
    escalation: {
      needed: false,
      reason: null,
      action: null,
    },
    clarification: {
      needed: true,
      state: {
        topic,
        original_question: originalQuestion,
        missing_field: missingField,
        follow_up_question: question,
      },
    },
  };
}

function fillTemplate(template, values = {}) {
  return String(template).replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
}

function extractSleepHours(normalizedMessage) {
  const pattern = DYNAMIC_RULES.sleep_hours?.min_pattern;
  if (!pattern) {
    return null;
  }

  const match = normalizedMessage.match(new RegExp(pattern));
  return match ? Number(match[1]) : null;
}

function extractLateNightHour(normalizedMessage) {
  const match = normalizedMessage.match(/jam\s+(\d+)\s+pagi/);
  return match ? Number(match[1]) : null;
}

function extractExerciseMinutes(normalizedMessage) {
  const minuteMatch = normalizedMessage.match(/(\d+)\s*menit/);
  if (minuteMatch) {
    return Number(minuteMatch[1]);
  }
  return null;
}

function extractExerciseDistance(normalizedMessage) {
  const kmMatch = normalizedMessage.match(/(\d+)\s*(km|kilometer)/);
  if (kmMatch) {
    return `${kmMatch[1]} ${kmMatch[2]}`;
  }
  return null;
}

function findEntityCategory(normalizedMessage) {
  const tokenSet = new Set(normalizedMessage.split(" ").filter(Boolean));
  const foodCategories = ENTITY_MAP.food_categories || {};
  const habitCategories = ENTITY_MAP.habit_categories || {};
  const matches = [];

  for (const [category, items] of Object.entries(foodCategories)) {
    const match = (items || []).find((item) => {
      const normalizedItem = normalizeText(item);
      if (!normalizedItem) {
        return false;
      }
      if (!normalizedItem.includes(" ")) {
        return tokenSet.has(normalizedItem);
      }
      return normalizedMessage.includes(normalizedItem);
    });
    if (match) {
      matches.push({ type: "food", category, entity: match, length: normalizeText(match).length });
    }
  }

  for (const [category, items] of Object.entries(habitCategories)) {
    const match = (items || []).find((item) => {
      const normalizedItem = normalizeText(item);
      if (!normalizedItem) {
        return false;
      }
      if (!normalizedItem.includes(" ")) {
        return tokenSet.has(normalizedItem);
      }
      return normalizedMessage.includes(normalizedItem);
    });
    if (match) {
      matches.push({ type: "habit", category, entity: match, length: normalizeText(match).length });
    }
  }

  if (matches.length === 0) {
    return null;
  }

  matches.sort((a, b) => b.length - a.length);
  return matches[0];
}

function findEntityInCategory(normalizedMessage, items = []) {
  const tokenSet = new Set(normalizedMessage.split(" ").filter(Boolean));
  for (const item of items) {
    const normalizedItem = normalizeText(item);
    if (!normalizedItem) {
      continue;
    }
    if (!normalizedItem.includes(" ")) {
      if (tokenSet.has(normalizedItem)) {
        return item;
      }
      continue;
    }
    if (normalizedMessage.includes(normalizedItem)) {
      return item;
    }
  }
  return null;
}

function detectFrequencyLabel(normalizedMessage) {
  const frequencyRules = DYNAMIC_RULES.daily_frequency || {};
  if ((frequencyRules.day_terms || []).some((term) => normalizedMessage.includes(normalizeText(term)))) {
    return "setiap hari";
  }
  if ((frequencyRules.night_terms || []).some((term) => normalizedMessage.includes(normalizeText(term)))) {
    return "hampir tiap malam";
  }
  if ((frequencyRules.week_terms || []).some((term) => normalizedMessage.includes(normalizeText(term)))) {
    return "berulang dalam seminggu";
  }
  return "terlalu sering";
}

function needsClarification(normalizedMessage) {
  if (extractSleepHours(normalizedMessage) !== null) {
    return null;
  }

  if (/(kopi|kopi hitam|kopi manis|teh tarik|minuman energi)/.test(normalizedMessage) &&
      /(malam|lembur|bahaya|aman|jantung|kesehatan|tidur)/.test(normalizedMessage)) {
    return null;
  }

  if (/(kopi|kopi hitam|kopi manis|susu|susu sapi|susu full cream)/.test(normalizedMessage) &&
      /(pagi|sarapan|bahaya|aman|kesehatan|kolesterol|gula darah)/.test(normalizedMessage)) {
    return null;
  }

  const asksExercise = /(olahraga|jalan ke kampus|jalan kaki|workout|lari)/.test(normalizedMessage);
  const asksEnough = /(cukup|udah cukup|sudah cukup|efektif|aman)/.test(normalizedMessage);
  const hasDuration = /(\d+)\s*(menit|jam|km|kilometer|langkah)/.test(normalizedMessage);
  const hasFrequency = /(setiap hari|tiap hari|tiap pagi|setiap pagi|tiap malam|setiap malam|tiap minggu|setiap minggu|seminggu|kali seminggu|hampir tiap hari)/.test(normalizedMessage);

  if (asksExercise && asksEnough && !hasDuration && !hasFrequency) {
    return buildClarificationResponse({
      topic: "exercise_enough",
      question: "Bisa membantu, tapi saya perlu sedikit konteks dulu. Biasanya aktivitas itu berapa menit atau berapa jauh, dan apakah dilakukan hampir tiap hari?",
      originalQuestion: normalizedMessage,
      missingField: !hasDuration ? "duration_or_distance" : "frequency",
      suggestions: [
        "Sekitar 15 menit hampir tiap hari",
        "Sekitar 2 km tiap hari",
        "Cuma 2-3 kali seminggu",
      ],
    });
  }

  const asksFoodSafety = /(makan|minum).*(aman|bahaya|cukup|boleh)/.test(normalizedMessage);
  const hasFoodEntity = !!findEntityCategory(normalizedMessage);
  const hasFoodFrequency = /(setiap hari|tiap hari|tiap pagi|setiap pagi|tiap malam|setiap malam|tiap minggu|setiap minggu|kali seminggu|seminggu|sering)/.test(normalizedMessage);

  if (asksFoodSafety && !hasFoodEntity) {
    return buildClarificationResponse({
      topic: "food_entity",
      question: "Boleh, saya bantu jawab. Makanan atau minuman yang kamu maksud apa, dan biasanya seberapa sering dikonsumsi?",
      originalQuestion: normalizedMessage,
      missingField: "food_or_drink_entity",
      suggestions: [
        "Burger tiap malam",
        "Boba 3 kali seminggu",
        "Kopi susu tiap pagi",
      ],
    });
  }

  if (asksFoodSafety && hasFoodEntity && !hasFoodFrequency) {
    return buildClarificationResponse({
      topic: "food_frequency",
      question: "Supaya jawabannya lebih pas, biasanya itu dikonsumsi seberapa sering? Misalnya tiap hari, beberapa kali seminggu, atau hanya sesekali?",
      originalQuestion: normalizedMessage,
      missingField: "frequency",
      suggestions: [
        "Tiap hari",
        "3 kali seminggu",
        "Cuma sesekali",
      ],
    });
  }

  return null;
}

function resolveClarificationMessage(message, context = {}) {
  const clarificationState = context.clarification_state;
  if (!clarificationState || typeof clarificationState !== "object") {
    return message;
  }

  const originalQuestion = clarificationState.original_question || "";
  const topic = clarificationState.topic || "";
  const normalizedAnswer = normalizeText(message);

  if (topic === "exercise_enough") {
    return `${originalQuestion} detail tambahan: ${normalizedAnswer}`;
  }

  if (topic === "food_entity" || topic === "food_frequency") {
    return `${originalQuestion} detail tambahan: ${normalizedAnswer}`;
  }

  return message;
}

function buildDynamicKnowledgeResponse(normalizedMessage, disease) {
  const sleepHours = extractSleepHours(normalizedMessage);
  const sleepRule = DYNAMIC_RULES.sleep_hours || {};
  const lateNightHour = extractLateNightHour(normalizedMessage);
  const exerciseMinutes = extractExerciseMinutes(normalizedMessage);
  const exerciseDistance = extractExerciseDistance(normalizedMessage);
  const diseaseLabel = disease ? getDiseaseLabel(disease) : "kesehatan metabolik";

  if (/(overthinking|cemas soal kesehatan|takut sakit|khawatir sakit terus)/.test(normalizedMessage) &&
      !/(nyeri dada hebat|sesak napas|wajah miring|pingsan|kelemahan satu sisi)/.test(normalizedMessage)) {
    return {
      answer: "Overthinking soal kesehatan memang bisa bikin badan terasa makin tidak nyaman, misalnya jadi tegang, sulit tidur, jantung terasa berdebar, atau terus fokus ke gejala kecil. Jadi rasa takutnya bukan berarti kamu pasti sakit berat, tetapi tetap layak diperhatikan kalau sampai mengganggu tidur, aktivitas, atau pikiran sehari-hari. Coba mulai dari membatasi cek gejala berulang, atur napas, dan kalau kecemasannya menetap, pertimbangkan bicara ke tenaga kesehatan supaya lebih tenang dan terarah.",
      matched_topic: "mental_health",
      confidence: 0.93,
      suggestions: [
        "Bagaimana cara menenangkan pikiran saat mulai overthinking?",
        "Kapan rasa cemas soal kesehatan perlu dibantu profesional?",
        "Apa bedanya cemas biasa dengan gejala yang perlu diperiksa?"
      ],
      disclaimer: "Informasi ini bersifat edukatif dan perlu dikonfirmasi dengan tenaga kesehatan bila keluhan menetap.",
      escalation: { needed: false, reason: null, action: null },
    };
  }

  const hba1cMatch = normalizedMessage.match(/hba1c\s*(\d+(?:[.,]\d+)?)/);
  if (hba1cMatch) {
    const hba1cValue = hba1cMatch[1].replace(",", ".");
    const asksReturnNormal = /(balik normal|normal lagi|masih bisa balik|harus gimana|harus ngapain)/.test(normalizedMessage);
    return {
      answer: asksReturnNormal
        ? `HbA1c sekitar ${hba1cValue} menunjukkan gula darah rata-rata memang sudah perlu lebih diperhatikan. Banyak orang masih bisa memperbaiki arahnya kalau mulai membenahi pola makan, aktivitas fisik, berat badan, dan tidur, tetapi tetap lebih aman kalau hasil seperti ini dikonfirmasi langsung ke dokter atau fasilitas kesehatan supaya tahu langkah lanjut yang paling tepat. Jadi fokusnya bukan panik, tetapi mulai bertindak dan memantau lagi secara terarah.`
        : `HbA1c sekitar ${hba1cValue} berarti kontrol gula darah sudah perlu diperhatikan lebih serius. Nilai ini sebaiknya tidak dibaca sendirian tanpa tindak lanjut, jadi lebih aman kalau dikonfirmasi ke tenaga kesehatan sambil mulai membenahi pola makan, gerak tubuh, dan jam tidur.`,
      matched_topic: "lab_interpretation",
      confidence: 0.94,
      suggestions: [
        "Langkah awal apa yang paling penting saya mulai dulu?",
        "Makanan apa yang paling perlu dibatasi kalau HbA1c naik?",
        "Kapan saya perlu cek ulang gula darah?"
      ],
      disclaimer: "Informasi ini bersifat edukatif dan perlu dikonfirmasi dengan tenaga kesehatan bila keluhan menetap.",
      escalation: { needed: false, reason: null, action: null },
    };
  }

  const bloodPressureMatch = normalizedMessage.match(/(\d{2,3})\s*\/\s*(\d{2,3})/);
  if ((/tekanan darah|darah tinggi/.test(normalizedMessage) || bloodPressureMatch) && bloodPressureMatch) {
    const systolic = Number(bloodPressureMatch[1]);
    const diastolic = Number(bloodPressureMatch[2]);
    const isHigh = systolic >= 140 || diastolic >= 90;
    return {
      answer: isHigh
        ? `Kalau tekanan darahmu sering di kisaran ${systolic}/${diastolic}, itu sudah termasuk tinggi dan tidak sebaiknya dianggap enteng. Satu kali pengukuran belum selalu menggambarkan kondisi penuh, tetapi kalau angkanya berulang di kisaran itu, akan lebih aman kalau kamu cek langsung ke dokter atau puskesmas sambil mulai mengurangi garam, rokok, begadang, dan menjaga berat badan serta aktivitas fisik.`
        : `Kalau tekanan darahmu di kisaran ${systolic}/${diastolic}, hasilnya tetap perlu dilihat bersama pola pengukuran lain dan kondisi tubuhmu. Jadi jangan hanya terpaku pada satu angka, tetapi kalau sering muncul tinggi atau kamu juga punya keluhan seperti pusing berat, nyeri dada, atau sesak, sebaiknya periksa langsung.`,
      matched_topic: "lab_interpretation",
      confidence: 0.94,
      suggestions: [
        "Kapan tekanan darah tinggi perlu diperiksa segera?",
        "Kebiasaan apa yang paling perlu dibenahi kalau tensi sering naik?",
        "Makanan apa yang paling sering bikin tekanan darah naik?"
      ],
      disclaimer: "Informasi ini bersifat edukatif dan perlu dikonfirmasi dengan tenaga kesehatan bila keluhan menetap.",
      escalation: { needed: false, reason: null, action: null },
    };
  }

  if (/(shift malam|kerja shift|pola tidur berantakan)/.test(normalizedMessage) && (disease || normalizedMessage.includes("diabetes") || normalizedMessage.includes("kolesterol") || normalizedMessage.includes("jantung"))) {
    return {
      answer: `Kerja shift malam dan pola tidur yang berantakan memang bisa ikut membuat risiko ${diseaseLabel} jadi kurang baik, terutama kalau efeknya membuat jam tidur tidak teratur, pola makan berantakan, tubuh kurang pulih, dan aktivitas fisik ikut menurun. Jadi dampaknya biasanya bukan karena shift malam saja, tetapi karena kebiasaan lain yang ikut terdorong jadi tidak seimbang. Kalau kondisi ini berlangsung terus, akan lebih baik kalau kamu mulai menjaga jam makan, kualitas tidur saat ada waktu istirahat, dan aktivitas ringan yang masih realistis di sela jadwal kerja.`,
      matched_topic: "daily_habit_risk_factor",
      confidence: 0.94,
      suggestions: [
        "Kalau kerja shift, pola makan yang lebih aman seperti apa?",
        "Bagaimana cara memperbaiki tidur kalau jadwal kerja tidak tetap?",
        "Kebiasaan kecil apa yang paling penting saya benahi dulu?"
      ],
      disclaimer: "Informasi ini bersifat edukatif dan perlu dikonfirmasi dengan tenaga kesehatan bila keluhan menetap.",
      escalation: { needed: false, reason: null, action: null },
    };
  }

  if (/(belajar|ngerjain tugas|tugas|kerja|lembur)/.test(normalizedMessage) &&
      /(tengah malam|larut malam|malam terus|sampai malam|sampai larut)/.test(normalizedMessage) &&
      /(kesehatan|bahaya|mempengaruhi|berpengaruh|risiko|aman)/.test(normalizedMessage)) {
    return {
      answer: "Kalau kamu sering belajar atau kerja sampai tengah malam, itu memang bisa memengaruhi kesehatan kalau terjadi berulang. Dampaknya biasanya bukan karena belajar malamnya saja, tetapi karena jam tidur jadi berkurang, tubuh kurang pulih, stres lebih mudah naik, dan pola makan sering ikut berantakan. Sesekali mungkin masih wajar, tetapi kalau sudah jadi kebiasaan, akan lebih baik kalau kamu cari cara supaya jam tidur tetap lebih terjaga dan waktu belajar dibagi lebih rapi.",
      matched_topic: "daily_habit_risk_factor",
      confidence: 0.94,
      suggestions: [
        "Kalau sering belajar malam, cara jaga tidur yang realistis bagaimana?",
        "Apakah begadang karena tugas juga bisa memengaruhi gula darah?",
        "Kebiasaan kecil apa yang paling penting dibenahi dulu?"
      ],
      disclaimer: "Informasi ini bersifat edukatif dan perlu dikonfirmasi dengan tenaga kesehatan bila keluhan menetap.",
      escalation: { needed: false, reason: null, action: null },
    };
  }

  if (/(skip sarapan|tidak sarapan|ga sarapan|gak sarapan|sarapan.*kopi|kopi doang)/.test(normalizedMessage) &&
      /(gula darah|diabetes|aman|bahaya|kesehatan)/.test(normalizedMessage)) {
    return {
      answer: "Kalau kamu sering melewatkan sarapan lalu hanya minum kopi, itu biasanya kurang ideal karena tubuh tetap butuh energi yang lebih seimbang untuk memulai hari. Pada sebagian orang pola seperti ini bisa bikin lebih mudah lapar berlebihan setelahnya, pola makan jadi berantakan, atau membuat badan terasa lebih lemas dan sulit fokus. Jadi kalau tujuanmu menjaga gula darah dan kesehatan secara umum, akan lebih baik kalau kopi tidak jadi pengganti sarapan terus-menerus.",
      matched_topic: "food_drink_guidance",
      confidence: 0.93,
      suggestions: [
        "Sarapan sederhana yang lebih aman itu seperti apa?",
        "Kalau tetap mau minum kopi pagi, sebaiknya dipadukan dengan apa?",
        "Apakah telat sarapan juga bisa mengganggu pola makan harian?"
      ],
      disclaimer: "Informasi ini bersifat edukatif dan perlu dikonfirmasi dengan tenaga kesehatan bila keluhan menetap.",
      escalation: { needed: false, reason: null, action: null },
    };
  }

  if (/(kopi|kopi hitam|kopi manis)/.test(normalizedMessage) &&
      /(tiap pagi|setiap pagi|pagi hari|setiap hari.*pagi)/.test(normalizedMessage) &&
      /(bahaya|berbahaya|aman|kesehatan|jantung|gula darah)/.test(normalizedMessage)) {
    return {
      answer: "Kalau kamu sering minum kopi setiap pagi, itu tidak selalu langsung berbahaya, tetapi tetap tergantung jenis kopi, kadar gula, dan bagaimana pola makanmu sepanjang hari. Kopi tanpa banyak gula biasanya lebih aman dibanding kopi yang sangat manis atau penuh krimer. Jadi kalau ingin tetap minum kopi pagi, lebih baik perhatikan manisnya, jangan sampai menggantikan sarapan terus-menerus, dan lihat juga apakah tubuhmu jadi berdebar, cemas, atau gampang maag.",
      matched_topic: "food_drink_guidance",
      confidence: 0.93,
      suggestions: [
        "Apa bedanya kopi hitam dan kopi manis untuk kesehatan?",
        "Kalau minum kopi pagi, sarapan yang lebih aman seperti apa?",
        "Kapan kopi mulai perlu dibatasi?"
      ],
      disclaimer: "Informasi ini bersifat edukatif dan perlu dikonfirmasi dengan tenaga kesehatan bila keluhan menetap.",
      escalation: { needed: false, reason: null, action: null },
    };
  }

  if (/(susu|susu sapi|susu pagi)/.test(normalizedMessage) &&
      /(tiap pagi|setiap pagi|pagi hari|setiap hari.*pagi)/.test(normalizedMessage) &&
      /(bahaya|berbahaya|aman|kesehatan|kolesterol|gula darah)/.test(normalizedMessage)) {
    return {
      answer: "Minum susu setiap pagi tidak otomatis berbahaya, tetapi tetap tergantung jenis susunya, kadar gula tambahannya, dan kondisi kesehatanmu. Susu plain dalam porsi wajar biasanya berbeda dengan susu yang tinggi gula atau lemak. Jadi kalau diminum rutin, yang paling penting adalah melihat label gizinya, manisnya, dan apakah ada keluhan tertentu seperti berat badan mudah naik atau kolesterol yang sedang dijaga.",
      matched_topic: "food_drink_guidance",
      confidence: 0.93,
      suggestions: [
        "Kalau sedang jaga kolesterol, susu seperti apa yang lebih aman?",
        "Apakah susu manis sebaiknya dibatasi?",
        "Apa bedanya susu full cream dan susu rendah lemak?"
      ],
      disclaimer: "Informasi ini bersifat edukatif dan perlu dikonfirmasi dengan tenaga kesehatan bila keluhan menetap.",
      escalation: { needed: false, reason: null, action: null },
    };
  }

  if (/(keripik|gorengan|cemilan|camilan)/.test(normalizedMessage) &&
      /(begadang|larut malam|malam-malam|malam hari)/.test(normalizedMessage) &&
      /(kolesterol|bahaya|risiko|kesehatan)/.test(normalizedMessage)) {
    return {
      answer: "Ngemil makanan seperti keripik atau gorengan sambil begadang memang kurang ideal, karena masalahnya datang dari dua sisi sekaligus: camilannya cenderung tinggi garam atau lemak, sementara begadang membuat tubuh kurang pulih dan pola makan jadi lebih mudah berantakan. Jadi kalau kebiasaan ini sering terjadi, risikonya ke kolesterol dan kesehatan metabolik bisa ikut memburuk pelan-pelan. Akan lebih aman kalau camilan malam dibatasi dan jam tidur ikut dibenahi.",
      matched_topic: "daily_habit_risk_factor",
      confidence: 0.93,
      suggestions: [
        "Kalau begadang, camilan yang lebih ringan apa?",
        "Kebiasaan malam apa yang paling penting dibenahi dulu?",
        "Apakah begadang juga berpengaruh ke gula darah?"
      ],
      disclaimer: "Informasi ini bersifat edukatif dan perlu dikonfirmasi dengan tenaga kesehatan bila keluhan menetap.",
      escalation: { needed: false, reason: null, action: null },
    };
  }

  if (/(kopi|kopi hitam|kopi manis)/.test(normalizedMessage) &&
      /(tiap malam|setiap malam|malam hari|malam-malam|setiap malam|tiap hari.*malam|malam terus)/.test(normalizedMessage) &&
      /(bahaya|berbahaya|aman|jantung|kesehatan|tidur)/.test(normalizedMessage)) {
    return {
      answer: "Kalau kamu sering minum kopi setiap malam, yang paling perlu diperhatikan biasanya adalah efeknya ke tidur, rasa berdebar, dan kualitas istirahat. Pada sebagian orang kopi malam tidak langsung terasa berbahaya, tetapi kalau jadi kebiasaan rutin, tidur bisa lebih dangkal atau susah teratur, lalu kebiasaan itu ikut memengaruhi stres dan kondisi tubuh keesokan harinya. Jadi lebih aman kalau kopi malam tidak dijadikan rutinitas, apalagi kalau kamu sudah merasa susah tidur, cemas, atau jantung terasa lebih berdebar.",
      matched_topic: "food_drink_guidance",
      confidence: 0.93,
      suggestions: [
        "Kalau tetap mau minum kopi, jam yang lebih aman biasanya kapan?",
        "Apa bedanya kopi hitam dan kopi manis untuk kesehatan?",
        "Kalau kopi bikin susah tidur, sebaiknya diganti apa?"
      ],
      disclaimer: "Informasi ini bersifat edukatif dan perlu dikonfirmasi dengan tenaga kesehatan bila keluhan menetap.",
      escalation: { needed: false, reason: null, action: null },
    };
  }

  if (/(teh tarik|minuman energi)/.test(normalizedMessage) &&
      /(tiap malam|setiap malam|saat lembur|lembur|sering|aman|bahaya|jantung|kesehatan)/.test(normalizedMessage)) {
    return {
      answer: "Minuman seperti teh tarik atau minuman energi biasanya perlu lebih hati-hati kalau sering diminum malam hari atau saat lembur, karena bisa mengandung gula tinggi, kafein, atau keduanya sekaligus. Pada sebagian orang efeknya bisa membuat tidur makin berantakan, badan terasa berdebar, dan pola istirahat jadi tidak pulih dengan baik. Jadi untuk kebiasaan rutin, minuman seperti ini lebih aman dibatasi daripada dijadikan andalan setiap malam.",
      matched_topic: "food_drink_guidance",
      confidence: 0.93,
      suggestions: [
        "Kalau lembur, minuman yang lebih aman apa?",
        "Apakah teh tarik lebih aman daripada kopi manis?",
        "Kalau sudah susah tidur, apa kebiasaan malam yang perlu dikurangi?"
      ],
      disclaimer: "Informasi ini bersifat edukatif dan perlu dikonfirmasi dengan tenaga kesehatan bila keluhan menetap.",
      escalation: { needed: false, reason: null, action: null },
    };
  }

  if (/(rebahan|mager|kurang gerak|jarang gerak|jarang olahraga|jarang bergerak|banyak duduk|duduk terus)/.test(normalizedMessage) &&
      (disease || normalizedMessage.includes("diabetes") || normalizedMessage.includes("kolesterol") || normalizedMessage.includes("jantung") || normalizedMessage.includes("risiko"))) {
    return {
      answer: `Kalau kamu lebih sering rebahan, duduk terus, atau jarang olahraga, itu memang bisa ikut menaikkan risiko ${diseaseLabel} secara bertahap. Pengaruhnya biasanya bukan karena satu kebiasaan ini saja, tetapi karena tubuh jadi kurang aktif, pembakaran energi menurun, berat badan lebih mudah naik, dan pola harian lain ikut berantakan. Kabar baiknya, kamu tidak harus langsung olahraga berat: mulai dari lebih sering jalan kaki, berdiri lebih sering, atau aktivitas ringan yang konsisten sudah lebih baik daripada terus pasif.`,
      matched_topic: "daily_habit_risk_factor",
      confidence: 0.94,
      suggestions: [
        "Kalau saya mager, mulai gerak dari kebiasaan kecil apa dulu?",
        "Jalan kaki berapa menit yang realistis untuk pemula?",
        "Olahraga ringan apa yang cocok kalau jarang gerak?"
      ],
      disclaimer: "Informasi ini bersifat edukatif dan perlu dikonfirmasi dengan tenaga kesehatan bila keluhan menetap.",
      escalation: { needed: false, reason: null, action: null },
    };
  }

  if (/(haus|sering haus)/.test(normalizedMessage) &&
      /(capek|lemas|mudah lelah)/.test(normalizedMessage) &&
      /(gula darah|diabetes|tanda|gejala)/.test(normalizedMessage)) {
    return {
      answer: "Sering haus dan mudah capek memang bisa berkaitan dengan gula darah yang sedang kurang terkontrol, tetapi dua keluhan itu tidak otomatis berarti diabetes karena bisa juga dipengaruhi kurang tidur, asupan makan, dehidrasi, atau kondisi lain. Jadi kalau keluhan seperti ini sering berulang, lebih aman kalau kamu pertimbangkan cek gula darah langsung daripada menebak-nebak dari gejala saja.",
      matched_topic: "symptom_awareness",
      confidence: 0.93,
      suggestions: [
        "Kapan gejala seperti ini perlu cek gula darah langsung?",
        "Gejala awal diabetes yang sering muncul apa saja?",
        "Kalau hasil cek tinggi, langkah awal yang paling aman apa?"
      ],
      disclaimer: "Informasi ini bersifat edukatif dan perlu dikonfirmasi dengan tenaga kesehatan bila keluhan menetap.",
      escalation: { needed: false, reason: null, action: null },
    };
  }

  if (extractSleepHours(normalizedMessage) !== null && /kopi/.test(normalizedMessage) && /(jantung|bahaya)/.test(normalizedMessage)) {
    const hours = extractSleepHours(normalizedMessage);
    const coffeeMatch = normalizedMessage.match(/(\d+)\s+gelas/);
    const coffeeText = coffeeMatch ? `${coffeeMatch[1]} gelas` : "kopi";
    return {
      answer: `Kalau tidurmu hanya sekitar ${hours} jam lalu dibarengi minum ${coffeeText} kopi, kombinasi itu bisa membuat tubuh lebih mudah berdebar, tegang, atau terasa kurang pulih. Jadi yang perlu diperhatikan bukan kopinya saja, tetapi gabungan kurang tidur, kafein, stres, dan pola hidup harian. Kalau situasi seperti ini sering terjadi, akan lebih aman kalau jam tidur dibenahi dulu dan asupan kopi tidak berlebihan.`,
      matched_topic: "daily_habit_risk_factor",
      confidence: 0.94,
      suggestions: [
        "Kalau kurang tidur, kopi sebaiknya dibatasi bagaimana?",
        "Bagaimana cara memperbaiki jam tidur secara realistis?",
        "Kapan berdebar setelah minum kopi perlu diwaspadai?"
      ],
      disclaimer: "Informasi ini bersifat edukatif dan perlu dikonfirmasi dengan tenaga kesehatan bila keluhan menetap.",
      escalation: { needed: false, reason: null, action: null },
    };
  }

  if (Number.isFinite(sleepHours) && (disease || normalizedMessage.includes("kolesterol") || normalizedMessage.includes("diabetes") || normalizedMessage.includes("jantung"))) {
    let answer;
    if (sleepHours <= (sleepRule.low_threshold ?? 5)) {
      answer = fillTemplate(RESPONSE_TEMPLATES.sleep_low, {
        hours: sleepHours,
        disease_label: diseaseLabel,
      });
    } else if (sleepHours <= (sleepRule.moderate_threshold ?? 6)) {
      answer = fillTemplate(RESPONSE_TEMPLATES.sleep_moderate, {
        hours: sleepHours,
      });
    } else {
      answer = fillTemplate(RESPONSE_TEMPLATES.sleep_healthy, {
        hours: sleepHours,
      }) + " Risiko kolesterol biasanya lebih banyak dipengaruhi gabungan faktor lain seperti pola makan, aktivitas fisik, merokok, dan faktor genetik.";
    }

    return {
      answer,
      matched_topic: "daily_habit_risk_factor",
      confidence: 0.94,
      suggestions: [
        "Bagaimana cara memperbaiki pola tidur secara realistis?",
        "Apa kebiasaan malam yang paling perlu dikurangi dulu?",
        "Begadang apakah juga berpengaruh ke gula darah?",
      ],
      disclaimer: "Informasi ini bersifat edukatif dan perlu dikonfirmasi dengan tenaga kesehatan bila keluhan menetap.",
      escalation: { needed: false, reason: null, action: null },
    };
  }

  if (Number.isFinite(lateNightHour) && normalizedMessage.includes("begadang")) {
    return {
      answer: `Kalau kamu masih sering terjaga sampai sekitar jam ${lateNightHour} pagi, itu termasuk pola tidur yang kurang ideal bila terjadi berulang. Pengaruhnya ke ${diseaseLabel} biasanya tidak langsung berupa angka pasti, tetapi lewat stres yang naik, waktu tidur yang berkurang, pola makan yang makin berantakan, dan tubuh yang kurang pulih. Jadi pertanyaannya bukan langsung "apakah pasti kena", melainkan bahwa kebiasaan seperti ini memang layak dibenahi kalau kamu ingin menurunkan risiko jangka panjang.`,
      matched_topic: "daily_habit_risk_factor",
      confidence: 0.94,
      suggestions: [
        "Bagaimana cara memperbaiki pola tidur secara realistis?",
        "Apa kebiasaan malam yang paling perlu dikurangi dulu?",
        "Begadang apakah juga berpengaruh ke gula darah?",
      ],
      disclaimer: "Informasi ini bersifat edukatif dan perlu dikonfirmasi dengan tenaga kesehatan bila keluhan menetap.",
      escalation: { needed: false, reason: null, action: null },
    };
  }

  if (/(vape|rokok elektrik)/.test(normalizedMessage) && /(tiap hari|setiap hari|1 pod|satu pod|berapa berbahaya|bahaya)/.test(normalizedMessage)) {
    const podMatch = normalizedMessage.match(/(\d+)\s+pod/);
    const podText = podMatch ? `${podMatch[1]} pod` : "rutin";
    return {
      answer: `Vape yang dipakai ${podText} atau setiap hari tetap tidak bisa dianggap aman, meskipun usia kamu masih remaja atau awal dewasa. Dampaknya ke tubuh biasanya tidak dilihat dari satu angka pasti, tetapi dari kebiasaan nikotin yang terus berulang dan bisa memengaruhi jantung, pembuluh darah, kualitas tidur, serta ketergantungan. Jadi kalau tujuanmu menjaga kesehatan jangka panjang, arah yang lebih baik tetap mengurangi lalu berhenti secara bertahap, bukan menganggap vape sebagai pilihan aman.`,
      matched_topic: "daily_habit_risk_factor",
      confidence: 0.94,
      suggestions: [
        "Cara berhenti vape yang paling realistis bagaimana?",
        "Apakah vape lebih aman daripada rokok biasa?",
        "Kebiasaan apa yang paling penting saya ubah dulu?"
      ],
      disclaimer: "Informasi ini bersifat edukatif dan perlu dikonfirmasi dengan tenaga kesehatan bila keluhan menetap.",
      escalation: { needed: false, reason: null, action: null },
    };
  }

  if (/(rokok|merokok)/.test(normalizedMessage) && /(mau berhenti|pengen berhenti|ingin berhenti|cara berhenti|saran yang gampang)/.test(normalizedMessage)) {
    return {
      answer: "Kalau kamu ingin berhenti merokok, mulai dari langkah yang realistis dulu, bukan menunggu motivasi besar datang. Banyak orang terbantu dengan mengenali jam atau situasi yang paling sering memicu rokok, lalu mengurangi satu per satu, misalnya menunda batang pertama, mengurangi stok, atau mengganti momen merokok dengan jalan singkat, minum air, atau aktivitas lain. Kalau rasanya susah berhenti sendiri, mencari bantuan tenaga kesehatan juga langkah yang sangat wajar.",
      matched_topic: "habit_guidance",
      confidence: 0.93,
      suggestions: [
        "Langkah paling mudah untuk mulai mengurangi rokok apa?",
        "Kenapa berhenti merokok terasa sulit?",
        "Apa yang bisa dilakukan saat keinginan merokok muncul?"
      ],
      disclaimer: "Informasi ini bersifat edukatif dan perlu dikonfirmasi dengan tenaga kesehatan bila keluhan menetap.",
      escalation: { needed: false, reason: null, action: null },
    };
  }

  if (/(roti bakar)/.test(normalizedMessage) && /(kopi susu)/.test(normalizedMessage)) {
    return {
      answer: "Kalau sarapanmu sering berupa roti bakar manis ditambah kopi susu, yang perlu diperhatikan biasanya adalah gabungan gula tambahan dan kalorinya, bukan salah satu minumannya saja. Kebiasaan seperti ini belum tentu langsung menimbulkan masalah, tetapi kalau terlalu sering dan tidak diimbangi pilihan yang lebih seimbang, itu kurang ideal untuk menjaga gula darah, berat badan, dan energi harian. Akan lebih aman kalau porsinya dijaga, tingkat manisnya dikurangi, dan sesekali diganti dengan sarapan yang lebih mengenyangkan serta tidak terlalu manis.",
      matched_topic: "food_drink_guidance",
      confidence: 0.93,
      suggestions: [
        "Sarapan yang lebih aman dan tetap praktis itu seperti apa?",
        "Kalau tetap minum kopi susu, apa yang sebaiknya dikurangi?",
        "Minuman manis pagi hari sebaiknya dibatasi bagaimana?"
      ],
      disclaimer: "Informasi ini bersifat edukatif dan perlu dikonfirmasi dengan tenaga kesehatan bila keluhan menetap.",
      escalation: { needed: false, reason: null, action: null },
    };
  }

  if (/coto makassar/.test(normalizedMessage) && /ketupat/.test(normalizedMessage)) {
    return {
      answer: "Coto Makassar dengan ketupat cenderung termasuk menu yang cukup berat karena biasanya memakai daging, kuah yang kaya rasa, dan porsi makan yang mudah jadi besar. Jadi kalau kamu sedang menjaga kolesterol atau jantung, makanan seperti ini lebih aman dinikmati sesekali, bukan terlalu sering, sambil tetap memperhatikan porsi dan pilihan makanan lain di hari yang sama.",
      matched_topic: "food_drink_guidance",
      confidence: 0.92,
      suggestions: [
        "Kalau suka makanan berkuah gurih, pilihan yang lebih ringan apa?",
        "Seberapa sering makanan seperti ini sebaiknya dibatasi?",
        "Apa yang paling perlu diperhatikan: kuah, daging, atau porsinya?"
      ],
      disclaimer: "Informasi ini bersifat edukatif dan perlu dikonfirmasi dengan tenaga kesehatan bila keluhan menetap.",
      escalation: { needed: false, reason: null, action: null },
    };
  }

  if (/papeda/.test(normalizedMessage) && /ikan/.test(normalizedMessage)) {
    return {
      answer: "Papeda dengan ikan biasanya bisa jadi pilihan yang lebih ringan dibanding makanan yang lebih berminyak atau tinggi santan, terutama kalau ikannya tidak digoreng berlebihan dan porsinya tetap wajar. Untuk usia lanjut, pola makan seperti ini umumnya lebih masuk akal karena lebih sederhana dan bisa lebih mudah diseimbangkan dengan sayur serta lauk yang tidak terlalu berat.",
      matched_topic: "food_drink_guidance",
      confidence: 0.92,
      suggestions: [
        "Kalau untuk orang tua, lauk seperti apa yang lebih aman dipilih?",
        "Apa yang sebaiknya dibatasi kalau sedang menjaga kolesterol?",
        "Menu harian yang lebih ringan tapi tetap mengenyangkan itu seperti apa?"
      ],
      disclaimer: "Informasi ini bersifat edukatif dan perlu dikonfirmasi dengan tenaga kesehatan bila keluhan menetap.",
      escalation: { needed: false, reason: null, action: null },
    };
  }

  if (/(riwayat keluarga|keluarga).*diabetes/.test(normalizedMessage) && /(kurus|badan saya kurus|badan kurus)/.test(normalizedMessage)) {
    return {
      answer: "Riwayat keluarga diabetes tetap penting meskipun badanmu kurus. Jadi tubuh yang tidak gemuk bukan jaminan otomatis aman kalau ada faktor genetik, pola makan kurang baik, aktivitas fisik rendah, atau jam tidur yang berantakan. Artinya, kamu tetap bisa berisiko dan justru bagus kalau mulai memperhatikan kebiasaan harian sejak sekarang, bukan menunggu sampai muncul keluhan.",
      matched_topic: "risk_factor_explanation",
      confidence: 0.93,
      suggestions: [
        "Kebiasaan apa yang paling penting saya benahi dulu?",
        "Apa arti hasil prediksi diabetes saya?",
        "Kapan saya perlu cek gula darah langsung?"
      ],
      disclaimer: "Informasi ini bersifat edukatif dan perlu dikonfirmasi dengan tenaga kesehatan bila keluhan menetap.",
      escalation: { needed: false, reason: null, action: null },
    };
  }

  if (/(hasil prediksi).*kolesterol.*tinggi/.test(normalizedMessage) && /(harus gimana|harus ngapain|apa yang harus dilakukan)/.test(normalizedMessage)) {
    return {
      answer: "Kalau hasil prediksi kolesterolmu tinggi, langkah yang paling masuk akal adalah tidak panik tetapi juga tidak menyepelekannya. Mulai dari membatasi makanan yang sangat tinggi lemak jenuh, gorengan, dan minuman manis, lalu usahakan lebih rutin bergerak. Kalau hasilnya terasa mengkhawatirkan atau kamu juga punya riwayat keluarga maupun keluhan lain, mempertimbangkan pemeriksaan lab atau konsultasi langsung ke dokter akan lebih aman.",
      matched_topic: "next_step_guidance",
      confidence: 0.94,
      suggestions: [
        "Makanan apa yang paling perlu dibatasi dulu?",
        "Apa arti hasil risiko tinggi kolesterol?",
        "Kapan saya perlu memeriksa kolesterol langsung?"
      ],
      disclaimer: "Informasi ini bersifat edukatif dan perlu dikonfirmasi dengan tenaga kesehatan bila keluhan menetap.",
      escalation: { needed: false, reason: null, action: null },
    };
  }

  if (/(kerja sambil kuliah|kuliah dan kerja|makan jadi berantakan|pola makan berantakan)/.test(normalizedMessage) && normalizedMessage.includes("diabetes")) {
    return {
      answer: "Kalau kerja sambil kuliah membuat jam makanmu berantakan, itu memang bisa ikut membuat risiko diabetes jadi kurang baik, terutama kalau akhirnya kamu sering melewatkan makan, memilih makanan cepat saji, kurang tidur, dan jarang bergerak. Jadi masalah utamanya biasanya bukan sibuknya saja, tetapi pola hidup yang jadi tidak seimbang. Yang paling realistis biasanya mulai dari menjaga jam makan yang lebih teratur, mengurangi minuman manis, dan memastikan masih ada aktivitas ringan di sela jadwal padat.",
      matched_topic: "daily_habit_risk_factor",
      confidence: 0.94,
      suggestions: [
        "Kalau jadwal padat, pola makan yang lebih aman seperti apa?",
        "Kebiasaan kecil apa yang paling penting saya benahi dulu?",
        "Begadang apakah ikut memperburuk risikonya?"
      ],
      disclaimer: "Informasi ini bersifat edukatif dan perlu dikonfirmasi dengan tenaga kesehatan bila keluhan menetap.",
      escalation: { needed: false, reason: null, action: null },
    };
  }

  if (/(minuman manis|berhenti minum minuman manis|kurangi minuman manis)/.test(normalizedMessage) && /(mulai dari mana|gimana mulai|bagaimana mulai)/.test(normalizedMessage)) {
    return {
      answer: "Kalau ingin berhenti minum minuman manis, jangan langsung menuntut diri sempurna. Cara yang lebih realistis biasanya mulai dari satu perubahan kecil, misalnya mengganti satu gelas minuman manis per hari dengan air putih atau teh tawar, lalu mengurangi ukuran gelas atau kadar gula secara bertahap. Begitu kebiasaan itu mulai terasa ringan, baru lanjut ke langkah berikutnya supaya perubahanmu lebih tahan lama.",
      matched_topic: "motivation",
      confidence: 0.93,
      suggestions: [
        "Minuman apa yang paling aman untuk dijadikan pengganti?",
        "Bagaimana cara mengurangi gula tanpa terasa berat?",
        "Kebiasaan kecil apa yang paling mudah dimulai dulu?"
      ],
      disclaimer: "Informasi ini bersifat edukatif dan perlu dikonfirmasi dengan tenaga kesehatan bila keluhan menetap.",
      escalation: { needed: false, reason: null, action: null },
    };
  }

  if (/(umur 16|usia 16)/.test(normalizedMessage) && /(boleh|bisa).*(pakai aplikasi|cek risiko)/.test(normalizedMessage)) {
    return {
      answer: "Kalau aplikasi menerima input umur, biasanya yang paling tepat adalah tetap mengisi usia sebenarnya. Jadi umur 16 tahun tetap bisa dipakai selama form atau alurnya memang tidak melarang, tetapi hasilnya tetap perlu dibaca sebagai edukasi awal, bukan diagnosis. Yang penting, data yang dimasukkan jangan diubah-ubah supaya gambaran risikonya tidak bias.",
      matched_topic: "practical_info",
      confidence: 0.93,
      suggestions: [
        "Data apa saja yang paling penting diisi dengan benar?",
        "Kalau salah input data, apakah hasilnya bisa berubah jauh?",
        "Apa arti hasil prediksi setelah saya isi data?"
      ],
      disclaimer: "Informasi ini bersifat edukatif dan perlu dikonfirmasi dengan tenaga kesehatan bila keluhan menetap.",
      escalation: { needed: false, reason: null, action: null },
    };
  }

  if (normalizedMessage.includes("soda zero") && /(coca cola|coca cola biasa|cola biasa)/.test(normalizedMessage)) {
    return {
      answer: "Kalau dibandingkan dengan coca cola biasa, soda zero biasanya memang tidak mengandung gula sebanyak versi reguler, jadi dari sisi asupan gula bisa terasa lebih baik. Tapi itu bukan berarti otomatis ideal untuk diminum setiap hari. Untuk kebiasaan rutin, air putih, teh tawar, atau minuman rendah gula tetap lebih aman daripada menjadikan soda jenis apa pun sebagai minuman harian.",
      matched_topic: "food_drink_guidance",
      confidence: 0.93,
      suggestions: [
        "Minuman apa yang paling aman untuk dikonsumsi rutin?",
        "Bagaimana cara mengurangi minuman manis tanpa terasa berat?",
        "Apakah kopi susu juga perlu dibatasi?"
      ],
      disclaimer: "Informasi ini bersifat edukatif dan perlu dikonfirmasi dengan tenaga kesehatan bila keluhan menetap.",
      escalation: { needed: false, reason: null, action: null },
    };
  }

  if (Number.isFinite(sleepHours) && /(risiko penyakit|umur\s+\d+|usia\s+\d+|sudah tua|buat umur|umur segini)/.test(normalizedMessage)) {
    const answer = sleepHours <= (sleepRule.moderate_threshold ?? 6)
      ? `Tidur sekitar ${sleepHours} jam tiap malam masih bisa terasa kurang, apalagi kalau berlangsung terus dan kualitas tidurnya juga tidak bagus. Pada usia berapa pun, pola tidur seperti ini bisa ikut memengaruhi stres, nafsu makan, energi, dan kebiasaan harian lain yang berhubungan dengan kesehatan. Jadi fokusnya bukan hanya umur, tetapi apakah pola itu terjadi terus-menerus dan dibarengi kebiasaan lain yang kurang baik.`
      : `Kalau kamu masih tidur sekitar ${sleepHours} jam tiap malam, itu umumnya sudah lebih mendekati durasi yang cukup untuk banyak orang. Meski begitu, risiko kesehatan tetap tidak ditentukan oleh tidur saja, karena pola makan, aktivitas fisik, obat, merokok, dan kondisi medis lain juga ikut berpengaruh. Jadi jam tidurnya cukup baik, tetapi tetap perlu dilihat bersama kebiasaan harian yang lain.`;
    return {
      answer,
      matched_topic: "daily_habit_risk_factor",
      confidence: 0.93,
      suggestions: [
        "Bagaimana cara menjaga kualitas tidur supaya lebih baik?",
        "Kebiasaan apa yang paling sering merusak pola tidur?",
        "Kalau tidur cukup tapi tetap capek, apa yang perlu diperhatikan?"
      ],
      disclaimer: "Informasi ini bersifat edukatif dan perlu dikonfirmasi dengan tenaga kesehatan bila keluhan menetap.",
      escalation: { needed: false, reason: null, action: null },
    };
  }

  if (/(jalan ke kampus|jalan kaki|jalan pagi|jalan .*kampus)/.test(normalizedMessage) && /(cukup|udah cukup|sudah cukup|aman)/.test(normalizedMessage)) {
    const hasDailyFrequency = /(setiap hari|tiap hari|hampir tiap hari|tiap pagi|setiap pagi)/.test(normalizedMessage);
    let activityDetail = "";
    if (Number.isFinite(exerciseMinutes)) {
      activityDetail = `${exerciseMinutes} menit`;
    } else if (exerciseDistance) {
      activityDetail = exerciseDistance;
    } else {
      activityDetail = "durasi singkat";
    }

    const consistencyText = hasDailyFrequency
      ? "Kalau itu dilakukan hampir tiap hari, kebiasaan tersebut sudah lebih baik daripada tidak aktif sama sekali."
      : "Aktivitas itu tetap bermanfaat, tetapi manfaatnya lebih terasa kalau dilakukan cukup rutin.";

    return {
      answer: `Jalan kaki ke kampus atau jalan pagi dengan durasi sekitar ${activityDetail} memang bisa membantu kesehatan. ${consistencyText} Untuk benar-benar menurunkan risiko dengan lebih optimal, biasanya tetap bagus kalau intensitasnya cukup membuat tubuh aktif dan, bila memungkinkan, ditambah aktivitas lain ringan di hari-hari tertentu.`,
      matched_topic: "exercise_guidance",
      confidence: 0.93,
      suggestions: [
        "Kalau cuma 10-15 menit, apakah perlu ditambah aktivitas lain?",
        "Olahraga apa yang realistis untuk jadwal sibuk?",
        "Berapa target gerak per minggu yang lebih ideal?"
      ],
      disclaimer: "Informasi ini bersifat edukatif dan perlu dikonfirmasi dengan tenaga kesehatan bila keluhan menetap.",
      escalation: { needed: false, reason: null, action: null },
    };
  }

  if (/olahraga/.test(normalizedMessage) && /(seminggu sekali|1 kali seminggu|sekali seminggu)/.test(normalizedMessage) && /(cukup|masih membantu|aman)/.test(normalizedMessage)) {
    return {
      answer: "Olahraga seminggu sekali tetap lebih baik daripada tidak bergerak sama sekali, tetapi biasanya belum cukup kalau tujuanmu ingin menurunkan risiko dengan lebih optimal. Manfaatnya akan terasa lebih baik kalau aktivitas fisik dilakukan lebih rutin, meskipun tidak harus langsung berat. Jadi kalau sekarang baru seminggu sekali, itu bisa jadi awal, lalu pelan-pelan ditambah frekuensinya.",
      matched_topic: "exercise_guidance",
      confidence: 0.93,
      suggestions: [
        "Kalau sibuk, target olahraga realistis per minggu seperti apa?",
        "Olahraga apa yang paling mudah dimulai dulu?",
        "Kalau cuma jalan kaki, berapa lama yang lebih bagus?"
      ],
      disclaimer: "Informasi ini bersifat edukatif dan perlu dikonfirmasi dengan tenaga kesehatan bila keluhan menetap.",
      escalation: { needed: false, reason: null, action: null },
    };
  }

  const entityMatch = findEntityCategory(normalizedMessage);
  const sugaryDrinkMatch = Object.entries(ENTITY_MAP.food_categories || {}).find(([category, entities]) =>
    category === "minuman_manis" && findEntityInCategory(normalizedMessage, entities)
  );
  const processedFoodMatch = Object.entries(ENTITY_MAP.food_categories || {}).find(([category, entities]) =>
    (category === "makanan_olahan_tinggi_garam" || category === "makanan_bersantan_berlemak") &&
    findEntityInCategory(normalizedMessage, entities)
  );

  if (sugaryDrinkMatch && processedFoodMatch) {
    const drinkEntity = findEntityInCategory(normalizedMessage, sugaryDrinkMatch[1]);
    const foodEntity = findEntityInCategory(normalizedMessage, processedFoodMatch[1]);
    const frequencyLabel = detectFrequencyLabel(normalizedMessage);
    return {
      answer: `Kalau ${foodEntity} dibarengi ${drinkEntity} dan itu jadi kebiasaan ${frequencyLabel}, yang perlu diperhatikan bukan cuma satu jenis makanannya, tetapi gabungan garam, lemak, gula, dan total kalorinya. Kombinasi seperti ini memang lebih mudah membuat pola makan harian jadi berat, jadi akan lebih aman kalau tidak dijadikan rutinitas terlalu sering dan sesekali diganti dengan pilihan yang lebih ringan.`,
      matched_topic: "food_drink_guidance",
      confidence: 0.93,
      suggestions: [
        "Kalau mau pilih salah satu, mana yang lebih penting dibatasi dulu?",
        "Menu malam yang lebih ringan tapi tetap kenyang itu seperti apa?",
        "Minuman apa yang lebih aman kalau makan berat?"
      ],
      disclaimer: "Informasi ini bersifat edukatif dan perlu dikonfirmasi dengan tenaga kesehatan bila keluhan menetap.",
      escalation: { needed: false, reason: null, action: null },
    };
  }

  if (entityMatch && /(aman|bahaya|boleh|gimana|naik|risiko)/.test(normalizedMessage)) {
    const frequencyLabel = detectFrequencyLabel(normalizedMessage);

    if (entityMatch.category === "makanan_olahan_tinggi_garam") {
      return {
        answer: fillTemplate(RESPONSE_TEMPLATES.food_daily_processed, {
          entity: entityMatch.entity,
          frequency_label: frequencyLabel,
          risk_terms: "garam, lemak, dan kepadatan kalori",
        }),
        matched_topic: "food_frequency_guidance",
        confidence: 0.9,
        suggestions: [
          "Makanan malam yang lebih aman itu seperti apa?",
          "Seberapa sering makanan olahan sebaiknya dibatasi?",
          "Bagaimana cara menurunkan risiko lewat pola makan?",
        ],
        disclaimer: "Informasi ini bersifat edukatif dan perlu dikonfirmasi dengan tenaga kesehatan bila keluhan menetap.",
        escalation: { needed: false, reason: null, action: null },
      };
    }

    if (entityMatch.category === "minuman_manis") {
      const answer = entityMatch.entity === "soda zero"
        ? "Minuman seperti soda zero memang bisa terasa lebih ringan karena tidak mengandung gula sebanyak soda biasa, tetapi tetap kurang ideal kalau dijadikan kebiasaan harian. Jadi kalau dibandingkan coca cola biasa mungkin bisa terasa lebih baik dari sisi gula, tetapi air putih, teh tawar, atau minuman rendah gula tetap lebih aman untuk kebiasaan rutin."
        : fillTemplate(RESPONSE_TEMPLATES.food_daily_sugary_drink, {
            entity: entityMatch.entity,
            frequency_label: frequencyLabel,
          });
      return {
        answer,
        matched_topic: "food_drink_guidance",
        confidence: 0.9,
        suggestions: [
          "Minuman apa yang lebih aman untuk dikonsumsi rutin?",
          "Bagaimana cara mengurangi gula harian tanpa terlalu berat?",
          "Makanan apa yang lebih aman untuk menjaga gula darah?",
        ],
        disclaimer: "Informasi ini bersifat edukatif dan perlu dikonfirmasi dengan tenaga kesehatan bila keluhan menetap.",
        escalation: { needed: false, reason: null, action: null },
      };
    }

    if (entityMatch.category === "makanan_bersantan_berlemak") {
      return {
        answer: `${entityMatch.entity} termasuk makanan yang cenderung lebih berat karena bisa tinggi santan, lemak, garam, atau porsi kalorinya. Kalau dikonsumsi ${frequencyLabel}, ini kurang ideal untuk orang yang sedang menjaga kolesterol, jantung, atau berat badan. Bukan berarti harus dilarang total, tetapi akan lebih aman kalau porsinya dijaga dan diseimbangkan dengan pilihan makan yang lebih ringan di waktu lain.`,
        matched_topic: "food_drink_guidance",
        confidence: 0.9,
        suggestions: [
          "Makanan apa yang lebih aman untuk dikonsumsi rutin?",
          "Bagaimana cara mengatur porsi makan yang lebih aman?",
          "Minuman apa yang sebaiknya dibatasi?",
        ],
        disclaimer: "Informasi ini bersifat edukatif dan perlu dikonfirmasi dengan tenaga kesehatan bila keluhan menetap.",
        escalation: { needed: false, reason: null, action: null },
      };
    }
  }

  return null;
}

function buildWhenToSeeDoctor(riskLevel) {
  if (riskLevel === "Tinggi") {
    return "Segera dalam 1-3 hari atau lebih cepat jika ada gejala berat.";
  }
  if (riskLevel === "Sedang") {
    return "Pertimbangkan konsultasi dalam 1-2 minggu ke depan.";
  }
  return "Lanjutkan pemeriksaan rutin dan evaluasi berkala.";
}

function buildRiskAwareAnswer(disease, riskLevel, topFactors = []) {
  const diseaseTips = TIPS[disease]?.[riskLevel];
  if (!diseaseTips) {
    return null;
  }

  const factorSentence = topFactors.length > 0
    ? ` Faktor yang paling menonjol dari hasilmu saat ini adalah ${topFactors.join(", ")}.`
    : "";

  return {
    answer: `Untuk risiko ${riskLevel.toLowerCase()} pada ${getDiseaseLabel(disease)}, fokus utamanya adalah ${diseaseTips.title.toLowerCase()}.${factorSentence} Langkah awal yang disarankan: ${diseaseTips.tips.slice(0, 3).join(" ")}`,
    matched_topic: "prediction_followup",
    confidence: 0.96,
    suggestions: [
      `Apa arti risiko ${riskLevel.toLowerCase()} ${getDiseaseLabel(disease)}?`,
      `Saran gaya hidup untuk ${getDiseaseLabel(disease)} apa saja?`,
      "Kapan saya perlu ke dokter?",
    ],
    disclaimer: "Jawaban ini bersifat edukatif dan tidak menggantikan evaluasi dokter.",
    escalation: riskLevel === "Tinggi"
      ? {
          needed: true,
          reason: "high_risk_prediction",
          action: buildWhenToSeeDoctor(riskLevel),
        }
      : {
          needed: false,
          reason: null,
          action: buildWhenToSeeDoctor(riskLevel),
        },
  };
}

function buildSafetyResponse(reason) {
  const urgent = reason === "dangerous_symptoms";
  return {
    answer: urgent
      ? "Gejala yang kamu sebutkan bisa termasuk kondisi darurat. Saya tidak bisa menilai kondisi secara pasti lewat chat. Jika gejala sedang terjadi atau berat, segera cari pertolongan medis, ke IGD, atau hubungi layanan darurat setempat."
      : "Saya hanya bisa membantu dengan edukasi umum, penjelasan hasil prediksi, dan saran tindak lanjut dasar. Saya tidak bisa memberi diagnosis pasti, resep, atau dosis obat. Untuk keputusan medis, sebaiknya konsultasikan langsung dengan dokter.",
    matched_topic: urgent ? "doctor_escalation" : "medical_guardrail",
    confidence: 0.99,
    suggestions: urgent
      ? ["Kapan harus ke dokter?", "Apa arti hasil risiko tinggi?", "Bagaimana mencari rumah sakit terdekat?"]
      : ["Apa arti hasil prediksi saya?", "Apa langkah awal jika risiko saya tinggi?", "Kapan saya perlu ke dokter?"],
    disclaimer: "Chatbot ini hanya untuk edukasi dan bukan pengganti tenaga medis.",
    escalation: {
      needed: true,
      reason,
      action: urgent
        ? "Segera cari bantuan medis darurat."
        : "Konsultasikan dengan dokter untuk terapi, obat, atau diagnosis.",
    },
  };
}

function scoreEntry(entry, normalizedMessage, tokens, disease, riskLevel, currentPage) {
  let score = 0;
  const asksSymptomOrTest = SYMPTOM_TEST_PATTERNS.some((pattern) => normalizedMessage.includes(pattern));
  const asksFoodOrDrink = FOOD_PATTERNS.some((pattern) => normalizedMessage.includes(pattern)) || LIFESTYLE_PATTERNS.some((pattern) => normalizedMessage.includes(pattern));
  const asksExercise = EXERCISE_PATTERNS.some((pattern) => normalizedMessage.includes(pattern));
  const asksDailyHabit = DAILY_HABIT_PATTERNS.some((pattern) => normalizedMessage.includes(pattern));
  const asksSoftDrink = SOFT_DRINK_PATTERNS.some((pattern) => normalizedMessage.includes(pattern));
  const asksLocalFood = LOCAL_FOOD_PATTERNS.some((pattern) => normalizedMessage.includes(pattern));
  const asksDeadlineStress = DEADLINE_STRESS_PATTERNS.some((pattern) => normalizedMessage.includes(pattern));
  const asksNoodleAtNight = NOODLE_NIGHT_PATTERNS.some((pattern) => normalizedMessage.includes(pattern));
  const asksSleep = SLEEP_PATTERNS.some((pattern) => normalizedMessage.includes(pattern));
  const asksSocialMedia = SOCIAL_MEDIA_PATTERNS.some((pattern) => normalizedMessage.includes(pattern));
  const asksPredictionHigh = PREDICTION_HIGH_PATTERNS.some((pattern) => normalizedMessage.includes(pattern));
  const asksPractical = PRACTICAL_PATTERNS.some((pattern) => normalizedMessage.includes(pattern));
  const asksAgeInput = AGE_INPUT_PATTERNS.some((pattern) => normalizedMessage.includes(pattern));
  const asksPcos = PCOS_PATTERNS.some((pattern) => normalizedMessage.includes(pattern));
  const asksQuitVape = VAPE_QUIT_PATTERNS.some((pattern) => normalizedMessage.includes(pattern));

  for (const phrase of entry.question_patterns || []) {
    if (normalizedMessage.includes(normalizeText(phrase))) {
      score += 12;
    }
  }

  for (const keyword of entry.keywords || []) {
    const normalizedKeyword = normalizeText(keyword);
    if (!normalizedKeyword) {
      continue;
    }

    if (normalizedMessage.includes(normalizedKeyword)) {
      score += normalizedKeyword.includes(" ") ? 8 : 4;
    }
  }

  for (const tag of entry.tags || []) {
    if (tokens.includes(normalizeText(tag))) {
      score += 2;
    }
  }

  if (disease && Array.isArray(entry.disease_scope) && entry.disease_scope.includes(disease)) {
    score += 7;
  }

  if (currentPage && disease && PAGE_DISEASE_MAP[currentPage] === disease) {
    score += 2;
  }

  if (riskLevel && entry.intent === "risk_level_meaning") {
    score += 6;
  }

  if (entry.intent === "healthy_lifestyle_advice" && LIFESTYLE_PATTERNS.some((pattern) => normalizedMessage.includes(pattern))) {
    score += 10;
  }

  if (asksSymptomOrTest && entry.intent === "symptom_awareness") {
    score += 12;
  }

  if (asksFoodOrDrink && ["food_drink_guidance", "food_frequency_guidance", "healthy_lifestyle_advice"].includes(entry.intent)) {
    score += 10;
  }

  if (asksSoftDrink && entry.id === "soft-drink-brand-specific") {
    score += 14;
  }

  if (asksLocalFood && entry.id === "indonesian-food-comparison-guidance") {
    score += 14;
  }

  if (asksNoodleAtNight && entry.id === "egg-and-noodle-guidance") {
    score += 16;
  }

  if (asksDeadlineStress && entry.id === "stress-specific") {
    score += 16;
  }

  if (asksDeadlineStress && entry.id === "genz-digital-habit-guidance") {
    score -= 6;
  }

  if (asksSleep && ["sleep-specific", "sleep-stress-and-daily-habit-guidance", "pola-tidur-gen-z", "sleep-and-cholesterol-specific"].includes(entry.id)) {
    score += 16;
  }

  if (asksSocialMedia && ["stres-sosmed", "screen-time-sleep-guidance", "scroll-instagram-stress-specific", "genz-digital-habit-guidance"].includes(entry.id)) {
    score += 16;
  }

  if (asksPredictionHigh && ["high-heart-risk-next-step", "high-diabetes-risk-next-step"].includes(entry.id)) {
    score += 18;
  }

  if (asksPractical && ["bpjs-glucose-check-specific", "gestational-diabetes-specific", "age-input-specific", "hospital-nearby-specific"].includes(entry.id)) {
    score += 18;
  }

  if (asksAgeInput && entry.id === "age-input-specific") {
    score += 18;
  }

  if (asksPcos && ["pcos-specific", "pcos-hormonal-factor", "pcos-dan-diabetes"].includes(entry.id)) {
    score += 18;
  }

  if (asksQuitVape && entry.id === "quit-vape-specific") {
    score += 18;
  }

  if (normalizedMessage.includes("bmi") && normalizedMessage.includes("mulai diet") && entry.id === "motivation-beginner-specific") {
    score += 18;
  }

  if ((asksFoodOrDrink || asksSleep || asksDailyHabit) && entry.id === "age-input-specific") {
    score -= 20;
  }

  if ((asksFoodOrDrink || asksSleep || asksDailyHabit || asksPredictionHigh) && entry.intent === "practical_info" && !asksPractical && !asksAgeInput) {
    score -= 10;
  }

  if ((asksFoodOrDrink || asksSleep || asksDailyHabit || asksExercise || asksSymptomOrTest) &&
      ["project_creator_info", "about_project", "project_tech_info", "app_features", "app_usage"].includes(entry.intent)) {
    score -= 18;
  }

  if (asksExercise && entry.intent === "exercise_guidance") {
    score += 12;
  }

  if (asksDailyHabit && entry.intent === "daily_habit_risk_factor") {
    score += 10;
  }

  if (typeof entry.priority === "number") {
    score += entry.priority;
  }

  if (entry.specificity === "specific") {
    score += 1.5;
  } else if (entry.specificity === "broad") {
    score -= 0.5;
  }

  if (entry.intent === "disease_education" && (asksSymptomOrTest || asksFoodOrDrink || asksExercise || asksDailyHabit)) {
    score -= 8;
  }

  if (entry.intent === "disease_education" && (asksPredictionHigh || asksSleep || asksSocialMedia || asksPcos || asksQuitVape)) {
    score -= 10;
  }

  return score;
}

function findBestEntry(message, context = {}) {
  const normalizedMessage = normalizeText(message);
  const tokens = tokenize(message);
  const disease = detectDisease(message, context);
  const riskLevel = getRiskLevel(context);
  const currentPage = context.current_page;

  let bestEntry = null;
  let bestScore = -1;

  for (const entry of knowledgeBase) {
    const score = scoreEntry(entry, normalizedMessage, tokens, disease, riskLevel, currentPage);
    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  }

  return {
    bestEntry,
    bestScore,
    disease,
    riskLevel,
  };
}

function buildEntryResponse(entry, disease, riskLevel, message = "") {
  let answer = entry.answer;
  const normalizedMessage = normalizeText(message);

  if (entry.intent === "risk_level_meaning" && disease && riskLevel) {
    answer = `Untuk ${getDiseaseLabel(disease)}, hasil risiko ${riskLevel.toLowerCase()} berarti ${entry.answer.toLowerCase()}`;
  } else if (entry.intent === "disease_education" && disease) {
    answer = `${entry.answer} Jika kamu sudah punya hasil prediksi ${getDiseaseLabel(disease)}, saya juga bisa bantu menjelaskan arti level risikonya.`;
  } else if (entry.intent === "healthy_lifestyle_advice" && disease) {
    answer = `${entry.answer} Kalau kamu mau, saya juga bisa bantu jelaskan saran yang lebih relevan untuk ${getDiseaseLabel(disease)}.`;
  } else if (entry.id === "egg-and-noodle-guidance" && !normalizedMessage.includes("telur")) {
    answer = "Makan mi atau makanan olahan di malam hari terlalu sering biasanya kurang baik karena cenderung tinggi garam, lemak, dan membuat pola makan harian jadi kurang seimbang. Kalau kamu masih 18 tahun, itu bukan berarti otomatis aman terus, karena kebiasaan harian tetap berpengaruh. Lebih aman kalau kebiasaan seperti ini tidak dijadikan rutinitas setiap malam dan makanan malam dibuat lebih ringan serta lebih bervariasi.";
  } else if (entry.id === "sleep-and-cholesterol-specific") {
    const hourMatch = normalizedMessage.match(/(?:tidur(?:\s+cuma)?\s+)(\d+)\s+jam/);
    const hours = hourMatch ? Number(hourMatch[1]) : null;

    if (Number.isFinite(hours) && hours <= 5) {
      answer = `Tidur sekitar ${hours} jam tiap malam termasuk kurang untuk banyak orang, dan kalau berlangsung terus-menerus bisa ikut memperburuk stres, pola makan, pemulihan tubuh, dan kesehatan metabolik. Jadi pengaruhnya ke kolesterol biasanya tidak berdiri sendiri, tetapi muncul bersama kebiasaan lain yang ikut berantakan saat kurang tidur. Kalau ini sering terjadi, memperbaiki jam tidur tetap langkah penting walaupun kamu masih muda.`;
    } else if (Number.isFinite(hours) && hours >= 7) {
      answer = `Tidur sekitar ${hours} jam tiap malam umumnya sudah lebih mendekati durasi yang cukup dibanding tidur yang terlalu pendek. Jadi kalau pola tidurmu relatif teratur, itu justru cenderung lebih baik untuk menjaga pemulihan tubuh, stres, dan kesehatan metabolik. Risiko kolesterol biasanya lebih banyak dipengaruhi gabungan faktor lain seperti pola makan, aktivitas fisik, merokok, dan faktor genetik, bukan dari tidur ${hours} jam saja.`;
    } else if (Number.isFinite(hours) && hours === 6) {
      answer = "Tidur 6 jam tiap malam masih bisa terasa kurang bagi sebagian orang kalau berlangsung terus-menerus, apalagi kalau kualitas tidurnya juga tidak baik. Dalam jangka panjang, tidur yang kurang rapi bisa ikut memengaruhi stres, nafsu makan, dan kebiasaan harian lain yang berhubungan dengan kesehatan metabolik. Jadi akan lebih baik kalau durasi dan kualitas tidurnya dibenahi pelan-pelan, bukan hanya mengandalkan pola makan saja.";
    }
  }

  return {
    answer,
    matched_topic: entry.intent,
    confidence: 0.6,
    suggestions: buildSuggestions(entry),
    disclaimer: entry.category === "safety"
      ? "Chatbot ini hanya untuk edukasi dan bukan pengganti tenaga medis."
      : "Informasi ini bersifat edukatif dan perlu dikonfirmasi dengan tenaga kesehatan bila keluhan menetap.",
    escalation: {
      needed: false,
      reason: null,
      action: riskLevel ? buildWhenToSeeDoctor(riskLevel) : null,
    },
  };
}

function buildFallbackResponse(disease) {
  return {
    answer: disease
      ? `Saya belum yakin dengan maksud pertanyaanmu, tapi saya bisa bantu seputar ${getDiseaseLabel(disease)}, arti hasil prediksi, cara menggunakan Vitarisk, dan saran tindak lanjut dasar.`
      : "Saya belum yakin dengan maksud pertanyaanmu. Saya bisa bantu seputar Vitarisk, cara membaca hasil prediksi, edukasi dasar jantung, diabetes, dan kolesterol, serta kapan perlu ke dokter.",
    matched_topic: "unsupported_question",
    confidence: 0.2,
    suggestions: disease
      ? [
          `Apa itu ${getDiseaseLabel(disease)}?`,
          `Apa arti risiko tinggi ${getDiseaseLabel(disease)}?`,
          "Bagaimana cara pakai Vitarisk?",
        ]
      : [
          "Apa itu Vitarisk?",
          "Cara cek risiko di aplikasi ini bagaimana?",
          "Apa arti hasil prediksi?",
        ],
    disclaimer: "Chatbot ini hanya menjawab berdasarkan knowledge base lokal Vitarisk.",
    escalation: {
      needed: false,
      reason: null,
      action: null,
    },
  };
}

function getChatResponse({ message, context = {} }) {
  const resolvedMessage = resolveClarificationMessage(message, context);
  const normalized = normalizeText(resolvedMessage);

  const clarificationResponse = needsClarification(normalized);
  if (clarificationResponse) {
    return clarificationResponse;
  }

  const dynamicResponse = buildDynamicKnowledgeResponse(normalized, detectDisease(resolvedMessage, context));
  if (dynamicResponse) {
    return dynamicResponse;
  }

  if (DANGEROUS_SYMPTOM_PATTERNS.some((pattern) => normalized.includes(pattern))) {
    return buildSafetyResponse("dangerous_symptoms");
  }

  if (MEDICAL_GUARDRAIL_PATTERNS.some((pattern) => normalized.includes(pattern))) {
    return buildSafetyResponse("medical_advice_request");
  }

  const disease = detectDisease(resolvedMessage, context);
  const riskLevel = getRiskLevel(context);
  const topFactors = getTopFactors(context);
  const asksAboutResults = /(hasil|prediksi|risiko|faktor|setelah hasil|arti)/.test(normalized);

  if (disease && riskLevel && asksAboutResults) {
    return buildRiskAwareAnswer(disease, riskLevel, topFactors);
  }

  const { bestEntry, bestScore } = findBestEntry(resolvedMessage, context);
  if (bestEntry && bestScore >= 6) {
    const response = buildEntryResponse(bestEntry, disease, riskLevel, resolvedMessage);
    response.confidence = Math.min(0.95, Number((bestScore / 20).toFixed(2)));
    return response;
  }

  return buildFallbackResponse(disease);
}

module.exports = {
  getChatResponse,
};
