import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Key,
  Activity,
  BarChart3,
  HeartPulse,
} from "lucide-react";
import { apiRequest, clearStoredToken } from "../lib/api";
import { fetchCurrentUser, isLoggedIn, logoutSession } from "../lib/session";

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
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>

          <button
            onClick={() => navigate("/history")}
            className="bg-[#295f4e] text-white px-5 py-2 rounded-full hover:bg-[#1f4a3c] transition"
          >
            History
          </button>
        </div>
      </div>

      <div className="flex justify-center p-7 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 w-full max-w-7xl items-stretch">
          <div className="bg-white rounded-2xl shadow p-7 text-center flex flex-col min-h-[520px]">
            <div className="w-20 h-20 mx-auto rounded-xl bg-[#295f4e] text-white flex items-center justify-center text-3xl font-bold">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>

            <h2 className="mt-4 text-lg font-semibold">
              {loading ? "Memuat..." : user?.name || "User"}
            </h2>
            <p className="text-sm text-gray-500">
              {!loading && user?.email ? user.email : ""}
            </p>

            <hr className="my-10" />

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-left text-red-600 text-sm">
                <p>{error}</p>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="mt-4 rounded-xl bg-[#295f4e] px-4 py-2 text-white"
                >
                  Login Sekarang
                </button>
              </div>
            ) : (
              <div className="space-y-5 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg">
                    <HeartPulse size={18} className="text-[#295f4e]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Riwayat Penyakit</p>
                    <p className="font-medium">{profileSummary.latestDisease}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg">
                    <Activity size={18} className="text-[#295f4e]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status Kesehatan</p>
                    <p className="font-medium">{profileSummary.healthStatus}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg">
                    <BarChart3 size={18} className="text-[#295f4e]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Jumlah Pengecekan</p>
                    <p className="font-medium">{profileSummary.totalChecks}x</p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              disabled
              className="w-full mt-auto bg-[#295f4e]/20 text-[#295f4e] py-3 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <Key size={18} />
              <span>Ganti Password Belum Tersedia</span>
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="md:col-span-2 bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Informasi Profil</h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Nama Lengkap</label>
                <input
                  type="text"
                  value={user?.name || ""}
                  readOnly
                  className="w-full mt-1 p-3 rounded-xl bg-gray-100 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className="w-full mt-1 p-3 rounded-xl bg-gray-100 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Riwayat Penyakit</label>
                <input
                  type="text"
                  value={profileSummary.latestDisease}
                  readOnly
                  className="w-full mt-1 p-3 rounded-xl bg-gray-100 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Status Kesehatan</label>
                <input
                  type="text"
                  value={profileSummary.healthStatus}
                  readOnly
                  className="w-full mt-1 p-3 rounded-xl bg-gray-100 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  Jumlah Pengecekan
                </label>
                <input
                  type="text"
                  value={`${profileSummary.totalChecks}x`}
                  readOnly
                  className="w-full mt-1 p-3 rounded-xl bg-gray-100 outline-none"
                />
              </div>

              <p className="text-sm text-gray-500 pt-2">
                Data akun mengikuti provider login yang aktif. Saat ini akun
                menggunakan login Google, sehingga perubahan password belum
                dikelola dari aplikasi.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/history")}
                  disabled={Boolean(error)}
                  className="w-full bg-[#295f4e] text-white py-3 rounded-xl hover:bg-[#1f4a3c] transition disabled:opacity-60"
                >
                  Lihat History
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full border border-red-200 text-red-500 py-3 rounded-xl hover:bg-red-50 transition"
                >
                  Keluar Akun
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
