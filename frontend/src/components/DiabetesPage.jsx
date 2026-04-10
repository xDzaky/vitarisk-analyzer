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
import Profile from "../assets/Profile.png";
export default function DiabetesPage() {
  const [umur, setUmur] = useState("");
  const [gender, setGender] = useState("");
  const [sistolik, setSistolik] = useState("");
  const [gula, setGula] = useState("");
  const [riwayat, setRiwayat] = useState("");
  const [makananManis, setMakananManis] = useState("");
  const [olahraga, setOlahraga] = useState("");
  const [bmi, setBmi] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      age: Number(umur),
      sex: gender,
      glucose: Number(gula),
      blood_pressure: Number(sistolik),
      family_history: riwayat,
      diet_sweet: makananManis,
      exercise_freq: olahraga,
      bmi: Number(bmi),
    };

    console.log(payload); // cek dulu sebelum kirim

    try {
      const res = await fetch("http://localhost:3000/api/predict/diabetes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      navigate("/result", {
        state: {
          ...data,
          type: "diabetes",
        },
      });
      console.log("HASIL:", data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-[#f9faf7] min-h-screen">
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
          Diagnosa Penyakit Diabetes
        </h1>
        <p className=" text-dark-green-teal/80">
          Form evaluasi klinis untuk membantu prediksi risiko penyakit diabetes.
          <br />
          Silakan isi data pasien dengan lengkap dan akurat.
        </p>
      </header>
      <form onSubmit={handleSubmit} type="post" className="m-5 h-full">
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
                  onChange={(e) => setUmur(e.target.value)}
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
        <div className="grid grid-cols-2  gap-5 mx-20">
          <div id="tekananDarah" className="flex w-full flex-col relative">
            <label htmlFor="" className="font-semibold">
              Indeks Masa Tubuh (BMI){" "}
            </label>
            <input
              type="number"
              value={bmi}
              onChange={(e) => setBmi(e.target.value)}
              min={10}
              max={50}
              placeholder="Contoh : 23.5"
              required
              className="border-2  border-mint-green/60 rounded-md p-3 my-3 focus:outline-none focus:border-pure-green focus:ring-2 focus:ring-pure-green/30"
            />
            <p className="text-[#8F6F6D] text-xs indent-2">
              BMI dihitung dari berat badan (kg) / tinggi badan² (m)
            </p>
          </div>
          <div id="olahraga" className=" w-full ">
            <label htmlFor="" className="my-3 font-semibold ">
              Seberapa Sering Olahraga?{" "}
            </label>
            <div className="flex w-full my-3">
              <select
                name=""
                id=""
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
        <div className="px-20">
          <div className="grid grid-cols-2 gap-5 mt-5">
            <div id="tekananDarah" className="flex w-full flex-col relative">
              <label htmlFor="" className=" font-semibold">
                Tekanan Darah Sistolik{" "}
              </label>
              <input
                type="number"
                placeholder="Contoh : 120"
                value={sistolik}
                onChange={(e) => setSistolik(e.target.value)}
                required
                className="border-2  border-mint-green/60 rounded-md p-3 mt-3 focus:outline-none focus:border-pure-green focus:ring-2 focus:ring-pure-green/30"
              />
              <span className="absolute left-135 top-1/2">mmHg</span>
            </div>
            <div className="w-full">
              <label htmlFor="" className=" font-semibold">
                Riwayat Keluarga{" "}
              </label>
              <div className="grid grid-cols-2 gap-5 py-3">
                <label className="flex items-cen   gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="riwayatKeluarga"
                    value="ya"
                    required
                    onChange={(e) => setRiwayat(e.target.value)}
                    className="hidden"
                  />
                  <div
                    className={`border w-full py-3 rounded-md border-[#adccbf] font-medium text-black/50 transition  flex justify-center items-center gap-2 px-8 ${
                      riwayat === "ya"
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
                    name="riwayatKeluarga"
                    value="tidak"
                    required
                    onChange={(e) => setRiwayat(e.target.value)}
                    className="hidden"
                  />
                  <div
                    className={`border w-full py-3 rounded-md border-[#adccbf] font-medium text-black/50 transition  flex justify-center items-center gap-2 px-8 ${
                      riwayat === "tidak"
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
          </div>

          <div className="grid grid-cols-2 gap-5 mt-5">
            <div>
              <div id="tekananDarah" className="flex w-full flex-col relative">
                <label htmlFor="" className=" font-semibold">
                  Kadar Gula Darah{" "}
                </label>
                <input
                  type="number"
                  placeholder="Contoh : 170"
                  value={gula}
                  onChange={(e) => setGula(e.target.value)}
                  min={50}
                  max={500}
                  required
                  className="border-2  border-mint-green/60 rounded-md p-3 mt-3 focus:outline-none focus:border-pure-green focus:ring-2 focus:ring-pure-green/30"
                />
                <span className="absolute left-135 translate-y-1/5 top-1/2 ">mg/dL</span>
              </div>
            </div>
            <div id="olahraga" className=" w-full ">
              <label htmlFor="" className="my-3 font-semibold ">
                Seberapa Sering Konsumsi Makanan Manis?{" "}
              </label>
              <div className="flex w-full my-3">
                <select
                  name=""
                  id=""
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
          <div className="flex justify-between py-15">
            <div className="flex gap-2 items-center">
              <img src={IconShield} alt="" className="w-3" />
              <p className="text-[#8F6F6D] align-middle">
                Data kamu tidak akan disimpan. Privasi dijamin 100%.
              </p>
            </div>
            <button
              type="submit"
              className="bg-pine-green py-2 px-10 flex gap-3 rounded-xl mx-45 text-white hover:scale-105 transition group"
            >
              Lihat hasil prediksi{" "}
              <ArrowRight className="group-hover:translate-x-2 transition" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
