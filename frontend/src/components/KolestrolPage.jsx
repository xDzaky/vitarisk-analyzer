import { useState } from "react";
import { ChevronLeft, Venus, Mars } from "lucide-react";
import Profile from "../assets/profile.png";
import IconShield from "../assets/Container.svg";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function KolestrolPage() {
  const [umur, setUmur] = useState("");
  const [gender, setGender] = useState("");
  const [sistolik, setSistolik] = useState("");
  const [riwayat, setRiwayat] = useState("");
  const [olahraga, setOlahraga] = useState("");
  const [merokok, setMerokok] = useState("");
  const [makananBerlemak, setMakananBerlemak] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      age: Number(umur),
      sex: gender,
      trestbps: Number(sistolik),
      diet_fat: makananBerlemak,
      exercise_freq: olahraga,
      smoking: merokok,
      family_history: riwayat,
    };

    console.log(payload); // cek dulu sebelum kirim

    try {
      const res = await fetch("http://localhost:3000/api/predict/cholesterol", {
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
          type: "cholesterol",
        },
      });
      console.log("HASIL:", data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-[#f9faf7]">
      <nav className="flex items-center justify-between py-4 px-15 sticky top-0 bg-[#f9faf7] z-10 shadow-sm ">
        <a href="/" className="flex items-center gap-4">
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
          Diagnosa Penyakit Kolestrol
        </h1>
        <p className=" text-dark-green-teal/80">
          Form evaluasi klinis untuk membantu prediksi risiko penyakit
          kolestrol.
          <br />
          Silakan isi data pasien dengan lengkap dan akurat.
        </p>
      </header>
      <form onSubmit={handleSubmit} className="m-5 h-full">
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
        <h2 className="font-bold p-5 px-20 text-sub-title mt-5 mb-3">
          —— Indikator Klinis & Gaya Hidup
        </h2>
        <div className="grid grid-cols-2 gap-5 mt-5 mx-20">
          <div id="tekananDarah" className="flex gap-1 flex-col relative">
            <label htmlFor="" className="font-semibold">
              Tekanan Darah Sistolik{" "}
            </label>
            <input
              type="number"
              min="50"
              max="250"
              value={sistolik}
              onChange={(e) => setSistolik(e.target.value)}
              placeholder="Contoh : 120"
              required
              className="border-2  border-mint-green/60 rounded-md p-3 mt-3 relative focus:outline-none focus:border-pure-green focus:ring-2 focus:ring-pure-green/30"
            />
            <span className="absolute left-135 text-black/60 top-[53%]">
              mmHg
            </span>
          </div>
          <div id="merokok" className=" w-full flex flex-col gap-1 ">
            <label htmlFor="" className=" font-semibold ">
              Kebiasaan Merokok{" "}
            </label>
            <div className="flex w-full">
              <select
                name=""
                id=""
                value={merokok}
                onChange={(e) => setMerokok(e.target.value)}
                required
                className="border-2 border-mint-green/60 rounded-md w-full p-3 mt-3 focus:outline-none focus:border-pure-green focus:ring-2 focus:ring-pure-green/30"
              >
                <option value="">Pilih</option>
                <option value="ya">Ya</option>
                <option value="tidak">Tidak</option>
                <option value="kadang-kadang">Kadang-Kadang</option>
              </select>
            </div>
          </div>
        </div>
        <div className="px-20">
          <div className="grid grid-cols-2 gap-5 mt-5">
            <div id="polaMakanBerlemak" className=" w-full">
              <label htmlFor="" className=" font-semibold ">
                Seberapa Sering Kosnumsi Makanan Berlemak?{" "}
              </label>
              <div className="flex w-full">
                <select
                  name=""
                  id=""
                  value={makananBerlemak}
                  onChange={(e) => setMakananBerlemak(e.target.value)}
                  required
                  className="border-2 border-mint-green/60 rounded-md w-full p-3 mt-3 focus:outline-none focus:border-pure-green focus:ring-2 focus:ring-pure-green/30"
                >
                  <option value="">Pilih</option>
                  <option value="jarang">Jarang</option>
                  <option value="3-5x seminggu">3-5x Seminggu</option>
                  <option value="setiap hari">Setiap Hari</option>
                </select>
              </div>
            </div>
            <div id="riwayatKeluarga" className=" w-full">
              <label htmlFor="" className="font-semibold">
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
          <div className="grid grid-cols-1 mt-5">
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
          <div className="flex justify-between mt-20"></div>

          <div className="flex justify-between pb-15 border-t border-gray-300 mt-10 items-center pt-5">
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
