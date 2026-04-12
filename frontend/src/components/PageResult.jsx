import { useLocation, useNavigate } from "react-router-dom";
import * as Icons from "lucide-react";
import { CircleAlert, ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Send, ArrowRight } from "lucide-react";
import HosipitalPng from "../assets/hospital.jpg";
import { TriangleAlert } from "lucide-react";
import { API_BASE_URL, apiRequest } from "../lib/api";
import ProfileAvatar from "./ProfileAvatar";

const LAST_LOCATION_STORAGE_KEY = "vitarisk:last-known-location";

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

function getGeolocationErrorMessage(error) {
  if (!error) {
    return "Lokasi belum bisa didapatkan saat ini.";
  }

  if (error.code === 1) {
    return "Akses lokasi belum diberikan. Aktifkan izin lokasi agar kami bisa menampilkan rumah sakit terdekat.";
  }

  if (error.code === 2) {
    return "Lokasi belum bisa didapatkan saat ini. Coba lagi sebentar atau periksa layanan lokasi di browser/perangkatmu.";
  }

  if (error.code === 3) {
    return "Permintaan lokasi memakan waktu terlalu lama. Coba muat ulang halaman ini lagi.";
  }

  return "Lokasi belum bisa didapatkan saat ini. Coba lagi beberapa saat.";
}

function saveLastKnownLocation(lat, lng) {
  localStorage.setItem(
    LAST_LOCATION_STORAGE_KEY,
    JSON.stringify({
      lat,
      lng,
      saved_at: Date.now(),
    })
  );
}

function getLastKnownLocation() {
  try {
    const rawValue = localStorage.getItem(LAST_LOCATION_STORAGE_KEY);
    if (!rawValue) {
      return null;
    }

    const parsedValue = JSON.parse(rawValue);
    if (
      typeof parsedValue?.lat === "number" &&
      typeof parsedValue?.lng === "number"
    ) {
      return parsedValue;
    }
  } catch (_error) {
    // Abaikan cache yang rusak.
  }

  return null;
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
  const [locationNote, setLocationNote] = useState("");

  const fetchHospitals = async (lat, lng, note = "") => {
    const res = await fetch(`${API_BASE_URL}/hospitals?lat=${lat}&lng=${lng}`);
    if (!res.ok) throw new Error("API error");

    const result = await res.json();
    setHospitals(result.data.hospitals.slice(0, 2));
    setLocationError(null);
    setLocationNote(note);
    console.log("HOSPITAL RESULT:", result);
  };

  const requestLocation = () =>
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 12000,
        maximumAge: 300000,
      });
    });

  const requestFreshLocation = () =>
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0,
      });
    });

  const loadNearbyHospitals = async () => {
    if (!data?.data) {
      return;
    }

    setLoadingLocation(true);
    setLocationError(null);
    setLocationNote("");
    setHospitals([]);

    if (!navigator.geolocation) {
      setLocationError(
        "Browser ini belum mendukung fitur lokasi, jadi rumah sakit terdekat belum bisa ditampilkan."
      );
      setLoadingLocation(false);
      return;
    }

    try {
      let position;

      try {
        position = await requestFreshLocation();
      } catch (_freshError) {
        position = await requestLocation();
      }

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      saveLastKnownLocation(lat, lng);
      await fetchHospitals(lat, lng);
    } catch (err) {
      console.error("Geolocation error:", err);

      const lastKnownLocation = getLastKnownLocation();
      if (lastKnownLocation) {
        try {
          await fetchHospitals(
            lastKnownLocation.lat,
            lastKnownLocation.lng,
            "Menampilkan rumah sakit terdekat berdasarkan lokasi terakhir yang berhasil dibaca."
          );
          return;
        } catch (hospitalError) {
          console.error(hospitalError);
        }
      }

      setLocationError(getGeolocationErrorMessage(err));
    } finally {
      setLoadingLocation(false);
    }
  };

  useEffect(() => {
    loadNearbyHospitals();
  }, [data]);


  useEffect(() => {
    if (!data?.data) {
      return;
    }

    const fetchTips = async () => {
      setLoadingTips(true);
      setTipsError(null);
      try {
        const result = await apiRequest("/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            disease: data.type,
            risk_level: data.data.risk_level,
          }),
        });
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

  if (!data?.data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 px-4">
        <CircleAlert className="text-red-500 size-12" />
        <p className="text-lg font-semibold text-center">Data prediksi tidak ditemukan.</p>
        <button
          onClick={() => navigate("/")}
          className="bg-pine-green text-white px-6 py-2 rounded-xl w-full sm:w-auto"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  const riskColor = getRiskColor(data.data.risk_percent);
  const riskTextClass = getRiskTextClass(data.data.risk_percent);
  const strokeDashoffset = 126 - (126 * data.data.risk_percent) / 100;

  return (
    <div className="bg-[#f9faf7] min-h-screen">
      <nav className="flex items-center justify-between py-4 px-4 md:px-16 sticky top-0 bg-[#f9faf7] z-10 shadow-sm">
        <a href="/" className="flex items-center gap-2 md:gap-4">
          <ChevronLeft />
          <span className="hidden md:inline">Kembali</span>
          <span className="md:hidden">Kembali</span>
        </a>
        <a href="/">
          <img src="/icons2.svg" className="h-8" alt="" />
        </a>
        <ProfileAvatar />
      </nav>
      
      <div className="m-4 md:m-5 shadow rounded-xl flex flex-col gap-8 md:gap-16 pb-10">

        <div className="px-4 pt-8 md:px-16 md:pt-16">
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2 w-full text-center md:text-left">
            <h1 className="font-bold text-2xl md:text-3xl text-sub-title">
              Hasil Prediksi Penyakit
            </h1>
            <p className="text-sm text-gray-600">
              Analisis mendalam berdasarkan parameter biometrik dan pola
              <br className="hidden md:block" />
              hidup Anda menggunakan sistem kecerdasan buatan.
            </p>
          </div>
        </div>


        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 flex justify-center p-4 md:p-10">
            <div className="w-full max-w-[320px] flex flex-col gap-4">
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
                  <p className={`text-sm font-bold text-center ${riskTextClass}`}>
                    • Risiko {data.data.risk_level}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {data.data.top_factors.map((factor, index) => (
                  <div
                    key={index}
                    className="rounded-md px-3 py-1 bg-[#EEF4FF] text-[#5B403E] text-sm text-center"
                  >
                    <p>{factor}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start gap-6 px-4 md:px-0">
            <div className="w-full max-w-2xl flex flex-col gap-5">
              <p className="text-sm flex items-center gap-2 font-medium">
                <CircleAlert className="text-red-800 size-5" /> Analisis Klinis
              </p>
              <p className="text-sm md:text-base text-center md:text-left">
                Berdasarkan data klinis Anda, tingkat risiko berada pada level{" "}
                <span className={`font-semibold ${riskTextClass}`}>
                  {data.data.risk_level}
                </span>
                . Hal ini dipengaruhi oleh faktor:{" "}
                {data.data.top_factors.join(", ")}. Tindakan preventif{" "}
                {data.data.risk_percent >= 60 ? "sangat mendesak" : "dianjurkan"}{" "}
                untuk mencegah peningkatan risiko di masa depan.
              </p>
            </div>

            <div className="flex items-start gap-3 p-4 bg-red-50 border-l-4 border-red-700 rounded-r-xl w-full max-w-2xl">
              <p className="text-sm leading-relaxed text-red-900 text-center md:text-left">
                <span className="font-medium uppercase flex items-center gap-1 justify-center md:justify-start"><TriangleAlert size={13} /> DISCLAIMER: </span>
                Hasil ini adalah estimasi berdasarkan model data. Konsultasi ke
                dokter spesialis untuk diagnosis medis yang pasti.
              </p>
            </div>
            <p className="w-full max-w-2xl text-xs text-gray-500 text-center md:text-left">
              Halaman ini menggabungkan hasil prediksi ML, saran pencegahan dari backend,
              dan data rumah sakit terdekat dari lokasi perangkatmu.
            </p>
          </div>
        </div>

        <div className="mx-5 md:mx-60">
          <h1 className="font-bold text-xl md:text-2xl text-sub-title">Saran Pencegahan</h1>
        </div>

        <div className="mb-10 md:mb-20 max-w-4xl mx-auto w-full px-4 md:px-0">
          {loadingTips ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        <div className="mx-5 md:mx-60">
          <h1 className="font-bold text-xl md:text-2xl text-sub-title">
            Rumah Sakit Terdekat
          </h1>
        </div>

        <div className="flex flex-col gap-3 mx-5 md:mx-60 mb-8">
          {loadingLocation ? (
            <div className="h-20 rounded-xl bg-gray-100 animate-pulse" />
          ) : locationError ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-amber-700 text-sm text-center md:text-left">{locationError}</p>
              <div className="flex justify-center md:justify-start">
                <button
                  type="button"
                  onClick={loadNearbyHospitals}
                  className="mt-3 rounded-lg bg-[#327E66] px-4 py-2 text-sm text-white"
                >
                  Coba lagi
                </button>
              </div>
            </div>
          ) : hospitals.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">
              Tidak ada rumah sakit ditemukan di sekitar Anda.
            </p>
          ) : (
            <>
              {locationNote ? (
                <p className="text-sm text-amber-700 text-center md:text-left">{locationNote}</p>
              ) : null}
              {hospitals.map((rs) => (
                <div
                  key={rs.id}
                  className="p-4 bg-[#BAD8B6B2] rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm"
                >
                  <div className="flex w-full md:w-auto">
                    <img
                      src={HosipitalPng}
                      className="w-16 h-16 rounded-xl object-cover"
                      alt={rs.name}
                    />
                    <div className="flex flex-col ml-4 justify-center">
                      <p className="font-bold">{rs.name}</p>
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-2">
                        <p className="text-sm text-gray-600">{rs.address}</p>
                        {window.innerWidth >= 768 && <span>•</span>}
                        <p className="text-sm">{rs.distance_km} km</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl px-3 py-2 w-full md:w-auto">
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={rs.google_maps_url}
                      className="flex items-center justify-center gap-1 text-sm font-medium"
                    >
                      <Send size={15} /> Lihat di Maps
                    </a>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="self-center bg-pine-green px-8 md:px-16 py-3 rounded-xl mb-10 md:mb-20 w-full md:w-auto">
          <button onClick={() => navigate("/")} className="flex justify-center items-center gap-2 text-white w-full">
            Periksa Penyakit Lainnya <ArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}