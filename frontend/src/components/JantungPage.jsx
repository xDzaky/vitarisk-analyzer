import { useState } from "react";
import IconDarah from "../assets/icon-darah.png";
import IconShield from "../assets/Container.svg";
import { ArrowRight } from "lucide-react";

export default function JantungPage() {
  const [umur, setUmur] = useState("");
  const [tekananDarah, setTekananDarah] = useState("");
  const [kolesterol, setKolesterol] = useState("");
  const [detakJantung, setDetakJantung] = useState("");
  const [isOn, setIsOn] = useState(true);

  const handleUmur = (e) => {
    let val = e.target.value;
    if (val === "") return setUmur("");
    val = Math.max(1, Math.min(100, Number(val)));
    setUmur(val);
  };

  const handleTekanan = (e) => {
    let val = e.target.value;
    if (val === "") return setTekananDarah("");
    val = Math.max(60, Math.min(250, Number(val)));
    setTekananDarah(val);
  };

  const handleKolesterol = (e) => {
    let val = e.target.value;
    if (val === "") return setKolesterol("");
    val = Math.max(50, Math.min(400, Number(val)));
    setKolesterol(val);
  };

  const handleDetakJantung = (e) => {
    let val = e.target.value;
    if (val === "") return setTekananDarah("");
    val = Math.max(60, Math.min(200, Number(val)));
    setDetakJantung(val);
  };
  return (
    <div className="shadow m-5 rounded-xl h-full">
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
                  className="accent-pure-green"
                />
                <span>Laki-laki</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="perempuan"
                  className="accent-pure-green"
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
      <div className="w-5.5/6 mx-20 " id="nyeri">
        <label htmlFor="" className="font-semibold">
          Intensitar Nyeri di Dada{" "}
        </label>
        <select
          name="tingkatNyeri"
          id=""
          className=" w-full border-2 mt-3  border-mint-green/60 rounded-xl p-3 focus:outline-none focus:border-pure-green focus:ring-2 focus:ring-pure-green/30"
        >
          <option value="tidak">Tidak Pernah Nyeri di Dada</option>
          <option value="jarang">Jarang Nyeri di Dada</option>
          <option value="sering">Sering Nyeri di Dada</option>
        </select>
      </div>
      <div className="flex justify-between mt-15">
        <div id="tekananDarah" className="flex w-100 mx-20 flex-col relative">
          <label htmlFor="" className="my-3 font-semibold">
            Tekanan Darah Sistolik{" "}
          </label>
          <input
            type="number"
            value={tekananDarah}
            onChange={handleTekanan}
            placeholder="Contoh : 17"
            className="border-2  border-mint-green/60 rounded-xl p-3 focus:outline-none focus:border-pure-green focus:ring-2 focus:ring-pure-green/30"
          />
          <span className="absolute left-83 translate-y-1/2 top-1/2 ">
            mmHg
          </span>
        </div>
        <div id="tekananDarah" className="flex w-100 mx-20 flex-col relative">
          <label htmlFor="" className="my-3 font-semibold">
            Kadar Kolesterol Total{" "}
          </label>
          <input
            type="number"
            value={kolesterol}
            onChange={handleKolesterol}
            placeholder="Contoh : 170"
            className="border-2  border-mint-green/60 rounded-xl p-3 focus:outline-none focus:border-pure-green focus:ring-2 focus:ring-pure-green/30"
          />
          <span className="absolute left-83 translate-y-1/2 top-1/2 ">
            mg/dL
          </span>
        </div>
      </div>
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
        <div className="flex my-15 justify-between">
          <div id="tekananDarah" className="flex w-100  flex-col relative">
            <label htmlFor="" className="my-3 font-semibold">
              Detak Jantung Tertinggi (Olahraga){" "}
            </label>
            <input
              type="number"
              value={detakJantung}
              onChange={handleDetakJantung}
              placeholder="Contoh : 170"
              className="border-2  border-mint-green/60 rounded-xl p-3 focus:outline-none focus:border-pure-green focus:ring-2 focus:ring-pure-green/30"
            />
            <span className="absolute left-83 translate-y-1/2 top-1/2 ">
              BPM
            </span>
          </div>
          <div id="riwayatKeluarga" className="my-3">
            <label htmlFor="" className="my-3 font-semibold">
              Riwayat Keluarga{" "}
            </label>
            <div className="flex gap-15 p-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="riwayat"
                  value="laki-laki"
                  className="accent-pure-green"
                />
                <span>Tidak Ada</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="riwayat"
                  value="perempuan"
                  className="accent-pure-green"
                />
                <span>Ada</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="riwayat"
                  value="tidakTahu"
                  className="accent-pure-green"
                />
                <span>Tidak Tahu</span>
              </label>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <div>
            <label htmlFor="" className="my-3 font-semibold">
              Nyeri Dada saat Olahraga{" "}
            </label>
            <div className="flex gap-30 p-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="nyeriDada"
                  value="laki-laki"
                  className="accent-pure-green"
                />
                <span>Ya</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="nyeriDada"
                  value="perempuan"
                  className="accent-pure-green"
                />
                <span>Tidak</span>
              </label>
            </div>
          </div>
          <div>
            <label htmlFor="" className="my-3 font-semibold">
              Kebiasaan Merokok{" "}
            </label>
            <div className="flex gap-15 p-3 w-95">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="merokok"
                  value="true"
                  className="accent-pure-green"
                />
                <span>Ya</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="merokok"
                  value="false"
                  className="accent-pure-green"
                />
                <span>Tidak</span>
              </label>
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-15">
          <div className="flex gap-2 items-center">
            <img src={IconShield} alt="" className="w-3"/>
            <p className="text-[#8F6F6D] align-middle">
              Data kamu tidak akan disimpan. Privasi dijamin 100%.
            </p>
          </div>
          <button type="submit" className="bg-pine-green py-2 px-10 flex gap-3 rounded-xl mx-45 text-white hover:scale-105 transition group">
            Lihat hasil prediksi <ArrowRight className="group-hover:translate-x-2 transition"/>
          </button>
        </div>
      </div>
    </div>
  );
}
