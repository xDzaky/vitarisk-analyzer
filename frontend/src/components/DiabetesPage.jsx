import { useState } from "react";
import IconDarah from "../assets/icon-darah.png";
import IconShield from "../assets/Container.svg";
import {
  ArrowRight,
  ChevronLeft,
  Venus,
  Mars,
  CircleX,
  CircleCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfileAvatar from "./ProfileAvatar";
import { Link } from "react-router-dom";
import { apiRequest } from "../lib/api";

export default function DiabetesPage() {
  const [umur, setUmur] = useState("");
  const [gender, setGender] = useState("");
  const [sistolik, setSistolik] = useState("");
  const [gula, setGula] = useState("");
  const [riwayat, setRiwayat] = useState("");
  const [makananManis, setMakananManis] = useState("");
  const [olahraga, setOlahraga] = useState("");
  const [bmi, setBmi] = useState("");
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
      glucose: Number(gula),
      blood_pressure: Number(sistolik),
      family_history: riwayat,
      diet_sweet: makananManis,
      exercise_freq: olahraga,
      bmi: Number(bmi),
    };

    try {
      const data = await apiRequest("/predict/diabetes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      navigate("/result", { state: { ...data, type: "diabetes" } });
    } catch (err) {
      console.error(err);
      setSubmitError(err.message || "Prediksi diabetes gagal diproses.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f9faf7] min-h-screen">

      {/* ── NAVBAR ── */}
      <nav className="flex items-center justify-between py-4 px-4 sm:px-8 md:px-15 sticky top-0 bg-[#f9faf7] z-10 shadow-sm">
        <Link
          to="/"
          className="flex gap-3 text-lg font-medium text-[#295f4e] items-center px-3 py-1 rounded-xl hover:text-[#295f4e]/75 transition"
        >
          <ChevronLeft size={22} /> Kembali
        </Link>
        <a href="/">
          <img src="/icons2.svg" className="h-8 hidden md:flex" alt="" />
        </a>
        <ProfileAvatar />
      </nav>

      {/* ── HEADER ── */}
      <header className="pt-5 flex flex-col gap-3 px-4 sm:px-8 md:mx-25">
        <h1 className="text-2xl md:text-3xl font-semibold text-sub-title">
          Diagnosa Penyakit Diabetes
        </h1>
        <p className="text-dark-green-teal/80 text-sm md:text-base">
          Form evaluasi klinis untuk membantu prediksi risiko penyakit diabetes.
          Silakan isi data pasien dengan lengkap dan akurat.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="m-5 h-full">
        {/* Error */}
        {submitError && (
          <div className="mx-0 sm:mx-4 md:mx-15 mb-5 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
            {submitError}
          </div>
        )}

        {/* ── DATA PERSONAL ── */}
        <div className="mx-0 sm:mx-4 md:mx-15 rounded-xl pb-8 bg-[#f3f4f1]">
          <h2 className="font-bold p-5 px-5 md:px-20 text-sub-title mb-3">
            —— Data Personal
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 px-5 md:px-20 gap-6">

            {/* Usia */}
            <div className="flex flex-col relative">
              <label className="my-3 font-semibold">Berapa Usiamu?</label>
              {/* Mobile: relative wrapper for unit label */}
              <div className="relative md:contents">
                <input
                  type="number"
                  value={umur}
                  onChange={(e) => setUmur(e.target.value)}
                  min={1}
                  max={120}
                  placeholder="Contoh : 17"
                  required
                  className="border-2 border-mint-green/60 rounded-xl p-3 w-full md:w-100 pr-20 md:pr-3 focus:outline-none focus:border-pure-green focus:ring-2 focus:ring-pure-green/30"
                />
                {/* Desktop: absolute positioned (original) */}
                <span className="hidden md:inline absolute left-83 translate-y-1/2 top-1/2">
                  Tahun
                </span>
                {/* Mobile: inside relative wrapper */}
                <span className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">
                  Tahun
                </span>
              </div>
            </div>

            {/* Jenis Kelamin */}
            <div className="flex flex-col md:px-20">
              <label className="my-3 font-semibold">Jenis Kelamin</label>
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
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition hover:border-blue-500/70 ${
                      gender === "male"
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    <Mars size={20} /> Laki-laki
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
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 hover:border-pink-500/70 transition ${
                      gender === "female"
                        ? "bg-pink-500 text-white border-pink-500"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    <Venus size={20} /> Perempuan
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* ── INDIKATOR KLINIS ── */}
        <h2 className="mt-5 font-bold p-5 px-4 md:px-20 text-sub-title mb-3">
          —— Indikator Klinis &amp; Gaya Hidup
        </h2>

        {/* Row 1: BMI + Olahraga */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mx-0 sm:mx-4 md:mx-20">
          <div className="flex w-full flex-col relative">
            <label className="font-semibold">Indeks Masa Tubuh (BMI)</label>
            <input
              type="number"
              value={bmi}
              onChange={(e) => setBmi(e.target.value)}
              min={10}
              max={50}
              step={0.1}
              placeholder="Contoh : 23.5"
              required
              className="border-2 border-mint-green/60 rounded-md p-3 my-3 w-full focus:outline-none focus:border-pure-green focus:ring-2 focus:ring-pure-green/30"
            />
            <p className="text-[#8F6F6D] text-xs indent-2">
              BMI dihitung dari berat badan (kg) / tinggi badan² (m)
            </p>
          </div>
          <div className="w-full">
            <label className="my-3 font-semibold">Seberapa Sering Olahraga?</label>
            <div className="flex w-full my-3">
              <select
                value={olahraga}
                onChange={(e) => setOlahraga(e.target.value)}
                required
                className="border-2 border-mint-green/60 rounded-md w-full p-3 focus:outline-none focus:border-pure-green focus:ring-2 focus:ring-pure-green/30"
              >
                <option value="">Pilih</option>
                <option value="tidak pernah">Tidak Pernah</option>
                <option value="jarang">Jarang</option>
                <option value="3x seminggu">3x Seminggu</option>
              </select>
            </div>
          </div>
        </div>

        <div className="px-0 sm:px-4 md:px-20">
          {/* Row 2: Tekanan Darah + Riwayat Keluarga */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
            {/* Tekanan Darah */}
            <div className="flex w-full flex-col relative">
              <label className="font-semibold">Tekanan Darah Sistolik</label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Contoh : 120"
                  value={sistolik}
                  onChange={(e) => setSistolik(e.target.value)}
                  required
                  className="border-2 border-mint-green/60 rounded-md p-3 mt-3 w-full pr-16 focus:outline-none focus:border-pure-green focus:ring-2 focus:ring-pure-green/30"
                />
                <span className="absolute right-3 top-[60%] -translate-y-1/2 text-black/50 text-xs sm:text-sm pointer-events-none">
                  mmHg
                </span>
              </div>
            </div>

            {/* Riwayat Keluarga */}
            <div className="w-full">
              <label className="font-semibold">Riwayat Keluarga</label>
              <div className="grid grid-cols-2 gap-5 py-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="riwayatKeluarga"
                    value="ya"
                    required
                    onChange={(e) => setRiwayat(e.target.value)}
                    className="hidden"
                  />
                  <div
                    className={`border-2 w-full py-3 rounded-md border-[#adccbf] font-medium text-black/50 transition flex justify-center items-center gap-2 px-4 md:px-8 ${
                      riwayat === "ya"
                        ? "bg-[#b6d3b9] text-sub-title"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    <CircleCheck size={18} /> Ya
                  </div>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="riwayatKeluarga"
                    value="tidak"
                    required
                    onChange={(e) => setRiwayat(e.target.value)}
                    className="hidden"
                  />
                  <div
                    className={`border-2 w-full py-3 rounded-md border-[#adccbf] font-medium text-black/50 transition flex justify-center items-center gap-2 px-4 md:px-8 ${
                      riwayat === "tidak"
                        ? "bg-[#b6d3b9] text-sub-title"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    <CircleX size={18} /> Tidak
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Row 3: Gula Darah + Makanan Manis */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
            {/* Gula Darah */}
            <div className="flex w-full flex-col relative">
              <label className="font-semibold">Kadar Gula Darah</label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Contoh : 170"
                  value={gula}
                  onChange={(e) => setGula(e.target.value)}
                  min={50}
                  max={500}
                  required
                  className="border-2 border-mint-green/60 rounded-md p-3 mt-3 w-full pr-16 focus:outline-none focus:border-pure-green focus:ring-2 focus:ring-pure-green/30"
                />
                <span className="absolute right-3 top-[60%] -translate-y-1/2 text-black/50 text-xs sm:text-sm pointer-events-none">
                  mg/dL
                </span>
              </div>
            </div>

            {/* Makanan Manis */}
            <div className="w-full">
              <label className="my-3 font-semibold">
                Seberapa Sering Konsumsi Makanan Manis?
              </label>
              <div className="flex w-full my-3">
                <select
                  value={makananManis}
                  onChange={(e) => setMakananManis(e.target.value)}
                  required
                  className="border-2 border-mint-green/60 rounded-md w-full p-3 focus:outline-none focus:border-pure-green focus:ring-2 focus:ring-pure-green/30"
                >
                  <option value="">Pilih</option>
                  <option value="jarang">Jarang</option>
                  <option value="3-5x seminggu">3-5x Seminggu</option>
                  <option value="sering">Sering</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── FOOTER FORM ── */}
          <div className="flex flex-col gap-4 py-10 md:py-15 sm:flex-row sm:items-center sm:justify-between lg:pr-56">
            <div className="flex gap-2 items-start sm:items-center">
              <img src={IconShield} alt="" className="w-3 mt-0.5 sm:mt-0 shrink-0" />
              <p className="text-[#8F6F6D] text-xs md:text-sm">
                Data kamu tidak akan disimpan. Privasi dijamin 100%.
              </p>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-pine-green py-2 px-10 flex items-center justify-center gap-3 rounded-xl text-white hover:scale-105 transition group disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 w-full sm:w-auto"
            >
              {submitting ? "Memproses..." : "Lihat hasil prediksi"}
              <ArrowRight className="group-hover:translate-x-2 transition" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
