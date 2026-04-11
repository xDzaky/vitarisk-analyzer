import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { apiRequest, clearStoredToken } from "../lib/api";

const HistoryPage = () => {
  const navigate = useNavigate();
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [needsLogin, setNeedsLogin] = useState(false);

  useEffect(() => {
    const fetchHistories = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setNeedsLogin(true);
        setError("Silakan login dulu supaya riwayat cek bisa ditampilkan.");
        setLoading(false);
        return;
      }

      try {
        const result = await apiRequest("/history/predictions?limit=20");
        setHistories(result?.data?.items || []);
      } catch (err) {
        console.error(err);

        if (err.status === 401) {
          clearStoredToken();
          setNeedsLogin(true);
          setError("Session login kamu sudah habis. Silakan login ulang.");
        } else {
          setError("Riwayat cek belum bisa dimuat. Coba lagi sebentar.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistories();
  }, []);

  const formatDisease = (disease) => {
    if (disease === "heart") return "Jantung";
    if (disease === "diabetes") return "Diabetes";
    if (disease === "cholesterol") return "Kolesterol";
    return disease;
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(dateString));
  };

  const openHistoryDetail = (item) => {
    navigate("/result", {
      state: {
        data: item.result_payload,
        type: item.disease,
        history_id: item.id,
        from_history: true,
      },
    });
  };

  const renderEmptyState = () => (
    <div className="rounded-3xl border border-[#327E66]/15 bg-white p-8 text-center shadow-sm">
      <p className="text-lg font-semibold text-gray-700">
        Belum ada riwayat cek kesehatan
      </p>
      <p className="mt-2 text-sm text-gray-500">
        Kamu belum pernah melakukan pemeriksaan. Hasil cek yang sudah dilakukan
        nanti akan muncul di halaman ini.
      </p>
      <button
        type="button"
        onClick={() => navigate("/")}
        className="mt-5 rounded-full bg-[#295f4e] px-5 py-2 text-white transition hover:bg-[#1f4a3c]"
      >
        Mulai Cek Sekarang
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative flex items-center justify-between px-7 py-4 bg-white shadow-sm top-0 z-50">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex gap-3 text-lg font-medium text-[#295f4e] items-center px-3 py-1 rounded-xl"
          >
            <ChevronLeft size={22} /> Kembali
          </Link>
        </div>

        <img
          src="/icons2.svg"
          alt="logo"
          className="h-7 absolute left-1/2 -translate-x-1/2"
        />

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/history")}
            className="bg-[#295f4e] text-white px-5 py-2 rounded-full hover:bg-[#1f4a3c] transition"
          >
            History
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-3xl text-center font-black text-gray-800 tracking-tight">
            Riwayat Cek
          </h2>
          <p className="text-gray-400 text-center font-medium mt-1">
            Daftar pemeriksaan kesehatan terakhir Anda
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-28 rounded-3xl bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] animate-pulse"
              />
            ))}
          </div>
        ) : null}

        {!loading && error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
            <p className="text-red-600">{error}</p>
            {needsLogin ? (
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="mt-5 rounded-full bg-[#295f4e] px-5 py-2 text-white transition hover:bg-[#1f4a3c]"
              >
                Login Sekarang
              </button>
            ) : null}
          </div>
        ) : null}

        {!loading && !error && histories.length === 0 ? renderEmptyState() : null}

        {!loading && !error && histories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {histories.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => openHistoryDetail(item)}
                className="group bg-white p-6 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-transparent hover:border-[#327E66]/20 hover:shadow-xl transition-all duration-300 cursor-pointer flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-mint-green/10 rounded-2xl flex items-center justify-center text-[#327E66] group-hover:bg-[#327E66] group-hover:text-white transition-colors duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>

                  <div>
                    <p className="font-bold text-gray-700 group-hover:text-[#327E66] transition-colors">
                      {formatDisease(item.disease)}
                    </p>
                    <p className="text-xs font-semibold text-gray-400 tracking-wider uppercase mt-0.5">
                      {formatDate(item.created_at)}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      {typeof item?.result_payload?.risk_percent === "number"
                        ? `Risiko ${item.result_payload.risk_percent}%`
                        : "Hasil tersedia"}
                    </p>
                  </div>
                </div>

                <div className="text-[#327E66] opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default HistoryPage;
