import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Key,
  Activity,
  BarChart3,
  HeartPulse,
  LogOut,
  History,
} from "lucide-react";
import { isLoggedIn, fetchCurrentUser, logoutSession } from "../lib/session";
import { clearStoredToken, apiRequest } from "../lib/api";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      if (!isLoggedIn()) {
        setError("Kamu perlu login dulu untuk membuka halaman profile.");
        setLoading(false);
        return;
      }

      try {
        const [currentUser, historyResult] = await Promise.all([
          fetchCurrentUser(),
          apiRequest("/history/predictions?limit=20"),
        ]);

        setUser(currentUser);
        setHistories(historyResult?.data?.items || []);
      } catch (err) {
        console.error(err);

        if (err.status === 401) {
          clearStoredToken();
          setError("Session login kamu sudah habis. Silakan login ulang.");
        } else {
          setError(err.message || "Gagal memuat data profile.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleLogout = async () => {
    await logoutSession();
    navigate("/login", { replace: true });
  };

  const profileSummary = useMemo(() => {
    const totalChecks = histories.length;
    const latestHistory = histories[0];

    const latestDisease = latestHistory
      ? latestHistory.disease === "heart"
        ? "Jantung"
        : latestHistory.disease === "diabetes"
          ? "Diabetes"
          : latestHistory.disease === "cholesterol"
            ? "Kolesterol"
            : latestHistory.disease
      : "Belum ada";

    const healthStatus =
      latestHistory?.result_payload?.risk_level
        ? `Risiko ${latestHistory.result_payload.risk_level}`
        : "Belum ada data";

    return {
      latestDisease,
      healthStatus,
      totalChecks,
    };
  }, [histories]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => navigate("/login")}
          className="bg-[#295f4e] text-white px-5 py-2 rounded-full w-full sm:w-auto"
        >
          Ke Halaman Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR RESPONSIF */}
      <div className="relative flex items-center justify-between px-4 md:px-7 py-4 bg-white shadow-sm top-0 z-50">
        {/* LEFT */}
        <div className="flex items-center gap-2 md:gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-medium text-[#295f4e] px-2 py-1 rounded-xl hover:text-[#295f4e]/75 transition"
          >
            <ChevronLeft size={22} />
            <span className="hidden sm:inline">Kembali</span>
          </Link>
        </div>

        {/* LOGO */}
        <img
          src="/icons2.svg"
          alt="logo"
          className="h-6 md:h-7 absolute left-1/2 -translate-x-1/2"
        />

        {/* RIGHT */}
        <div className="flex items-center gap-2 md:gap-4">
          {user?.picture ? (
            <img
              src={user.picture}
              alt="Profile"
              className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold text-[#295f4e] text-sm md:text-base">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}

          <button
            onClick={handleLogout}
            className="hover:bg-red-50 px-2 md:px-5 py-2 rounded-full border-red-200 border text-red-500 transition flex items-center gap-1 md:gap-2"
          >
            <LogOut size={18} />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex justify-center px-4 md:p-7 mt-4 md:mt-12 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-7 w-full max-w-7xl items-stretch">
          {/* LEFT CARD */}
          <div className="bg-white rounded-2xl shadow p-5 md:p-7 text-center flex flex-col min-h-auto md:min-h-125">
            {/* Avatar */}
            {user?.picture ? (
              <img
                src={user.picture}
                alt="Profile"
                className="w-20 h-20 md:w-20 md:h-20 mx-auto rounded-xl object-cover shadow-sm"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-20 h-20 mx-auto rounded-xl bg-[#295f4e] text-white flex items-center justify-center text-3xl font-bold">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            )}

            <h2 className="mt-4 text-lg md:text-xl font-semibold truncate px-2">
              {loading ? "Memuat..." : user?.name || "User"}
            </h2>

            <p className="text-sm text-gray-500 truncate px-2">
              {!loading && user?.email ? user.email : ""}
            </p>

            <hr className="my-6 md:my-10" />

            <div className="space-y-5 text-left">
              {/* Riwayat Penyakit */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg shrink-0">
                  <HeartPulse size={18} className="text-[#295f4e]" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs text-gray-500">Riwayat Penyakit</p>
                  <p className="font-medium truncate text-sm md:text-base">{profileSummary.latestDisease}</p>
                </div>
              </div>

              {/* Status Kesehatan */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg shrink-0">
                  <Activity size={18} className="text-[#295f4e]" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs text-gray-500">Status Kesehatan</p>
                  <p className="font-medium truncate text-sm md:text-base">{profileSummary.healthStatus}</p>
                </div>
              </div>

              {/* Jumlah Pengecekan */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg shrink-0">
                  <BarChart3 size={18} className="text-[#295f4e]" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs text-gray-500">Jumlah Pengecekan</p>
                  <p className="font-medium text-sm md:text-base">{profileSummary.totalChecks}x</p>
                </div>
              </div>
            </div>

            {/* BUTTON */}
            <button
              onClick={() => navigate("/history")}
              className="w-full mt-auto bg-[#295f4e] text-white py-3 rounded-xl hover:bg-[#1f4a3c] transition flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <History size={18} />
              <span>History</span>
              <ChevronRight size={18} />
            </button>
          </div>

          {/* RIGHT FORM */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow p-5 md:p-6">
            <h2 className="text-xl font-semibold mb-4 md:mb-6">Informasi Profil</h2>

            <div className="space-y-4 md:space-y-5">
              {/* Nama */}
              <div>
                <label className="text-sm text-gray-600">Nama Lengkap</label>
                <input
                  type="text"
                  readOnly
                  value={user?.name}
                  className="w-full mt-1 p-3 rounded-xl bg-gray-100 outline-none text-sm md:text-base"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  value={user?.email}
                  className="w-full mt-1 p-3 rounded-xl bg-gray-100 outline-none text-sm md:text-base"
                  readOnly
                />
              </div>

              {/* Riwayat Penyakit */}
              <div>
                <label className="text-sm text-gray-600">
                  Riwayat Penyakit
                </label>
                <input
                  type="text"
                  readOnly
                  value={profileSummary.latestDisease}
                  className="w-full mt-1 p-3 rounded-xl bg-gray-100 outline-none text-sm md:text-base"
                />
              </div>

              {/* Status */}
              <div>
                <label className="text-sm text-gray-600">
                  Status Kesehatan
                </label>
                <input
                  type="text"
                  readOnly
                  value={profileSummary.healthStatus}
                  className="w-full mt-1 p-3 rounded-xl bg-gray-100 outline-none text-sm md:text-base"
                />
              </div>

              {/* SAVE */}
              <button
                className="w-full mt-4 md:mt-6 bg-[#295f4e] text-white py-3 rounded-xl hover:bg-[#1f4a3c] transition text-sm md:text-base"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}