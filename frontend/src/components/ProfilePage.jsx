import icon from "../assets/icon.svg";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state || {};

  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <div className="bg-bg min-h-screen">
      {/* Navbar */}
      <nav className="p-5">
        <img src={icon} className="h-12" alt="logo" />
      </nav>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-6xl w-full mx-auto mt-10 mb-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-gray-300 rounded-full flex items-center justify-center text-xl font-bold">
            {name.charAt(0)?.toUpperCase() || "U"}
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            Hai, {name || "User"}!
          </h2>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-2 border-mint-green/60 rounded-xl p-3 focus:outline-none focus:border-pure-green focus:ring-2 focus:ring-pure-green/30"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              No Telp
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border-2 border-mint-green/60 rounded-xl p-3 focus:outline-none focus:border-pure-green focus:ring-2 focus:ring-pure-green/30"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-mint-green/60 rounded-xl p-3 focus:outline-none focus:border-pure-green focus:ring-2 focus:ring-pure-green/30"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password baru"
                className="w-full border-2 border-mint-green/60 rounded-xl p-3 pr-12 focus:outline-none focus:border-pure-green focus:ring-2 focus:ring-pure-green/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-12">
          <button
            onClick={() => navigate("/history")}
            className="bg-[#327E66] text-white px-8 py-3 rounded-xl text-center font-semibold flex-1"
          >
            Riwayat Cek Kesehatan
          </button>

          <button
            onClick={() => navigate("/about", { replace: true })}
            className="border-2 border-[#327E66] text-[#327E66] px-8 py-3 rounded-xl font-semibold flex-1"
          >
            About
          </button>
        </div>
      </div>
    </div>
  );
}
