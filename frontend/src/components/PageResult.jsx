import { useLocation, useNavigate } from "react-router-dom";
import * as Icons from "lucide-react";
import { CircleAlert, ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Send, ArrowRight } from "lucide-react";
import HosipitalPng from "../assets/hospital.jpg";
import { TriangleAlert } from "lucide-react";
import Profile from "../assets/Profile.png";

function getRiskColor(percent) {
  if (percent >= 60) return "#E53E3E";
  if (percent >= 30) return "#f27527";
  return "#38A169";
}

function getRiskTextClass(percent) {
  if (percent >= 60) return "text-[#E53E3E]";
  if (percent >= 30) return "text-[#f27527]";
  return "text-[#38A169]";
}

export default function PageResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  const [tips, setTips] = useState(null);
  const [loadingTips, setLoadingTips] = useState(true);
  const [tipsError, setTipsError] = useState(null);

  const [hospitals, setHospitals] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [locationError, setLocationError] = useState(null);

  const riskColor = getRiskColor(data.data.risk_percent);
  const riskTextClass = getRiskTextClass(data.data.risk_percent);
  const strokeDashoffset = 126 - (126 * data.data.risk_percent) / 100;

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Browser tidak mendukung geolokasi");
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        try {
          const res = await fetch(
            `http://localhost:3000/api/hospitals?lat=${lat}&lng=${lng}`,
          );
          if (!res.ok) throw new Error("API error");
          const result = await res.json();
          setHospitals(result.data.hospitals.slice(0, 2));
          console.log("HOSPITAL RESULT:", result);
        } catch (err) {
          console.error(err);
          setLocationError("Gagal mengambil data rumah sakit");
        } finally {
          setLoadingLocation(false);
        }
      },
      (err) => {
        console.error("Lokasi ditolak:", err);
        setLocationError("Izin lokasi ditolak");
        setLoadingLocation(false);
      },
    );
  }, []);

  useEffect(() => {
    const fetchTips = async () => {
      setLoadingTips(true);
      setTipsError(null);
      try {
        const res = await fetch("http://localhost:3000/api/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            disease: data.type,
            risk_level: data.data.risk_level,
          }),
        });
        if (!res.ok) throw new Error("Respons server tidak OK");
        const result = await res.json();
        setTips(result);
      } catch (err) {
        console.error(err);
        setTipsError("Gagal memuat saran pencegahan");
      } finally {
        setLoadingTips(false);
      }
    };

    fetchTips();
  }, [data]);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <CircleAlert className="text-red-500 size-12" />
        <p className="text-lg font-semibold">Data prediksi tidak ditemukan.</p>
        <button
          onClick={() => navigate("/")}
          className="bg-pine-green text-white px-6 py-2 rounded-xl"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

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
      <div className="m-5 shadow rounded-xl flex flex-col gap-16">
        <div className="flex p-16">
          <div className="w-1/2 gap-4 flex flex-col items-center">
            <h1 className="font-bold text-3xl text-sub-title">
              Hasil Prediksi Penyakit
            </h1>
            <p className="text-sm text-center">
              Analisis mendalam berdasarkan parameter biometrik dan pola
              <br />
              hidup Anda menggunakan sistem kecerdasan buatan.
            </p>
          </div>
        </div>

        <div className="flex">
          <div className="w-1/2 flex justify-center p-10">
            <div className="w-80 flex flex-col gap-4">
              <div className="flex flex-col items-center justify-center gap-3 p-5">
                <div className="flex items-center justify-center w-64 h-32 overflow-hidden relative">
                  <svg className="w-full h-full" viewBox="0 0 100 50">
                    <path
                      d="M 10,50 A 40,40 0 0 1 90,50"
                      fill="none"
                      stroke="#E2E8F0"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 10,50 A 40,40 0 0 1 90,50"
                      fill="none"
                      stroke={riskColor}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray="126"
                      strokeDashoffset={strokeDashoffset}
                    />
                  </svg>
                  <div className="absolute bottom-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-slate-900">
                      {data.data.risk_percent}%
                    </span>
                  </div>
                </div>

                <div className="rounded-xl bg-[#EAB3081A] px-4 py-1 flex items-center justify-center">
                  <p
                    className={`text-sm font-bold text-center ${riskTextClass}`}
                  >
                    • Risiko {data.data.risk_level}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {data.data.top_factors.map((factor, index) => (
                  <div
                    key={index}
                    className="rounded-md px-2 bg-[#EEF4FF] text-[#5B403E]"
                  >
                    <p>{factor}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-1/2 flex flex-col justify-around">
            <div className="w-96 flex flex-col gap-5">
              <p className="text-sm flex items-center gap-2 font-medium">
                <CircleAlert className="text-red-800 size-5" /> Analisis Klinis
              </p>
              <p>
                Berdasarkan data klinis Anda, tingkat risiko berada pada level{" "}
                <span className={`font-semibold ${riskTextClass}`}>
                  {data.data.risk_level}
                </span>
                . Hal ini dipengaruhi oleh faktor:{" "}
                {data.data.top_factors.join(", ")}. Tindakan preventif{" "}
                {data.data.risk_percent >= 60
                  ? "sangat mendesak"
                  : "dianjurkan"}{" "}
                untuk mencegah peningkatan risiko di masa depan.
              </p>
            </div>

            <div className="flex items-start gap-3 p-4 bg-red-50 border-l-4 border-red-700 rounded-r-xl w-96">
              <p className="text-sm leading-relaxed text-red-900">
                <span className="font-medium uppercase flex items-center gap-1">
                  <TriangleAlert size={13} /> DISCLAIMER:{" "}
                </span>
                Hasil ini adalah estimasi berdasarkan model data. Konsultasi ke
                dokter spesialis untuk diagnosis medis yang pasti.
              </p>
            </div>
          </div>
        </div>

        <div className="mx-60">
          <h1 className="font-bold text-2xl text-sub-title">
            Saran Pencegahan
          </h1>
        </div>

        <div className="mb-20 max-w-4xl mx-auto w-full px-4">
          {loadingTips ? (
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-28 rounded-xl bg-gray-100 animate-pulse"
                />
              ))}
            </div>
          ) : tipsError ? (
            <div className="text-red-500 text-sm text-center py-8">
              {tipsError}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {tips?.data?.recommendations?.tips.map((item, index) => {
                const TipIcon = Icons[item.icon] ?? Icons.Activity;
                return (
                  <div
                    key={index}
                    className="flex flex-col justify-center items-center gap-3 p-4 bg-pure-green/10 rounded-xl hover:shadow-md transition"
                  >
                    <div className="size-12 grid place-items-center bg-pure-green/30 text-dark-green-teal rounded-lg">
                      <TipIcon size={20} />
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mx-60">
          <h1 className="font-bold text-2xl text-sub-title">
            Rumah Sakit Terdekat
          </h1>
        </div>

        <div className="flex flex-col gap-3 mx-60 mb-8">
          {loadingLocation ? (
            <div className="h-20 rounded-xl bg-gray-100 animate-pulse" />
          ) : locationError ? (
            <div className="text-red-500 text-sm">{locationError}</div>
          ) : hospitals.length === 0 ? (
            <p className="text-sm text-gray-500">
              Tidak ada rumah sakit ditemukan di sekitar Anda.
            </p>
          ) : (
            hospitals.map((rs) => (
              <div
                key={rs.id}
                className="p-4 bg-[#BAD8B6B2] rounded-xl flex justify-between items-center shadow-sm"
              >
                <div className="flex">
                  <img
                    src={HosipitalPng}
                    className="w-16 rounded-xl object-cover"
                    alt={rs.name}
                  />
                  <div className="flex flex-col ml-4 justify-center">
                    <p className="font-bold">{rs.name}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-600">{rs.address}</p>
                      <span>•</span>
                      <p className="text-sm">{rs.distance_km} km</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl px-3 py-1">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={rs.google_maps_url}
                    className="flex items-center gap-1 text-sm font-medium"
                  >
                    <Send size={15} /> Lihat di Maps
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="self-center bg-pine-green px-16 py-2 rounded-xl mb-20">
          <button
            onClick={() => navigate("/")}
            className="flex gap-2 text-white"
          >
            Periksa Penyakit Lainnya <ArrowRight />
          </button>
        </div>
        </div>
    </div>
  );
}
