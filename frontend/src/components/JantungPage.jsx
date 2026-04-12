import { useState } from "react";
import ProfileAvatar from "./ProfileAvatar";
import IconDarah from "../assets/icon-darah.png";
import IconShield from "../assets/Container.svg";
import {
  ArrowRight,
  ChevronLeft,
  CircleCheck,
  CircleX,
  Mars,
  Venus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../lib/api";
import { Link } from "react-router-dom";

export default function JantungPage() {
  const [umur, setUmur] = useState("");
  const [gender, setGender] = useState("");
  const [nyeriDada, setNyeriDada] = useState("tidak pernah");
  const [tekananDarah, setTekananDarah] = useState("");
  const [kolesterol, setKolesterol] = useState("");
  const [detakJantung, setDetakJantung] = useState("");
  const [riwayat, setRiwayat] = useState("");
  const [exangina, setExangina] = useState("");
  const [merokok, setMerokok] = useState("");
  const [isOn, setIsOn] = useState(true);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);

    const payload = {
      age: Number(umur),
      sex: gender === "male" ? "laki-laki" : "perempuan",
      cp: nyeriDada,
      trestbps: Number(tekananDarah),
      chol: Number(kolesterol),
      fbs: isOn ? "ya" : "tidak",
      thalach: Number(detakJantung),
      exang: exangina,
      family_history: riwayat,
      smoking: merokok,
    };

    try {
      const data = await apiRequest("/predict/heart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      navigate("/result", { state: { ...data, type: "heart" } });
    } catch (err) {
      console.error(err);
      setSubmitError(err.message || "Prediksi jantung gagal diproses.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f9faf7] min-h-screen">
      {/* ─── NAVBAR ─── */}
      <nav className="flex items-center justify-between py-4 px-4 sm:px-8 md:px-15 sticky top-0 bg-[#f9faf7] z-10 shadow-sm">
        <Link
          to="/"
          className="flex gap-2 text-base font-medium text-[#295f4e] items-center px-3 py-1 rounded-xl hover:text-[#295f4e]/75 transition"
        >
          <ChevronLeft size={22} /> Kembali
        </Link>
        <a href="/">
          <img src="/icons2.svg" className="h-8 hidden md:flex" alt="logo" />
        </a>
        <ProfileAvatar />
      </nav>

      {/* ─── HEADER ─── */}
      <header className="pt-5 flex flex-col gap-3 px-4 sm:px-8 md:px-25">
        <h1 className="text-2xl md:text-3xl font-semibold text-sub-title">
          Diagnosa Penyakit Jantung
        </h1>
        <p className="text-dark-green-teal/80 text-sm md:text-base">
          Form evaluasi klinis untuk membantu prediksi risiko penyakit jantung.
          Silakan isi data pasien dengan lengkap dan akurat.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="p-4 sm:p-5 h-full">
        {/* Error */}
        {submitError && (
          <div className="mx-0 sm:mx-4 md:mx-15 mb-5 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
            {submitError}
          </div>
        )}

        {/* ─── DATA PERSONAL ─── */}
        <div className="mx-0 sm:mx-4 md:mx-15 rounded-xl pb-8 bg-[#f3f4f1]">
          <h2 className="font-bold p-5 px-5 md:px-20 text-sub-title mb-3">
            —— Data Personal
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 px-5 md:px-20 gap-6">
            {/* Usia */}
            <div className="flex flex-col relative">
              <label className="my-3 font-semibold text-sm md:text-base">
                Berapa Usiamu?
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={umur}
                  onChange={(e) => setUmur(e.target.value)}
                  min={1}
                  max={120}
                  placeholder="Contoh : 17"
                  required
                  className="border-2 border-mint-green/60 rounded-md p-2.5 w-full focus:outline-none focus:border-pure-green focus:ring-2 focus:ring-pure-green/30 pr-20"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">
                  Tahun
                </span>
              </div>
            </div>

            {/* Jenis Kelamin */}
            <div className="flex flex-col">
              <label className="my-3 font-semibold text-sm md:text-base">
                Jenis Kelamin
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    className="hidden"
                    onChange={(e) => setGender(e.target.value)}
                  />
                  <div
                    className={`flex items-center justify-center gap-2 px-3 py-3 rounded-md border-2 transition text-sm
                      ${gender === "male"
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-500/70 hover:bg-gray-100"
                      }`}
                  >
                    <Mars size={18} />
                    Laki-laki
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    className="hidden"
                    onChange={(e) => setGender(e.target.value)}
                  />
                  <div
                    className={`flex items-center justify-center gap-2 px-3 py-3 rounded-md border-2 transition text-sm
                      ${gender === "female"
                        ? "bg-pink-500 text-white border-pink-500"
                        : "bg-white text-gray-700 border-gray-300 hover:border-pink-500/70 hover:bg-gray-100"
                      }`}
                  >
                    <Venus size={18} />
                    Perempuan
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* ─── INDIKATOR KLINIS ─── */}
        <h2 className="mt-5 font-bold p-5 px-4 md:px-20 text-sub-title mb-3">
          —— Indikator Klinis &amp; Gaya Hidup
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mx-0 sm:mx-4 md:mx-20">
          {/* Nyeri Dada */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm md:text-base">
              Intensitas Nyeri di Dada
            </label>
            <select
              value={nyeriDada}
              onChange={(e) => setNyeriDada(e.target.value)}
              required
              className="border-2 border-mint-green/60 rounded-md w-full p-2.5 my-3 focus:outline-none focus:border-pure-green focus:ring-2 focus:ring-pure-green/30 text-sm md:text-base"
            >
              <option value="tidak pernah">Tidak Pernah Nyeri di Dada</option>
              <option value="nyeri ringan">Nyeri Ringan di Dada</option>
              <option value="nyeri sedang">Nyeri Sedang di Dada</option>
              <option value="nyeri berat">Nyeri Berat di Dada</option>
            </select>
          </div>

          {/* Tekanan Darah + Kolesterol */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col relative">
              <label className="font-semibold text-sm md:text-base">
                Tekanan Darah Sistolik
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="50"
                  max="250"
                  value={tekananDarah}
                  onChange={(e) => setTekananDarah(e.target.value)}
                  placeholder="120"
                  required
                  className="border-2 border-mint-green/60 rounded-md p-3 my-4 w-full focus:outline-none focus:border-pure-green focus:ring-2 focus:ring-pure-green/30 pr-16 text-sm"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50 text-xs pointer-events-none">
                  mmHg
                </span>
              </div>
            </div>
            <div className="flex flex-col relative">
              <label className="font-semibold text-sm md:text-base">
                Kadar Kolesterol Total
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="50"
                  max="400"
                  value={kolesterol}
                  onChange={(e) => setKolesterol(e.target.value)}
                  placeholder="170"
                  required
                  className="border-2 border-mint-green/60 rounded-md my-4 p-3 w-full focus:outline-none focus:border-pure-green focus:ring-2 focus:ring-pure-green/30 pr-16 text-sm"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50 text-xs pointer-events-none">
                  mg/dL
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── GULA DARAH TOGGLE + LAINNYA ─── */}
        <div className="px-0 sm:px-4 md:px-20 py-8 md:py-15">
          {/* Toggle Gula Darah */}
          <div className="bg-sage-green/60 rounded-2xl px-4 md:px-5 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0">
                <img src={IconDarah} alt="" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-900">
                  Gula darah puasa &gt; 120 mg/dL?
                </p>
                <p className="text-xs text-green-700 mt-0.5">
                  Indikasi adanya diabetes atau pre-diabetes.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOn(!isOn)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 shrink-0 ${
                isOn ? "bg-pure-green" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${
                  isOn ? "left-6" : "left-0.5"
                }`}
              />
            </button>
          </div>

          {/* Detak Jantung + Riwayat Keluarga */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 my-8 md:my-15">
            {/* Detak Jantung */}
            <div className="flex flex-col relative">
              <label className="my-3 font-semibold text-sm md:text-base">
                Detak Jantung Tertinggi (Olahraga)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="60"
                  max="200"
                  value={detakJantung}
                  onChange={(e) => setDetakJantung(e.target.value)}
                  placeholder="Contoh : 120"
                  required
                  className="border-2 border-mint-green/60 rounded-md p-2.5 w-full focus:outline-none focus:border-pure-green focus:ring-2 focus:ring-pure-green/30 pr-16 text-sm md:text-base"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50 text-sm pointer-events-none">
                  BPM
                </span>
              </div>
            </div>

            {/* Riwayat Keluarga */}
            <div className="my-0 sm:my-3 w-full">
              <label className="font-semibold text-sm md:text-base">
                Riwayat Keluarga
              </label>
              <div className="grid grid-cols-2 text-center py-3 gap-4">
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="riwayat"
                    value="tidak"
                    onChange={(e) => setRiwayat(e.target.value)}
                    required
                    className="hidden"
                  />
                  <div
                    className={`py-3 w-full rounded-md border-[#adccbf] font-medium border-2 text-black/50 transition text-sm ${
                      riwayat === "tidak"
                        ? "bg-[#b6d3b9] text-sub-title"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    Tidak Ada
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="riwayat"
                    value="ya"
                    onChange={(e) => setRiwayat(e.target.value)}
                    required
                    className="hidden"
                  />
                  <div
                    className={`py-3 w-full rounded-md border-[#adccbf] font-medium border-2 text-black/50 transition text-sm ${
                      riwayat === "ya"
                        ? "bg-[#b6d3b9] text-sub-title"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    Ada
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Nyeri saat Olahraga + Kebiasaan Merokok */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Nyeri saat Olahraga */}
            <div className="w-full">
              <label className="font-semibold text-sm md:text-base">
                Nyeri Dada saat Olahraga
              </label>
              <div className="grid grid-cols-2 gap-4 py-3">
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="nyeriDadaOlahraga"
                    value="ya"
                    required
                    onChange={(e) => setExangina(e.target.value)}
                    className="hidden"
                  />
                  <div
                    className={`border-2 w-full py-3 rounded-md border-[#adccbf] font-medium text-black/50 transition flex justify-center items-center gap-2 text-sm ${
                      exangina === "ya"
                        ? "bg-[#b6d3b9] text-sub-title"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    <CircleCheck size={18} />
                    Ya
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="nyeriDadaOlahraga"
                    value="tidak"
                    required
                    onChange={(e) => setExangina(e.target.value)}
                    className="hidden"
                  />
                  <div
                    className={`border-2 w-full py-3 rounded-md border-[#adccbf] font-medium text-black/50 transition flex justify-center items-center gap-2 text-sm ${
                      exangina === "tidak"
                        ? "bg-[#b6d3b9] text-sub-title"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    <CircleX size={18} />
                    Tidak
                  </div>
                </label>
              </div>
            </div>

            {/* Kebiasaan Merokok */}
            <div className="w-full">
              <label className="font-semibold text-sm md:text-base">
                Kebiasaan Merokok
              </label>
              <div className="flex w-full my-3">
                <select
                  value={merokok}
                  onChange={(e) => setMerokok(e.target.value)}
                  required
                  className="border-2 border-mint-green/60 rounded-md w-full p-2.5 focus:outline-none focus:border-pure-green focus:ring-2 focus:ring-pure-green/30 text-sm md:text-base"
                >
                  <option value="">Pilih</option>
                  <option value="ya">Ya</option>
                  <option value="tidak">Tidak</option>
                  <option value="kadang-kadang">Kadang-Kadang</option>
                </select>
              </div>
            </div>
          </div>

          {/* ─── FOOTER FORM ─── */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-10 md:mt-15 border-t pt-5 border-gray-300 gap-4">
            <div className="flex gap-2 items-center">
              <img src={IconShield} alt="" className="w-3 shrink-0" />
              <p className="text-[#8F6F6D] text-xs md:text-sm">
                Data kamu tidak akan disimpan. Privasi dijamin 100%.
              </p>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-pine-green py-3 px-8 flex items-center justify-center gap-3 rounded-xl text-white hover:scale-105 transition group disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 w-full sm:w-auto"
            >
              {submitting ? "Memproses..." : "Lihat hasil prediksi"}
              <ArrowRight className="group-hover:translate-x-2 transition" size={18} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}