import ProfileAvatar from "./ProfileAvatar";
import Doctor from "../assets/doctor.png";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
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
  SendHorizonal,
  Stethoscope,
  TestTubeDiagonal,
  X,
} from "lucide-react";
import { apiRequest, getStoredToken } from "../lib/api";
import { logoutSession } from "../lib/session";

export default function LandingPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState("home");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "bot", text: "Halo! Ada yang bisa saya bantu hari ini?" },
  ]);
  const [loading, setLoading] = useState(false);
  const [chatError, setChatError] = useState("");
  const [clarificationState, setClarificationState] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const messagesEndRef = useRef(null);

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

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendChat = async () => {
    const messageToSend = chatInput.trim();
    if (!messageToSend) return;

    const userMessage = { role: "user", text: messageToSend };
    setMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setLoading(true);
    setChatError("");

    try {
      const result = await apiRequest("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageToSend,
          context: clarificationState
            ? { clarification_state: clarificationState }
            : {},
        }),
      });
      const botMessage = {
        role: "bot",
        text: result?.data?.answer || "Maaf, saya belum bisa menjawab sekarang.",
        suggestions: result?.data?.suggestions || [],
      };
      setMessages((prev) => [...prev, botMessage]);
      setClarificationState(result?.data?.clarification?.state || null);
    } catch (err) {
      console.error(err);
      setChatError(err.message || "Chatbot sedang tidak bisa diakses.");
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Terjadi error, coba lagi ya. Pastikan backend berjalan di port 3000.",
        },
      ]);
    }

    setLoading(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setChatInput(suggestion);
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
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-start">
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
              <div className="space-y-4 mb-4 h-52 overflow-y-auto pr-1 custom-scrollbar">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                        message.role === "user"
                          ? "bg-[#295f4e] text-white border border-white/20"
                          : "bg-white text-[#295f4e]"
                      }`}
                    >
                      {message.text}
                      {message.role === "bot" &&
                        Array.isArray(message.suggestions) &&
                        message.suggestions.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {message.suggestions.slice(0, 2).map((s) => (
                              <button
                                key={s}
                                onClick={() => handleSuggestionClick(s)}
                                className="rounded-full bg-[#295f4e]/10 px-3 py-1 text-xs text-[#295f4e]"
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white text-[#295f4e] px-4 py-3 rounded-2xl text-sm flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-[#295f4e] rounded-full animate-spin"></div>
                      AI sedang mengetik...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !loading && handleSendChat()}
                  placeholder="Ketik pertanyaanmu..."
                  disabled={loading}
                  className="flex-1 bg-white/90 rounded-2xl px-4 py-3 text-gray-800 placeholder-gray-400 text-sm"
                />
                <button
                  onClick={handleSendChat}
                  disabled={loading || !chatInput.trim()}
                  className="bg-white text-[#295f4e] p-3 rounded-2xl disabled:opacity-50"
                >
                  <SendHorizonal size={18} />
                </button>
              </div>
            </div>

            <button
              onClick={() => handleClick("sumberData")}
              className="hidden md:inline-block bg-white text-[#295f4e] px-6 mt-12 py-3 rounded-xl font-medium"
            >
              Chat AI Sekarang
            </button>
          </div>

          {/* Desktop chat widget */}
          <div className="hidden md:block">
            <div className="bg-white/25 backdrop-blur-2xl rounded-4xl p-8">
              <div className="space-y-4 mb-6 h-64 overflow-y-auto pr-2 custom-scrollbar">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-3xl shadow-md ${
                        message.role === "user"
                          ? "bg-[#295f4e] text-white"
                          : "bg-white text-[#295f4e]"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      {message.role === "bot" &&
                        Array.isArray(message.suggestions) &&
                        message.suggestions.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {message.suggestions.slice(0, 3).map((suggestion) => (
                              <button
                                key={suggestion}
                                type="button"
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="rounded-full bg-[#295f4e]/10 px-3 py-1 text-xs text-[#295f4e]"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-200 text-[#295f4e] px-4 py-3 rounded-3xl">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-gray-400 border-t-[#295f4e] rounded-full animate-spin"></div>
                        AI sedang mengetik...
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className="pt-4">
                {chatError && <p className="mb-3 text-sm text-red-100">{chatError}</p>}
                <div className="flex items-end gap-3">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !loading && handleSendChat()}
                    placeholder="Ketik pertanyaan kesehatanmu disini..."
                    disabled={loading}
                    className="flex-1 bg-gray-100 border border-gray-300 rounded-3xl px-5 py-4 text-gray-800 placeholder-gray-400"
                  />
                  <button
                    onClick={handleSendChat}
                    disabled={loading || !chatInput.trim()}
                    className="bg-[#295f4e] text-white px-6 py-4 rounded-3xl font-semibold shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                        Tunggu
                      </>
                    ) : (
                      <>
                        Kirim <SendHorizonal size={18} />
                      </>
                    )}
                  </button>
                </div>
              </div>
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
            <p className="text-gray-500 text-xs md:text-sm mb-4">
              Deteksi kesehatan mudah di genggaman Anda.
            </p>
            <button className="w-full bg-black text-white py-2 rounded-lg text-sm hover:opacity-90 transition">
              Google Play
            </button>
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