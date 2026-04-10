import Profile from "../assets/Profile.png";
import Doctor from "../assets/doctor.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
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
  SendHorizonal,
  Stethoscope,
  TestTubeDiagonal,
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState("home");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "bot", text: "Halo! Ada yang bisa saya bantu hari ini?" },
  ]);
  const [loading, setLoading] = useState(false);

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

    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      const offset = 90;
      const top =
        element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({
        top,
        behavior: "smooth",
      });
    } else {
      console.warn(`Element dengan id "${id}" tidak ditemukan`);
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

  const handleSendChat = async () => {
    const messageToSend = chatInput.trim();
    if (!messageToSend) return;

    const userMessage = { role: "user", text: messageToSend };
    setMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: messageToSend }),
      });

      const data = await res.json();

      const botMessage = { role: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
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

  return (
    <div className="font-sans">
      {/* Bagian Navbar  */}
      <nav className="top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm flex items-center px-10 py-4 fixed left-0 ">
        <div className="flex items-center gap-3">
          <img src="/icons2.svg" className="h-9" alt="logo" />
        </div>
        <ul className="hidden md:flex gap-8 font-medium text-pine-green absolute left-1/2 -translate-x-1/2">
          {menuItems.map((item) => (
            <li
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={`cursor-pointer transition-all border-b-2 ${
                active === item.id
                  ? "border-b-2 border-pine-green text-dark-green-teal"
                  : "border-transparent hover:text-dark-green-teal"
              }`}
            >
              {item.name}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3 ml-auto">
          <img
            src={Profile}
            alt="Profile"
            onClick={() => navigate("/profile")}
            className="w-10 h-10 rounded-full cursor-pointer hover:opacity-80 transition"
          />

          <button
            onClick={() => navigate("/login")}
            className="bg-pine-green text-white px-5 py-2 rounded-full font-medium hover:bg-dark-green-teal transition"
          >
            Daftar Sekarang
          </button>
        </div>
      </nav>

      {/* Bagian Hero */}
      <section id="home" className="scroll">
        <div className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 bg-white overflow-hidden">
          <svg
            className="absolute top-0 left-0 w-96 opacity-30 blur-2xl"
            viewBox="0 0 500 500"
          >
            <path
              fill="#22c55e"
              d="M0,200 C150,100 350,300 500,200 L500,0 L0,0 Z"
            />
          </svg>
          <svg
            className="absolute bottom-0 right-0 w-150 opacity-25 blur-2xl"
            viewBox="0 0 500 500"
          >
            <path
              fill="#22c55e"
              d="M0,320 C120,420 380,200 500,300 L500,500 L0,500 Z"
            />
          </svg>
          <svg
            className="absolute top-0 left-0 w-150 opacity-20 blur-2xl rotate-180"
            viewBox="0 0 500 500"
          >
            <path
              fill="#4ade80"
              d="M0,320 C120,420 380,200 500,300 L500,500 L0,500 Z"
            />
          </svg>
          <h1 className="font-bold text-5xl tracking-wide mb-4 relative z-10">
            Kenali Risiko{" "}
            <span className="text-pure-green">Sebelum Terlambat</span>
          </h1>
          <p className="text-pine-green font-medium text-xl mb-8 relative z-10">
            Pemeriksaan cepat ini dirancang untuk membantu kamu memahami
            <br />
            risiko kesehatan berdasarkan kondisi dan kebiasaanmu.
          </p>
          <div className="flex gap-4 relative z-10">
            <button className="bg-[#295f4e] text-white px-7 py-3 rounded-2xl flex gap-3 items-center">
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
      {/* Bagian Deskripsi  */}
      <section
        id="Deskripsi"
        className="py-24 scroll"
        style={{
          backgroundColor: "#f9fafb",
          backgroundImage: "radial-gradient(#a8d5ba 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6">
              Tentang <span className="text-[#295f4e]">VitaRisk</span> Analyzer
            </h2>
            <div className="w-24 h-1.5 bg-[#295f4e] mx-auto rounded-full mb-8"></div>
            <div>
              <p className="text-gray-600 text-lg leading-relaxed border-l-2 border-[#295f4e] mb-6 pl-6">
                VitaRisk Analyzer adalah aplikasi kesehatan yang membantu
                pengguna mengetahui risiko penyakit jantung, diabetes, dan
                kolesterol berdasarkan data pribadi, gaya hidup, serta indikator
                kesehatan tertentu. Aplikasi ini dirancang sebagai alat edukasi
                agar pengguna lebih sadar terhadap kondisi kesehatannya dan
                dapat mengambil langkah pencegahan lebih dini.
              </p>

              <p className="text-gray-600 text-lg leading-relaxed border-l-2 border-[#295f4e] pl-6">
                Hasil yang ditampilkan berupa tingkat risiko, faktor utama yang
                paling berpengaruh, serta saran umum yang dapat membantu
                pengguna memahami kondisi mereka dengan lebih baik. VitaRisk
                Analyzer tidak menggantikan diagnosis dokter, melainkan menjadi
                pendamping digital untuk mendukung keputusan kesehatan yang
                lebih terarah.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Bagian Deteksi Kesehatan */}
      <section id="Deteksi" className="py-24 bg-white text-center scroll">
        <div className="max-w-6xl mx-auto px-10">
          <p className="text-[#295f4e] mb-2">DETEKSI KESEHATAN GRATIS</p>
          <h2 className="text-4xl font-bold mb-4">
            3 Deteksi Kesehatan Penting
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto mb-12">
            Pemeriksaan cepat ini dirancang untuk membantu kamu memahami potensi
            risiko kesehatan berdasarkan kondisi dan kebiasaanmu.
          </p>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white p-10 rounded-3xl border border-gray-200 h[300px] flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mb-6 text-xl text-red-400">
                  <HeartPulse />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-left">
                  Deteksi Jantung
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed text-left">
                  Periksa risiko penyakit jantung melalui kuesioner kesehatan
                  interaktif.
                </p>
              </div>
              <button
                onClick={() => navigate("/landing/deteksi-jantung")}
                className="text-[#295f4e] font-medium flex items-center gap-1"
              >
                Mulai Sekarang <ChevronRight size={18} />
              </button>
            </div>
            <div className="bg-white p-10 rounded-3xl border border-gray-200 h[300px] flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-red-200 rounded-2xl flex items-center justify-center mb-6 text-xl text-red-600">
                  <Droplet />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-left">
                  Deteksi Diabetes
                </h3>

                <p className="text-gray-500 text-sm leading-relaxed text-left">
                  Identifikasi risiko diabetes dengan pertanyaan medis yang
                  akurat.
                </p>
              </div>

              <button
                onClick={() => navigate("/landing/deteksi-diabetes")}
                className="text-[#295f4e] font-medium flex mt-2 items-center gap-1"
              >
                Mulai Sekarang <ChevronRight size={18} />
              </button>
            </div>
            <div className="bg-white p-10 rounded-3xl border border-gray-200 h[300px] flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center mb-6 text-xl text-yellow-600">
                  <ChartLine />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-left">
                  Deteksi Kolesterol
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed text-left">
                  Cek potensi masalah kolesterol tinggi dengan penilaian cepat.
                </p>
              </div>

              <button
                onClick={() => navigate("/landing/deteksi-kolestrol")}
                className="text-[#295f4e] font-medium flex items-center gap-1"
              >
                Mulai Sekarang <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* Cara VitaRisk  */}
      <section
        id="caraKerja"
        className="py-20 bg-gray-50 text-center scroll-mt[90px]"
        style={{
          backgroundColor: "#f9fafb",
          backgroundImage: "radial-gradient(#a8d5ba 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-[#295f4e] mb-3">CARA KERJA</p>
          <h2 className="text-4xl font-bold mb-16">
            Cara Kerja dengan 6 Langkah Yang Mudah
          </h2>
          <div className="grid lg:grid-cols-3 gap-10 justify-items-center">
            <div className="bg-white p-10 rounded-3xl border border-gray-200 min-h[300px] flex flex-col items-center justify-center text-center hover:-translate-y-1 transition">
              <div className="text-2xl bg-gray-100 rounded-xl grid place-items-center size-12 mb-3 text-dark-green-teal">
                <Clipboard />
              </div>
              <h3 className="text-5xl font-bold text-[#295f4e] mb-3">01</h3>
              <p className="font-semibold mb-2">Jawab Pertanyaan</p>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                Pilih penyakit yang ingin diperiksa: jantung, diabetes, atau
                kolesterol.
              </p>
            </div>
            <div className="bg-white p-10 rounded-3xl border border-gray-200 min-h[300px] flex flex-col items-center justify-center text-center hover:-translate-y-1 transition">
              <div className="text-2xl mb-3 2xl bg-gray-100 rounded-xl grid place-items-center size-12 text-dark-green-teal">
                <ChartColumn />
              </div>
              <h3 className="text-5xl font-bold text-[#295f4e] mb-3">02</h3>
              <p className="font-semibold mb-2">Dapatkan Hasil</p>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                Isi data usia, jenis kelamin, riwayat keluarga, dan indikator
                kesehatan.
              </p>
            </div>
            <div className="bg-white p-10 rounded-3xl border border-gray-200 min-h[300px] flex flex-col items-center justify-center text-center hover:-translate-y-1 transition">
              <div className="text-2xl mb-3 2xl bg-gray-100 rounded-xl grid place-items-center size-12 text-dark-green-teal">
                <Bot />
              </div>
              <h3 className="text-5xl font-bold text-[#295f4e] mb-3">03</h3>
              <p className="font-semibold mb-2">Chat dengan AI</p>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                Sistem memproses data menggunakan model machine learning.
              </p>
            </div>
            <div className="bg-white p-10 rounded-3xl border border-gray-200 min-h[300px] flex flex-col items-center justify-center text-center hover:-translate-y-1 transition">
              <div className="text-2xl mb-3 2xl bg-gray-100 rounded-xl grid place-items-center size-12 text-dark-green-teal">
                <ChartArea />
              </div>
              <h3 className="text-5xl font-bold text-[#295f4e] mb-3">04</h3>
              <p className="font-semibold mb-2">Analisis Hasil</p>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                Lihat persentase risiko, kategori risiko, dan faktor utama yang
                memengaruhi.
              </p>
            </div>
            <div className="bg-white p-10 rounded-3xl border border-gray-200 min-h[300px] flex flex-col items-center justify-center text-center hover:-translate-y-1 transition">
              <div className="text-2xl mb-3 2xl bg-gray-100 rounded-xl grid place-items-center size-12 text-dark-green-teal">
                <Stethoscope />
              </div>
              <h3 className="text-5xl font-bold text-[#295f4e] mb-3">05</h3>
              <p className="font-semibold mb-2">Saran & Tindak Lanjut</p>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                Pengguna mendapatkan saran awal sebelum konsultasi ke tenaga
                medis.
              </p>
            </div>
            <div className="bg-white p-10 rounded-3xl border border-gray-200 min-h[300px] flex flex-col items-center justify-center text-center hover:-translate-y-1 transition">
              <div className="text-2xl mb-3 2xl bg-gray-100 rounded-xl grid place-items-center size-12 text-dark-green-teal">
                <FileText />
              </div>
              <h3 className="text-5xl font-bold text-[#295f4e] mb-3">06</h3>
              <p className="font-semibold mb-2">Tampilkan Rekomendasi</p>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                Sistem menampilkan saran kesehatan yang disesuaikan berdasarkan
                hasil analisis risiko pengguna.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Bagian Sumber Data */}
      <div id="sumberData" className=" text-white px-6"></div>
      <div className="min-h-screen bg-gray-50 py-12 px-6">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            VitaRisk Analyzer
          </h1>
          <p className="text-gray-600">
            VitaRisk Analyzer menggunakan data kesehatan untuk membantu
            menganalisis risiko penyakit jantung, diabetes, dan kolesterol. Data
            yang digunakan mencakup informasi seperti usia, tekanan darah, gula
            darah, kolesterol, riwayat keluarga, dan kebiasaan hidup
          </p>
        </div>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-100">
                <Heart className="text-dark-green-teal" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-800 text-lg">
                    Heart Disease Dataset
                  </h3>
                  <span className="text-xs px-2 py-1 bg-red-100 text-red-500 rounded-full">
                    JANTUNG
                  </span>
                </div>

                <p className="text-sm text-gray-500 mb-1">
                  UCI Heart Disease via Kaggle
                </p>

                <p className="text-sm text-gray-600 leading-relaxed">
                  Dataset komprehensif untuk analisis faktor risiko penyakit
                  jantung koroner, mencakup tekanan darah, kadar kolesterol, dan
                  riwayat klinis.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-100">
                <Stethoscope className="text-dark-green-teal" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-800 text-lg">
                    Pima Indians Diabetes Dataset
                  </h3>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">
                    DIABETES
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-1">
                  Kaggle — UCI Machine Learning Repository
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Dataset standar untuk prediksi risiko diabetes berdasarkan
                  indikator biometrik seperti kadar glukosa, BMI, dan riwayat
                  keluarga.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-100">
                {" "}
                <TestTubeDiagonal className="text-dark-green-teal" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-800 text-lg">
                    Cholesterol Risk Data
                  </h3>
                  <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full">
                    KOLESTEROL
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-1">
                  Diolah dari Heart Disease Dataset
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Data yang diekstrak dan diolah dari Heart Disease Dataset
                  khusus untuk analisis mendalam risiko kolesterol tinggi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bagian Chat Ai Dari Web VitaRisk */}
      <div className="bg-[#295f4e] text-white py-24 px-6 md:px-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start md:gap-20">
          <div className="text-left">
            <h2 className="text-3xl font-bold mb-6">
              Dapatkan Konsultasi Kesehatan 24/7
            </h2>
            <p className="text-green-100 mb-6 leading-relaxed">
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
            <button
              onClick={() => handleClick("sumberData")}
              className="bg-white text-[#295f4e] px-6 mt-12 py-3 rounded-xl font-medium"
            >
              Chat AI Sekarang 
            </button>
          </div>

          <div className="hidden md:block justify-end">
            <div className="bg-white/25 backdrop-blur-2xl rounded-4xl p-8">
              <div className="space-y-4 mb-6 h-64 overflow-y-auto pr-2 custom-scrollbar">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-3xl shadow-md ${
                        message.role === "user"
                          ? "bg-[#295f4e] text-white"
                          : "bg-white text-[#295f4e]"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-200 text-[#295f4e] px-4 py-3 rounded-3xl">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-gray-400 border-t-[#295f4e] rounded-full"></div>
                        AI sedang mengetik...
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <div className="flex items-end gap-3">
                  <input
                    ref={null}
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && !loading && handleSendChat()
                    }
                    placeholder="Ketik pertanyaan kesehatanmu disini..."
                    disabled={loading}
                    className="flex-1 bg-gray-100 border border-gray-300 rounded-3xl px-5 py-4 text-gray-800 placeholder-gray-400"
                  />

                  <button
                    onClick={handleSendChat}
                    disabled={loading || !chatInput.trim()}
                    className=" bg-[#295f4e]  text-white  px-6 py-4 rounded-3xl font-semibold shadow-sm hover:shadow-md flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-t-[#295f4e] rounded-full"></div>
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
      {/* Call to Action / artikel blog ajakan  */}
      <section className="bg-[#ecf4f1] from-[#e6f4f1] to-white px-6 md:px-12 py-24 scroll-mt-22.5">
        <div className="max-w-10xl rounded-3xl grid grid-cols-2  bg-white/70 backdrop-blur-xl border border-gray-200 ">
          <div className="relative p-10 flex items-center justify-between gap-10">
            <div className="absolute -top-20 -left-20 w-72 h-72 bg-green-300 opacity-20 rounded-full blur-3xl"></div>
            <div className="max-w-lg relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-snug">
                Jangan Tunda Lagi{" "}
                <span className="text-[#295f4e]">Pemeriksaan Kesehatan</span>
              </h2>

              <p className="text-gray-600 text-sm md:text-base mb-6 leading-relaxed">
                Deteksi lebih awal membantu Anda mengambil keputusan yang lebih
                baik. Dapatkan hasil analisis dan konsultasi AI hanya dalam
                hitungan menit.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/login")}
                  className="bg-[#295f4e] text-white px-7 py-3 rounded-xl font-medium flex gap-4 items-center"
                >
                  Mulai Deteksi Gratis <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
          <div className="relative grid place-items-center">
            <svg
              className="absolute bottom-0 right-0 w-125 opacity-20 blur-2xl -z-10 "
              viewBox="0 0 500 500"
            >
              <path
                fill="#22c55e"
                d="M0,320 C120,420 380,200 500,300 L500,500 L0,500 Z"
              />
            </svg>
            <div className="absolute inset-0 bg-linear-to-b from-transparent to-[#fafcfb] from-70% rounded-3xl"></div>
            <img src={Doctor} className="h-100 object-contain" alt="" />
          </div>
        </div>
      </section>
      {/* Bagian FOOTER */}
      <footer
        id="footer"
        className="px-6 md:px-10 py-10 bg-white scroll-mt[90px]"
      >
        <div className="max-w-10xl mx-auto grid md:grid-cols-4 gap-10">
          <div>
            <img src="/icons2.svg" className="h-8 mb-4" alt="logo" />
            <p className="text-gray-500 text-sm leading-relaxed">
              Platform kesehatan digital yang memudahkan deteksi dini dan
              membuat setiap orang lebih peduli dengan kesehatan mereka.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-gray-900">Dibuat Oleh</h4>
            <ul className="text-gray-500 text-sm space-y-2">
              <li>Achmad Dzaki Habibullah Al Azhar</li>
              <li>Airin Yenita Putri</li>
              <li>Fauzi Muhamad</li>
              <li>Salsa Sabila Humaira</li>
              <li>Firman Ibnu Shobirin</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-gray-900">Fitur</h4>
            <ul className="text-gray-500 text-sm space-y-2">
              <li>Deteksi Jantung</li>
              <li>Deteksi Diabetes</li>
              <li>Deteksi Kolesterol</li>
              <li>AI Chat</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-gray-900">Download App</h4>
            <p className="text-gray-500 text-sm mb-4">
              Deteksi kesehatan mudah di genggaman Anda.
            </p>

            <button className="w-full bg-black text-white py-2 rounded-lg text-sm hover:opacity-90 transition">
               Google Play
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-10 pt-3 text-center text-gray-400 text-xs md:text-sm">
          © 2026 <span className="text-[#295f4e] font-semibold">Vitarisk</span>{" "}
          — Solusi cerdas untuk kesehatan Anda.
        </div>
      </footer>
    </div>
  );
}
