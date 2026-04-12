import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiRequest, clearStoredToken } from "../lib/api";
import { logoutSession } from "../lib/session";

import {
  ChevronLeft,
  LogOut,
} from "lucide-react";

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

  const handleLogout = async () => {
    await logoutSession();
    navigate("/login", { replace: true });
  };

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
      hour: "2-digit",
      minute: "2-digit",
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar Responsif */}
      <div className="relative flex items-center justify-between px-4 md:px-7 py-4 bg-white shadow-sm top-0 z-50">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-medium text-[#295f4e] px-2 py-1 rounded-xl hover:text-[#295f4e]/75 transition"
          >
            <ChevronLeft size={22} />
            <span className="hidden sm:inline">Kembali</span>
          </Link>
        </div>
        <img
          src="/icons2.svg"
          alt="logo"
          className="h-7 absolute left-1/2 -translate-x-1/2"
        />
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={handleLogout}
            className="hover:bg-red-50 px-3 md:px-5 py-2 rounded-full border-red-200 border text-red-500 transition flex items-center gap-2"
          >
            <LogOut size={18} />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10">
        {/* Judul Responsif: Tengah di mobile, Kiri di Desktop */}
        <div className="mb-8 md:mb-10 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">
            Riwayat Cek
          </h2>
          <p className="text-gray-400 font-medium mt-1 text-sm md:text-base">
            Daftar pemeriksaan kesehatan terakhir Anda
          </p>
        </div>

        {/* GRID RIWAYAT */}
        {loading ? (
          <div className="border border-gray-200 rounded-xl p-6 text-center text-gray-500">
            Memuat riwayat cek...
          </div>
        ) : null}

        {!loading && error ? (
          <div className="border border-red-200 bg-red-50 rounded-xl p-6 text-center text-red-600">
            <p className="mb-2">{error}</p>
            {needsLogin ? (
              <div className="mt-4">
                <button
                  onClick={() => navigate("/login")}
                  className="bg-[#295f4e] text-white px-5 py-2 rounded-lg w-full sm:w-auto"
                >
                  Login Sekarang
                </button>
              </div>
            ) : null}
          </div>
        ) : null}

        {!loading && !error && histories.length === 0 ? (
          <div className="border border-gray-200 rounded-xl p-6 text-center text-gray-500">
            Belum ada riwayat cek yang tersimpan di akun ini.
          </div>
        ) : null}

        {!loading && !error && histories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {histories.map((item) => (
              <div
                key={item.id}
                onClick={() => openHistoryDetail(item)}
                className="group bg-white p-4 md:p-6 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-transparent hover:border-[#327E66]/20 hover:shadow-xl transition-all duration-300 cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-mint-green/10 rounded-2xl flex items-center justify-center text-[#327E66] group-hover:bg-[#327E66] group-hover:text-white transition-colors duration-300 shrink-0">
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

                  <div className="text-left">
                    <p className="font-bold text-gray-700 group-hover:text-[#327E66] transition-colors text-base md:text-lg">
                      {formatDisease(item.disease)}
                    </p>
                    <p className="text-xs font-semibold text-gray-400 tracking-wider uppercase mt-0.5">
                      {formatDate(item.created_at)}
                    </p>
                  </div>
                </div>

                <div className="text-[#327E66] opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all shrink-0">
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
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default HistoryPage;