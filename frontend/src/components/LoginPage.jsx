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
    <div className="bg-bg grid grid-cols-1 lg:grid-cols-2 p-4 min-h-screen">
      <div className="relative bg-pure-green/30 rounded-3xl hidden lg:block">
        <img src={Doctor2} className="max-h-[calc(100vh-32px)]" alt="" />
        <div className="absolute inset-0 p-10 flex justify-between flex-col">
          <a
            href="/"
            className="flex gap-3 text-lg items-center hover:bg-black/10 max-w-max py-1.5 px-3 rounded-xl duration-300 transition-all"
          >
            <ChevronLeft /> Kembali
          </a>
          <div className="w-full rounded-2xl flex flex-col bg-black/20 gap-5 p-5 backdrop-blur-xs">
            <h1 className="font-semibold text-3xl w-80 text-white">
              Kenali Tubuhmu, Kendalikan Risikonya
            </h1>
            <p className="w-130 text-white">
              Dapatkan analisis menyeluruh tentang jantung, kolesterol, dan
              risiko diabetesmu. Ambil kendali kesehatan sebelum terlambat.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-10">
        <div className="flex items-center">
          <img src="/icons2.svg" className="w-70" alt="" />
        </div>

        <div className="flex flex-col items-center mt-12 gap-5 w-full max-w-xl">
          <h1 className="text-3xl font-semibold">Selamat Datang</h1>
          <p className="text-center text-gray-600">
            Masuk untuk menyimpan hasil cek dan melihat kembali riwayat kesehatanmu.
          </p>

          {error ? (
            <p className="text-red-500 text-sm text-center">{error}</p>
          ) : null}

          <div className="mt-3 flex flex-col w-full gap-5">
            <div className="rounded-2xl border border-[#327E66]/20 bg-[#327E66]/5 p-5">
              <p className="font-semibold text-lg text-[#1e4f40]">
                Masuk dengan Google
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Dengan masuk menggunakan Google, hasil cekmu akan tersimpan dan
                bisa kamu lihat lagi kapan saja.
              </p>
              <div className="mt-4 grid place-items-center">
                {authConfig.loading ? (
                  <p className="text-sm text-gray-500">
                    Memuat konfigurasi login...
                  </p>
                ) : authConfig.auth_enabled ? (
                  <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => setError("Login Google dibatalkan atau gagal.")}
                    useOneTap={false}
                    theme="outline"
                    shape="circle"
                    size="large"
                    text="continue_with"
                  />
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
                <div className="relative grid place-items-center">
                  <span className="absolute h-0.5 w-full top-1/2 -translate-y-1/2 bg-[#327E66]/60"></span>
                  <p className="relative z-10 text-center text-[#327E66] font-medium max-w-max bg-bg px-2">
                    Atau login development
                  </p>
                </div>

                <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-3">
                    <label htmlFor="email" className="text-black/80">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Masukan Email"
                      className="border-2 border-[#327E66] py-3 px-5 rounded-md"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="border py-3 bg-[#327E66] text-white text-lg rounded-md disabled:opacity-70 disabled:cursor-not-allowed"
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
