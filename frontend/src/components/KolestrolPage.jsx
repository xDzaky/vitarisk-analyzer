import { useState } from "react";
import { ChevronLeft, Venus, Mars } from "lucide-react";
import ProfileAvatar from "./ProfileAvatar";
import IconShield from "../assets/Container.svg";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { apiRequest } from "../lib/api";

export default function KolestrolPage() {
  const [umur, setUmur] = useState("");
  const [gender, setGender] = useState("");
  const [sistolik, setSistolik] = useState("");
  const [riwayat, setRiwayat] = useState("");
  const [olahraga, setOlahraga] = useState("");
  const [merokok, setMerokok] = useState("");
  const [makananBerlemak, setMakananBerlemak] = useState("");
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
      trestbps: Number(sistolik),
      diet_fat: makananBerlemak,
      exercise_freq: olahraga,
      smoking: merokok,
      family_history: riwayat,
    };

    try {
      const data = await apiRequest("/predict/cholesterol", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      navigate("/result", { state: { ...data, type: "cholesterol" } });
    } catch (err) {
      console.error(err);
      setSubmitError(err.message || "Prediksi kolesterol gagal diproses.");
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
          Diagnosa Penyakit Kolesterol
        </h1>
        <p className="text-dark-green-teal/80 text-sm md:text-base">
          Form evaluasi klinis untuk membantu prediksi risiko penyakit kolesterol.
          Silakan isi data pasien dengan lengkap dan akurat.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="p-4 sm:p-5 h-full">
        {/* Error */}
        {submitError && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
            {submitError}
          </div>
        )}

        {/* ─── DATA PERSONAL ─── */}
        <div className="rounded-xl pb-8 bg-[#f3f4f1]">
          <h2 className="font-bold p-5 px-5 md:px-20 text-sub-title mb-3">
            —— Data Personal
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 px-5 md:px-20 gap-6">
            {/* Usia */}
            <div className="flex flex-col">
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
                  className="border-2 border-mint-green/60 rounded-xl p-3 w-full pr-20 focus:outline-none focus:border-pure-green focus:ring-2 focus:ring-pure-green/30"
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
                    className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl border-2 transition text-sm
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
                    className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl border-2 transition text-sm
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
        <h2 className="font-bold p-5 px-4 md:px-20 text-sub-title mt-5 mb-3">
          —— Indikator Klinis &amp; Gaya Hidup
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 px-0 sm:px-4 md:px-20">
          {/* Tekanan Darah */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm md:text-base">
              Tekanan Darah Sistolik
            </label>
            <div className="relative">
              <input
                type="number"
                min="50"
                max="250"
                value={sistolik}
                onChange={(e) => setSistolik(e.target.value)}
                placeholder="Contoh : 120"
                required
                className="border-2 border-mint-green/60 rounded-md p-3 mt-3 w-full pr-20 focus:outline-none focus:border-pure-green focus:ring-2 focus:ring-pure-green/30 text-sm md:text-base"
              />
              <span className="absolute right-3 top-[60%] -translate-y-1/2 text-black/60 text-xs sm:text-sm pointer-events-none">
                mmHg
              </span>
            </div>
          </div>

          {/* Kebiasaan Merokok */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm md:text-base">
              Kebiasaan Merokok
            </label>
            <select
              value={merokok}
              onChange={(e) => setMerokok(e.target.value)}
              required
              className="border-2 border-mint-green/60 rounded-md w-full p-3 mt-3 focus:outline-none focus:border-pure-green focus:ring-2 focus:ring-pure-green/30 text-sm md:text-base"
            >
              <option value="">Pilih</option>
              <option value="ya">Ya</option>
              <option value="tidak">Tidak</option>
              <option value="kadang-kadang">Kadang-Kadang</option>
            </select>
          </div>
        </div>

        <div className="px-0 sm:px-4 md:px-20">
          {/* Makanan Berlemak + Riwayat Keluarga */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
            {/* Makanan Berlemak */}
            <div className="w-full">
              <label className="font-semibold text-sm md:text-base">
                Seberapa Sering Konsumsi Makanan Berlemak?
              </label>
              <select
                value={makananBerlemak}
                onChange={(e) => setMakananBerlemak(e.target.value)}
                required
                className="border-2 border-mint-green/60 rounded-md w-full p-3 mt-3 focus:outline-none focus:border-pure-green focus:ring-2 focus:ring-pure-green/30 text-sm md:text-base"
              >
                <option value="">Pilih</option>
                <option value="jarang">Jarang</option>
                <option value="3-5x seminggu">3-5x Seminggu</option>
                <option value="setiap hari">Setiap Hari</option>
              </select>
            </div>

            {/* Riwayat Keluarga */}
            <div className="w-full">
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

          {/* Frekuensi Olahraga */}
          <div className="mt-5 w-full">
            <label className="font-semibold text-sm md:text-base">
              Seberapa Sering Olahraga?
            </label>
            <select
              value={olahraga}
              onChange={(e) => setOlahraga(e.target.value)}
              required
              className="border-2 border-mint-green/60 rounded-md w-full p-3 mt-3 focus:outline-none focus:border-pure-green focus:ring-2 focus:ring-pure-green/30 text-sm md:text-base"
            >
              <option value="">Pilih</option>
              <option value="tidak pernah">Tidak Pernah</option>
              <option value="jarang">Jarang</option>
              <option value="3x seminggu">3x Seminggu</option>
            </select>
          </div>

          {/* ─── FOOTER FORM ─── */}
          <div className="mt-10 flex flex-col gap-4 border-t border-gray-300 pb-10 pt-5 sm:flex-row sm:items-center sm:justify-between lg:pr-56">
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
