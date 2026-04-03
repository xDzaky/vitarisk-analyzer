import { useState } from "react";
import IconDarah from "../assets/icon-darah.png";
import IconShield from "../assets/Container.svg";
import { ArrowRight } from "lucide-react";

export default function DiabetesPage() {
  const [umur, setUmur] = useState("");
  const [gender, setGender] = useState("");
  const [sistolik, setSistolik] = useState("");
  const [gula, setGula] = useState("");
  const [riwayat, setRiwayat] = useState("");
  const [makananManis, setMakananManis] = useState("");
  const [olahraga, setOlahraga] = useState("");
  const [bmi, setBmi] = useState("");

  const handleUmur = (e) => {
    let val = e.target.value;
    if (val === "") return setUmur("");
    val = Math.max(1, Math.min(100, Number(val)));
    setUmur(val);
  };
  const handleGula = (e) => {
    let val = e.target.value;
    if (val === "") return setGula("");
    val = Math.max(50, Math.min(500, Number(val)));
    setGula(val);
  }

  const handleBMI = (e) => {
      let val = e.target.value;

      if (val === "") return setBmi("");

      val = Math.max(10, Math.min(50, Number(val)));
      setBmi(val);
    };

  const handleSistolik = (e) => {
    let val = e.target.value;
    if (val === "") return setSistolik("");
    val = Math.max(80, Math.min(200, Number(val)));
    setSistolik(val);
  }

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
      console.log("HASIL:", data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="shadow m-5 rounded-xl h-full">
      <div>
        <h2 className="font-bold p-5 px-20 text-sub-title mb-3">
          —— Data Personal
        </h2>
        <div className="flex px-20 justify-between">
          <div id="umur" className="flex w-100 flex-col relative">
            <label htmlFor="" className="my-3 font-semibold">
              Berapa Usiamu?{" "}
            </label>
            <input
              type="number"
              value={umur}
              onChange={handleUmur}
              placeholder="Contoh : 17"
              required
              className="border-2  border-mint-green/60 rounded-xl p-3 focus:outline-none focus:border-pure-green focus:ring-2 focus:ring-pure-green/30"
            />
            <span className="absolute left-83 translate-y-1/2 top-1/2 ">
              Tahun
            </span>
          </div>
          <div id="jk" className="my-3 w-100">
            <label htmlFor="" className="my-3 font-semibold">
              Jenis Kelamin{" "}
            </label>
            <div className="flex gap-20 p-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="laki-laki"
                  required
                  className="accent-pure-green"
                  onChange={(e) => setGender(e.target.value)}
                />
                <span>Laki-laki</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="perempuan"
                  required
                  className="accent-pure-green"
                  onChange={(e) => setGender(e.target.value)}
                />
                <span>Perempuan</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <h2 className="mt-15 font-bold p-5 px-20 text-sub-title mb-3">
        —— Indikator Klinis & Gaya Hidup
      </h2>
      <div className="flex justify-between">
        <div id="tekananDarah" className="flex w-100 mx-20 flex-col relative">
          <label htmlFor="" className="my-3 font-semibold">
            Indeks Masa Tubuh (BMI){" "}
          </label>
          <input
            type="number"
            value={bmi}
            onChange={handleBMI}
            placeholder="Contoh : 23.5"
            required
            className="border-2  border-mint-green/60 rounded-xl p-3 focus:outline-none focus:border-pure-green focus:ring-2 focus:ring-pure-green/30"
          />
          <p className="text-[#8F6F6D] text-xs indent-2 mt-2">
            BMI dihitung dari berat badan (kg) / tinggi badan² (m)
          </p>
        </div>
        <div id="tekananDarah" className="flex w-100 mx-20 flex-col relative">
          <label htmlFor="" className="my-3 font-semibold">
            Kadar Gula Darah{" "}
          </label>
          <input
            type="number"
            placeholder="Contoh : 170"
            value={gula}
            onChange={handleGula}
            required
            className="border-2  border-mint-green/60 rounded-xl p-3 focus:outline-none focus:border-pure-green focus:ring-2 focus:ring-pure-green/30"
          />
          <span className="absolute left-83 top-1/2 ">mg/dL</span>
        </div>
      </div>
      <div className="px-20">
        <div className="flex mt-10 mb-15 justify-between">
          <div id="tekananDarah" className="flex w-100  flex-col relative">
            <label htmlFor="" className="my-3 font-semibold">
              Tekanan Darah Sistolik{" "}
            </label>
            <input
              type="number"
              placeholder="Contoh : 17"
              value={sistolik}
              onChange={handleSistolik}
              required
              className="border-2  border-mint-green/60 rounded-xl p-3 focus:outline-none focus:border-pure-green focus:ring-2 focus:ring-pure-green/30"
            />
            <span className="absolute left-83 translate-y-1/2 top-1/2 ">
              mmHg
            </span>
          </div>
          <div id="riwayatKeluarga" className="my-3 w-95">
            <label htmlFor="" className="my-3 font-semibold">
              Ada Riwayat Keluarga Diabetes{" "}
            </label>
            <div className="flex gap-15 p-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="riwayat"
                  value="tidak"
                  onChange={(e) => setRiwayat(e.target.value)}
                  required
                  className="accent-pure-green"
                />
                <span>Tidak Ada</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="riwayat"
                  value="ya"
                  onChange={(e) => setRiwayat(e.target.value)}
                  required
                  className="accent-pure-green"
                />
                <span>Ada</span>
              </label>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <div>
            <label htmlFor="" className="my-3 font-semibold">
              Seberapa Sering Konsumsi Makanan Manis?{" "}
            </label>
            <div className="flex gap-15 p-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="makananManis"
                  value="3-5x seminggu"
                  onChange={(e) => setMakananManis(e.target.value)}
                  required
                  className="accent-pure-green"
                />
                <span>3-5x Seminggu</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="makananManis"
                  value="jarang"
                  onChange={(e) => setMakananManis(e.target.value)}
                  required
                  className="accent-pure-green"
                />
                <span>Jarang</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="makananManis"
                  value="setiap hari"
                  onChange={(e) => setMakananManis(e.target.value)}
                  required
                  className="accent-pure-green"
                />
                <span>Sering</span>
              </label>
            </div>
          </div>
          <div>
            <label htmlFor="" className="my-3 font-semibold">
              Seberapa Sering Olahraga{" "}
            </label>
            <div className="flex gap-7 p-3 w-95">
              <label className="flex items-center gap-2 cursor-pointer ">
                <input
                  type="radio"
                  name="olahraga"
                  value="tidak pernah"
                  onChange={(e) => setOlahraga(e.target.value)}
                  required
                  className="accent-pure-green"
                />
                <span>Tidak Pernah</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer ">
                <input
                  type="radio"
                  name="olahraga"
                  value="jarang"
                  onChange={(e) => setOlahraga(e.target.value)}
                  required
                  className="accent-pure-green"
                />
                <span>Jarang</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer ">
                <input
                  type="radio"
                  name="olahraga"
                  value="3x seminggu"
                  onChange={(e) => setOlahraga(e.target.value)}
                  required
                  className="accent-pure-green"
                />
                <span>3x Seminggu</span>
              </label>
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
  );
}
