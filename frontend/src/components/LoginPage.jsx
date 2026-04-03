import icon from "../assets/icon.svg";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // FIX: pake /api
  const backendUrl = "http://localhost:3000/api";

  // 🔐 GOOGLE LOGIN
  const handleGoogleLogin = async (res) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${backendUrl}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credential: res.credential,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      // simpan token
      localStorage.setItem("token", result.data.token);

      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError("Login Google gagal");
    } finally {
      setLoading(false);
    }
  };

  // 🤡 DEV LOGIN (buat testing doang)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${backendUrl}/auth/dev-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name: email.split("@")[0] || "User",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      localStorage.setItem("token", result.data.token);

      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError("Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-bg min-h-[calc(100vh-80px)]">
      <nav className="p-5">
        <img src={icon} className="h-10" alt="logo" />
      </nav>

      <section className="flex justify-center items-center">
        <form
          onSubmit={handleFormSubmit}
          className="shadow-md w-fit p-20 gap-4 rounded-2xl flex flex-col"
        >
          <h1 className="text-pure-green text-2xl text-center font-bold">
            Masuk ke Akun Anda
          </h1>

          {error && <p className="text-red-500 text-center">{error}</p>}

          {/* FIX: bukan form lagi */}
          <div className="my-5 flex justify-center">
            <GoogleLogin
              theme="outline"
              size="large"
              shape="pill"
              text="continue_with"
              onSuccess={handleGoogleLogin}
              onError={() => setError("Login Google gagal")}
              disabled={loading}
            />
          </div>

          <span className="font-semibold">Email</span>
          <input
            type="email"
            className="border-2 border-mint-green/60 rounded-xl p-2"
            placeholder="Masukan Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          {/* NOTE: password ga dipake di dev-login */}
          <span className="font-semibold">Password</span>
          <input
            type="password"
            className="border-2 border-mint-green/60 rounded-xl p-2"
            placeholder="Masukan Password"
            disabled
          />

          <button
            type="submit"
            disabled={loading}
            className="self-center mt-6 rounded-xl bg-pine-green text-white w-32 h-10 hover:bg-dark-green-teal transition disabled:opacity-50"
          >
            {loading ? "Loading..." : "Masuk (Dev)"}
          </button>
        </form>
      </section>
    </div>
  );
}