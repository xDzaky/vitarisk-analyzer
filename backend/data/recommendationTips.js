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
        "Berhenti merokok dan konsultasikan ke dokter jika butuh bantuan.",
        "Olahraga aerobik 30 menit setiap hari.",
        "Periksa kadar kolesterol dan gula darah secara berkala.",
        "Kelola stres dengan meditasi atau yoga.",
      ],
    },
    Tinggi: {
      title: "Risiko Tinggi - Segera Konsultasi Dokter",
      icon: "❤️",
      tips: [
        "Segera temui dokter atau kardiolog untuk pemeriksaan menyeluruh.",
        "Lakukan EKG dan tes darah untuk profil lipid lengkap.",
        "Ikuti program diet jantung sehat seperti DASH atau Mediterranean diet.",
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
        "Ganti dengan karbohidrat kompleks seperti nasi merah, oat, dan ubi.",
        "Olahraga 30 menit setiap hari untuk meningkatkan sensitivitas insulin.",
        "Perbanyak konsumsi serat seperti sayuran hijau dan kacang-kacangan.",
        "Periksa HbA1c dan gula darah puasa setiap 6 bulan.",
        "Jaga BMI di bawah 25.",
      ],
    },
    Tinggi: {
      title: "Risiko Tinggi - Segera Periksa Gula Darah",
      icon: "🍬",
      tips: [
        "Segera lakukan tes HbA1c dan gula darah puasa di laboratorium.",
        "Konsultasikan dengan dokter Spesialis Penyakit Dalam.",
        "Ikuti program diet diabetes dengan prinsip 3J: jadwal, jumlah, dan jenis.",
        "Monitor gula darah secara mandiri dengan glukometer.",
        "Hindari makanan dengan indeks glikemik tinggi.",
        "Ikuti program edukasi diabetes di Puskesmas atau rumah sakit terdekat.",
      ],
    },
  },
  cholesterol: {
    Rendah: {
      title: "Kadar Kolesterol Anda Baik",
      icon: "💚",
      tips: [
        "Pertahankan pola makan rendah lemak jenuh.",
        "Konsumsi makanan kaya omega-3 seperti salmon, tuna, dan sarden.",
        "Olahraga rutin untuk menjaga HDL tetap tinggi.",
        "Hindari makanan gorengan dan makanan olahan.",
      ],
    },
    Sedang: {
      title: "Perhatikan Kadar Kolesterol Anda",
      icon: "💛",
      tips: [
        "Batasi konsumsi daging merah berlemak hingga kurang dari 2 kali per minggu.",
        "Ganti minyak sawit dengan minyak zaitun atau canola.",
        "Konsumsi oat, kacang almond, dan avokad untuk membantu menurunkan LDL.",
        "Tingkatkan aktivitas fisik aerobik seperti berjalan, jogging, atau bersepeda.",
        "Cek kolesterol lengkap setiap 6 bulan.",
      ],
    },
    Tinggi: {
      title: "Risiko Kolesterol Tinggi - Konsultasi Segera",
      icon: "🩸",
      tips: [
        "Lakukan pemeriksaan lipid profile lengkap di laboratorium.",
        "Konsultasikan ke dokter tentang kemungkinan obat penurun kolesterol.",
        "Ikuti diet rendah kolesterol ketat dan hindari kuning telur, jeroan, serta santan.",
        "Olahraga aerobik 45 menit per hari, minimal 5 kali seminggu.",
        "Hindari rokok karena nikotin menurunkan HDL.",
        "Turunkan berat badan jika berlebih.",
      ],
    },
  },
};

module.exports = {
  TIPS,
};
