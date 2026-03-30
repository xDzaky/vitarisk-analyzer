/**
 * routes/recommendations.js
 * Returns health recommendations based on prediction result.
 * Route: POST /api/recommendations
 *
 * Body: { disease: "heart"|"diabetes"|"cholesterol", risk_level: "Rendah"|"Sedang"|"Tinggi", top_factors: [...] }
 */

const express = require("express");
const router  = express.Router();
const { sendSuccess, sendError } = require("../utils/apiResponse");
const { validateRecommendationPayload } = require("../utils/validateRequest");

// ─── Static recommendation database ─────────────────────────────────
const TIPS = {
  heart: {
    Rendah: {
      title: "Jantung Anda Sehat!",
      icon: "💚",
      tips: [
        "Pertahankan pola makan rendah lemak jenuh dan kolesterol.",
        "Olahraga minimal 150 menit per minggu (berjalan kaki, berenang, bersepeda).",
        "Hindari merokok aktif maupun pasif.",
        "Jaga berat badan ideal (BMI 18.5–24.9).",
        "Periksa tekanan darah minimal setahun sekali.",
      ],
    },
    Sedang: {
      title: "Perhatikan Kesehatan Jantung Anda",
      icon: "💛",
      tips: [
        "Kurangi konsumsi garam (< 5g per hari) untuk menjaga tekanan darah.",
        "Perbanyak konsumsi sayur dan buah (minimal 5 porsi/hari).",
        "Berhenti merokok — konsultasikan ke dokter jika butuh bantuan.",
        "Olahraga aerobik 30 menit setiap hari.",
        "Periksa kadar kolesterol dan gula darah secara berkala.",
        "Kelola stres dengan meditasi atau yoga.",
      ],
    },
    Tinggi: {
      title: "⚠️ Risiko Tinggi — Segera Konsultasi Dokter",
      icon: "❤️",
      tips: [
        "Segera temui dokter atau kardiolog untuk pemeriksaan menyeluruh.",
        "Lakukan EKG dan tes darah untuk profil lipid lengkap.",
        "Ikuti program diet jantung sehat (DASH atau Mediterranean diet).",
        "Hentikan semua kebiasaan merokok dan konsumsi alkohol.",
        "Monitor tekanan darah setiap hari di rumah.",
        "Diskusikan kebutuhan obat-obatan dengan dokter Anda.",
      ],
    },
  },
  diabetes: {
    Rendah: {
      title: "Kadar Gula Anda Normal",
      icon: "💚",
      tips: [
        "Pertahankan berat badan ideal.",
        "Kurangi konsumsi minuman manis dan makanan tinggi karbohidrat olahan.",
        "Tetap aktif bergerak setiap hari.",
        "Periksa gula darah setahun sekali jika ada faktor risiko keluarga.",
      ],
    },
    Sedang: {
      title: "Waspadai Risiko Diabetes",
      icon: "💛",
      tips: [
        "Kurangi konsumsi nasi putih, roti putih, dan minuman manis.",
        "Ganti dengan karbohidrat kompleks: nasi merah, oat, ubi.",
        "Olahraga 30 menit setiap hari untuk meningkatkan sensitivitas insulin.",
        "Perbanyak konsumsi serat: sayuran hijau, kacang-kacangan.",
        "Periksa HbA1c dan gula darah puasa setiap 6 bulan.",
        "Jaga BMI di bawah 25.",
      ],
    },
    Tinggi: {
      title: "⚠️ Risiko Tinggi — Segera Periksa Gula Darah",
      icon: "🍬",
      tips: [
        "Segera lakukan tes HbA1c dan gula darah puasa di laboratorium.",
        "Konsultasikan dengan dokter Spesialis Penyakit Dalam (SpPD).",
        "Ikuti program diet diabetes (prinsip 3J: jadwal, jumlah, jenis).",
        "Monitor gula darah secara mandiri dengan glukometer.",
        "Hindari makanan dengan indeks glikemik tinggi.",
        "Ikutkan dalam program edukasi diabetes di Puskesmas/RS terdekat.",
      ],
    },
  },
  cholesterol: {
    Rendah: {
      title: "Kadar Kolesterol Anda Baik",
      icon: "💚",
      tips: [
        "Pertahankan pola makan rendah lemak jenuh.",
        "Konsumsi makanan kaya omega-3: ikan salmon, tuna, sarden.",
        "Olahraga rutin untuk menjaga HDL tetap tinggi.",
        "Hindari makanan gorengan dan makanan olahan.",
      ],
    },
    Sedang: {
      title: "Perhatikan Kadar Kolesterol Anda",
      icon: "💛",
      tips: [
        "Batasi konsumsi daging merah berlemak (< 2x per minggu).",
        "Ganti minyak sawit dengan minyak zaitun atau canola.",
        "Konsumsi oat, kacang almond, dan avokad untuk menurunkan LDL.",
        "Tingkatkan aktivitas fisik aerobik (berjalan, jogging, bersepeda).",
        "Cek kolesterol lengkap (HDL, LDL, Trigliserida) setiap 6 bulan.",
      ],
    },
    Tinggi: {
      title: "⚠️ Risiko Kolesterol Tinggi — Konsultasi Segera",
      icon: "🩸",
      tips: [
        "Lakukan pemeriksaan lipid profile lengkap di laboratorium.",
        "Konsultasikan ke dokter tentang kemungkinan statin atau obat penurun kolesterol.",
        "Ikuti diet rendah kolesterol ketat: hindari kuning telur, jeroan, santan.",
        "Olahraga aerobik 45 menit per hari, minimal 5x seminggu.",
        "Hindari rokok — nikotin menurunkan HDL (kolesterol baik).",
        "Turunkan berat badan jika kelebihan — setiap 1 kg turun, kolesterol berkurang ~1 mg/dL.",
      ],
    },
  },
};

// ─── POST /api/recommendations ───────────────────────────────────────
router.post("/", (req, res) => {
  const { disease, risk_level } = req.body;

  const validationErrors = validateRecommendationPayload(req.body);
  if (validationErrors.length > 0) {
    return sendError(res, {
      status: 400,
      code: "INVALID_PAYLOAD",
      message: "Payload rekomendasi tidak valid",
      details: validationErrors,
    });
  }

  const diseaseTips = TIPS[disease];
  if (!diseaseTips) {
    return sendError(res, {
      status: 400,
      code: "INVALID_DISEASE",
      message: `Jenis penyakit tidak valid: ${disease}`,
    });
  }

  const levelTips = diseaseTips[risk_level];
  if (!levelTips) {
    return sendError(res, {
      status: 400,
      code: "INVALID_RISK_LEVEL",
      message: `Tingkat risiko tidak valid: ${risk_level}. Gunakan Rendah, Sedang, atau Tinggi.`,
    });
  }

  return sendSuccess(res, {
    data: {
      disease,
      risk_level,
      recommendations: levelTips,
      when_to_see_doctor: risk_level === "Tinggi"
        ? "Segera dalam 1-3 hari"
        : risk_level === "Sedang"
        ? "Dalam 1-2 minggu ke depan"
        : "Pemeriksaan rutin tahunan",
    },
  });
});

module.exports = router;
