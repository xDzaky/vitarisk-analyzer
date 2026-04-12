import ProfileAvatar from "./ProfileAvatar";
import Doctor from "../assets/doctor.png";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { usePWAInstall } from "../hooks/usePWAInstall";
import {
  ArrowRight,
  Bot,
  ChartArea,
  ChartColumn,
  ChartLine,
  ChevronRight,
  Clipboard,
  Droplet,
  FileText,
  Heart,
  HeartPulse,
  LogOut,
  Menu,
  Stethoscope,
  TestTubeDiagonal,
  X,
} from "lucide-react";
import { getStoredToken } from "../lib/api";
import { logoutSession } from "../lib/session";

export default function LandingPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const { isInstallable, isInstalled, isIOS, triggerInstall } = usePWAInstall();

  const loggedIn = !!getStoredToken();

  const handleLogout = async () => {
    try {
      await logoutSession();
    } catch (e) {
      localStorage.removeItem("token");
    }
    window.location.reload();
  };

  const menuItems = [
    { name: "Beranda", id: "home" },
    { name: "Deskripsi", id: "Deskripsi" },
    { name: "Deteksi", id: "Deteksi" },
    { name: "Cara Kerja", id: "caraKerja" },
    { name: "Sumber Data", id: "sumberData" },
    { name: "Footer", id: "footer" },
  ];

  const handleClick = (id) => {
    setActive(id);
    setMobileMenuOpen(false);

    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      const offset = 90;
      const top =
        element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = menuItems.map((item) => item.id);
      let current = "home";
      sections.forEach((id) => {
        const section = document.getElementById(id);
        if (section) {
          const sectionTop = section.offsetTop - 120;
          if (window.scrollY >= sectionTop) {
            current = id;
          }
        }
      });
      setActive(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openChatbot = () => {
    window.dispatchEvent(new Event("vitarisk:open-chatbot"));
  };

  return (
    <div className="font-sans">
      {/* ─── NAVBAR ─── */}
      <nav className="top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm flex items-center px-4 md:px-10 py-4 fixed left-0">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src="/icons2.svg" className="md:h-9 h-6 " alt="logo" />
        </div>

        {/* Desktop menu */}
        <ul className="hidden md:flex gap-8 font-medium text-pine-green absolute left-1/2 -translate-x-1/2">
          {menuItems.map((item) => (
            <li
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={`cursor-pointer transition-all border-b-2 ${
                active === item.id
                  ? "border-pine-green text-dark-green-teal"
                  : "border-transparent hover:text-dark-green-teal"
              }`}
            >
              {item.name}
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-2 ml-auto">
          <ProfileAvatar />

          {loggedIn ? (
            <button
              onClick={handleLogout}
              className="hidden sm:flex hover:bg-red-50 px-4 py-2 rounded-full border-red-200 border text-red-500 transition items-center gap-2 text-sm"
            >
              <LogOut size={16} />
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="hidden sm:block bg-pine-green text-white px-4 py-2 rounded-full font-medium hover:bg-dark-green-teal transition text-sm"
            >
              Daftar Sekarang
            </button>
          )}

          {/* Hamburger button — mobile only */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Menu panel */}
          <div className="relative ml-auto w-64 h-full bg-white shadow-xl flex flex-col pt-20 px-6 gap-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleClick(item.id)}
                className={`text-left px-4 py-3 rounded-xl font-medium transition ${
                  active === item.id
                    ? "bg-[#295f4e]/10 text-[#295f4e]"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.name}
              </button>
            ))}
            <div className="mt-4 border-t pt-4 flex flex-col gap-3">
              {loggedIn ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-red-500 border border-red-200 hover:bg-red-50 transition"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => {
                    navigate("/login");
                    setMobileMenuOpen(false);
                  }}
                  className="bg-[#295f4e] text-white px-4 py-3 rounded-xl font-medium hover:bg-dark-green-teal transition"
                >
                  Daftar Sekarang
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── HERO ─── */}
      <section id="home" className="scroll">
        <div className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 bg-white overflow-hidden">
          <svg className="absolute top-0 left-0 w-96 opacity-30 blur-2xl" viewBox="0 0 500 500">
            <path fill="#22c55e" d="M0,200 C150,100 350,300 500,200 L500,0 L0,0 Z" />
          </svg>
          <svg className="absolute bottom-0 right-0 w-64 md:w-150 opacity-25 blur-2xl" viewBox="0 0 500 500">
            <path fill="#22c55e" d="M0,320 C120,420 380,200 500,300 L500,500 L0,500 Z" />
          </svg>
          <svg className="absolute top-0 left-0 w-64 md:w-150 opacity-20 blur-2xl rotate-180" viewBox="0 0 500 500">
            <path fill="#4ade80" d="M0,320 C120,420 380,200 500,300 L500,500 L0,500 Z" />
          </svg>

          <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl tracking-wide mb-4 relative z-10 leading-tight">
            Kenali Risiko{" "}
            <span className="text-pure-green">Sebelum Terlambat</span>
          </h1>
          <p className="text-pine-green font-medium text-base md:text-xl mb-8 relative z-10 max-w-xl">
            Pemeriksaan cepat ini dirancang untuk membantu kamu memahami risiko
            kesehatan berdasarkan kondisi dan kebiasaanmu.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 relative z-10 w-full sm:w-auto px-4 sm:px-0">
            <button
              onClick={() => handleClick("Deteksi")}
              className="bg-[#295f4e] text-white px-7 py-3 rounded-2xl flex gap-3 items-center justify-center"
            >
              Mulai Deteksi <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="border border-gray-300 px-7 py-3 rounded-2xl hover:bg-gray-100 transition"
            >
              Daftar Sekarang
            </button>
          </div>
        </div>
      </section>

      {/* ─── DESKRIPSI ─── */}
      <section
        id="Deskripsi"
        className="py-16 md:py-24 scroll"
        style={{
          backgroundColor: "#f9fafb",
          backgroundImage: "radial-gradient(#a8d5ba 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-gray-900 mb-6">
              Tentang <span className="text-[#295f4e]">VitaRisk</span> Analyzer
            </h2>
            <div className="w-24 h-1.5 bg-[#295f4e] mx-auto rounded-full mb-8"></div>
            <div>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed border-l-2 border-[#295f4e] mb-6 pl-6 text-left">
                VitaRisk Analyzer adalah aplikasi kesehatan yang membantu pengguna
                mengetahui risiko penyakit jantung, diabetes, dan kolesterol
                berdasarkan data pribadi, gaya hidup, serta indikator kesehatan
                tertentu. Aplikasi ini dirancang sebagai alat edukasi agar pengguna
                lebih sadar terhadap kondisi kesehatannya dan dapat mengambil
                langkah pencegahan lebih dini.
              </p>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed border-l-2 border-[#295f4e] pl-6 text-left">
                Hasil yang ditampilkan berupa tingkat risiko, faktor utama yang
                paling berpengaruh, serta saran umum yang dapat membantu pengguna
                memahami kondisi mereka dengan lebih baik. VitaRisk Analyzer tidak
                menggantikan diagnosis dokter, melainkan menjadi pendamping digital
                untuk mendukung keputusan kesehatan yang lebih terarah.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DETEKSI KESEHATAN ─── */}
      <section id="Deteksi" className="py-16 md:py-24 bg-white text-center scroll">
        <div className="max-w-6xl mx-auto px-4 md:px-10">
          <p className="text-[#295f4e] mb-2 text-sm font-medium">DETEKSI KESEHATAN GRATIS</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            3 Deteksi Kesehatan Penting
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto mb-10 text-sm md:text-base">
            Pemeriksaan cepat ini dirancang untuk membantu kamu memahami potensi
            risiko kesehatan berdasarkan kondisi dan kebiasaanmu.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
            {/* Jantung */}
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-200 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mb-6 text-xl text-red-400">
                  <HeartPulse />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-left">Deteksi Jantung</h3>
                <p className="text-gray-500 text-sm leading-relaxed text-left">
                  Periksa risiko penyakit jantung melalui kuesioner kesehatan interaktif.
                </p>
              </div>
              <button
                onClick={() => navigate("/landing/deteksi-jantung")}
                className="text-[#295f4e] font-medium flex items-center gap-1 mt-6"
              >
                Mulai Sekarang <ChevronRight size={18} />
              </button>
            </div>
            {/* Diabetes */}
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-200 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-red-200 rounded-2xl flex items-center justify-center mb-6 text-xl text-red-600">
                  <Droplet />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-left">Deteksi Diabetes</h3>
                <p className="text-gray-500 text-sm leading-relaxed text-left">
                  Identifikasi risiko diabetes dengan pertanyaan medis yang akurat.
                </p>
              </div>
              <button
                onClick={() => navigate("/landing/deteksi-diabetes")}
                className="text-[#295f4e] font-medium flex mt-6 items-center gap-1"
              >
                Mulai Sekarang <ChevronRight size={18} />
              </button>
            </div>
            {/* Kolesterol */}
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-200 flex flex-col justify-between sm:col-span-2 md:col-span-1">
              <div>
                <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center mb-6 text-xl text-yellow-600">
                  <ChartLine />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-left">Deteksi Kolesterol</h3>
                <p className="text-gray-500 text-sm leading-relaxed text-left">
                  Cek potensi masalah kolesterol tinggi dengan penilaian cepat.
                </p>
              </div>
              <button
                onClick={() => navigate("/landing/deteksi-kolestrol")}
                className="text-[#295f4e] font-medium flex items-center gap-1 mt-6"
              >
                Mulai Sekarang <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CARA KERJA ─── */}
      <section
        id="caraKerja"
        className="py-16 md:py-20 bg-gray-50 text-center scroll-mt-22.5"
        style={{
          backgroundColor: "#f9fafb",
          backgroundImage: "radial-gradient(#a8d5ba 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <p className="text-[#295f4e] mb-3 text-sm font-medium">CARA KERJA</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-12 md:mb-16">
            Cara Kerja dengan 6 Langkah Yang Mudah
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 justify-items-center">
            {[
              { icon: <Clipboard />, num: "01", title: "Jawab Pertanyaan", desc: "Pilih penyakit yang ingin diperiksa: jantung, diabetes, atau kolesterol." },
              { icon: <ChartColumn />, num: "02", title: "Dapatkan Hasil", desc: "Isi data usia, jenis kelamin, riwayat keluarga, dan indikator kesehatan." },
              { icon: <Bot />, num: "03", title: "Chat dengan AI", desc: "Sistem memproses data menggunakan model machine learning." },
              { icon: <ChartArea />, num: "04", title: "Analisis Hasil", desc: "Lihat persentase risiko, kategori risiko, dan faktor utama yang memengaruhi." },
              { icon: <Stethoscope />, num: "05", title: "Saran & Tindak Lanjut", desc: "Pengguna mendapatkan saran awal sebelum konsultasi ke tenaga medis." },
              { icon: <FileText />, num: "06", title: "Tampilkan Rekomendasi", desc: "Sistem menampilkan saran kesehatan yang disesuaikan berdasarkan hasil analisis risiko pengguna." },
            ].map((step) => (
              <div
                key={step.num}
                className="bg-white p-8 md:p-10 rounded-3xl border border-gray-200 w-full flex flex-col items-center justify-center text-center hover:-translate-y-1 transition"
              >
                <div className="text-2xl mb-3 bg-gray-100 rounded-xl grid place-items-center size-12 text-dark-green-teal">
                  {step.icon}
                </div>
                <h3 className="text-4xl md:text-5xl font-bold text-[#295f4e] mb-3">{step.num}</h3>
                <p className="font-semibold mb-2">{step.title}</p>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SUMBER DATA ─── */}
      <div id="sumberData" className="text-white px-6"></div>
      <div className="min-h-auto bg-gray-50 py-12 px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            VitaRisk Analyzer
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            VitaRisk Analyzer menggunakan data kesehatan untuk membantu menganalisis
            risiko penyakit jantung, diabetes, dan kolesterol. Data yang digunakan
            mencakup informasi seperti usia, tekanan darah, gula darah, kolesterol,
            riwayat keluarga, dan kebiasaan hidup.
          </p>
        </div>
        <div className="max-w-4xl mx-auto space-y-6">
          {[
            {
              icon: <Heart className="text-dark-green-teal" />,
              title: "Heart Disease Dataset",
              badge: "JANTUNG",
              badgeColor: "bg-red-100 text-red-500",
              source: "UCI Heart Disease via Kaggle",
              desc: "Dataset komprehensif untuk analisis faktor risiko penyakit jantung koroner, mencakup tekanan darah, kadar kolesterol, dan riwayat klinis.",
            },
            {
              icon: <Stethoscope className="text-dark-green-teal" />,
              title: "Pima Indians Diabetes Dataset",
              badge: "DIABETES",
              badgeColor: "bg-green-100 text-green-600",
              source: "Kaggle — UCI Machine Learning Repository",
              desc: "Dataset standar untuk prediksi risiko diabetes berdasarkan indikator biometrik seperti kadar glukosa, BMI, dan riwayat keluarga.",
            },
            {
              icon: <TestTubeDiagonal className="text-dark-green-teal" />,
              title: "Cholesterol Risk Data",
              badge: "KOLESTEROL",
              badgeColor: "bg-yellow-100 text-yellow-600",
              source: "Diolah dari Heart Disease Dataset",
              desc: "Data yang diekstrak dan diolah dari Heart Disease Dataset khusus untuk analisis mendalam risiko kolesterol tinggi.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl p-5 md:p-6 shadow-md border border-gray-100 hover:shadow-lg transition duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 shrink-0 flex items-center justify-center rounded-xl bg-gray-100">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-800 text-base md:text-lg">
                      {item.title}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">{item.source}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── CHAT AI ─── */}
      <div className="bg-[#295f4e] text-white py-16 md:py-24 px-4 md:px-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
          {/* Left content */}
          <div className="text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Dapatkan Konsultasi Kesehatan 24/7
            </h2>
            <p className="text-green-100 mb-6 leading-relaxed text-sm md:text-base">
              Chat dengan AI assistant kami untuk mendapatkan rekomendasi
              kesehatan, menjawab pertanyaan, dan memahami hasil deteksi dengan
              lebih mudah.
            </p>
            <ul className="space-y-3 mb-6 text-sm text-white">
              <li>⚪ Respon instan 24/7 tanpa menunggu</li>
              <li>⚪ Rekomendasi kesehatan personal</li>
              <li>⚪ Tanya jawab hasil deteksi</li>
              <li>⚪ Tips gaya hidup sehat</li>
            </ul>

            {/* Mobile inline chat */}
            <div className="md:hidden mt-8 bg-white/20 backdrop-blur-2xl rounded-3xl p-5">
              <div className="rounded-3xl bg-white/95 p-4 text-[#295f4e] shadow-sm">
                <p className="text-sm leading-relaxed">
                  Punya pertanyaan soal hasil cek atau kesehatan dasar? Buka
                  chatbot VitaRisk lewat tombol di kanan bawah.
                </p>
                <button
                  type="button"
                  onClick={openChatbot}
                  className="mt-4 w-full rounded-2xl bg-[#295f4e] px-4 py-3 text-sm font-medium text-white"
                >
                  Buka Chatbot
                </button>
              </div>
            </div>

            <button
              onClick={openChatbot}
              className="hidden md:inline-block bg-white text-[#295f4e] px-6 mt-12 py-3 rounded-xl font-medium"
            >
              Chat AI Sekarang
            </button>
          </div>

          {/* Desktop chat widget — screenshot preview */}
          <div className="hidden md:flex items-center justify-center w-full">
            <div className="relative flex items-center justify-center">
              {/* Glow behind the image */}
              <div className="absolute -inset-6 rounded-[2.5rem] bg-white/15 blur-3xl" />
              <img
                src="/chatbot-tampilan.png"
                alt="Tampilan Chatbot VitaRisk"
                className="relative z-10 w-96 rounded-[1.75rem] shadow-[0_32px_72px_rgba(0,0,0,0.4)] ring-1 ring-white/25"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ─── CTA ─── */}
      <section className="bg-[#ecf4f1] px-4 md:px-12 py-16 md:py-24">
        <div className="max-w-10xl rounded-3xl grid grid-cols-1 md:grid-cols-2 bg-white/70 backdrop-blur-xl border border-gray-200 overflow-hidden">
          <div className="relative p-8 md:p-10 flex items-center justify-between gap-10">
            <div className="absolute -top-20 -left-20 w-72 h-72 bg-green-300 opacity-20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="max-w-lg relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-snug">
                Jangan Tunda Lagi{" "}
                <span className="text-[#295f4e]">Pemeriksaan Kesehatan</span>
              </h2>
              <p className="text-gray-600 text-sm md:text-base mb-6 leading-relaxed">
                Deteksi lebih awal membantu Anda mengambil keputusan yang lebih
                baik. Dapatkan hasil analisis dan konsultasi AI hanya dalam
                hitungan menit.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="bg-[#295f4e] text-white px-7 py-3 rounded-xl font-medium flex gap-4 items-center"
              >
                Mulai Deteksi Gratis <ArrowRight size={18} />
              </button>
            </div>
          </div>
          <div className="relative grid place-items-center py-8 md:py-0">
            <svg className="absolute bottom-0 right-0 w-64 md:w-125 opacity-20 blur-2xl -z-10" viewBox="0 0 500 500">
              <path fill="#22c55e" d="M0,320 C120,420 380,200 500,300 L500,500 L0,500 Z" />
            </svg>
            <div className="absolute inset-0 bg-linear-to-b from-transparent to-[#fafcfb] from-70% rounded-3xl"></div>
            <img src={Doctor} className="h-100 md:grid hidden md:h-100 object-contain relative z-10" alt="Dokter" />
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer id="footer" className="px-4 md:px-10 py-10 bg-white scroll-mt-22.5">
        <div className="max-w-10xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          <div className="col-span-2 md:col-span-1">
            <img src="/icons2.svg" className="h-8 mb-4" alt="logo" />
            <p className="text-gray-500 text-sm leading-relaxed">
              Platform kesehatan digital yang memudahkan deteksi dini dan membuat
              setiap orang lebih peduli dengan kesehatan mereka.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-gray-900 text-sm md:text-base">Dibuat Oleh</h4>
            <ul className="text-gray-500 text-xs md:text-sm space-y-2">
              <li>Achmad Dzaki Habibullah Al Azhar</li>
              <li>Airin Yenita Putri</li>
              <li>Fauzi Muhamad</li>
              <li>Salsa Sabila Humaira</li>
              <li>Firman Ibnu Shobirin</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-gray-900 text-sm md:text-base">Fitur</h4>
            <ul className="text-gray-500 text-xs md:text-sm space-y-2">
              <li>Deteksi Jantung</li>
              <li>Deteksi Diabetes</li>
              <li>Deteksi Kolesterol</li>
              <li>AI Chat</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-gray-900 text-sm md:text-base">Download App</h4>
            <p className="text-gray-500 text-xs md:text-sm mb-3">
              Deteksi kesehatan mudah di genggaman Anda. Install sebagai aplikasi di Windows, Android, iOS, dan Linux.
            </p>

            {isInstalled ? (
              <div className="flex items-center gap-2 rounded-xl bg-[#edf7f2] border border-[#b7dbc9] px-3 py-2.5">
                <span className="text-lg">✅</span>
                <div>
                  <p className="text-xs font-semibold text-[#295f4e]">Sudah Terinstall</p>
                  <p className="text-[10px] text-gray-500">VitaRisk berjalan sebagai app</p>
                </div>
              </div>
            ) : isIOS ? (
              <div>
                <button
                  onClick={() => setShowIOSGuide((v) => !v)}
                  className="w-full flex items-center justify-center gap-2 bg-black text-white py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  Install di iPhone / iPad
                </button>
                {showIOSGuide && (
                  <div className="mt-2 p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600 space-y-1">
                    <p className="font-semibold text-gray-800 mb-1">Cara install di iOS:</p>
                    <p>1. Buka di Safari</p>
                    <p>2. Ketuk ikon <strong>Share</strong> (kotak dengan panah ↑)</p>
                    <p>3. Pilih <strong>"Add to Home Screen"</strong></p>
                    <p>4. Ketuk <strong>Add</strong></p>
                  </div>
                )}
              </div>
            ) : isInstallable ? (
              <button
                onClick={triggerInstall}
                className="w-full flex items-center justify-center gap-2 bg-[#295f4e] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#214d3e] transition"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Install Aplikasi
              </button>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-200">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 shrink-0 text-[#295f4e]"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                  <span>Buka di Chrome/Edge untuk install di Windows, Android, atau Linux</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 mt-10 pt-3 text-center text-gray-400 text-xs md:text-sm">
          © 2026 <span className="text-[#295f4e] font-semibold">Vitarisk</span> — Solusi
          cerdas untuk kesehatan Anda.
        </div>
      </footer>
    </div>
  );
}
