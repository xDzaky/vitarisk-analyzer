import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Doctor2 from "../assets/doctor2.png";
import { ChevronLeft } from "lucide-react";
import { apiRequest } from "../lib/api";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authConfig, setAuthConfig] = useState({
    loading: true,
    google_client_id: null,
    auth_enabled: false,
    dev_login_enabled: false,
  });

  useEffect(() => {
    const loadAuthConfig = async () => {
      try {
        const result = await apiRequest("/auth/config", { auth: false });
        setAuthConfig({
          loading: false,
          ...result.data,
        });
      } catch (err) {
        console.error(err);
        setAuthConfig((prev) => ({
          ...prev,
          loading: false,
        }));
      }
    };

    loadAuthConfig();
  }, []);

  const handleGoogleLogin = async (googleResponse) => {
    setLoading(true);
    setError("");

    try {
      if (!googleResponse?.credential) {
        throw new Error("Credential Google tidak diterima dari browser.");
      }

      const result = await apiRequest("/auth/google", {
        method: "POST",
        auth: false,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credential: googleResponse.credential,
        }),
      });

      localStorage.setItem("token", result.data.token);
      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError(err.message || "Login Google gagal");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await apiRequest("/auth/dev-login", {
        method: "POST",
        auth: false,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name: email.split("@")[0] || "User",
        }),
      });

      localStorage.setItem("token", result.data.token);
      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError(err.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-bg grid grid-cols-1 lg:grid-cols-2 min-h-screen">
      {/* KIRI: Gambar & Info (Hidden di Mobile) */}
      <div className="relative bg-pure-green/30 rounded-none lg:rounded-3xl hidden lg:flex flex-col justify-between overflow-hidden">
        <img 
          src={Doctor2} 
          className="w-full h-auto object-cover absolute inset-0" 
          alt="" 
        />
        <div className="relative z-10 p-6 lg:p-10 flex flex-col justify-between h-full min-h-125">
          <a
            href="/"
            className="flex gap-3 text-lg items-center hover:bg-black/10 max-w-max py-1.5 px-3 rounded-xl duration-300 transition-all text-white"
          >
            <ChevronLeft /> Kembali
          </a>
          <div className="w-full rounded-2xl flex flex-col bg-black/20 gap-5 p-5 backdrop-blur-xs">
            <h1 className="font-semibold text-3xl w-full lg:w-80 text-white">
              Kenali Tubuhmu, Kendalikan Risikonya
            </h1>
            <p className="w-full lg:w-130 text-white text-sm lg:text-base">
              Dapatkan analisis menyeluruh tentang jantung, kolesterol, dan
              risiko diabetesmu. Ambil kendali kesehatan sebelum terlambat.
            </p>
          </div>
        </div>
      </div>

      {/* KANAN: Form Login */}
      <div className="relative flex flex-col items-center justify-center px-4 py-8 lg:p-10">
        
        {/* Tombol Kembali Khusus Mobile (Hanya muncul jika layar kecil) */}
        <a
          href="/"
          className="absolute top-4 left-4 lg:hidden flex items-center gap-2 text-[#295f4e] p-2 -ml-2"
        >
          <ChevronLeft /> Kembali
        </a>

        <div className="flex items-center w-full justify-center mb-6 lg:mb-0">
          {/* Responsif Logo: Menggunakan max-w agar tidak overflow di mobile */}
          <img src="/icons2.svg" className="w-full max-w-70 h-auto" alt="" />
        </div>

        <div className="flex flex-col items-center mt-6 lg:mt-12 gap-4 lg:gap-5 w-full max-w-md lg:max-w-xl">
          <h1 className="text-2xl lg:text-3xl font-semibold text-center">Selamat Datang</h1>
          <p className="text-center text-gray-600 text-sm lg:text-base">
            Masuk untuk menyimpan hasil cek dan melihat kembali riwayat kesehatanmu.
          </p>

          {error ? (
            <p className="text-red-500 text-sm text-center px-4">{error}</p>
          ) : null}

          <div className="mt-3 flex flex-col w-full gap-4 lg:gap-5">
            <div className="rounded-2xl border border-[#327E66]/20 bg-[#327E66]/5 p-4 lg:p-5 text-center">
              <p className="font-semibold text-base lg:text-lg text-[#1e4f40]">
                Masuk dengan Google
              </p>
              <p className="text-xs lg:text-sm text-gray-600 mt-2">
                Dengan masuk menggunakan Google, hasil cekmu akan tersimpan dan
                bisa kamu lihat lagi kapan saja.
              </p>
              <div className="mt-4 grid place-items-center">
                {authConfig.loading ? (
                  <p className="text-sm text-gray-500">
                    Memuat konfigurasi login...
                  </p>
                ) : authConfig.auth_enabled ? (
                  <div className="w-full overflow-hidden flex justify-center">
                    <GoogleLogin
                      onSuccess={handleGoogleLogin}
                      onError={() => setError("Login Google dibatalkan atau gagal.")}
                      useOneTap={false}
                      theme="outline"
                      shape="circle"
                      size="large"
                      text="continue_with"
                      width="100%"
                    />
                  </div>
                ) : (
                  <p className="text-sm text-red-500 text-center">
                    Login Google belum siap. Pastikan origin frontend sudah
                    terdaftar di Google Cloud Console dan backend memiliki
                    GOOGLE_CLIENT_ID serta JWT_SECRET.
                  </p>
                )}
              </div>
            </div>

            {authConfig.dev_login_enabled ? (
              <>
                <div className="relative grid place-items-center py-2">
                  <span className="absolute h-0.5 w-full top-1/2 -translate-y-1/2 bg-[#327E66]/60"></span>
                  <p className="relative z-10 text-center text-[#327E66] font-medium max-w-max bg-bg px-2 text-xs lg:text-sm">
                    Atau login development
                  </p>
                </div>

                <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 lg:gap-5">
                  <div className="flex flex-col gap-2 lg:gap-3">
                    <label htmlFor="email" className="text-black/80 text-sm lg:text-base">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Masukan Email"
                      className="border-2 border-[#327E66] py-3 px-4 lg:px-5 rounded-md w-full text-sm lg:text-base"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="border py-3 bg-[#327E66] text-white text-base lg:text-lg rounded-md disabled:opacity-70 disabled:cursor-not-allowed w-full"
                  >
                    {loading ? "Memproses..." : "Masuk Development"}
                  </button>
                </form>
              </>
            ) : (
              <p className="text-sm text-center text-gray-500">
                Saat ini, masuk menggunakan Google adalah cara yang tersedia.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}