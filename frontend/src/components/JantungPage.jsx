import { useState } from "react";
import Profile from "../assets/Profile.png";
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

  const handleUmur = (e) => {
    setUmur(e.target.value);
  };

  const handleTekanan = (e) => {
    setTekananDarah(e.target.value);
  };

  const handleKolesterol = (e) => {
    setKolesterol(e.target.value);
  };

  const handleDetakJantung = (e) => {
    setDetakJantung(e.target.value);
  };

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

    console.log("PAYLOAD:", payload); // cek dulu sebelum kirim

    try {
      const data = await apiRequest("/predict/heart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      navigate("/result", { state: { ...data, type: "heart" } });
      console.log("HASIL:", data);
    } catch (err) {
      console.error(err);
      setSubmitError(err.message || "Prediksi jantung gagal diproses.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f9faf7]">
      <nav className="flex items-center justify-between py-4 px-15 sticky top-0 bg-[#f9faf7] z-10 shadow-sm ">
        <a href="/" className="flex items-center gap-4 hover:bg-black/10 pr-2.5 rounded-md transition text-dark-green-teal font-semibold">
          <ChevronLeft />
          Kembali
        </a>
        <a href="/">
          <img src="/icons2.svg" className="h-8" alt="" />
        </a>
        <img
          src={Profile}
          alt="Profile"
          onClick={() => navigate("/profile")}
          className="w-10 h-10 rounded-full cursor-pointer hover:opacity-80 transition"
        />
      </nav>
      <header className="pt-5 flex flex-col gap-3 mx-25">
        <h1 className="text-3xl font-semibold text-sub-title">
          Diagnosa Penyakit Jantung
        </h1>
        <p className=" text-dark-green-teal/80">
          Form evaluasi klinis untuk membantu prediksi risiko penyakit jantung.
          <br />
          Silakan isi data pasien dengan lengkap dan akurat.
        </p>
      </header>
      <form onSubmit={handleSubmit} className="m-5 h-full ">
        {submitError ? (
          <div className="mx-15 mb-5 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
            {submitError}
          </div>
        ) : null}
        <div>
          <div className="mx-15 rounded-xl pb-8 bg-[#f3f4f1]">
            <h2 className="font-bold p-5 px-20 text-sub-title mb-3">
              —— Data Personal
            </h2>
            <div className="grid grid-cols-2 px-20 ">
              <div id="umur" className="flex w-100 flex-col relative">
                <label htmlFor="" className="my-3 font-semibold">
                  Berapa Usiamu?{" "}
                </label>
                <input
                  type="number"
                  value={umur}
                  onChange={handleUmur}
                  min={1}
                  max={120}
                  placeholder="Contoh : 17"
                  required
                  className="border-2  border-mint-green/60 rounded-xl p-3 focus:outline-none focus:border-pure-green focus:ring-2 focus:ring-pure-green/30"
                />
                <span className="absolute left-83 translate-y-1/2 top-1/2 ">
                  Tahun
                </span>
              </div>
              <div className="flex flex-col px-20">
                <label htmlFor="" className="my-3 font-semibold">
                  Jenis Kelamin{" "}
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
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition hover:border-blue-500/70
          ${
            gender === "male"
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
                    >
                      <Mars size={20} />
                      Laki-laki{" "}
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
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 hover:border-pink-500/70 transition
          ${
            gender === "female"
              ? "bg-pink-500 text-white border-pink-500"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
                    >
                      <Venus size={20} />
                      Perempuan
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className="mt-5 font-bold p-5 px-20 text-sub-title mb-3">
          —— Indikator Klinis & Gaya Hidup
        </h2>
        <div className="grid grid-cols-2 gap-5 mx-20">
          <div id="nyeri">
            <div className="flex flex-col gap-1">
              <label htmlFor="nyeriDada" className="font-semibold">
                Intensitar Nyeri di Dada{" "}
              </label>
              <select
                name="tingkatNyeri"
                value={nyeriDada}
                id="nyeriDada"
                onChange={(e) => setNyeriDada(e.target.value)}
                required
                className="border-2 border-mint-green/60 rounded-md w-full p-3 focus:outline-none my-3 focus:border-pure-green focus:ring-2 focus:ring-pure-green/30"
              >
                <option value="tidak pernah">Tidak Pernah Nyeri di Dada</option>
                <option value="nyeri ringan">Nyeri Ringan di Dada</option>
                <option value="nyeri sedang">Nyeri Sedang di Dada</option>
                <option value="nyeri berat">Nyeri Berat di Dada</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div id="tekananDarah" className="flex gap-1 flex-col relative">
              <label htmlFor="" className="font-semibold">
                Tekanan Darah Sistolik{" "}
              </label>
              <input
                type="number"
                min="50"
                max="250"
                value={tekananDarah}
                onChange={handleTekanan}
                placeholder="Contoh : 120"
                required
                className="border-2  border-mint-green/60 rounded-md p-3 my-3 relative focus:outline-none focus:border-pure-green focus:ring-2 focus:ring-pure-green/30"
              />
              <span className="absolute left-58 text-black/60 -translate-y-1/10 top-[53%]">
                mmHg
              </span>
            </div>
            <div id="tekananDarah" className="flex flex-col gap-1 relative">
              <label htmlFor="" className=" font-semibold">
                Kadar Kolesterol Total{" "}
              </label>
              <input
                type="number"
                min="50"
                max="400"
                value={kolesterol}
                onChange={handleKolesterol}
                placeholder="Contoh : 170"
                required
                className="border-2  border-mint-green/60 rounded-md my-3 p-3 focus:outline-none focus:border-pure-green focus:ring-2 focus:ring-pure-green/30"
              />
              <span className="absolute left-58 -translate-y-1/10 text-black/50 top-[53%]">
                mg/dL
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-between"></div>
        <div className="px-20 py-15">
          <div className="bg-sage-green/60 rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
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
          <div className="grid grid-cols-2 gap-5 my-15 ">
            <div id="tekananDarah" className="flex w-full  flex-col relative">
              <label htmlFor="" className="my-3 font-semibold">
                Detak Jantung Tertinggi (Olahraga){" "}
              </label>
              <input
                type="number"
                min="60"
                max="200"
                value={detakJantung}
                onChange={handleDetakJantung}
                placeholder="Contoh : 120"
                required
                className="border-2  border-mint-green/60 rounded-md p-3 focus:outline-none focus:border-pure-green focus:ring-2 focus:ring-pure-green/30"
              />
              <span className="absolute left-140 top-1/2 ">
                BPM
              </span>
            </div>
            <div id="riwayatKeluarga" className="my-3 w-full">
              <label htmlFor="" className="my-3 font-semibold">
                <p className="indent-3">Riwayat Keluarga </p>
              </label>
              <div className="grid grid-cols-2 text-center py-3 gap-5">
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
                    className={`py-3 w-full  rounded-md border-[#adccbf] font-medium border-2 text-black/50 transition ${
                      riwayat === "tidak"
                        ? "bg-[#b6d3b9] text-sub-title"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    <p>Tidak Ada</p>
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
                    className={`py-3 px-8  rounded-md border-[#adccbf] font-medium border-2 text-black/50 transition ${
                      riwayat === "ya"
                        ? "bg-[#b6d3b9] text-sub-title"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    <p>Ada</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="w-full">
              <label htmlFor="" className="my-3 font-semibold">
                Nyeri Dada saat Olahraga{" "}
              </label>
              <div className="grid grid-cols-2 gap-5 py-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="nyeriDada"
                    value="ya"
                    required
                    onChange={(e) => setExangina(e.target.value)}
                    className="hidden"
                  />
                  <div
                    className={`border-2 w-full py-3 rounded-md border-[#adccbf] font-medium text-black/50 transition  flex justify-center items-center gap-2 px-8 ${
                      exangina === "ya"
                        ? "bg-[#b6d3b9] text-sub-title"
                        : "bg-whit hover:bg-gray-100"
                    }`}
                  >
                    <p className="flex gap-3">
                      <CircleCheck />
                      Ya
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="nyeriDada"
                    value="tidak"
                    required
                    onChange={(e) => setExangina(e.target.value)}
                    className="hidden"
                  />
                  <div
                    className={`border-2 w-full py-3 rounded-md border-[#adccbf] font-medium text-black/50 transition  flex justify-center items-center gap-2 px-8 ${
                      exangina === "tidak"
                        ? "bg-[#b6d3b9] text-sub-title"
                        : "bg-whit hover:bg-gray-100"
                    }`}
                  >
                    <p className="flex gap-3">
                      <CircleX />
                      Tidak
                    </p>
                  </div>
                </label>
              </div>
            </div>
            <div id="merokok" className=" w-full ">
              <label htmlFor="" className="my-3 font-semibold ">
                Kebiasaan Merokok{" "}
              </label>
              <div className="flex w-full my-3">
                <select
                  name=""
                  id=""
                  value={merokok}
                  onChange={(e) => setMerokok(e.target.value)}
                  required
                  className="border-2 border-mint-green/60 rounded-md w-full p-3 focus:outline-none focus:border-pure-green focus:ring-2 focus:ring-pure-green/30"
                >
                  <option value="">Pilih</option>
                  <option value="ya">Ya</option>
                  <option value="tidak">Tidak</option>
                  <option value="kadang-kadang">Kadang-Kadang</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-15 border-t pt-5 border-gray-300">
            <div className="flex gap-2 items-center">
              <img src={IconShield} alt="" className="w-3" />
              <p className="text-[#8F6F6D] align-middle">
                Data kamu tidak akan disimpan. Privasi dijamin 100%.
              </p>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-pine-green py-2 px-10 flex gap-3 rounded-xl mx-45 text-white hover:scale-105 transition group disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
            >
              {submitting ? "Memproses..." : "Lihat hasil prediksi"}{" "}
              <ArrowRight className="group-hover:translate-x-2 transition" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
