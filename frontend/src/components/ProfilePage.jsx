import icon from "../assets/icon.svg";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCurrentUser, isLoggedIn, logoutSession } from "../lib/session";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
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
        const currentUser = await fetchCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error(err);
        setError(err.message || "Gagal memuat data profile.");
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

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <nav className="p-5 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
        <img
          src={icon}
          className="h-10 cursor-pointer"
          alt="logo"
          onClick={() => navigate("/")}
        />
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100">
          <div className="p-8 md:p-12 to-transparent">
            <div className="flex flex-col md:flex-row items-center gap-9">
              <div className="w-24 h-24 bg-[#327E66] rounded-full flex items-center justify-center text-3xl text-white shadow-lg">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="text-center md:text-left">
                <h4 className="text-3xl text-black">
                  {loading ? "Memuat profile..." : user?.name || "Hai, User"}
                </h4>
                {!loading && user?.email ? (
                  <p className="text-gray-500 mt-2">{user.email}</p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12">
            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-600">
                <p>{error}</p>
                <button
                  onClick={() => navigate("/login")}
                  className="mt-4 rounded-xl bg-[#327E66] px-5 py-2 text-white"
                >
                  Login Sekarang
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 ml-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={user?.name || ""}
                    readOnly
                    className="w-full bg-gray-50 border-2 border-[#BAD8B6] rounded-2xl p-3.5"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 ml-1">
                    Status Verifikasi
                  </label>
                  <input
                    type="text"
                    value={
                      user?.email_verified
                        ? "Email sudah terverifikasi"
                        : "Email belum terverifikasi"
                    }
                    readOnly
                    className="w-full bg-gray-50 border-2 border-[#BAD8B6] rounded-2xl p-3.5"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 ml-1">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    readOnly
                    className="w-full bg-gray-50 border-2 border-[#BAD8B6] rounded-2xl p-3.5"
                  />
                </div>

                <p className="text-sm text-gray-500 md:col-span-2">
                  Data akun mengikuti provider login yang aktif. Untuk saat ini,
                  edit profile manual belum diaktifkan.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mt-16 border-t border-gray-50 pt-10">
              <button
                onClick={() => navigate("/history")}
                disabled={Boolean(error)}
                className="border-2 bg-[#327E66] text-white px-10 py-4 rounded-2xl flex-1 disabled:opacity-60"
              >
                Riwayat Cek Kesehatan
              </button>

              <button
                onClick={handleLogout}
                className="border-2 border-red-100 text-red-500 px-10 py-4 rounded-2xl font-bold flex-1"
              >
                Keluar Akun
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
